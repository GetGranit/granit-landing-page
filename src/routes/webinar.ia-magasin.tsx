import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";

import { Reveal } from "@/components/Reveal";
import { Faq, WebinarForm } from "@/components/webinar/WebinarShared";
import { useJoursRestants } from "@/hooks/useWebinarCountdown";
import { t } from "@/lib/webinarIa";
import logoMonogram from "@/assets/logo.svg";
import photoPaul from "@/assets/paul-pietra.jpg";
import photoMagasin from "@/assets/webinar-magasin.jpg";

/**
 * Inscription au webinar « 5 usages de l'IA en magasin » du 26 novembre.
 * On y arrive par les liens de la campagne lemlist « Test 3 messages »
 * (approche Webinar IA, cohortes A et B, distinguées par `utm_content`).
 *
 * Page de campagne comme /silmo : hors navigation, hors sitemap et en noindex,
 * dont la seule action est le formulaire. Le haut de page est une affiche
 * (photo de magasin, animateur, date) qui dit quoi, quand et qui avant toute
 * lecture. Texte et formulaire sont communs avec la variante
 * /webinar/ia-magasin-b (voir lib/webinarIa.ts et components/webinar).
 *
 * Page en français seulement : la campagne ne vise que des magasins français.
 */
export const Route = createFileRoute("/webinar/ia-magasin")({
  head: () => ({
    meta: [
      { title: "Webinar : 5 usages de l'IA en magasin - Granit" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content:
          "Jeudi 26 novembre, 13h15-14h : 5 cas d'usage concrets de l'IA pour gagner du temps en magasin. En ligne, gratuit, sans théorie.",
      },
      { property: "og:title", content: "5 usages concrets de l'IA en magasin" },
      {
        property: "og:description",
        content: "Webinar gratuit, jeudi 26 novembre à 13h15. 45 minutes, des exemples en direct.",
      },
    ],
  }),
  component: WebinarPage,
});

const ENCRE = "var(--text)";
const CREME = "var(--bg2)";
const FILET = "var(--border2)";

const mono = {
  fontFamily: "var(--font-mono)",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
};

