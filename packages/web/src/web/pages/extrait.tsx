import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Link, useParams } from "wouter";
import { formatPrice } from "../../api/catalog";
import { SiteLayout } from "../components/site-layout";
import { useEbook } from "../queries/catalog";

export default function ExtraitPage() {
  const { ref } = useParams<{ ref: string }>();
  const query = useEbook(ref ?? "");

  if (query.isLoading) {
    return (
      <SiteLayout>
        <section className="section">
          <div className="shell stack">
            <div className="skeleton" style={{ height: "1rem", width: "12rem" }} />
            <div className="skeleton" style={{ height: "3rem", width: "60%" }} />
            <div className="skeleton" style={{ height: "14rem" }} />
          </div>
        </section>
      </SiteLayout>
    );
  }

  if (query.isError || !query.data) {
    return (
      <SiteLayout>
        <section className="section">
          <div className="shell stack">
            <p className="eyebrow">Extrait introuvable</p>
            <h1 className="display h-section">Aucun extrait pour cette référence</h1>
            <div className="row">
              <Link to="/" className="btn btn--solid">
                <ArrowLeft size={14} />
                Retour à la collection
              </Link>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const { ebook } = query.data;

  return (
    <SiteLayout>
      <section className="section" style={{ paddingTop: "clamp(2.5rem, 5vw, 4rem)" }}>
        <div className="halo" />
        <div className="shell wrap-content">
          <Link to={`/formation/${ebook.ref}`} className="crumb">
            <ArrowLeft size={13} />
            {ebook.title}
          </Link>

          <div className="stack stack--lg">
            <div className="stack">
              <div className="row">
                <span className="pill pill--orange">Extrait gratuit · {ebook.ref}</span>
                <span className="pill">Module 1 sur {ebook.modules.length}</span>
              </div>
              <h1 className="display h-section">{ebook.excerpt.moduleTitle}</h1>
              <p className="lede">{ebook.excerpt.intro}</p>
            </div>

            <div className="extrait">
              {ebook.excerpt.sections.map((section) => (
                <div className="extrait__block" key={section.title}>
                  <h3>{section.title}</h3>
                  <ul className="ticks">
                    {section.items.map((item) => (
                      <li key={item}>
                        <Check size={15} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="note">
              <strong>À retenir — </strong>
              {ebook.excerpt.note}
            </div>

            <hr className="divider" />

            <div className="grid grid--2" style={{ alignItems: "center" }}>
              <div className="stack">
                <p className="eyebrow">La suite</p>
                <h2 className="display h-section">
                  Ce module continue dans le <span className="boxed">PDF</span>
                </h2>
                <p className="lede">
                  L’extrait s’arrête ici. La formation complète déroule les {ebook.modules.length}{" "}
                  modules, les exercices à remplir, le plan d’action et les fiches pratiques.
                </p>
                <div className="row">
                  <Link to={`/formation/${ebook.ref}`} className="btn btn--solid">
                    Acheter — {formatPrice(ebook.price)}
                    <ArrowRight size={14} />
                  </Link>
                  <Link to="/" className="btn btn--ghost">
                    Les autres formations
                  </Link>
                </div>
              </div>
              <div className="card card--pad">
                <p className="eyebrow">Sommaire du PDF</p>
                <ul className="modules" style={{ marginTop: "1rem" }}>
                  {ebook.modules.map((module) => (
                    <li key={module.n}>
                      <span className="modules__n">{String(module.n).padStart(2, "0")}</span>
                      <p className="modules__t">{module.title}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
