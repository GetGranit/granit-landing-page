import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { usePostHog } from "posthog-js/react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";
import { SITE_URL, organizationLd } from "@/lib/seo";
import { calcomDemoUrl } from "@/lib/calcom";
import { chiffres, content, equipe, type Lang, type Membre } from "@/lib/aProposCopy";

// Structure inspirée de vocca.com/fr/a-propos : hero, chiffres, problème → réponse, convictions,
// équipe, FAQ, CTA (histoire et cap retirés : boîte jeune). Textes et données dans src/lib/aProposCopy.ts.
// TODO Paul : date de création légale de Granit introuvable dans le repo ; l'ajouter dans le hero
// (heroDateTodo) et en `foundingDate` ci-dessous une fois confirmée.

const TITRE = "À propos de Granit : l'équipe et la mission - Granit";
const DESCRIPTION =
  "Granit conçoit des agents IA pour le back-office des professionnels de santé, dans leurs outils. Fondé par Jenny Mansour (CEO) et Corneille Marechal (CTO).";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: TITRE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITRE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: AProposPage,
});

// Données structurées : toujours en français (langue rendue côté serveur et indexée).
const URL_PAGE = `${SITE_URL}/a-propos`;
const ldPage = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": URL_PAGE,
  url: URL_PAGE,
  name: TITRE,
  description: DESCRIPTION,
  inLanguage: "fr-FR",
  mainEntity: {
    ...organizationLd,
    "@context": undefined,
    description: content.fr.lead,
    founder: equipe
      .filter((m) => m.fondateur)
      .map((m) => ({
        "@type": "Person",
        name: m.nom,
        jobTitle: m.poste,
        image: m.photo ? SITE_URL + m.photo : undefined,
        sameAs: m.linkedin ? [m.linkedin] : undefined,
        alumniOf: m.ecoles?.map((name) => ({ "@type": "CollegeOrUniversity", name })),
      })),
  },
};
const ldFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: content.fr.faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const h2Style = { fontSize: "clamp(28px,3vw,40px)", lineHeight: 1.15, fontWeight: 700 } as const;