function WebinarPage() {
  return (
    <div className="min-h-screen" style={{ background: CREME, color: ENCRE }}>
      <header
        className="sticky top-0 z-50"
        style={{ background: CREME, borderBottom: `1px solid ${ENCRE}` }}
      >
        <div className="mx-auto flex h-[62px] max-w-[1140px] items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-2.5">
            <img src={logoMonogram} alt="Granit" className="h-[26px] w-auto" />
            <span className="font-serif text-[19px] tracking-tight" style={{ fontWeight: 700 }}>
              Granit
            </span>
          </div>
          <a
            href="#inscription"
            className="px-3.5 py-2 text-[11px]"
            style={{ ...mono, color: CREME, background: ENCRE }}
          >
            S'inscrire
          </a>
        </div>
      </header>

      <Hero />

      <main className="mx-auto max-w-[1140px] px-5 pb-20 md:px-8">
        <section className="pt-20">
          <Reveal>
            <p className="text-[11px]" style={{ ...mono, color: "var(--terra)" }}>
              {t.whatEyebrow}
            </p>
            <h2
              className="mt-3 font-serif"
              style={{ fontSize: "clamp(26px, 4vw, 40px)", lineHeight: 1.12, fontWeight: 400 }}
            >
              {t.whatTitle} <span className="accent-italic">{t.whatAccent}</span>
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.cas.map((c, i) => (
              <Reveal key={c.titre} delay={i * 0.08}>
                <div
                  className="card-hover flex h-full flex-col rounded-[16px] border p-6"
                  style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[30px] leading-none" aria-hidden>
                      {c.emoji}
                    </span>
                    <span
                      className="num-tabular text-[12px]"
                      style={{ ...mono, color: "var(--terra)" }}
                    >
                      0{i + 1}
                    </span>
                  </div>
                  <h3
                    className="mt-6 font-serif text-[21px]"
                    style={{ fontWeight: 400, lineHeight: 1.2 }}
                  >
                    {c.titre}
                  </h3>
                  <p
                    className="mt-3 text-[14px]"
                    style={{ lineHeight: 1.55, color: "var(--text-soft)" }}
                  >
                    {c.texte}
                  </p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.24}>
              <SurpriseCard />
            </Reveal>
          </div>
        </section>

        <section className="grid gap-4 pt-16 md:grid-cols-3">
          {t.infos.map((info, i) => (
            <Reveal key={info.titre} delay={i * 0.08}>
              <div
                className="flex h-full gap-4 rounded-[16px] p-6"
                style={{ background: "var(--terra-light)" }}
              >
                <span className="text-[26px] leading-none" aria-hidden>
                  {info.emoji}
                </span>
                <div>
                  <h3 className="text-[15px]" style={{ fontWeight: 600 }}>
                    {info.titre}
                  </h3>
                  <p
                    className="mt-1.5 text-[14px]"
                    style={{ lineHeight: 1.55, color: "var(--text-soft)" }}
                  >
                    {info.texte}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </section>

        <section className="pt-16">
          <Reveal>
            <p className="text-[11px]" style={{ ...mono, color: "var(--terra)" }}>
              {t.derouleEyebrow}
            </p>
            <Deroule />
          </Reveal>
        </section>

        <section
          id="inscription"
          className="grid scroll-mt-24 gap-12 pt-20 md:grid-cols-[1fr_1.1fr]"
        >
          <Reveal>
            <h2
              className="font-serif"
              style={{ fontSize: "clamp(26px, 4vw, 40px)", lineHeight: 1.12, fontWeight: 400 }}
            >
              On vous garde <span className="accent-italic">une place&nbsp;?</span>
            </h2>
            <p
              className="mt-4 max-w-md text-[15px]"
              style={{ lineHeight: 1.6, color: "var(--text-soft)" }}
            >
              📅 {t.date} · ⏰ {t.heure}
            </p>
            <div className="mt-10">
              <h3 className="mb-1 font-serif text-[21px]" style={{ fontWeight: 400 }}>
                {t.faqTitle}
              </h3>
              <Faq />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <WebinarForm variant="a" />
          </Reveal>
        </section>
      </main>
    </div>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  const jours = useJoursRestants();

  return (
    <section className="relative overflow-hidden" style={{ background: "#16120e" }}>
      <motion.img
        src={photoMagasin}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
        initial={reduce ? false : { scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 14, ease: "easeOut" }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(22,18,14,0.92) 0%, rgba(22,18,14,0.78) 45%, rgba(22,18,14,0.35) 100%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1140px] items-center gap-10 px-5 py-14 md:grid-cols-[1.15fr_1fr] md:px-8 md:py-24">
        <Reveal>
          <span
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px]"
            style={{
              ...mono,
              color: "#fff",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <span className="relative flex h-2 w-2">
              {!reduce && (
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ background: "var(--terra)" }}
                />
              )}
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: "var(--terra)" }}
              />
            </span>
            🎙️ {t.badge}
          </span>

          <h1
            className="mt-6 font-serif text-white"
            style={{
              fontSize: "clamp(32px, 5.2vw, 60px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontWeight: 400,
            }}
          >
            {t.titleLead}
            <br />
            <span className="accent-italic" style={{ color: "#f0a07e" }}>
              {t.titleAccent}
            </span>
          </h1>
          <p
            className="mt-5 max-w-lg text-[16px]"
            style={{ lineHeight: 1.6, color: "rgba(255,255,255,0.78)" }}
          >
            {t.intro}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#inscription"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[14px] text-white transition-transform hover:scale-[1.03]"
              style={{
                background: "var(--terra)",
                fontWeight: 600,
                boxShadow: "0 10px 30px -10px var(--terra-glow)",
              }}
            >
              {t.cta} <span aria-hidden>→</span>
            </a>
            <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.7)" }}>
              🎬 {t.replay}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <Affiche jours={jours} />
        </Reveal>
      </div>
    </section>
  );
}

/** La carte « affiche » du hero : qui, quand, et les cinq cas en un coup d'œil. */
function Affiche({ jours }: { jours: string | null }) {
  const emojis = [...t.cas.map((c) => c.emoji), "🔒", "🔒"];
  return (
    <motion.div
      className="relative rounded-[20px] p-6 md:p-7"
      style={{ background: CREME, boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)" }}
      initial={{ rotate: 0 }}
      whileHover={{ rotate: -0.6, y: -4 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      {jours !== null && (
        <motion.span
          className="absolute -right-3 -top-3 rounded-full px-3.5 py-1.5 text-[12px] text-white"
          style={{
            ...mono,
            background: "var(--terra)",
            boxShadow: "0 8px 20px -6px var(--terra-glow)",
          }}
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: 6 }}
          transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.6 }}
        >
          {jours}
        </motion.span>
      )}

      <div className="flex items-center gap-4">
        <img
          src={photoPaul}
          alt="Paul Pietra"
          width={76}
          height={76}
          className="h-[76px] w-[76px] shrink-0 rounded-full object-cover"
          style={{ boxShadow: "0 0 0 3px var(--bg2), 0 0 0 5px var(--terra)" }}
        />
        <div>
          <p className="text-[15px]" style={{ fontWeight: 600 }}>
            {t.host}
          </p>
          <p className="mt-1 text-[13px]" style={{ lineHeight: 1.45, color: "var(--text-soft)" }}>
            {t.hostLine}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div
          className="rounded-[12px] p-4"
          style={{ background: "var(--surface)", border: `1px solid ${FILET}` }}
        >
          <p className="text-[11px]" style={{ ...mono, color: "var(--text-muted)" }}>
            📅 Date
          </p>
          <p className="mt-1.5 font-serif text-[19px]" style={{ fontWeight: 400 }}>
            {t.date}
          </p>
        </div>
        <div
          className="rounded-[12px] p-4"
          style={{ background: "var(--surface)", border: `1px solid ${FILET}` }}
        >
          <p className="text-[11px]" style={{ ...mono, color: "var(--text-muted)" }}>
            ⏰ Horaire
          </p>
          <p
            className="num-tabular mt-1.5 font-serif text-[19px]"
            style={{ fontWeight: 400, color: "var(--terra)" }}
          >
            {t.heure}
          </p>
        </div>
      </div>

      <p className="mt-6 text-[11px]" style={{ ...mono, color: "var(--text-muted)" }}>
        {t.programme} · 5 cas d'usage
      </p>
      <ul className="mt-3 flex gap-2.5">
        {emojis.map((e, i) => (
          <motion.li
            key={i}
            className="flex h-12 flex-1 items-center justify-center rounded-[12px] text-[22px]"
            style={{
              background: i < 3 ? "var(--terra-light)" : "var(--surface)",
              border: i < 3 ? "none" : `1px dashed ${FILET}`,
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }}
            aria-hidden
          >
            {e}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

/** Les cas 4 et 5, cachés comme dans le mail : la raison de venir en direct. */
function SurpriseCard() {
  const reduce = useReducedMotion();
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-[16px] p-6 text-white"
      style={{ background: "#16120e" }}
    >
      {!reduce && (
        <motion.div
          aria-hidden
          className="absolute inset-y-0 w-1/2"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          }}
          animate={{ x: ["-120%", "320%"] }}
          transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
        />
      )}
      <div className="flex items-center justify-between">
        <span className="text-[30px] leading-none" aria-hidden>
          🔒
        </span>
        <span className="num-tabular text-[12px]" style={{ ...mono, color: "#f0a07e" }}>
          04 · 05
        </span>
      </div>
      <h3 className="mt-6 font-serif text-[21px]" style={{ fontWeight: 400, lineHeight: 1.2 }}>
        {t.surpriseTitre}
      </h3>
      <p className="mt-3 text-[14px]" style={{ lineHeight: 1.55, color: "rgba(255,255,255,0.72)" }}>
        {t.surprise}
      </p>
    </div>
  );
}

/** Le déroulé en frise, avec un point qui la parcourt. */
function Deroule() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mt-6">
      <div
        aria-hidden
        className="absolute left-0 right-0 top-[7px] hidden h-px md:block"
        style={{ background: FILET }}
      >
        {!reduce && (
          <motion.span
            className="absolute -top-[3px] h-[7px] w-[7px] rounded-full"
            style={{ background: "var(--terra)", boxShadow: "0 0 12px var(--terra-glow)" }}
            animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.8 }}
          />
        )}
      </div>
      <ol className="grid gap-5 md:grid-cols-4">
        {t.deroule.map((d) => (
          <li key={d.h} className="relative flex gap-4 md:block">
            <span
              className="relative z-10 mt-[1px] block h-[15px] w-[15px] shrink-0 rounded-full border-2"
              style={{ borderColor: "var(--terra)", background: CREME }}
            />
            <div className="md:mt-4">
              <p
                className="num-tabular text-[13px]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--terra)" }}
              >
                {d.h}
              </p>
              <p className="mt-1 text-[15px]" style={{ lineHeight: 1.45 }}>
                {d.t}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
