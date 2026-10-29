/** Prise de RDV démo depuis les ressources : Cal.com de Paul, UTM par emplacement (et par article). */
const CALCOM_DEMO_URL = "https://cal.com/paul-pietra-granit/decouvrir-granit/";

export function calcomDemoUrl(emplacement: string, article?: string) {
  const params = new URLSearchParams({
    utm_source: "getgranit.ai",
    utm_medium: "site",
    utm_campaign: "blog",
    utm_content: emplacement,
  });
  if (article) params.set("utm_term", article);
  return `${CALCOM_DEMO_URL}?${params.toString()}`;
}
