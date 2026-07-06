import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos - Granit AI" },
      { name: "description", content: "Granit AI construit la plateforme d'agents IA pour le back-office des établissements de santé en France et en Europe." },
      { property: "og:title", content: "À propos - Granit AI" },
      { property: "og:description", content: "Construire l'infrastructure administrative invisible du soin." },
    ],
  }),
  component: AProposPage,
});

const content = {
  fr: { eyebrow: "À propos", title: "Construire l'infrastructure invisible du soin.", belief: "Notre conviction", quote: "« L'IA en santé ne devrait pas remplacer les soignants. Elle devrait leur rendre du temps. »", stats: ["Mise en production", "Connecteurs natifs", "Précision", "Conformité native"], paragraphs: ["Les équipes administratives des établissements de santé passent des heures chaque jour sur des tâches répétitives : vérification de droits, télétransmission FSE, traitement des rejets CPAM, relances impayés, rapprochement bancaire.", "Pendant ce temps, les soignants attendent. Les patients attendent. Les remboursements aussi.", "Granit déploie des agents IA sur mesure qui automatisent ces tâches - branchés nativement sur vos outils existants : portails AMC, RO, SESAM-Vitale, NOEMIE, SIH, LGO. Plus de 50 connecteurs, sans développement spécifique.", "Vous décrivez votre quotidien. Granit déploie les bons agents. En 48h."] },
  en: { eyebrow: "About", title: "Building the invisible infrastructure of care.", belief: "Our belief", quote: "“AI in healthcare should not replace care teams. It should give them time back.”", stats: ["Production launch", "Native connectors", "Precision", "Native compliance"], paragraphs: ["Administrative teams in healthcare organizations spend hours every day on repetitive work: eligibility checks, FSE transmission, public payer rejections, unpaid follow-ups and bank reconciliation.", "Meanwhile, caregivers wait. Patients wait. Reimbursements wait too.", "Granit deploys custom AI agents that automate these tasks - working natively on your existing tools: insurer portals, public payer flows, SESAM-Vitale, NOEMIE, hospital systems and ERPs. More than 50 connectors, without custom development.", "You describe daily operations. Granit deploys the right agents. In 48h."] },
};

function AProposPage() {
  const { lang } = useLanguage();
  const t = content[lang];
  return <SiteLayout><section className="mx-auto max-w-[1280px] px-6 pt-24 pb-20"><Reveal><div className="eyebrow mb-5">{t.eyebrow}</div><h1 className="h1-hero max-w-4xl" style={{ fontSize: "clamp(40px,5vw,76px)" }}>{t.title}</h1></Reveal><div className="mt-16 grid gap-12 md:grid-cols-2"><Reveal><div className="space-y-5 text-[16px] leading-[1.75]" style={{ color: "var(--text-soft)" }}>{t.paragraphs.map((p) => <p key={p}>{p}</p>)}</div></Reveal><Reveal delay={0.1}><div className="rounded-[12px] border p-8" style={{ borderColor: "var(--border)", background: "var(--bg2)" }}><div className="eyebrow mb-5">{t.belief}</div><p className="text-[18px] leading-[1.6]" style={{ fontFamily: "var(--font-serif)" }}>{t.quote}</p><div className="mt-12 grid grid-cols-2 gap-6"><Stat v="48 h" l={t.stats[0]} /><Stat v="50+" l={t.stats[1]} /><Stat v="99 %" l={t.stats[2]} /><Stat v="HDS" l={t.stats[3]} /></div></div></Reveal></div></section></SiteLayout>;
}

function Stat({ v, l }: { v: string; l: string }) {
  return <div><div className="text-[24px]" style={{ fontFamily: "var(--font-mono)" }}>{v}</div><div className="mt-1 text-[12px]" style={{ color: "var(--text-muted)" }}>{l}</div></div>;
}
