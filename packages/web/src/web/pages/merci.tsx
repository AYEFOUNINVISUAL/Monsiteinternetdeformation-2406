import { AlertTriangle, Check, Download, Loader2 } from "lucide-react";
import { Link, useSearch } from "wouter";
import { formatPrice } from "../../api/catalog";
import { ContactStrip, SiteLayout } from "../components/site-layout";
import { useOrderByToken } from "../queries/catalog";

export default function MerciPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const token = params.get("token") ?? "";
  const ref = params.get("ref") ?? "";
  const query = useOrderByToken(token);

  return (
    <SiteLayout>
      <section className="section">
        <div className="halo" />
        <div className="shell wrap-content" style={{ maxWidth: "46rem" }}>
          {!token ? (
            <div className="stack">
              <p className="eyebrow">Lien manquant</p>
              <h1 className="display h-section">Aucun jeton de téléchargement</h1>
              <p className="lede">
                Cette page s’ouvre normalement juste après un paiement confirmé. Si tu es arrivé ici
                par erreur, reviens à la collection.
              </p>
              <div className="row">
                <Link to="/" className="btn btn--solid">
                  Retour à la collection
                </Link>
              </div>
            </div>
          ) : query.isLoading ? (
            <div className="stack">
              <p className="eyebrow">Vérification</p>
              <h1 className="display h-section">On retrouve ta commande…</h1>
              <div className="skeleton" style={{ height: "12rem" }} />
            </div>
          ) : query.isError || !query.data ? (
            <div className="stack">
              <p className="eyebrow">Lien inconnu</p>
              <h1 className="display h-section">Commande introuvable</h1>
              <p className="lede">
                Ce lien de téléchargement n’est pas reconnu. Écris sur WhatsApp avec ton identifiant
                de transaction : on te renvoie un lien valide.
              </p>
              <ContactStrip title="Besoin d’un nouveau lien ?" />
            </div>
          ) : (
            <div className="stack stack--lg">
              <div className="stack">
                <div className="row">
                  <span className="pill pill--orange">
                    <Check size={12} /> Paiement confirmé
                  </span>
                  <span className="pill">{query.data.reference}</span>
                </div>
                <h1 className="display h-section">
                  Merci, ta formation est <span className="boxed">prête</span>
                </h1>
                <p className="lede">
                  {query.data.title} — {formatPrice(query.data.amount)}. Le lien ci-dessous est privé
                  et à usage unique : télécharge le fichier maintenant, puis garde-le sur ton
                  téléphone.
                </p>
              </div>

              <div className="card card--pad stack">
                <div>
                  <p className="eyebrow">Ton PDF</p>
                  <h2 className="display h-card" style={{ marginTop: "0.6rem" }}>
                    {query.data.title}
                  </h2>
                  <p className="meta" style={{ marginTop: "0.5rem" }}>
                    Lien valable jusqu’au{" "}
                    {new Date(query.data.expiresAt).toLocaleString("fr-FR", {
                      dateStyle: "long",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                {query.data.expired || query.data.alreadyUsed ? (
                  <div className="alert alert--error">
                    <AlertTriangle size={14} style={{ display: "inline", marginRight: "0.4rem" }} />
                    {query.data.alreadyUsed
                      ? "Ce lien a déjà été utilisé. Le téléchargement ne fonctionne qu’une seule fois."
                      : "Ce lien a expiré."}{" "}
                    Écris sur WhatsApp avec ton identifiant de transaction pour en recevoir un
                    nouveau.
                  </div>
                ) : (
                  <>
                    <a className="btn btn--solid btn--block" href={`/api/download/${token}`}>
                      <Download size={15} />
                      Télécharger le PDF
                    </a>
                    <p className="meta" style={{ textTransform: "none", letterSpacing: 0 }}>
                      Un seul téléchargement possible. Si le bouton reste sans effet, écris sur
                      WhatsApp avec ton identifiant de transaction.
                    </p>
                  </>
                )}

                {query.data.sandbox ? (
                  <div className="alert alert--info">
                    Transaction effectuée en mode test Kkiapay : aucun débit réel n’a eu lieu.
                  </div>
                ) : null}
              </div>

              {ref ? (
                <Link to={`/formation/${ref}`} className="btn btn--ghost">
                  Revoir la fiche de cette formation
                </Link>
              ) : null}

              <ContactStrip
                title="Un problème avec le fichier ?"
                body="Écris sur WhatsApp avec ton identifiant de transaction. Renvoi de fichier ou remboursement si le problème vient de nous."
              />

              <div className="row" style={{ justifyContent: "center" }}>
                <span className="pill">
                  <Loader2 size={12} /> Besoin d’aide ? WhatsApp +229 01 53 61 66 60
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
