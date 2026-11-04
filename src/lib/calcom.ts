/** Prise de RDV démo : Cal.com de Paul, UTM par emplacement (et par article). Campagne « blog » par défaut. */
const CALCOM_DEMO_URL = "https://cal.com/paul-pietra-granit/decouvrir-granit/";

export function calcomDemoUrl(emplacement: string, article?: string, campagne = "blog") {
  const params = new URLSearchParams({
    utm_source: "getgranit.ai",
    utm_medium: "site",
    utm_campaign: campagne,
    utm_content: emplacement,
  });
  if (article) params.set("utm_term", article);
  return `${CALCOM_DEMO_URL}?${params.toString()}`;
}
