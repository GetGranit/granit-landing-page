import { useReducedMotion } from "framer-motion";

import { EQUIPEMENT, euros, type PecCase } from "@/lib/pec/essaiState";

export type FormField = { label: string; value: string; start: number };

/** Vitesse de frappe simulée (caractères par seconde). */
const CPS = 8;

/** Les champs du faux formulaire, repris du cas scanné + équipement fictif. */
export function buildFields(c: PecCase, start = 0): FormField[] {
  const values: [string, string][] = [
    ["N° adhérent", c.adherent ?? "0601234567"],
    ["Mutuelle", c.mutuelle ?? "Mutuelle Exemple"],
    ["N° AMC", c.amc ?? "12345678"],
    ...EQUIPEMENT.map((e): [string, string] => [e.label, euros(e.montant)]),
  ];
  // Chaque champ commence quand le précédent a fini de se taper (+ 0,6 s).
  let t = start;
  return values.map(([label, value]) => {
    const f = { label, value, start: t };
    t += value.length / CPS + 0.6;
    return f;
  });
}

export function fieldsEnd(fields: FormField[]): number {
  const last = fields[fields.length - 1];
  return last ? last.start + last.value.length / CPS : 0;
}

/**
 * Faux formulaire du portail. `elapsed` (s) pilote la frappe ; `elapsed`
 * = Infinity affiche tout rempli. Mouvement réduit : champs remplis d'un coup.
 */
export function PortalForm({
  fields,
  elapsed,
  portal,
}: {
  fields: FormField[];
  elapsed: number;
  portal: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className="overflow-hidden rounded-[22px] border bg-white"
      style={{ borderColor: "var(--border)", boxShadow: "var(--shadow-soft)" }}
      aria-label={`Formulaire ${portal} (simulation)`}
    >
      <div
        className="flex items-center gap-2 border-b px-4 py-2.5"
        style={{ borderColor: "var(--border)", background: "var(--bg2)" }}
      >
        <span className="flex gap-1" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full"
              style={{ background: "var(--border2)" }}
            />
          ))}
        </span>
        <span
          className="truncate text-[11px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
        >
          {portal} · Demande de prise en charge
        </span>
      </div>
      <dl className="divide-y px-4" style={{ borderColor: "var(--border)" }}>
        {fields.map((f) => {
          const n = reduce
            ? elapsed >= f.start
              ? f.value.length
              : 0
            : Math.max(0, Math.min(f.value.length, Math.floor((elapsed - f.start) * CPS)));
          const typing = n > 0 && n < f.value.length;
          return (
            <div key={f.label} className="flex items-baseline justify-between gap-3 py-2.5">
              <dt className="shrink-0 text-[12px]" style={{ color: "var(--text-muted)" }}>
                {f.label}
              </dt>
              <dd
                className="min-h-[20px] truncate text-right text-[14px] num-tabular"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {f.value.slice(0, n)}
                {typing && !reduce && (
                  <span
                    aria-hidden
                    className="ml-px inline-block h-[14px] w-[2px] translate-y-[2px] animate-pulse"
                    style={{ background: "var(--terra)" }}
                  />
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
