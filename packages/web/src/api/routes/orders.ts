import { randomBytes } from "node:crypto";
import { ORPCError } from "@orpc/server";
import { and, desc, eq, gt } from "drizzle-orm";
import { z } from "zod";
import { base } from "../__core/app";
import { findEbook } from "../catalog";
import { db } from "../database";
import * as schema from "../database/schema";
import { fetchKkiapayTransaction, readKkiapayConfig } from "../kkiapay";

/** Durée de vie du lien de téléchargement privé. */
const TOKEN_TTL_MS = 48 * 60 * 60 * 1000;

const verifyInput = z.object({
  /** Référence catalogue de la formation, ex. « E-01 ». */
  reference: z.string().min(1).max(24),
  /** Identifiant de transaction renvoyé par le widget Kkiapay. */
  transactionId: z.string().min(4).max(120),
  /** E-mail ou numéro WhatsApp de l'acheteur. */
  contact: z.string().min(5).max(160),
});

async function issueToken(orderId: number) {
  const token = randomBytes(24).toString("base64url");
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
  await db.insert(schema.downloadTokens).values({ token, orderId, expiresAt });
  return { token, expiresAt };
}

export const orders = {
  /**
   * Vérifie le paiement auprès de Kkiapay, enregistre la commande puis délivre
   * un lien de téléchargement privé, à usage unique, valable 48 heures.
   * Le montant n'est jamais lu depuis le client : il vient du catalogue.
   */
  verify: base.input(verifyInput).handler(async ({ input }) => {
    const ebook = findEbook(input.reference);
    if (!ebook) {
      throw new ORPCError("NOT_FOUND", {
        message: `Aucune formation ne correspond à « ${input.reference} ».`,
      });
    }

    const config = readKkiapayConfig();
    if (!config.configured) {
      throw new ORPCError("PRECONDITION_FAILED", {
        message:
          "Le paiement en ligne n'est pas encore activé : les clés Kkiapay du marchand doivent être renseignées. Écris sur WhatsApp pour commander en attendant.",
      });
    }

    // Idempotence : une transaction déjà enregistrée ne crée pas de doublon.
    const [existingOrder] = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.transactionId, input.transactionId))
      .limit(1);

    if (existingOrder) {
      const { token, expiresAt } = await issueToken(existingOrder.id);
      return {
        reference: existingOrder.reference,
        slug: existingOrder.slug,
        amount: existingOrder.amount,
        downloadUrl: `/api/download/${token}`,
        expiresAt,
        sandbox: existingOrder.sandbox,
      };
    }

    const transaction = await fetchKkiapayTransaction(config, input.transactionId);

    if (transaction.status !== "SUCCESS") {
      throw new ORPCError("BAD_REQUEST", {
        message: `Paiement non confirmé (statut Kkiapay : ${transaction.status || "inconnu"}). Aucun montant n'a été débité pour cette tentative.`,
      });
    }

    if (Math.round(transaction.amount) !== ebook.price) {
      throw new ORPCError("BAD_REQUEST", {
        message: `Montant reçu (${Math.round(transaction.amount)} F CFA) différent du prix de la formation (${ebook.price} F CFA). Écris sur WhatsApp pour régulariser.`,
      });
    }

    const [order] = await db
      .insert(schema.orders)
      .values({
        reference: ebook.ref,
        slug: ebook.slug,
        amount: ebook.price,
        transactionId: input.transactionId,
        status: "paid",
        customerContact: input.contact,
        sandbox: config.sandbox,
      })
      .returning();

    const { token, expiresAt } = await issueToken(order.id);

    return {
      reference: order.reference,
      slug: order.slug,
      amount: order.amount,
      downloadUrl: `/api/download/${token}`,
      expiresAt,
      sandbox: order.sandbox,
    };
  }),

  /**
   * Détail d'une commande à partir du jeton — sert la page de confirmation.
   * Ne consomme pas le jeton et n'expose jamais le PDF.
   */
  byToken: base
    .input(z.object({ token: z.string().min(8).max(200) }))
    .handler(async ({ input }) => {
      const [row] = await db
        .select({
          token: schema.downloadTokens.token,
          expiresAt: schema.downloadTokens.expiresAt,
          usedAt: schema.downloadTokens.usedAt,
          reference: schema.orders.reference,
          amount: schema.orders.amount,
          sandbox: schema.orders.sandbox,
          createdAt: schema.orders.createdAt,
        })
        .from(schema.downloadTokens)
        .innerJoin(schema.orders, eq(schema.orders.id, schema.downloadTokens.orderId))
        .where(eq(schema.downloadTokens.token, input.token))
        .limit(1);

      if (!row) {
        throw new ORPCError("NOT_FOUND", {
          message: "Ce lien de téléchargement est inconnu.",
        });
      }

      const ebook = findEbook(row.reference);
      const expired = row.expiresAt.getTime() < Date.now();

      return {
        reference: row.reference,
        title: ebook?.title ?? row.reference,
        slug: ebook?.slug ?? "",
        amount: row.amount,
        expiresAt: row.expiresAt,
        usedAt: row.usedAt,
        expired,
        alreadyUsed: Boolean(row.usedAt),
        sandbox: row.sandbox,
      };
    }),

  /** Dernières commandes — alimente le bandeau « dernières ventes » côté public. */
  recent: base.handler(async () => {
    const rows = await db
      .select({
        reference: schema.orders.reference,
        createdAt: schema.orders.createdAt,
      })
      .from(schema.orders)
      .where(
        and(
          eq(schema.orders.status, "paid"),
          gt(schema.orders.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
        ),
      )
      .orderBy(desc(schema.orders.createdAt))
      .limit(6);

    return { count: rows.length, orders: rows };
  }),
};