function AProposPage() {
  const { lang } = useLanguage();
  const posthog = usePostHog();
  const t = content[lang];
  return (
    <SiteLayout>
      {[ldPage, ldFaq].map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}

      {/* 1. Hero : ce qu'on est, une phrase factuelle, photo d'équipe */}
      <section className="mx-auto max-w-[1280px] px-6 pt-24 pb-16">
        <Reveal>
          <div className="eyebrow mb-5">{t.eyebrow}</div>
          <h1 className="h1-hero max-w-5xl" style={{ fontSize: "clamp(36px,4.6vw,68px)" }}>
            {t.title}
          </h1>
          <p className="body-lg mt-8 max-w-3xl">
            {t.heroAvant} <Todo>{t.heroDateTodo}</Todo> {t.heroApres}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <img
            src="/equipe/equipe-granit.jpg"
            alt={t.photoAlt}
            width={1280}
            height={854}
            className="mt-12 aspect-[3/2] w-full rounded-[16px] object-cover"
          />
        </Reveal>
      </section>

      {/* 2. Bandeau de chiffres : valeurs à fournir, jamais inventées */}
      <section className="mx-auto max-w-[1280px] px-6 pb-20">
        <h2 className="sr-only">{t.chiffresTitre}</h2>
        <div
          className="grid grid-cols-2 gap-6 rounded-[12px] border p-8 md:grid-cols-4"
          style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
        >
          {chiffres.map((c) => (
            <div key={c.libelle.fr}>
              <div className="text-[36px]" style={{ fontFamily: "var(--font-mono)" }}>
                {c.valeur ?? "—"}
              </div>
              <div className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>
                {c.libelle[lang]}
              </div>
              {c.valeur === null && <Todo>{lang === "fr" ? "chiffre" : "number"}</Todo>}
            </div>
          ))}
        </div>
      </section>

      {/* 3. Problème → réponse */}
      <section className="mx-auto max-w-[1280px] px-6 pb-20">
        <Reveal>
          <h2 className="font-serif" style={h2Style}>
            {t.problemeTitre}
          </h2>
          <div
            className="mt-6 max-w-3xl space-y-5 text-[16px] leading-[1.75]"
            style={{ color: "var(--text-soft)" }}
          >
            {t.probleme.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 4. Nos convictions */}
      <Section titre={t.convictionsTitre}>
        <div className="grid gap-4 md:grid-cols-3">
          {t.convictions.map((c, i) => (
            <Reveal key={c.t} delay={i * 0.04}>
              <Bloc numero={i + 1} titre={c.t} texte={c.d} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 5. L'équipe : ajouter un membre = une ligne dans `equipe` (aProposCopy.ts) */}
      <Section titre={t.equipeTitre} intro={t.equipeIntro}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {equipe.map((m, i) => (
            <Reveal key={m.nom} delay={i * 0.05}>
              <CarteMembre m={m} lang={lang} lienLabel={t.linkedin} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FAQ en accordéon natif (<details>) : les réponses restent dans le HTML serveur, lisibles par les moteurs */}
      <Section titre={t.faqTitle}>
        <div className="max-w-3xl border-b" style={{ borderColor: "var(--border)" }}>
          {t.faq.map((f) => (
            <details key={f.q} className="group border-t" style={{ borderColor: "var(--border)" }}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                <h3 className="text-[17px]" style={{ fontWeight: 500 }}>
                  {f.q}
                </h3>
                <span
                  aria-hidden
                  className="text-[22px] leading-none transition-transform group-open:rotate-45"
                  style={{ color: "var(--terra)" }}
                >
                  +
                </span>
              </summary>
              <p className="pb-6 text-[15px] leading-[1.7]" style={{ color: "var(--text-soft)" }}>
                {f.a}
                {"lien" in f && f.lien && (
                  <>
                    {" "}
                    <Link to={f.lien.to} className="underline" style={{ color: "var(--terra)" }}>
                      {f.lien.label} →
                    </Link>
                  </>
                )}
              </p>
            </details>
          ))}
        </div>
      </Section>

      {/* 7. CTA final : même bouton démo Cal.com que la page d'accueil */}
      <section className="mx-auto max-w-[1280px] px-6 pb-28">
        <Reveal>
          <div
            className="rounded-[12px] border p-10 text-center"
            style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
          >
            <h2 className="font-serif" style={h2Style}>
              {t.ctaTitre}
            </h2>
            <p
              className="mx-auto mt-4 max-w-2xl text-[15px] leading-[1.7]"
              style={{ color: "var(--text-soft)" }}
            >
              {t.ctaTexte}
            </p>
            <a
              href={calcomDemoUrl("a_propos_cta", undefined, "a_propos")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-8 inline-flex"
              onClick={() =>
                posthog?.capture("demo_booking_clicked", { placement: "a_propos_cta" })
              }
            >
              {t.ctaBouton} <span className="arrow">↗</span>
            </a>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}

/** Section standard : titre H2 (+ intro), puis contenu. */
function Section({
  titre,
  intro,
  children,
}: {
  titre: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pb-20">
      <Reveal>
        <h2 className="font-serif" style={h2Style}>
          {titre}
        </h2>
        {intro && (
          <p
            className="mt-4 max-w-3xl text-[15px] leading-[1.7]"
            style={{ color: "var(--text-soft)" }}
          >
            {intro}
          </p>
        )}
      </Reveal>
      <div className="mt-10">{children}</div>
    </section>
  );
}

/** Repère TODO visible : contenu manquant que Paul doit fournir avant mise en ligne. */
function Todo({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-[4px] border border-dashed px-1.5 py-0.5 align-middle text-[11px] uppercase tracking-[0.04em]"
      style={{ borderColor: "var(--terra)", color: "var(--terra)", fontFamily: "var(--font-mono)" }}
    >
      TODO · {children}
    </span>
  );
}

function Bloc({ numero, titre, texte }: { numero: number; titre: string; texte: string }) {
  return (
    <div
      className="h-full rounded-[8px] border bg-white/40 p-6"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="text-[11px] uppercase tracking-[0.04em]"
        style={{ fontFamily: "var(--font-mono)", color: "var(--terra)" }}
      >
        0{numero}
      </div>
      <h3 className="mt-3 text-[17px]" style={{ fontWeight: 500 }}>
        {titre}
      </h3>
      <p className="mt-2 text-[14px] leading-[1.65]" style={{ color: "var(--text-soft)" }}>
        {texte}
      </p>
    </div>
  );
}

/** Carte d'un membre : photo si fournie, sinon initiales. */
function CarteMembre({ m, lang, lienLabel }: { m: Membre; lang: Lang; lienLabel: string }) {
  return (
    <div
      className="h-full rounded-[8px] border bg-white/40 p-6"
      style={{ borderColor: "var(--border)" }}
    >
      {m.photo ? (
        <img
          src={m.photo}
          alt={m.nom}
          width={400}
          height={400}
          loading="lazy"
          className="aspect-square w-full rounded-[8px] object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="flex aspect-square w-full items-center justify-center rounded-[8px] text-[40px]"
          style={{
            background: "var(--bg2)",
            color: "var(--terra)",
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
          }}
        >
          {m.initiales}
        </div>
      )}
      <h3 className="mt-5 text-[19px]" style={{ fontWeight: 500 }}>
        {m.nom}
      </h3>
      <div className="text-[13px]" style={{ color: "var(--text-muted)" }}>
        {m.role[lang]}
      </div>
      <ul className="mt-4 space-y-2">
        {m.parcours[lang].map((p) => (
          <li key={p} className="text-[14px] leading-[1.6]" style={{ color: "var(--text-soft)" }}>
            {p}
          </li>
        ))}
      </ul>
      {m.linkedin && (
        <a
          href={m.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex text-[13px] underline"
          style={{ color: "var(--terra)" }}
        >
          {lienLabel} ↗
        </a>
      )}
    </div>
  );
}
