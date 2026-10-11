import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import type { Hono } from "hono";
import { ebookFileName, findEbook } from "./catalog";
import { db } from "./database";
import * as schema from "./database/schema";

/**
 * Téléchargement privé des PDF — route HTTP brute (pas d'oRPC : on renvoie un
 * fichier binaire). Le jeton est à usage unique et expire au bout de 48 h.
 * Les PDF sont dans `packages/web/private/ebooks/`, jamais servis en statique.
 */

const DOWNLOAD_DIR_SEGMENTS = ["private", "ebooks"];

/** Remonte les parents depuis les points d'ancrage connus jusqu'à trouver le fichier. */
function resolveEbookPath(fileName: string): string | null {
  const anchors = [import.meta.dirname, process.cwd()];

  for (const anchor of anchors) {
    let dir = anchor;
    for (let depth = 0; depth < 6; depth += 1) {
      const candidate = path.join(dir, ...DOWNLOAD_DIR_SEGMENTS, fileName);
      if (existsSync(candidate)) return candidate;
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  return null;
}

function messagePage(title: string, body: string, status: number) {
  return new Response(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title} — Collection AYENA</title>
<style>
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
    background:#08080A; color:#fff; font-family:system-ui, sans-serif; padding:2rem; }
  .card { max-width:34rem; border:1px solid rgba(255,255,255,.12); border-radius:18px;
    padding:2.5rem; background:#141418; }
  h1 { font-size:1.5rem; margin:0 0 1rem; letter-spacing:-.01em; }
  p { color:#9C9CA6; line-height:1.6; margin:0 0 1rem; }
  a { display:inline-block; margin-top:.5rem; border:1px solid #FF6A00; color:#FF6A00;
    text-decoration:none; padding:.8rem 1.5rem; border-radius:999px; text-transform:uppercase;
    font-size:.75rem; font-weight:700; letter-spacing:.14em; }
  a:hover { background:#FF6A00; color:#08080A; }
</style></head><body><div class="card"><h1>${title}</h1><p>${body}</p>
<a href="/#formations">Retour aux formations</a></div></body></html>`,
    {
      status,
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    },
  );
}

export function registerDownloadRoute(app: Hono) {
  app.get("/api/download/:token", async (c) => {
    const token = c.req.param("token");

    const [row] = await db
      .select({
        token: schema.downloadTokens.token,
        usedAt: schema.downloadTokens.usedAt,
        expiresAt: schema.downloadTokens.expiresAt,
        reference: schema.orders.reference,
        slug: schema.orders.slug,
      })
      .from(schema.downloadTokens)
      .innerJoin(schema.orders, eq(schema.orders.id, schema.downloadTokens.orderId))
      .where(eq(schema.downloadTokens.token, token))
      .limit(1);

    if (!row) {
      return messagePage(
        "Lien inconnu",
        "Ce lien de téléchargement n'existe pas. Vérifie l'adresse reçue après le paiement, ou écris sur WhatsApp avec ton identifiant de transaction.",
        404,
      );
    }

    if (row.usedAt) {
      return messagePage(
        "Lien déjà utilisé",
        `Ce lien a servi une fois, le ${row.usedAt.toLocaleString("fr-FR")}. Il est volontairement à usage unique. Écris sur WhatsApp avec ton identifiant de transaction : un nouveau lien te sera envoyé.`,
        410,
      );
    }

    if (row.expiresAt.getTime() < Date.now()) {
      return messagePage(
        "Lien expiré",
        `Ce lien était valable jusqu'au ${row.expiresAt.toLocaleString("fr-FR")}. Écris sur WhatsApp avec ton identifiant de transaction : un nouveau lien te sera envoyé.`,
        410,
      );
    }

    const fileName = ebookFileName(row.reference);
    const filePath = fileName ? resolveEbookPath(fileName) : null;

    if (!fileName || !filePath) {
      return messagePage(
        "Fichier indisponible",
        "Le PDF de cette formation est introuvable sur le serveur. Écris sur WhatsApp : la commande est enregistrée et le fichier te sera envoyé.",
        500,
      );
    }

    // Usage unique : le jeton est consommé avant l'envoi du fichier.
    await db
      .update(schema.downloadTokens)
      .set({ usedAt: new Date() })
      .where(eq(schema.downloadTokens.token, token));

    // Lecture via node:fs — le serveur tourne sous Bun en production et sous
    // Node en développement (plugin Vite), donc pas d'API propre à Bun ici.
    const data = await readFile(filePath);
    const ebook = findEbook(row.reference);
    const downloadName = `AYENA-${row.reference}-${ebook?.slug ?? row.slug}.pdf`;

    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${downloadName}"`,
        "Content-Length": String(data.byteLength),
        "Cache-Control": "private, no-store",
      },
    });
  });
}
