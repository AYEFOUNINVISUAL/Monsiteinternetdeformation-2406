/**
 * Widget de paiement Kkiapay (côté navigateur).
 *
 * Le script officiel expose `openKkiapayWidget` et `addSuccessListener` sur
 * `window` une fois chargé. Le paiement seul ne vaut rien : chaque transaction
 * est revérifiée côté serveur (src/api/kkiapay.ts) avant d'enregistrer la
 * commande — le montant, lui, vient toujours du catalogue.
 */

const WIDGET_SRC = "https://cdn.kkiapay.me/k.js";

export type KkiapaySuccessResponse = {
  transactionId: string;
  [key: string]: unknown;
};

type OpenWidgetOptions = {
  amount: number;
  key: string;
  callback?: string;
  position?: "left" | "right" | "center";
  theme?: string;
  sandbox?: boolean;
  name?: string;
  email?: string;
  phone?: string;
  data?: string;
};

declare global {
  interface Window {
    openKkiapayWidget?: (options: OpenWidgetOptions) => void;
    addSuccessListener?: (listener: (response: KkiapaySuccessResponse) => void) => void;
    addFailureListener?: (listener: (response: unknown) => void) => void;
    closeKkiapayWidget?: () => void;
  }
}

/** Clé publique du marchand, exposée au navigateur. */
export const KKIAPAY_PUBLIC_KEY = (import.meta.env.VITE_KKIAPAY_PUBLIC_KEY ?? "").trim();

/** Mode test Kkiapay (api-sandbox). */
export const KKIAPAY_SANDBOX = (import.meta.env.VITE_KKIAPAY_SANDBOX ?? "true") !== "false";

export const kkiapayConfigured = KKIAPAY_PUBLIC_KEY.length > 0;

let loader: Promise<void> | null = null;

/** Charge le script Kkiapay une seule fois, puis résout. */
export function loadKkiapayWidget(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("Pas de navigateur."));
  if (window.openKkiapayWidget) return Promise.resolve();
  if (loader) return loader;

  loader = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${WIDGET_SRC}"]`);
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () =>
      reject(new Error("Le module de paiement Kkiapay n'a pas pu être chargé.")),
    );
    if (!existing) {
      script.src = WIDGET_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  }).catch((error) => {
    loader = null;
    throw error;
  });

  return loader;
}
