import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Check, Clock3, Lock } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { Faq, WebinarForm } from "@/components/webinar/WebinarShared";
import { useCompteARebours } from "@/hooks/useWebinarCountdown";
import { t } from "@/lib/webinarIa";
import logoMonogram from "@/assets/logo.svg";
import photoPaul from "@/assets/paul-pietra.jpg";

/**
 * Variante B de l'inscription au webinar du 26 novembre : une seule « fiche
 * événement » sur fond dégradé, avec à gauche le programme et l'animateur, à
 * droite une carte blanche qui chevauche et porte le compte à rebours et le
 * formulaire. Même texte et même formulaire que la variante A
 * (/webinar/ia-magasin) ; PostHog les distingue par `variant`.
 *
 * Sans photo de magasin : rien à faire valider côté droits d'image.
 */
export const Route = createFileRoute("/webinar/ia-magasin-b")({
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
  component: WebinarPageB,
});

const DEGRADE = "linear-gradient(135deg, #e0654f 0%, #ec8a64 45%, #f6b58c 100%)";
const BOUTON = "linear-gradient(90deg, #d9583f 0%, #f0956a 100%)";

const mono = {
  fontFamily: "var(--font-mono)",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
};

function WebinarPageB() {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: DEGRADE, color: "var(--text)" }}
    >
      <Cercles />

      <main className="relative mx-auto max-w-[1180px] px-4 py-10 md:px-8 md:py-16">
        <div className="flex flex-col items-stretch md:flex-row md:items-center">
          <Reveal className="md:w-[64%]">
            <FicheProgramme />
          </Reveal>
          <Reveal
            delay={0.12}
            className="relative z-10 -mt-6 md:-ml-16 md:mt-0 md:w-[410px] md:shrink-0"
          >
            <CarteInscription />
          </Reveal>
        </div>

        <Reveal>
          <section
            className="mx-auto mt-10 max-w-[760px] rounded-[24px] p-6 md:mt-14 md:p-8"
            style={{
              background: "rgba(255,255,255,0.92)",
              boxShadow: "0 20px 60px -30px rgba(80,30,10,0.5)",
            }}
          >
            <h2 className="font-serif text-[22px]" style={{ fontWeight: 400 }}>
              {t.faqTitle}
            </h2>
            <Faq />
          </section>
        </Reveal>
      </main>
    </div>
  );
}

