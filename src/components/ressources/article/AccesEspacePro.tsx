// « Accéder à l'espace pro {plateforme} » : en tête des pages qui ont un fichier de faits avec `acces`.
// Beaucoup de lecteurs arrivent ici en cherchant à se connecter au portail : on leur donne le lien
// officiel tout de suite, sans les faire défiler. Liens vérifiés à la main, datés (champ `acces`).
import { usePostHog } from "posthog-js/react";
import { dateFr } from "@/lib/ressources/contenu";
import type { Plateforme } from "@/lib/ressources/types";

const domaine = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

function Fleche() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function AccesEspacePro({ p, slug }: { p: Plateforme; slug: string }) {
  const posthog = usePostHog();
  const acces = p.acces;
  if (!acces) return null;
  const [principal, ...autres] = acces.liens;
  // Le lien peut être chez l'opérateur du TP (Sévéane → korelio.com) : on nomme le domaine, pas la marque.
  const domaines = [...new Set(acces.liens.map((l) => domaine(l.url)))];
  const clic = (url: string, rang: number) =>
    posthog?.capture("portail_acces_clicked", {
      plateforme: p.nom,
      article: slug,
      domaine: domaine(url),
      rang,
    });

  return (
    <section
      aria-labelledby="acces-espace-pro"
      className="mt-6 max-w-[620px] rounded-[16px] border border-[var(--border)] bg-white px-4 py-4 shadow-[var(--shadow-soft)] sm:px-5"
    >
      <p
        id="acces-espace-pro"
        className="text-[17px] font-semibold leading-snug text-[var(--text)]"
      >
        Accéder à l'espace pro {p.nom}
      </p>
      {principal ? (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              href={principal.url}
              target="_blank"
              rel="noopener"
              onClick={() => clic(principal.url, 1)}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--terra)] px-4 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--terra-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--terra)]"
            >
              {principal.label}
              <Fleche />
            </a>
            {autres.map((l, i) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener"
                onClick={() => clic(l.url, i + 2)}
                className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[var(--text)] underline underline-offset-[3px] hover:text-[var(--terra-hover)]"
              >
                {l.label}
                <Fleche />
              </a>
            ))}
          </div>
          {acces.liens.some((l) => l.detail) && (
            <ul className="mt-3 space-y-1 text-[14px] leading-snug text-[var(--text-soft)]">
              {acces.liens
                .filter((l) => l.detail)
                .map((l) => (
                  <li key={l.url}>
                    {acces.liens.length > 1 && (
                      <span className="font-semibold">{domaine(l.url)} : </span>
                    )}
                    {l.detail}
                  </li>
                ))}
            </ul>
          )}
        </>
      ) : (
        acces.note && (
          <p className="mt-2 text-[14px] leading-snug text-[var(--text-soft)]">{acces.note}</p>
        )
      )}
      <p className="mt-3 text-[13px] leading-snug text-[var(--text-muted)]">
        {principal
          ? domaines.length > 1
            ? `Sites officiels (${domaines.join(", ")}), liens vérifiés le ${dateFr(acces.verifieLe, true)}. Vos identifiants se saisissent sur ces sites, jamais sur getgranit.ai.`
            : `Site officiel (${domaines[0]}), lien vérifié le ${dateFr(acces.verifieLe, true)}. Vos identifiants se saisissent sur ce site, jamais sur getgranit.ai.`
          : `Vérifié le ${dateFr(acces.verifieLe, true)}.`}
      </p>
    </section>
  );
}
