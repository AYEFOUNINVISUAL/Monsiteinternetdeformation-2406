import { ArrowLeft, ArrowRight, Check, FileText, Users } from "lucide-react";
import { Link, useParams } from "wouter";
import { Checkout } from "../components/checkout";
import { ContactStrip, SiteLayout } from "../components/site-layout";
import { useEbook } from "../queries/catalog";

export default function FormationPage() {
  const { ref } = useParams<{ ref: string }>();
  const query = useEbook(ref ?? "");

  if (query.isLoading) {
    return (
      <SiteLayout>
        <section className="section">
          <div className="shell stack">
            <div className="skeleton" style={{ height: "1rem", width: "10rem" }} />
            <div className="skeleton" style={{ height: "4rem", width: "70%" }} />
            <div className="skeleton" style={{ height: "12rem" }} />
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
            <p className="eyebrow">Formation introuvable</p>
            <h1 className="display h-section">Cette référence n’existe pas</h1>
            <p className="lede">
              Vérifie le lien reçu, ou reviens à la collection pour choisir une formation.
            </p>
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
          <Link to="/" className="crumb">
            <ArrowLeft size={13} />
            Toutes les formations
          </Link>

          <div className="detail">
            <div className="detail__main stack stack--lg">
              <div className="stack">
                <div className="row">
                  <span className="pill pill--orange">
                    {ebook.ref} · {ebook.pages} pages
                  </span>
                  <span className="pill">{ebook.modules.length} modules</span>
                </div>
                <h1 className="display h-section">{ebook.title}</h1>
                <p className="lede">{ebook.subtitle}</p>
                <p className="meta">{ebook.tagline}</p>
              </div>

              <div className="card card--pad">
                <div className="row" style={{ gap: "0.6rem", marginBottom: "1rem" }}>
                  <Users size={15} color="var(--orange)" />
                  <span className="eyebrow">Cette formation est pour toi si</span>
                </div>
                <ul className="ticks">
                  {ebook.audience.map((item) => (
                    <li key={item}>
                      <Check size={15} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="eyebrow">Programme</p>
                <h2 className="display h-section" style={{ margin: "0.8rem 0 1.5rem" }}>
                  Les {ebook.modules.length} modules
                </h2>
                <ul className="modules">
                  {ebook.modules.map((module) => (
                    <li key={module.n}>
                      <span className="modules__n">
                        {String(module.n).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="modules__t">{module.title}</p>
                        <p className="modules__d">{module.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid--2">
                <div className="card card--pad">
                  <p className="eyebrow">Exercices à remplir</p>
                  <ul className="ticks" style={{ marginTop: "1rem" }}>
                    {ebook.exercises.map((item) => (
                      <li key={item}>
                        <Check size={15} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card card--pad">
                  <p className="eyebrow">Dans le PDF</p>
                  <ul className="ticks" style={{ marginTop: "1rem" }}>
                    {ebook.includes.map((item) => (
                      <li key={item}>
                        <Check size={15} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="card card--pad stack">
                <div className="row" style={{ gap: "0.6rem" }}>
                  <FileText size={15} color="var(--orange)" />
                  <span className="eyebrow">Extrait gratuit</span>
                </div>
                <h3 className="display h-card">{ebook.excerpt.moduleTitle}</h3>
                <p className="muted" style={{ margin: 0, fontSize: "0.94rem" }}>
                  {ebook.excerpt.intro}
                </p>
                <div className="row">
                  <Link to={`/extrait/${ebook.ref}`} className="btn btn--sm">
                    Lire l’extrait complet
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              <ContactStrip title="Un doute sur cette formation ?" />
            </div>

            <aside className="detail__side">
              <Checkout ebook={ebook} />
            </aside>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
