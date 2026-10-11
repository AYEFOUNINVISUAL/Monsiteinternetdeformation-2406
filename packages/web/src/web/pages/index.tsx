import { ArrowRight, Check, Download, Wallet } from "lucide-react";
import { Link } from "wouter";
import type { Ebook } from "../../api/catalog";
import { formatPrice } from "../../api/catalog";
import { EbookCard } from "../components/ebook-card";
import { Faq, type FaqEntry } from "../components/faq";
import { kkiapayConfigured } from "../lib/kkiapay";
import { ContactStrip, Marquee, SiteLayout } from "../components/site-layout";
import { useCatalog } from "../queries/catalog";

const MARQUEE_ITEMS = [
  "Paiement Mobile Money",
  "Téléchargement immédiat",
  "24 pages par formation",
  "8 modules + plan d’action",
  "Écrit depuis Cotonou",
  "Chiffres en francs CFA",
];

/** Les étapes changent selon que le paiement en ligne est actif ou non. */
function buildSteps(onlinePayment: boolean) {
  return [
    {
      title: "Choisis ta formation",
      body: "Quatre sujets, un seul objectif : que tu puisses appliquer dès cette semaine. Lis un extrait gratuit avant de payer.",
    },
    onlinePayment
      ? {
          title: "Paie par Mobile Money",
          body: "MTN, Moov, Celtiis ou carte bancaire via Kkiapay. Le prix est affiché en francs CFA, sans frais cachés côté client.",
        }
      : {
          title: "Commande sur WhatsApp",
          body: "Le message est déjà rédigé avec la référence et le prix. Tu l’envoies, on convient du paiement Mobile Money, et c’est parti.",
        },
    onlinePayment
      ? {
          title: "Télécharge ton PDF",
          body: "Un lien privé, à usage unique, valable 48 heures. Le fichier est à toi : imprime-le, annote-le, garde-le.",
        }
      : {
          title: "Reçois ton PDF",
          body: "Le fichier part sur WhatsApp dès que le paiement est confirmé. Il est à toi : imprime-le, annote-le, garde-le.",
        },
  ];
}

function buildFaq(onlinePayment: boolean): FaqEntry[] {
  return [
  {
    question: "Qu’est-ce que je reçois exactement après le paiement ?",
    answer:
      "Un fichier PDF de 24 pages, en français, avec 8 modules, les exercices à remplir, un plan d’action et des fiches pratiques. Rien à installer, rien à attendre : le lien de téléchargement s’affiche immédiatement après la vérification du paiement.",
  },
  {
    question: "Comment se passe le paiement ?",
    answer: onlinePayment
      ? "Par Mobile Money (MTN, Moov, Celtiis) ou par carte bancaire, à travers le widget sécurisé Kkiapay. Tu saisis ton numéro, tu valides sur ton téléphone, et la boutique vérifie le paiement auprès de Kkiapay avant de te donner ton lien."
      : "Pour l’instant, la commande se fait sur WhatsApp : le message est pré-rempli avec la référence et le prix de la formation. On convient du paiement par Mobile Money (MTN, Moov, Celtiis), et le PDF part dès confirmation. Le paiement en ligne par carte et Mobile Money arrive bientôt.",
  },
  {
    question: "Pourquoi le lien de téléchargement est-il à usage unique ?",
    answer: onlinePayment
      ? "Parce que chaque formation est vendue, pas partagée. Le lien est privé, il expire après 48 heures et ne fonctionne qu’une fois. Si tu perds le fichier, écris sur WhatsApp avec ton identifiant de transaction : un nouveau lien t’est envoyé."
      : "Le fichier est envoyé une seule fois, à toi. Chaque formation est vendue, pas partagée : merci de ne pas la rediffuser. Si tu perds le fichier, écris sur WhatsApp, il t’est renvoyé.",
  },
  {
    question: "Est-ce que ça marche si je ne suis pas au Bénin ?",
    answer:
      "Oui. Le contenu est écrit pour l’Afrique francophone, avec des chiffres en francs CFA et des exemples du Bénin et de la sous-région. Le paiement Kkiapay est disponible au Bénin, au Togo, en Côte d’Ivoire, au Sénégal, au Niger et au Burkina Faso.",
  },
  {
    question: "Est-ce que tu garantis que je vais gagner de l’argent ?",
    answer:
      "Non, et méfie-toi de quiconque te le promet. Ces formations donnent une méthode, des chiffres réels et des exercices. Le résultat dépend de ton marché, de ton produit et du travail que tu fournis. Aucun revenu n’est promis nulle part dans ces pages.",
  },
  {
    question: "Je peux être remboursé ?",
    answer:
      "Comme il s’agit d’un fichier numérique livré immédiatement, l’achat est définitif. Si le fichier ne s’ouvre pas ou si le lien pose problème, écris sur WhatsApp : le problème est réglé, fichier renvoyé ou paiement remboursé.",
  },
  ];
}

