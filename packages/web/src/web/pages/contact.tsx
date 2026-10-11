import { Camera, Clock, MessageCircle, Video } from "lucide-react";
import { Link } from "wouter";
import { Faq, type FaqEntry } from "../components/faq";
import { SiteLayout, WHATSAPP_LINK } from "../components/site-layout";

const FAQ: FaqEntry[] = [
  {
    question: "Je n’ai pas reçu mon lien de téléchargement, que faire ?",
    answer:
      "Écris sur WhatsApp en indiquant ton identifiant de transaction (il commence par une longue suite de chiffres reçue après le paiement). Un nouveau lien te sera envoyé, même si l’ancien a expiré.",
  },
  {
    question: "Le PDF ne s’ouvre pas sur mon téléphone.",
    answer:
      "Sur Android, ouvre le fichier avec Google Drive ou WPS Office plutôt qu’avec le lecteur par défaut. Si ça ne suffit pas, écris sur WhatsApp : le fichier est renvoyé, ou le paiement est remboursé.",
  },
  {
    question: "Est-ce que tu proposes une facture ou un reçu ?",
    answer:
      "Le paiement Kkiapay te renvoie automatiquement un reçu par SMS ou par e-mail. Pour une facture au nom de ton entreprise, écris sur WhatsApp avec ton IFU : la facture est préparée.",
  },
  {
    question: "Est-ce que tu fais des formations en présentiel ou du coaching ?",
    answer:
      "Pas pour l’instant. La boutique vend uniquement les formations PDF. Si tu veux du sur-mesure, écris sur WhatsApp : les demandes sont étudiées au cas par cas, sans engagement.",
  },
];

export default function ContactPage() {
  return (
    <SiteLayout>
      <section className="section">
        <div className="halo" />
        <div className="shell wrap-content">
          <div className="grid grid--2" style={{ alignItems: "start", gap: "3rem" }}>
            <div className="stack stack--lg">
              <div className="stack">
                <p className="eyebrow">Contact</p>
                <h1 className="display h-section">
                  Écris, c’est l’<span className="boxed">auteur</span> qui répond
                </h1>
                <p className="lede">
                  Une question sur une formation, un lien de téléchargement perdu, une facture à
                  établir : tout passe par WhatsApp.
                </p>
              </div>

              <a className="btn btn--solid" href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
                <MessageCircle size={15} />
                WhatsApp +229 01 53 61 66 60
              </a>

              <div className="card card--pad stack">
                <p className="eyebrow">Pour aller plus vite</p>
                <ul className="ticks">
                  <li>
                    <MessageCircle size={15} />
                    Recopie ton identifiant de transaction si la question concerne un achat.
                  </li>
                  <li>
                    <MessageCircle size={15} />
                    Dis sur quel appareil tu lis le PDF (Android, iPhone, ordinateur).
                  </li>
                  <li>
                    <MessageCircle size={15} />
                    Précise la référence de la formation : E-01, E-02, E-03 ou E-04.
                  </li>
                </ul>
              </div>

              <div className="card card--pad stack">
                <p className="eyebrow">AYENA Jacques</p>
                <p className="muted" style={{ margin: 0, fontSize: "0.94rem" }}>
                  Photographe, vidéaste et réalisateur de clips à Cotonou, Bénin. Les formations de
                  la collection viennent de son propre travail : commandes de clients, ventes en
                  ligne, vidéos publiées, comptes tenus au mois.
                </p>
                <div className="row">
                  <span className="pill">
                    <Camera size={12} /> Photo & vidéo
                  </span>
                  <span className="pill">
                    <Video size={12} /> Clips musicaux
                  </span>
                  <span className="pill">
                    <Clock size={12} /> Réponse 24–48 h
                  </span>
                </div>
              </div>

              <div className="row">
                <Link to="/conditions" className="btn btn--ghost">
                  Conditions de vente
                </Link>
                <Link to="/" className="btn btn--ghost">
                  Les 4 formations
                </Link>
              </div>
            </div>

            <div className="stack">
              <p className="eyebrow">Questions fréquentes</p>
              <h2 className="display h-section" style={{ margin: "0.8rem 0 1rem" }}>
                Avant d’écrire
              </h2>
              <Faq entries={FAQ} />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
