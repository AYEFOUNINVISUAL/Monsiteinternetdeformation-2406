/**
 * Vérification serveur des paiements Kkiapay.
 *
 * Le widget côté client renvoie un `transactionId` — il ne prouve rien à lui
 * seul. On interroge donc l'API Kkiapay avec les trois clés du marchand et on
 * n'accepte la commande que si le statut est SUCCESS et le montant exact.
 *
 * Contrat vérifié sur docs.kkiapay.me (Node.js Admin SDK, octobre 2026) et sur
 * le paquet @kkiapay-org/nodejs-sdk :
 *   POST {base}/api/v1/transactions/status   body { transactionId }
 *   en-têtes : x-api-key (clé publique), x-secret-key, x-private-key
 *   base sandbox : https://api-sandbox.kkiapay.me
 *   base live    : https://api.kkiapay.me
 */

const SANDBOX_BASE_URL = "https://api-sandbox.kkiapay.me";
const LIVE_BASE_URL = "https://api.kkiapay.me";
const STATUS_PATH = "/api/v1/transactions/status";

export type KkiapayConfig = {
  publicKey: string;
  privateKey: string;
  secretKey: string;
  sandbox: boolean;
  /** false tant que les trois clés ne sont pas renseignées dans .env */
  configured: boolean;
};

export type KkiapayTransaction = {
  status: string;
  amount: number;
  transactionId: string;
  source?: string;
  reason?: string;
  failureMessage?: string;
  performedAt?: string;
  client?: { fullname?: string; phone?: string; email?: string };
};

export function readKkiapayConfig(): KkiapayConfig {
  const publicKey = (process.env.KKIAAPAY_PUBLIC_KEY ?? "").trim();
  const privateKey = (process.env.KKIAAPAY_PRIVATE_KEY ?? "").trim();
  const secretKey = (process.env.KKIAAPAY_SECRET_KEY ?? "").trim();
  return {
    publicKey,
    privateKey,
    secretKey,
    sandbox: (process.env.KKIAAPAY_SANDBOX ?? "true").trim() !== "false",
    configured: Boolean(publicKey && privateKey && secretKey),
  };
}

/** Interroge Kkiapay. Renvoie la transaction ou lève une erreur explicite. */
export async function fetchKkiapayTransaction(
  config: KkiapayConfig,
  transactionId: string,
): Promise<KkiapayTransaction> {
  const baseUrl = config.sandbox ? SANDBOX_BASE_URL : LIVE_BASE_URL;

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${STATUS_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.publicKey,
        "x-secret-key": config.secretKey,
        "x-private-key": config.privateKey,
      },
      body: JSON.stringify({ transactionId }),
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    throw new Error(
      `Kkiapay est injoignable pour l'instant (${error instanceof Error ? error.message : "erreur réseau"}).`,
    );
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Kkiapay a refusé la vérification (HTTP ${response.status}). ${detail.slice(0, 200)}`.trim(),
    );
  }

  const payload = (await response.json()) as KkiapayTransaction;
  if (!payload?.transactionId) {
    throw new Error("Kkiapay n'a renvoyé aucune transaction pour cet identifiant.");
  }
  return payload;
}
