import { useLanguage } from "@/lib/i18n";

const copy = {
  fr: {
    statuses: { ok: "validé", pending: "en cours", fixed: "rejet corrigé" },
    amc: "Portail AMC",
    ro: "RO",
    activeCount: "3 agents actifs",
    activeAgents: "Agents actifs",
    agents: ["Tiers-payant", "Rejets CPAM", "Recouvrement", "Rapprochement"],
    connections: "Connexions",
    connectors: ["Portails AMC", "Régime obligatoire", "SESAM-Vitale", "NOEMIE"],
    kpis: ["Précision", "Récupéré / jour", "Rejets (7j)", "Action"],
    saved: "3 h 12",
    taskTitle: "Tiers-payant · Portail AMC",
    taskSub: "Vérification droits - 14 patients · contrôle en cours",
    active: "actif",
    columns: ["Dossier", "Patient", "Connecteur", "Montant", "Statut"],
    amount: (v: string) => `${v} €`,
  },
  en: {
    statuses: { ok: "approved", pending: "in progress", fixed: "rejection fixed" },
    amc: "AMC portal",
    ro: "AMO",
    activeCount: "3 active agents",
    activeAgents: "Active agents",
    agents: ["Third-party payment", "CPAM rejections", "Collections", "Reconciliation"],
    connections: "Connections",
    connectors: ["AMC portals", "Mandatory insurance", "SESAM-Vitale", "NOEMIE"],
    kpis: ["Accuracy", "Saved / day", "Rejections (7d)", "Action"],
    saved: "3h12",
    taskTitle: "Third-party payment · AMC portal",
    taskSub: "Eligibility check - 14 patients · check in progress",
    active: "active",
    columns: ["File", "Patient", "Connector", "Amount", "Status"],
    amount: (v: string) => `€${v.replace(",", ".")}`,
  },
};

/**
 * A real-looking product mockup of the Granit dashboard, built in HTML/CSS.
 * Used in the hero and product reveal sections. Self-contained, design-system colors only.
 */
