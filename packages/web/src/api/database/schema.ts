import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Une commande confirmée. Elle n'est écrite qu'après vérification du paiement
 * auprès de l'API Kkiapay (statut SUCCESS + montant exact).
 */
export const orders = sqliteTable(
  "orders",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    /** Référence catalogue de la formation achetée, ex. « E-01 ». */
    reference: text("reference").notNull(),
    /** Slug de la formation, ex. « e-commerce ». */
    slug: text("slug").notNull(),
    /** Montant payé, en francs CFA (entier). */
    amount: integer("amount").notNull(),
    /** Identifiant de transaction renvoyé par Kkiapay — unique, bloque les doublons. */
    transactionId: text("transaction_id").notNull().unique(),
    /** « paid » tant que le paiement est confirmé. */
    status: text("status").notNull().default("paid"),
    /** E-mail ou numéro WhatsApp laissé par l'acheteur. */
    customerContact: text("customer_contact").notNull(),
    /** true si la transaction a été vérifiée en sandbox Kkiapay. */
    sandbox: integer("sandbox", { mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [index("orders_reference_idx").on(table.reference)],
);

/**
 * Jeton de téléchargement privé : usage unique, expire 48 h après la commande.
 * Le PDF n'est jamais exposé par une URL publique — seul ce jeton y donne accès.
 */
export const downloadTokens = sqliteTable(
  "download_tokens",
  {
    token: text("token").primaryKey(),
    orderId: integer("order_id").notNull(),
    usedAt: integer("used_at", { mode: "timestamp" }),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [index("download_tokens_order_idx").on(table.orderId)],
);
