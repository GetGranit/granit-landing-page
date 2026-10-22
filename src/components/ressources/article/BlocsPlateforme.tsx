// Blocs d'une page plateforme, rendus depuis le fichier de faits (gabarit §6) :
// fiche d'identité, chiffres, organismes, statuts, contacts. Jamais réécrits par Claude.
import { useState, type ReactElement } from "react";
import { dateFr } from "@/lib/ressources/contenu";
import type { Plateforme } from "@/lib/ressources/types";

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/** « Source : … » d'un bloc ; les données du connecteur (sans URL) sont datées du relevé. */
function Source({ p, cle }: { p: Plateforme; cle?: string }) {
  const s = cle ? p.sources[cle] : undefined;
  if (!s) return null;
  return (
    <p className="mt-2 text-[13px] text-[var(--text-muted)]">
      {s.url ? (
        <>
          Source :{" "}
          <a href={s.url} rel="noopener" className="underline underline-offset-2">
            {s.label}
          </a>
        </>
      ) : (
        <>Relevé par les agents Granit sur le portail le {dateFr(p.checkedOn, true)}</>
      )}
    </p>
  );
}

const caseCls = "rounded-[12px] border border-[var(--border)] bg-white px-3.5 py-3";

export function FicheIdentite({ p }: { p: Plateforme }) {
  if (!p.identite?.length) return null;
  return (
    <dl className="mb-8 grid grid-cols-2 gap-2.5 md:grid-cols-4">
      {p.identite.map((i) => (
        <div key={i.label} className={caseCls}>
          <dt className="text-[13px] text-[var(--text-muted)]">{i.label}</dt>
          <dd className="mt-0.5 text-[16px] font-semibold leading-snug text-[var(--text)]">
            {i.valeur}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Chiffres({ p }: { p: Plateforme }) {
  if (!p.chiffres?.length) return null;
  const sources = [...new Set(p.chiffres.map((c) => c.source))];
  return (
    <div className="my-4">
      <dl className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5">
        {p.chiffres.map((c) => (
          <div key={c.label} className={`${caseCls} flex flex-col-reverse justify-end`}>
            <dt className="text-[14px] leading-snug text-[var(--text-muted)]">{c.label}</dt>
            <dd className="whitespace-nowrap font-serif text-[28px] leading-[1.1] text-[var(--text)]">
              {c.valeur}
            </dd>
          </div>
        ))}
      </dl>
      {sources.map((s) => (
        <Source key={s} p={p} cle={s} />
      ))}
    </div>
  );
}

export function Organismes({ p }: { p: Plateforme }) {
  const [q, setQ] = useState("");
  const liste = p.organismes?.liste ?? [];
  if (!liste.length) return null;
  const n = norm(q.trim());
  const visibles = liste.filter((m) => !n || norm(m).includes(n));
  return (
    <div className="my-4">
      <label className="block">
        <span className="sr-only">Chercher une complémentaire</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ex. MGEN, Malakoff, Neoliane…"
          className="w-full rounded-[14px] border border-[var(--border2)] bg-white px-4 py-3 text-[16px] shadow-[var(--shadow-soft)] focus-visible:outline-2 focus-visible:outline-[var(--terra)]"
        />
      </label>
      <p
        className="mt-2 font-mono text-[12px] tracking-[0.04em] text-[var(--text-muted)]"
        aria-live="polite"
      >
        {n
          ? `${visibles.length} résultat${visibles.length > 1 ? "s" : ""} sur ${liste.length}`
          : `${liste.length} complémentaire${liste.length > 1 ? "s" : ""}`}
      </p>
      <ul className="mt-3 flex max-h-[260px] flex-wrap gap-2 overflow-auto p-0.5">
        {liste.map((m) => (
          <li
            key={m}
            hidden={Boolean(n) && !norm(m).includes(n)}
            className="rounded-full px-3 py-1 text-[14.5px] leading-snug text-[var(--text)]"
            style={{ background: "var(--tint)" }}
          >
            {m}
          </li>
        ))}
      </ul>
      <Source p={p} cle={p.organismes?.source} />
    </div>
  );
}

export function Statuts({ p }: { p: Plateforme }) {
  if (!p.statuts?.length) return null;
  return (
    <div>
      <div className="tbl">
        <table>
          <thead>
            <tr>
              <th>Statut affiché</th>
              <th>Ce que ça veut dire</th>
              <th>Que faire</th>
            </tr>
          </thead>
          <tbody>
            {p.statuts.map((s) => (
              <tr key={s.libelle}>
                <td>
                  <strong className="font-semibold text-[var(--text)]">{s.libelle}</strong>
                </td>
                <td>{s.sens}</td>
                <td>{s.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Source p={p} cle={p.statutsSource} />
    </div>
  );
}

export function Contacts({ p }: { p: Plateforme }) {
  if (!p.contacts?.length) return null;
  const sources = [...new Set(p.contacts.map((c) => c.source))];
  return (
    <div className="my-4">
      <dl className="grid gap-2.5 sm:grid-cols-2">
        {p.contacts.map((c) => (
          <div key={c.label} className={caseCls}>
            <dt className="text-[13px] text-[var(--text-muted)]">{c.label}</dt>
            <dd className="mt-0.5 text-[16px] font-semibold leading-snug text-[var(--text)]">
              {c.url ? (
                <a
                  href={c.url}
                  rel="noopener"
                  className="underline underline-offset-2 hover:text-[var(--terra-hover)]"
                >
                  {c.valeur}
                </a>
              ) : (
                c.valeur
              )}
            </dd>
            {c.detail && <dd className="mt-1 text-[13px] text-[var(--text-muted)]">{c.detail}</dd>}
          </div>
        ))}
      </dl>
      {sources.map((s) => (
        <Source key={s} p={p} cle={s} />
      ))}
    </div>
  );
}

export const BLOCS: Record<string, (props: { p: Plateforme }) => ReactElement | null> = {
  chiffres: Chiffres,
  organismes: Organismes,
  statuts: Statuts,
  contacts: Contacts,
};
