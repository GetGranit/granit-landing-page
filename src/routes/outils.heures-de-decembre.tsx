import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import {
  BlocSombre,
  Carte,
  Champ,
  EnTeteOutil,
  FormulaireOutil,
  GrandChiffre,
  champClass,
  champStyle,
  useSuiviOutil,
} from "@/components/outils/OutilShared";
import { SiteLayout } from "@/components/SiteLayout";
import {
  HEURES_PAR_DIMANCHE,
  compterHeures,
  dimanchesEnMots,
  semainesAvantNoel,
} from "@/lib/outils/calculs";

/**
 * Outil gratuit « heures de décembre » : en trois chiffres, combien d'heures
 * l'équipe va passer sur le tiers payant d'ici Noël, traduites en dimanches de
 * travail. Lead magnet envoyé après une invitation LinkedIn acceptée
 * (personnes qui ont réagi à un post sur le repos des équipes en fin d'année),
 * lien avec utm_campaign=post-11-novembre.
 *
 * L'opticien saisit ses propres minutes par dossier : on n'affirme aucun
 * temps moyen (TON.md, « seulement avec un chiffre vrai »). Les valeurs
 * d'arrivée sont un exemple, et la page le dit.
 *
 * Page de campagne : hors navigation, hors sitemap, en noindex. Elle n'a de
 * sens que jusqu'à Noël ; après, le nombre de semaines retombe à 1.
 */
export const Route = createFileRoute("/outils/heures-de-decembre")({
  head: () => ({
    meta: [
      { title: "Tiers payant : combien d'heures d'ici Noël - Granit" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content:
          "Trois chiffres que vous connaissez, et vous savez combien d'heures votre équipe va passer sur le tiers payant d'ici Noël.",
      },
      {
        property: "og:title",
        content: "Combien d'heures votre équipe va passer sur le tiers payant d'ici Noël ?",
      },
      {
        property: "og:description",
        content: "Un calcul gratuit pour les opticiens, en heures et en dimanches.",
      },
    ],
  }),
  component: HeuresDeDecembre,
});

const CHAMPS = [
  { cle: "ventes", libelle: "Ventes par semaine", aide: "Tous magasins confondus.", max: 100000 },
  { cle: "part", libelle: "Part en tiers payant (%)", aide: "", max: 100 },
  {
    cle: "minutes",
    libelle: "Minutes par dossier",
    aide: "Prise en charge, facture, suivi du virement : votre estimation.",
    max: 240,
  },
  { cle: "semaines", libelle: "Semaines d’ici Noël", aide: "", max: 52 },
] as const;

type Cle = (typeof CHAMPS)[number]["cle"];

function HeuresDeDecembre() {
  const { suivre, commence, resultat } = useSuiviOutil("heures-de-decembre");
  // Valeurs d'exemple. Le nombre de semaines dépend du jour : il est calculé
  // après l'hydratation pour que le serveur et le navigateur rendent le même HTML.
  const [v, setV] = useState<Record<Cle, string>>({
    ventes: "60",
    part: "70",
    minutes: "12",
    semaines: "6",
  });
  useEffect(() => {
    setV((x) => ({ ...x, semaines: String(semainesAvantNoel(new Date())) }));
  }, []);

  const saisie = useMemo(
    () => ({
      ventesParSemaine: Number(v.ventes),
      partTiersPayant: Number(v.part),
      minutesParDossier: Number(v.minutes),
      semaines: Number(v.semaines),
    }),
    [v],
  );
  const r = useMemo(() => compterHeures(saisie), [saisie]);
  const heures = Math.round(r.heures).toLocaleString("fr-FR");

  return (
    <SiteLayout>
      <EnTeteOutil
        titre="Combien d’heures votre équipe va passer sur le tiers payant"
        accent="d’ici Noël ?"
        chapeau="Trois chiffres que vous connaissez. Le résultat s’affiche tout de suite, en heures et en dimanches de travail."
      />

      <div className="mx-auto flex max-w-[1120px] flex-col gap-7 px-4 py-10 md:px-8 md:py-16">
        <Carte>
          <h2 className="font-serif text-[24px]" style={{ fontWeight: 400, lineHeight: 1.15 }}>
            Vos chiffres
          </h2>
          <p className="mt-2 max-w-[62ch] text-[15px]" style={{ color: "var(--texte-secondaire)" }}>
            Les valeurs affichées sont un exemple : remplacez-les par les vôtres.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CHAMPS.map((c) => (
              <Champ key={c.cle} libelle={c.libelle} aide={c.aide || undefined}>
                <input
                  type="number"
                  min={0}
                  max={c.max}
                  inputMode="decimal"
                  value={v[c.cle]}
                  onChange={(e) => {
                    commence();
                    setV((x) => ({ ...x, [c.cle]: e.target.value }));
                  }}
                  className={champClass}
                  style={champStyle}
                />
              </Champ>
            ))}
          </div>
        </Carte>

        <div ref={resultat}>
          <BlocSombre>
            <p className="eyebrow">D’ici Noël, sur le tiers payant</p>
            <GrandChiffre>{heures} heures</GrandChiffre>
            <p className="mt-4 text-[19px]" style={{ lineHeight: 1.4 }}>
              Soit <span className="accent-italic">{dimanchesEnMots(r.dimanches)}</span> de travail
              d’une personne.
            </p>
            <p className="mt-3 text-[14px]" style={{ color: "var(--sur-encre-secondaire)" }}>
              {Math.round(r.dossiers).toLocaleString("fr-FR")} dossiers en tiers payant sur{" "}
              {saisie.semaines || 0} semaines, à {saisie.minutesParDossier || 0} minutes chacun. Un
              dimanche compte ici pour {HEURES_PAR_DIMANCHE} heures de travail.
            </p>
          </BlocSombre>
        </div>

        <p className="max-w-[62ch] text-[16px]" style={{ lineHeight: 1.55 }}>
          Ce temps ne se voit pas sur le planning : il est pris entre deux clients, ou le soir une
          fois le magasin fermé.
        </p>

        <FormulaireOutil
          outil="heures-de-decembre"
          source="lead-magnet-decembre"
          formLocation="outil_heures_decembre"
          titre="Recevez votre calcul, et la liste de ce qui peut sortir du comptoir en décembre."
          bouton="Recevoir mon calcul"
          merci="Votre calcul arrive dans la minute à {adresse}. Vous voulez voir ce que nos agents peuvent reprendre avant Noël ?"
          suivre={suivre}
          resume={
            `Heures de décembre : ${saisie.ventesParSemaine || 0} ventes par semaine, ` +
            `${saisie.partTiersPayant || 0} % en tiers payant, ${saisie.minutesParDossier || 0} min par dossier, ` +
            `soit ${heures} heures d’ici Noël.`
          }
          proprietes={{
            ventes_par_semaine: saisie.ventesParSemaine || 0,
            part_tiers_payant: saisie.partTiersPayant || 0,
            minutes_par_dossier: saisie.minutesParDossier || 0,
            heures: Math.round(r.heures),
          }}
          mail={() => ({ outil: "heures-de-decembre", saisie })}
        />
      </div>
    </SiteLayout>
  );
}