/** Grands cercles au trait, comme sur l'affiche de référence, qui dérivent lentement. */
function Cercles() {
  const reduce = useReducedMotion();
  const cercles = [
    { size: 520, top: "-12%", left: "-8%", d: 26 },
    { size: 380, top: "55%", left: "30%", d: 32 },
    { size: 300, top: "8%", left: "78%", d: 22 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {cercles.map((c, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            width: c.size,
            height: c.size,
            top: c.top,
            left: c.left,
            border: "1px solid rgba(255,255,255,0.35)",
          }}
          animate={reduce ? undefined : { x: [0, 24, 0], y: [0, -18, 0] }}
          transition={{ duration: c.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function FicheProgramme() {
  return (
    <div
      className="relative overflow-hidden rounded-[24px] px-6 pb-14 pt-8 md:py-12 md:pl-14 md:pr-28"
      style={{
        background: "linear-gradient(160deg, #fff6ef 0%, #fde9e1 100%)",
        boxShadow: "0 30px 80px -30px rgba(80,30,10,0.55)",
      }}
    >
      <p className="text-[11px]" style={{ ...mono, color: "var(--terra)" }}>
        🎙️ {t.badge}
      </p>
      <h1
        className="mt-4 font-serif"
        style={{
          fontSize: "clamp(28px, 3.6vw, 42px)",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          fontWeight: 400,
        }}
      >
        {t.titleLead}
        <br />
        <span className="accent-italic">{t.titleAccent}</span>
      </h1>

      <div
        className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[14px]"
        style={{ color: "var(--text-soft)" }}
      >
        <span className="inline-flex items-center gap-2">
          <CalendarDays size={17} strokeWidth={1.75} /> {t.date}
        </span>
        <span className="inline-flex items-center gap-2">
          <Clock3 size={17} strokeWidth={1.75} /> {t.heure} · 45 min · en ligne
        </span>
      </div>

      <p
        className="mt-6 max-w-[560px] text-[15px]"
        style={{ lineHeight: 1.65, color: "var(--text-soft)" }}
      >
        {t.constat}
      </p>

      <h2 className="mt-9 text-[15px]" style={{ fontWeight: 600 }}>
        Votre animateur
      </h2>
      <div className="mt-4 flex items-center gap-5">
        <motion.img
          src={photoPaul}
          alt="Paul Pietra"
          width={104}
          height={104}
          className="h-[104px] w-[104px] shrink-0 rounded-full object-cover"
          style={{ boxShadow: "0 0 0 6px #fff, 0 12px 30px -10px rgba(80,30,10,0.45)" }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.3 }}
        />
        <div>
          <p className="text-[16px]" style={{ fontWeight: 600 }}>
            Paul Pietra
          </p>
          <p className="text-[12px]" style={{ ...mono, color: "var(--terra)" }}>
            {t.hostRole}
          </p>
          <p
            className="mt-2 max-w-[340px] text-[13.5px]"
            style={{ lineHeight: 1.5, color: "var(--text-soft)" }}
          >
            {t.hostLine}
          </p>
        </div>
      </div>

      <h2 className="mt-9 text-[15px]" style={{ fontWeight: 600 }}>
        Vous apprendrez…
      </h2>
      <ul className="mt-4 space-y-3">
        {t.cas.map((c, i) => (
          <motion.li
            key={c.titre}
            className="flex items-start gap-3 text-[14.5px]"
            style={{ lineHeight: 1.5 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }}
          >
            <span
              className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
              style={{ background: "var(--terra)" }}
            >
              <Check size={13} strokeWidth={3} />
            </span>
            <span>
              {c.emoji} <span style={{ fontWeight: 600 }}>{c.titre}</span>{" "}
              <span style={{ color: "var(--text-soft)" }}>: {c.texte}</span>
            </span>
          </motion.li>
        ))}
        <motion.li
          className="flex items-start gap-3 text-[14.5px]"
          style={{ lineHeight: 1.5 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.5 + t.cas.length * 0.12 }}
        >
          <span
            className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
            style={{ border: "1.5px dashed var(--terra)", color: "var(--terra)" }}
          >
            <Lock size={11} strokeWidth={2.5} />
          </span>
          <span style={{ color: "var(--text-soft)" }}>{t.surprise}</span>
        </motion.li>
      </ul>
    </div>
  );
}

function CarteInscription() {
  return (
    <div
      className="rounded-[24px] bg-white px-6 py-8 md:px-9 md:py-10"
      style={{ boxShadow: "0 40px 90px -30px rgba(80,30,10,0.6)" }}
    >
      <div className="flex items-center justify-center gap-2.5">
        <img src={logoMonogram} alt="Granit" className="h-[24px] w-auto" />
        <span className="font-serif text-[19px] tracking-tight" style={{ fontWeight: 700 }}>
          Granit
        </span>
      </div>

      <div className="mt-8 flex items-end justify-between gap-3">
        <div>
          <p className="text-[12px]" style={{ color: "var(--text-soft)" }}>
            Le webinar commence dans
          </p>
          <CompteARebours />
        </div>
        <div className="text-center">
          <p className="text-[12px]" style={{ color: "var(--text-soft)" }}>
            Prix
          </p>
          <div
            className="mt-2 flex h-[52px] w-[52px] flex-col items-center justify-center rounded-[10px]"
            style={{ background: "#f6f1ec" }}
          >
            <span className="text-[17px]" style={{ fontWeight: 700 }}>
              0 €
            </span>
            <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>
              Gratuit
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <WebinarForm
          variant="b"
          bare
          stacked
          inputBackground="#fff"
          buttonBackground={BOUTON}
          heading={
            <p className="mb-5 text-[15px]" style={{ fontWeight: 600 }}>
              On a hâte de vous voir ! 👋
            </p>
          }
        />
      </div>

      <p className="mt-5 text-center text-[12px]" style={{ color: "var(--text-muted)" }}>
        🎬 {t.replay}
      </p>
    </div>
  );
}

const UNITES = [
  { k: "j", label: "jours" },
  { k: "h", label: "heures" },
  { k: "m", label: "min" },
  { k: "s", label: "sec" },
] as const;

/** Compte à rebours en cases, dont les chiffres glissent à chaque changement. */
function CompteARebours() {
  const reste = useCompteARebours();
  const reduce = useReducedMotion();
  return (
    <div className="mt-2 flex items-center gap-1.5">
      {UNITES.map((u, i) => {
        const v = reste ? String(reste[u.k]).padStart(2, "0") : "--";
        return (
          <div key={u.k} className="flex items-center gap-1.5">
            <div
              className="flex h-[52px] w-[46px] flex-col items-center justify-center overflow-hidden rounded-[10px]"
              style={{ background: "#f6f1ec" }}
            >
              {/* Le chiffre est remonté à chaque changement et glisse en place :
                  pas d'animation de sortie, la case n'est donc jamais vide. */}
              <motion.span
                key={v}
                className="num-tabular block h-[20px] text-center text-[17px]"
                style={{ fontWeight: 700, lineHeight: "20px" }}
                initial={reduce ? false : { y: -8, opacity: 0.2 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                {v}
              </motion.span>
              <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                {u.label}
              </span>
            </div>
            {i < UNITES.length - 1 && (
              <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                :
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
