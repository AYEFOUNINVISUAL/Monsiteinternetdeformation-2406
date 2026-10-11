import { useCallback, useRef, useState } from "react";
import { Check, Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { Ebook } from "../../api/catalog";
import { formatPrice } from "../../api/catalog";
import {
  KKIAPAY_PUBLIC_KEY,
  KKIAPAY_SANDBOX,
  kkiapayConfigured,
  loadKkiapayWidget,
  type KkiapaySuccessResponse,
} from "../lib/kkiapay";
import { useVerifyPayment } from "../queries/catalog";
import { WHATSAPP_NUMBER } from "./site-layout";

type Stage = "idle" | "opening" | "verifying";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "Le paiement n'a pas pu être vérifié. Si tu as été débité, écris sur WhatsApp avec ton identifiant de transaction.";
}

/** Lien WhatsApp pré-rempli pour commander une formation à la main. */
export function whatsappOrderLink(ebook: Ebook): string {
  const message = `Bonjour AYENA Jacques, je veux commander la formation ${ebook.ref} — ${ebook.title} (${formatPrice(ebook.price)}). Comment je paie ?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function Checkout({ ebook }: { ebook: Ebook }) {
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [, navigate] = useLocation();
  const verify = useVerifyPayment();

  // Le widget Kkiapay ne peut recevoir qu'un seul écouteur : on l'enregistre une
  // fois, et il lit toujours la dernière valeur saisie via une référence.
  const contactRef = useRef(contact);
  contactRef.current = contact;
  const listenerReady = useRef(false);
  const handlerRef = useRef<(response: KkiapaySuccessResponse) => void>(() => {});

  const busy = stage !== "idle";

  const handleSuccess = useCallback(
    async (response: KkiapaySuccessResponse) => {
      setError(null);
      setStage("verifying");
      try {
        const result = await verify.mutateAsync({
          reference: ebook.ref,
          transactionId: response.transactionId,
          contact: contactRef.current.trim(),
        });
        const token = result.downloadUrl.split("/").pop() ?? "";
        setStage("idle");
        navigate(`/merci?ref=${ebook.ref}&token=${encodeURIComponent(token)}`);
      } catch (cause) {
        setError(errorMessage(cause));
        setStage("idle");
      }
    },
    [ebook.ref, navigate, verify],
  );
  handlerRef.current = (response) => {
    void handleSuccess(response);
  };

  const startPayment = async () => {
    setError(null);

    if (contactRef.current.trim().length < 5) {
      setError(
        "Indique un e-mail ou un numéro WhatsApp : c'est là que le lien de téléchargement arrive.",
      );
      return;
    }

    setStage("opening");
    try {
      await loadKkiapayWidget();

      if (!listenerReady.current) {
        window.addSuccessListener?.((response) => handlerRef.current(response));
        window.addFailureListener?.(() => {
          setStage("idle");
        });
        listenerReady.current = true;
      }

      window.openKkiapayWidget?.({
        amount: ebook.price,
        key: KKIAPAY_PUBLIC_KEY,
        position: "center",
        theme: "#FF6A00",
        sandbox: KKIAPAY_SANDBOX,
        countries: ["BJ", "CI", "TG", "SN", "NE"],
        data: JSON.stringify({ reference: ebook.ref, slug: ebook.slug }),
      });
      setStage("idle");
    } catch (cause) {
      setError(errorMessage(cause));
      setStage("idle");
    }
  };

  return (
    <div className="buy">
      <div>
        <span className="buy__label">Prix de la formation</span>
        <div className="buy__price">{formatPrice(ebook.price)}</div>
        <p className="meta" style={{ marginTop: "0.5rem" }}>
          Paiement unique · PDF à toi pour toujours
        </p>
      </div>

      <hr className="divider" />

      {kkiapayConfigured ? (
        <>
          <div>
            <label className="buy__label" htmlFor="checkout-contact">
              Ton e-mail ou ton numéro WhatsApp
            </label>
            <input
              id="checkout-contact"
              aria-label="Ton e-mail ou ton numéro WhatsApp"
              className="field"
              type="text"
              inputMode="email"
              autoComplete="email"
              placeholder="ex. 0153616660 ou nom@email.com"
              value={contact}
              disabled={busy}
              onChange={(event) => setContact(event.target.value)}
            />
            <p
              className="meta"
              style={{ marginTop: "0.5rem", textTransform: "none", letterSpacing: 0 }}
            >
              Sert uniquement à te renvoyer le lien en cas de problème.
            </p>
          </div>

          {error ? (
            <div className="alert alert--error" role="alert">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            className="btn btn--solid btn--block"
            disabled={busy}
            onClick={() => void startPayment()}
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
            {stage === "opening"
              ? "Ouverture du paiement…"
              : stage === "verifying"
                ? "Vérification du paiement…"
                : `Acheter — ${formatPrice(ebook.price)}`}
          </button>

          <ul className="ticks" style={{ gap: "0.5rem" }}>
            <li>
              <Check size={14} />
              Mobile Money (MTN, Moov, Celtiis) et carte bancaire via Kkiapay
            </li>
            <li>
              <Check size={14} />
              Lien de téléchargement privé, valable 48 heures
            </li>
            {KKIAPAY_SANDBOX ? (
              <li>
                <Check size={14} />
                Mode test Kkiapay actif — aucun débit réel
              </li>
            ) : null}
          </ul>
        </>
      ) : (
        <>
          <div className="alert alert--info">
            Le paiement en ligne par Mobile Money est en cours d'activation. En attendant, commande
            directement sur WhatsApp : tu reçois le PDF dès que le paiement est confirmé.
          </div>

          <a
            className="btn btn--solid btn--block"
            href={whatsappOrderLink(ebook)}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={15} />
            Commander — {formatPrice(ebook.price)}
          </a>

          <p className="meta" style={{ textTransform: "none", letterSpacing: 0 }}>
            Le message WhatsApp est déjà rédigé : référence {ebook.ref}, titre et prix. Tu n'as plus
            qu'à l'envoyer.
          </p>

          <ul className="ticks" style={{ gap: "0.5rem" }}>
            <li>
              <Check size={14} />
              Paiement Mobile Money (MTN, Moov, Celtiis) ou espèces, à convenir
            </li>
            <li>
              <Check size={14} />
              PDF envoyé par WhatsApp dès confirmation du paiement
            </li>
            <li>
              <Check size={14} />
              Paiement en ligne par carte et Mobile Money : bientôt disponible
            </li>
          </ul>
        </>
      )}

      <Link to="/conditions" className="meta" style={{ textDecoration: "underline" }}>
        Conditions de vente
      </Link>
    </div>
  );
}
