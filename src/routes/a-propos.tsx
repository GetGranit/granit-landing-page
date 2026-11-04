import { createFileRoute, redirect } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/a-propos")({
  /* page coupée pour le moment (302) : retirer ce beforeLoad pour la rouvrir */
  beforeLoad: () => {
    throw redirect({ to: "/", statusCode: 302 });
  },
  head: () => ({
    meta: [
      { title: "À propos : agents IA pour l'administratif santé - Granit" },
      { name: "description", content: "Granit construit la plateforme d'agents IA pour le back-office des établissements de santé en France et en Europe." },
      { property: "og:title", content: "À propos : agents IA pour l'administratif santé - Granit" },
      { property: "og:description", content: "Construire l'infrastructure administrative invisible du soin." },
    ],
  }),
  component: AProposPage,
});

const content = {
  fr: { eyebrow: "À propos", title: "Construire l'infrastructure invisible du soin.", belief: "Notre conviction", quote: "« L'IA en santé ne devrait pas remplacer les soignants. Elle devrait leur rendre du temps. »", stats: ["Mise en production", "Connecteurs natifs", "Précision", "Conformité native"], statValues: ["48 h", "50+", "99 %", "HDS"], paragraphs: ["Les équipes administratives des établissements de santé passent des heures chaque jour sur des tâches répétitives : vérification de droits, télétransmission FSE, traitement des rejets CPAM, relances impayés, rapprochement bancaire.", "Pendant ce temps, les soignants attendent. Les patients attendent. Les remboursements aussi.", "Granit déploie des agents IA sur mesure qui automatisent ces tâches - branchés nativement sur vos outils existants : portails AMC, RO, SESAM-Vitale, NOEMIE, SIH, LGO. Plus de 50 connecteurs, sans développement spécifique.", "Vous décrivez votre quotidien. Granit déploie les bons agents. En 48h."] },
  en: { eyebrow: "About", title: "Building the invisible infrastructure of care.", belief: "Our belief", quote: "“AI in healthcare should not replace caregivers. It should give them time back.”", stats: ["Go-live", "Native connectors", "Accuracy", "Built-in compliance"], statValues: ["48h", "50+", "99%", "HDS"], paragraphs: ["Administrative teams in healthcare organizations spend hours every day on repetitive tasks: eligibility checks, e-transmission of claim forms (FSE), handling rejections from the local health insurance office (CPAM), follow-up on unpaid invoices, bank reconciliation.", "Meanwhile, caregivers wait. Patients wait. So do reimbursements.", "Granit deploys custom AI agents that automate these tasks, connected natively to your existing tools: supplementary insurer (AMC) portals, mandatory insurance (AMO), SESAM-Vitale, NOEMIE, hospital information systems, LGO. More than 50 connectors, with no custom development.", "You describe your day-to-day work. Granit deploys the right agents. In 48 hours."] },
};

function AProposPage() {
  const { lang } = useLanguage();
  const t = content[lang];
  return <SiteLayout><section className="mx-auto max-w-[1280px] px-6 pt-24 pb-20"><Reveal><div className="eyebrow mb-5">{t.eyebrow}</div><h1 className="h1-hero max-w-4xl" style={{ fontSize: "clamp(40px,5vw,76px)" }}>{t.title}</h1></Reveal><div className="mt-16 grid gap-12 md:grid-cols-2"><Reveal><div className="space-y-5 text-[16px] leading-[1.75]" style={{ color: "var(--text-soft)" }}>{t.paragraphs.map((p) => <p key={p}>{p}</p>)}</div></Reveal><Reveal delay={0.1}><div className="rounded-[12px] border p-8" style={{ borderColor: "var(--border)", background: "var(--bg2)" }}><div className="eyebrow mb-5">{t.belief}</div><p className="text-[18px] leading-[1.6]" style={{ fontFamily: "var(--font-serif)" }}>{t.quote}</p><div className="mt-12 grid grid-cols-2 gap-6">{t.stats.map((l, i) => <Stat key={l} v={t.statValues[i]} l={l} />)}</div></div></Reveal></div></section></SiteLayout>;
}

function Stat({ v, l }: { v: string; l: string }) {
  return <div><div className="text-[24px]" style={{ fontFamily: "var(--font-mono)" }}>{v}</div><div className="mt-1 text-[12px]" style={{ color: "var(--text-muted)" }}>{l}</div></div>;
}
