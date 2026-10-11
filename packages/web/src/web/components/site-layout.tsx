import { ArrowUpRight, MessageCircle } from "lucide-react";
import { kkiapayConfigured } from "../lib/kkiapay";
import { Link } from "wouter";

const NAV_LINKS = [
  { href: "/#formations", label: "Formations" },
  { href: "/#methode", label: "Comment ça marche" },
  { href: "/#extraits", label: "Extraits" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

/** Numéro WhatsApp au format international, sans « + » ni espaces (pour wa.me). */
export const WHATSAPP_NUMBER = "2290153616660";
export const WHATSAPP_DISPLAY = "+229 01 53 61 66 60";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export function SiteNav() {
  return (
    <header className="nav">
      <div className="shell nav__inner">
        <Link to="/" className="nav__brand">
          <strong>AYENA</strong>
          <span>Collection</span>
        </Link>
        <nav className="nav__links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="btn btn--sm" href="/#formations">
          Voir les formations
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__grid">
          <div>
            <p className="eyebrow">Collection AYENA</p>
            <p
              className="display"
              style={{ fontSize: "1.6rem", margin: "0.6rem 0 0.8rem" }}
            >
              Des formations écrites depuis Cotonou
            </p>
            <p className="muted" style={{ fontSize: "0.92rem", maxWidth: "34rem" }}>
              Quatre formations pratiques en français, en francs CFA, pour lancer une activité,
              vendre en ligne et tenir tes comptes — sans promesse de revenu.
            </p>
          </div>

          <div>
            <h4>La collection</h4>
            <div className="footer__list">
              <Link to="/formation/E-01">Lancer son e-commerce</Link>
              <Link to="/formation/E-02">Gagner de l'argent avec TikTok</Link>
              <Link to="/formation/E-03">Créer des vidéos avec l'IA</Link>
              <Link to="/formation/E-04">Construire son indépendance</Link>
            </div>
          </div>

          <div>
            <h4>Infos</h4>
            <div className="footer__list">
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
                WhatsApp +229 01 53 61 66 60
              </a>
              <Link to="/contact">Contact</Link>
              <Link to="/conditions">Conditions de vente</Link>
              <a href="/#faq">Questions fréquentes</a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {new Date().getFullYear()} AYENA Jacques — Photographe, vidéaste et réalisateur de
            clips, Cotonou, Bénin.
          </span>
          <span>
            {kkiapayConfigured
              ? "Paiement Mobile Money et carte via Kkiapay."
              : "Commande par WhatsApp, paiement Mobile Money."}{" "}
            Chiffres et sources consultés en octobre 2026.
          </span>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

/** Bandeau défilant — répète les garanties de la collection. */
export function Marquee({ items }: { items: string[] }) {
  const group = (
    <div className="marquee__group" aria-hidden="true">
      {items.map((item) => (
        <span className="marquee__item" key={item}>
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee">
      <div className="marquee__track">
        {group}
        {group}
      </div>
    </div>
  );
}

export function ContactStrip({
  title = "Une question avant d'acheter ?",
  body = "Écris directement sur WhatsApp. Tu parles à l'auteur, pas à un service client.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <div className="card card--pad" style={{ display: "grid", gap: "1.2rem" }}>
      <div>
        <p className="eyebrow">Contact direct</p>
        <h3 className="display h-card" style={{ margin: "0.7rem 0 0.6rem" }}>
          {title}
        </h3>
        <p className="muted" style={{ margin: 0, fontSize: "0.94rem" }}>
          {body}
        </p>
      </div>
      <div className="row">
        <a className="btn btn--solid" href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
          <MessageCircle size={15} />
          WhatsApp +229 01 53 61 66 60
        </a>
        <Link to="/conditions" className="btn btn--ghost">
          Conditions de vente
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
