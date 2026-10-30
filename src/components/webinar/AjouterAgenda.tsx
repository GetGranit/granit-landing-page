import { usePostHog } from "posthog-js/react";

import { fichierIcs, lienGoogle, lienOutlook } from "@/lib/webinarAgenda";

/**
 * Boutons « ajouter à mon agenda » de l'écran de confirmation. Chaque clic
 * part dans PostHog (webinar_add_to_calendar) pour savoir quel agenda les
 * opticiens utilisent.
 */
export function AjouterAgenda() {
  const posthog = usePostHog();
  const suivre = (agenda: string) => posthog?.capture("webinar_add_to_calendar", { agenda });

  const telechargerIcs = () => {
    suivre("apple");
    const url = URL.createObjectURL(
      new Blob([fichierIcs()], { type: "text/calendar;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "webinar-granit-26-novembre.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const bouton =
    "flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-3 text-[13.5px] transition-colors hover:border-[color:var(--terra)] hover:text-[color:var(--terra)]";
  const style = { borderColor: "var(--border2)", fontWeight: 600, background: "#fffdfd" };

  return (
    <div className="mt-5 flex w-full max-w-sm flex-col gap-2.5">
      <a
        href={lienGoogle()}
        target="_blank"
        rel="noopener noreferrer"
        className={bouton}
        style={style}
        onClick={() => suivre("google")}
      >
        <span aria-hidden>📅</span> Google Agenda
      </a>
      <div className="flex gap-2.5">
        <button type="button" className={bouton} style={style} onClick={telechargerIcs}>
          Apple / iPhone
        </button>
        <a
          href={lienOutlook()}
          target="_blank"
          rel="noopener noreferrer"
          className={bouton}
          style={style}
          onClick={() => suivre("outlook")}
        >
          Outlook
        </a>
      </div>
    </div>
  );
}
