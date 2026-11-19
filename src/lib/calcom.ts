/** Prise de RDV démo depuis les ressources : Cal.com de Paul, UTM par emplacement (et par article). */
const CALCOM_DEMO_URL = "https://cal.com/paul-pietra-granit/decouvrir-granit/";

/**
 * @param emplacement utm_content (ex. « fin-article », « outil-entree »)
 * @param article utm_term : le slug de l'article ou de l'entrée d'outil, s'il y en a un
 * @param campagne utm_campaign : « blog » par défaut (ressources) ; les outils passent « outil-<id> »
 * @param medium utm_medium : « site » par défaut ; les outils gratuits (lead magnets) passent « lead-magnet »
 */
export function calcomDemoUrl(emplacement: string, article?: string, campagne = "blog", medium = "site") {
  const params = new URLSearchParams({
    utm_source: "getgranit.ai",
    utm_medium: medium,
    utm_campaign: campagne,
    utm_content: emplacement,
  });
  if (article) params.set("utm_term", article);
  return `${CALCOM_DEMO_URL}?${params.toString()}`;
}