function SectionTitle({
  eyebrow,
  title,
  lede,
  center,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "center" : undefined} style={{ marginBottom: "2.5rem" }}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display h-section" style={{ margin: "0.8rem 0 0.9rem" }}>
        {title}
      </h2>
      {lede ? <p className="lede">{lede}</p> : null}
    </div>
  );
}

function Hero({ ebooks }: { ebooks: Ebook[] }) {
  const cheapest = ebooks.reduce(
    (min, ebook) => (ebook.price < min ? ebook.price : min),
    ebooks[0]?.price ?? 0,
  );
  const pages = ebooks.reduce((total, ebook) => total + ebook.pages, 0);
  const modules = ebooks.reduce((total, ebook) => total + ebook.modules.length, 0);

  return (
    <section className="section" style={{ paddingTop: "clamp(3rem, 7vw, 6rem)" }}>
      <div className="halo" />
      <div className="shell wrap-content">
        <div className="stack stack--lg">
          <div className="stack">
            <p className="eyebrow">Collection AYENA · Cotonou, Bénin</p>
            <h1 className="display h-hero">
              Apprends, applique, <span className="boxed">encaisse.</span>
            </h1>
            <p className="lede">
              Quatre formations PDF en français, chiffrées en francs CFA, écrites depuis Cotonou :
              e-commerce, TikTok, vidéo avec l’IA et indépendance financière. 24 pages chacune, 8
              modules, un plan d’action — et aucune promesse de revenu.
            </p>
          </div>

          <div className="row">
            <a className="btn btn--solid" href="#formations">
              Voir les 4 formations
              <ArrowRight size={14} />
            </a>
            <a className="btn btn--ghost" href="#extraits">
              Lire un extrait gratuit
            </a>
          </div>

          <div className="grid grid--4" style={{ gap: "1rem" }}>
            {[
              { value: String(ebooks.length), label: "formations" },
              { value: String(pages), label: "pages au total" },
              { value: String(modules), label: "modules" },
              { value: `dès ${formatPrice(cheapest)}`, label: "prix de départ" },
            ].map((stat) => (
              <div className="card" key={stat.label} style={{ padding: "1.2rem" }}>
                <div
                  className="display"
                  style={{ fontSize: "1.35rem", color: "var(--orange)" }}
                >
                  {stat.value}
                </div>
                <div className="meta" style={{ marginTop: "0.35rem" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Method() {
  const steps = buildSteps(kkiapayConfigured);
  return (
    <section className="section section--alt" id="methode">
      <div className="shell">
        <SectionTitle
          eyebrow="Comment ça marche"
          title={
            <>
              Trois étapes, <span className="boxed">zéro</span> complication
            </>
          }
          lede="Tu n’as pas besoin de compte, ni d’application, ni d’ordinateur. Un téléphone connecté suffit."
        />
        <div className="grid grid--3">
          {steps.map((step, index) => (
            <div className="step" key={step.title}>
              <div className="step__num">{index + 1}</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Formations({ ebooks }: { ebooks: Ebook[] }) {
  return (
    <section className="section" id="formations">
      <div className="shell">
        <SectionTitle
          eyebrow="La collection"
          title={
            <>
              Les <span className="boxed">4</span> formations
            </>
          }
          lede="Chaque formation se suffit à elle-même. Prise seule ou avec les autres, elle se termine par un plan d’action que tu peux commencer le jour même."
        />
        <div className="grid grid--4">
          {ebooks.map((ebook) => (
            <EbookCard ebook={ebook} key={ebook.ref} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Includes({ ebooks }: { ebooks: Ebook[] }) {
  const includes = ebooks[0]?.includes ?? [];

  return (
    <section className="section orange">
      <div className="shell">
        <div className="grid grid--2" style={{ alignItems: "center", gap: "2.5rem" }}>
          <div>
            <p className="eyebrow">Ce qui est inclus</p>
            <h2 className="display h-section" style={{ margin: "0.8rem 0 1rem" }}>
              Le même niveau d’exigence dans les quatre PDF
            </h2>
            <p className="orange__lede">
              Pas de remplissage, pas de théorie recopiée. Des chiffres en francs CFA, des étapes
              numérotées, des modèles à remplir et des limites annoncées clairement.
            </p>
          </div>
          <div className="orange__card">
            <ul className="ticks">
              {includes.map((item) => (
                <li key={item}>
                  <Check size={15} />
                  {item}
                </li>
              ))}
              <li>
                <Check size={15} />
                Un extrait gratuit du module 1 pour chaque formation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Excerpts({ ebooks }: { ebooks: Ebook[] }) {
  return (
    <section className="section section--alt" id="extraits">
      <div className="shell">
        <SectionTitle
          eyebrow="Extraits gratuits"
          title={
            <>
              Lis avant de <span className="boxed">payer</span>
            </>
          }
          lede="Le début du module 1 de chaque formation, tel quel, sans inscription."
        />
        <div className="grid grid--2">
          {ebooks.map((ebook) => (
            <article className="card card--pad stack" key={ebook.ref}>
              <span className="pill pill--orange">{ebook.ref}</span>
              <h3 className="display h-card">{ebook.title}</h3>
              <p className="muted" style={{ margin: 0, fontSize: "0.92rem" }}>
                {ebook.excerpt.intro}
              </p>
              <div className="row" style={{ marginTop: "auto" }}>
                <Link to={`/extrait/${ebook.ref}`} className="btn btn--sm">
                  Lire l’extrait
                  <ArrowRight size={13} />
                </Link>
                <span className="meta">{formatPrice(ebook.price)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="section" id="faq">
      <div className="shell">
        <SectionTitle
          eyebrow="Questions fréquentes"
          title={
            <>
              Ce qu’on me demande <span className="boxed">tout le temps</span>
            </>
          }
        />
        <Faq entries={buildFaq(kkiapayConfigured)} />
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="section section--alt" id="contact">
      <div className="shell">
        <SectionTitle
          eyebrow="Contact"
          title={
            <>
              Parler à l’<span className="boxed">auteur</span>
            </>
          }
          lede="AYENA Jacques — photographe, vidéaste et réalisateur de clips à Cotonou. Tu écris, c’est lui qui répond."
        />
        <ContactStrip />
      </div>
    </section>
  );
}

export default function Index() {
  const catalog = useCatalog();
  const ebooks = catalog.data?.ebooks ?? [];

  return (
    <SiteLayout>
      <Hero ebooks={ebooks} />
      <Marquee items={MARQUEE_ITEMS} />
      {catalog.isLoading ? (
        <section className="section">
          <div className="shell stack">
            <div className="skeleton" style={{ height: "2rem", width: "12rem" }} />
            <div className="grid grid--4">
              {[0, 1, 2, 3].map((key) => (
                <div className="skeleton" key={key} style={{ height: "15rem" }} />
              ))}
            </div>
          </div>
        </section>
      ) : catalog.isError ? (
        <section className="section">
          <div className="shell">
            <div className="alert alert--error">
              Le catalogue n’a pas pu être chargé. Recharge la page ou écris sur WhatsApp.
            </div>
          </div>
        </section>
      ) : (
        <>
          <Method />
          <Formations ebooks={ebooks} />
          <Includes ebooks={ebooks} />
          <Excerpts ebooks={ebooks} />
        </>
      )}
      <FaqSection />
      <ContactSection />
      <section className="section" style={{ paddingBlock: "clamp(3rem, 6vw, 5rem)" }}>
        <div className="shell center stack">
          <div className="row" style={{ justifyContent: "center" }}>
            <span className="pill">
              <Download size={12} /> Livraison immédiate
            </span>
            <span className="pill">
              <Wallet size={12} /> Mobile Money & carte
            </span>
          </div>
          <h2 className="display h-section">
            Commence par un <span className="boxed">extrait</span>
          </h2>
          <p className="lede">
            Quatre modules 1 complets, gratuits. Si la méthode te parle, le reste est à toi pour le
            prix d’un repas.
          </p>
          <div className="row" style={{ justifyContent: "center" }}>
            <a className="btn btn--solid" href="#formations">
              Choisir ma formation
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
