import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { fichesPlateformes } from "@/lib/ressources/contenu";
import { TuilePlateforme } from "./Cartes";

const copy = {
  fr: {
    filtrer: "Filtrer par nom",
    sur: (n: number, total: number) => `${n} sur ${total}`,
    plateformes: (n: number) => `${n} plateforme${n > 1 ? "s" : ""}`,
    aucune: (q: string) => `Aucune fiche pour « ${q} » pour l'instant.`,
  },
  en: {
    filtrer: "Filter by name",
    sur: (n: number, total: number) => `${n} of ${total}`,
    plateformes: (n: number) => `${n} platform${n > 1 ? "s" : ""}`,
    aucune: (q: string) => `No fact sheet for “${q}” yet.`,
  },
};

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/**
 * Annuaire des plateformes : toutes les fiches portail-* en ligne, avec un filtre par nom.
 * La liste complète est dans le HTML serveur ; le filtre n'est qu'un plus en JavaScript.
 * Même composant sur la page catégorie plateformes et sous l'ouverture du pilier portails-tiers-payant.
 */
export function Annuaire() {
  const t = copy[useLanguage().lang];
  const fiches = fichesPlateformes();
  const [q, setQ] = useState("");
  if (!fiches.length) return null;
  const visibles = fiches.filter((f) =>
    norm(f.plateforme?.nom ?? f.title).includes(norm(q.trim())),
  );
  return (
    <div>
      {fiches.length >= 8 && (
        <label className="relative block max-w-[420px]">
          <span className="sr-only">{t.filtrer}</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.filtrer}
            className="w-full rounded-[12px] border border-[var(--border2)] bg-papier px-4 py-3 text-[15px] focus-visible:outline-2 focus-visible:outline-[var(--profond)]"
          />
        </label>
      )}
      <p
        className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-muted)]"
        aria-live="polite"
      >
        {q.trim() ? t.sur(visibles.length, fiches.length) : t.plateformes(fiches.length)}
      </p>
      <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        {fiches.map((f) => (
          <li key={f.slug} hidden={!visibles.includes(f)}>
            <TuilePlateforme fiche={f} />
          </li>
        ))}
      </ul>
      {q.trim() && !visibles.length && (
        <p className="mt-3 text-[15px] text-[var(--text-muted)]">
          {t.aucune(q.trim())}
        </p>
      )}
    </div>
  );
}
