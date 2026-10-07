import type { Demande } from "./DemandePec";
import { ApercuBadge } from "./ui";

/** Les demandes lancées depuis l'espace (maquette), sous la 1re PEC. */
export function MesDemandes({
  demandes,
  onOpen,
}: {
  demandes: Demande[];
  onOpen: (index: number) => void;
}) {
  if (demandes.length === 0) return null;
  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <p className="eyebrow" style={{ color: "var(--text-muted)" }}>
          Vos demandes
        </p>
        <ApercuBadge />
      </div>
      <ul className="space-y-2">
        {demandes.map((d, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => onOpen(i)}
              className="flex w-full items-center justify-between gap-3 rounded-[14px] border bg-white px-4 py-3 text-left"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="text-[15px]">{d.dossier.nom}</span>
              <span
                className="text-[13px]"
                style={{
                  color: d.statut === "accordee" ? "var(--sage)" : "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                {d.statut === "accordee" ? "Accordée" : "En cours…"}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Accès permanent à Paul, en bas à droite. */
export function PaulButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border bg-white py-2 pl-2 pr-4 text-[14px]"
      style={{ borderColor: "var(--border)", boxShadow: "var(--shadow-soft)" }}
    >
      <span
        aria-hidden
        className="flex h-8 w-8 items-center justify-center rounded-full font-serif text-[15px] text-white"
        style={{ background: "var(--gradient-terra)" }}
      >
        P
      </span>
      Une question ? <span style={{ color: "var(--terra)" }}>Paul vous répond</span>
    </button>
  );
}