export function DashboardMockup({ compact = false }: { compact?: boolean }) {
  const t = copy[useLanguage().lang];
  const rows = [
    { id: "#4821", patient: "M. D.", mut: t.amc, amount: "127,40", status: t.statuses.ok, tone: "sage" },
    { id: "#4820", patient: "L. B.", mut: t.ro, amount: "238,90", status: t.statuses.pending, tone: "amber" },
    { id: "#4819", patient: "S. R.", mut: "NOEMIE", amount: "312,00", status: t.statuses.ok, tone: "sage" },
    { id: "#4818", patient: "C. T.", mut: "SESAM-Vitale", amount: "94,50", status: t.statuses.ok, tone: "sage" },
    { id: "#4817", patient: "F. L.", mut: "CPAM", amount: "405,75", status: t.statuses.fixed, tone: "terra" },
    { id: "#4816", patient: "N. P.", mut: t.amc, amount: "156,20", status: t.statuses.ok, tone: "sage" },
  ];

  return (
    <div className="overflow-hidden rounded-[12px] border bg-white" style={{ borderColor: "var(--border)", fontFamily: "var(--font-sans)" }}>
      <div className="flex items-center gap-3 border-b px-4 py-2.5" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--border)" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--border)" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--border)" }} />
        </div>
        <div className="flex items-center gap-1.5 text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
          <span className="h-4 w-4 rounded-[3px]" style={{ background: "var(--terra)" }} />
          getgranit.ai / centre-paris
        </div>
        <div className="ml-auto flex items-center gap-1.5"><span className="status-dot" /><span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--text-soft)" }}>{t.activeCount}</span></div>
      </div>

      <div className="flex" style={{ minHeight: compact ? 360 : 440 }}>
        <aside className="w-[180px] shrink-0 border-r p-3" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
          <div className="eyebrow mb-2" style={{ color: "var(--text-muted)", fontSize: 9 }}>{t.activeAgents}</div>
          {[
            { l: t.agents[0], a: true, n: "14" },
            { l: t.agents[1], a: false, n: "2" },
            { l: t.agents[2], a: false, n: "6" },
            { l: t.agents[3], a: false, n: "-" },
          ].map((it) => <SidebarItem key={it.l} {...it} />)}
          <div className="eyebrow mt-4 mb-2" style={{ color: "var(--text-muted)", fontSize: 9 }}>{t.connections}</div>
          {t.connectors.map((label) => <SidebarItem key={label} l={label} a={false} n="●" />)}
        </aside>

        <div className="flex-1 overflow-hidden">
          <div className="flex border-b" style={{ borderColor: "var(--border)" }}>
            {[
              { l: t.kpis[0], v: "99%" },
              { l: t.kpis[1], v: t.saved },
              { l: t.kpis[2], v: "0" },
              { l: t.kpis[3], v: "< 2 s" },
            ].map((k, i) => (
              <div key={k.l} className="flex-1 px-4 py-3" style={{ borderRight: i < 3 ? "1px solid var(--border)" : "none" }}>
                <div className="text-[9px] uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{k.l}</div>
                <div className="mt-0.5 text-[15px]" style={{ fontFamily: "var(--font-mono)", color: "var(--text)" }}>{k.v}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="h-7 w-7 rounded-md flex items-center justify-center" style={{ background: "var(--terra-light)", color: "var(--terra)" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/></svg></div>
            <div><div className="text-[13px] font-medium">{t.taskTitle}</div><div className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{t.taskSub}</div></div>
            <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: "var(--sage-light)" }}><span className="status-dot" /><span className="text-[10px]" style={{ fontFamily: "var(--font-mono)", color: "var(--sage)" }}>{t.active}</span></div>
          </div>
          <div className="overflow-hidden">
            <div className="grid border-b px-4 py-2 text-[10px] uppercase tracking-[0.08em]" style={{ gridTemplateColumns: "1fr 1fr 1.2fr 0.9fr 0.9fr", borderColor: "var(--border)", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{t.columns.map((c) => <div key={c}>{c}</div>)}</div>
            {rows.map((r) => <div key={r.id} className="grid items-center border-b px-4 py-2.5 text-[12px]" style={{ gridTemplateColumns: "1fr 1fr 1.2fr 0.9fr 0.9fr", borderColor: "var(--border)" }}><div style={{ fontFamily: "var(--font-mono)", color: "var(--text-soft)" }}>{r.id}</div><div>{r.patient}</div><div style={{ color: "var(--text-soft)" }}>{r.mut}</div><div style={{ fontFamily: "var(--font-mono)" }}>{t.amount(r.amount)}</div><div><StatusPill tone={r.tone} label={r.status} /></div></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ l, a, n }: { l: string; a: boolean; n: string }) {
  return <div className="flex items-center gap-2 rounded-md px-2 py-1.5 mb-0.5" style={{ background: a ? "var(--terra-light)" : "transparent" }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: a ? "var(--terra)" : "var(--border2)" }} /><span className="text-[12px]" style={{ color: a ? "var(--text)" : "var(--text-soft)", fontWeight: a ? 500 : 300 }}>{l}</span><span className="ml-auto text-[10px]" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{n}</span></div>;
}

function StatusPill({ tone, label }: { tone: string; label: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    sage: { bg: "var(--sage-light)", fg: "var(--sage)" },
    terra: { bg: "var(--terra-light)", fg: "var(--terra)" },
    amber: { bg: "var(--tag-bg)", fg: "var(--text-soft)" },
  };
  const c = map[tone] ?? map.sage;
  return <span className="inline-block rounded-full px-2 py-0.5 text-[10px]" style={{ background: c.bg, color: c.fg, fontFamily: "var(--font-mono)" }}>{label}</span>;
}
