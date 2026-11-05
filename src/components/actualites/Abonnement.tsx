import { useId, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { getAttribution } from "@/lib/attribution";
import { useLanguage } from "@/lib/i18n";
import { sAbonner } from "@/lib/actualites/abonnement";
import { NEWSLETTER_OUVERTE, NOM_NEWSLETTER, RYTHME } from "@/lib/actualites/marque";
import { LIBELLES } from "@/lib/actualites/textes";

/** Rien ne s'affiche tant que la newsletter est fermée (marque.ts). */
export function Abonnement() {
  return NEWSLETTER_OUVERTE ? <Formulaire /> : null;
}

function Formulaire() {
  const { lang } = useLanguage();
  const t = LIBELLES[lang];
  const id = useId();
  const [etat, setEtat] = useState<"repos" | "envoi" | "ok" | "erreur">("repos");

  async function envoyer(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const champs = new FormData(ev.currentTarget);
    setEtat("envoi");
    try {
      await sAbonner({
        data: {
          email: String(champs.get("email") ?? ""),
          consentement: champs.get("consentement") === "oui",
          utm: getAttribution(),
        },
      });
      setEtat("ok");
    } catch {
      setEtat("erreur");
    }
  }

  return (
    <aside className="act-encre act-sombre act-abonnement">
      <h2>
        {t.recevoir} {NOM_NEWSLETTER}
      </h2>
      <p>
        {RYTHME && `${RYTHME[lang]}. `}
        {t.accroche}
      </p>
      <form onSubmit={envoyer}>
        <div className="act-abonnement-ligne">
          <label className="sr-only" htmlFor={id}>
            {t.courriel}
          </label>
          <input
            id={id}
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t.courriel}
            required
          />
          <button className="btn-clair" type="submit" disabled={etat === "envoi"}>
            {t.abonner}
          </button>
        </div>
        <label className="act-consentement">
          <input name="consentement" type="checkbox" value="oui" required />
          <span>
            {t.consentement} <Link to="/privacy">{t.confidentialite}</Link>
          </span>
        </label>
      </form>
      <p role="status">
        {etat === "ok" && t.abonnementOk}
        {etat === "erreur" && t.abonnementErreur}
      </p>
    </aside>
  );
}
