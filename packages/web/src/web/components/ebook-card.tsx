import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { Ebook } from "../../api/catalog";
import { formatPrice } from "../../api/catalog";

export function EbookCard({ ebook }: { ebook: Ebook }) {
  return (
    <Link to={`/formation/${ebook.ref}`} className="card card--accent ebook">
      <div className="ebook__top">
        <span className="pill pill--orange">
          {ebook.ref} · {ebook.pages} pages
        </span>
      </div>
      <h3 className="display h-card">{ebook.title}</h3>
      <p className="ebook__sub">{ebook.subtitle}</p>
      <div className="ebook__foot">
        <span>{ebook.modules.length} modules</span>
        <span>{formatPrice(ebook.price)}</span>
      </div>
      <span className="btn btn--sm btn--block">
        Voir la formation
        <ArrowRight size={13} />
      </span>
    </Link>
  );
}
