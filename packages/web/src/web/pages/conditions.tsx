import { Link } from "wouter";
import { kkiapayConfigured } from "../lib/kkiapay";
import { SiteLayout } from "../components/site-layout";

const SECTIONS = [
  {
    title: "1. Ce que vend la boutique",
    body: [
      "La boutique vend des formations numériques au format PDF, en français, rédigées par AYENA Jacques. Chaque fiche produit indique le nombre de pages, le nombre de modules et le prix en francs CFA.",
      "Aucun support papier n’est expédié. Aucun abonnement n’est vendu : chaque achat est un paiement unique.",
    ],
  },
  {
    title: "2. Prix et paiement",
    body: [
      "Les prix sont affichés en francs CFA, toutes taxes comprises. Ils sont susceptibles d’évoluer ; le prix appliqué est celui affiché au moment de l’achat.",
      kkiapayConfigured
        ? "Le paiement se fait en ligne par Mobile Money (MTN, Moov, Celtiis) ou par carte bancaire, via la plateforme Kkiapay. La boutique ne stocke ni ne voit jamais ton code Mobile Money ni tes données de carte."
        : "Le paiement se fait par Mobile Money (MTN, Moov, Celtiis), sur commande passée par WhatsApp. Le paiement en ligne par carte et Mobile Money est en cours d’activation et sera proposé directement sur la boutique.",
      kkiapayConfigured
        ? "Chaque paiement est vérifié côté serveur auprès de Kkiapay avant l’enregistrement de la commande. Si le montant reçu ne correspond pas au prix affiché, la commande n’est pas délivrée."
        : "Aucune donnée de paiement n’est collectée par la boutique : l’échange se fait directement avec l’auteur, et la commande n’est traitée qu’après confirmation du paiement.",
    ],
  },
  {
    title: "3. Livraison du fichier",
    body: [
      kkiapayConfigured
        ? "La livraison est immédiate et automatique : dès que le paiement est confirmé, une page de téléchargement s’affiche avec un lien privé."
        : "La livraison se fait sur WhatsApp : le PDF est envoyé dès que le paiement est confirmé.",
      kkiapayConfigured
        ? "Ce lien est personnel, valable 48 heures et utilisable une seule fois. Télécharge le fichier et conserve-le. Si tu perds le fichier ou si le lien a expiré, écris sur WhatsApp avec ton identifiant de transaction : un nouveau lien t’est envoyé."
        : "Le fichier t’est réservé : il est envoyé une seule fois et n’a pas à être rediffusé. Si tu le perds, écris sur WhatsApp, il t’est renvoyé.",
    ],
  },
  {
    title: "4. Droit d’usage",
    body: [
      "L’achat donne un droit d’usage personnel et non transférable du fichier. Le partage, la revente, la mise en ligne publique ou la redistribution des PDF, en tout ou partie, ne sont pas autorisés.",
      "Les liens de téléchargement sont à usage unique précisément pour éviter le partage des fichiers.",
    ],
  },
  {
    title: "5. Remboursement",
    body: [
      "S’agissant d’un contenu numérique livré immédiatement, l’achat est définitif et aucun remboursement n’est dû au motif d’un changement d’avis.",
      "En revanche, si le fichier est illisible, corrompu, incomplet, ou si le lien de téléchargement ne fonctionne pas malgré l’aide apportée, le paiement est remboursé intégralement sur simple demande par WhatsApp, avec l’identifiant de transaction.",
    ],
  },
  {
    title: "6. Aucune garantie de revenu",
    body: [
      "Les formations décrivent des méthodes, des ordres de grandeur et des exercices. Elles ne promettent aucun revenu, aucun résultat et aucun délai.",
      "Les chiffres cités dans les PDF sont sourcés et vérifiés en octobre 2026. Les tarifs, frais et règles cités (Kkiapay, TikTok, administration béninoise, outils d’IA) peuvent changer : il te revient de vérifier l’information au moment où tu l’appliques.",
    ],
  },
  {
    title: "7. Responsabilité et contact",
    body: [
      "La boutique met tout en œuvre pour que les fichiers soient disponibles sans interruption, sans pouvoir garantir une disponibilité permanente du réseau mobile ou de la plateforme de paiement.",
      "Pour toute question, réclamation ou demande de nouveau lien : WhatsApp +229 01 53 61 66 60, ou via la page contact. Réponse sous 24 à 48 heures.",
    ],
  },
];

export default function ConditionsPage() {
  return (
    <SiteLayout>
      <section className="section">
        <div className="halo" />
        <div className="shell wrap-content" style={{ maxWidth: "52rem" }}>
          <p className="eyebrow">Conditions de vente</p>
          <h1 className="display h-section" style={{ margin: "0.8rem 0 1rem" }}>
            Les règles du jeu, <span className="boxed">clairement</span>
          </h1>
          <p className="lede">
            Qui vend quoi, comment tu paies, comment tu reçois ton fichier, et ce qui se passe si ça
            ne marche pas. Dernière mise à jour : octobre 2026.
          </p>

          <div className="stack stack--lg" style={{ marginTop: "3rem" }}>
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="display" style={{ fontSize: "1.1rem", marginBottom: "0.8rem" }}>
                  {section.title}
                </h2>
                <div className="stack" style={{ gap: "0.8rem" }}>
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="muted"
                      style={{ margin: 0, fontSize: "0.95rem" }}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="row" style={{ marginTop: "3rem" }}>
            <Link to="/" className="btn btn--solid">
              Voir les formations
            </Link>
            <Link to="/contact" className="btn btn--ghost">
              Nous écrire
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
