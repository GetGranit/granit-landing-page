import rejetsCpam from "@/assets/articles/rejets-cpam.jpg";
import portailsMutuelles from "@/assets/articles/portails-mutuelles.jpg";
import ehpad from "@/assets/articles/ehpad.jpg";
import laboratoire from "@/assets/articles/laboratoire.jpg";
import pharmacie from "@/assets/articles/pharmacie.jpg";
import securiteLogs from "@/assets/articles/securite-logs.jpg";
import iaSante from "@/assets/articles/ia-sante.jpg";
import kpiPilotage from "@/assets/articles/kpi-pilotage.jpg";
import recouvrement from "@/assets/articles/recouvrement.jpg";
import integrations from "@/assets/articles/integrations.jpg";
import optique from "@/assets/articles/optique.jpg";
import hopitalPrive from "@/assets/articles/hopital-prive.jpg";
import sesamVitale from "@/assets/articles/sesam-vitale.jpg";
import architectureIa from "@/assets/articles/architecture-ia.jpg";
import groupesMultisites from "@/assets/articles/groupes-multisites.jpg";

const map: Record<string, string> = {
  // FR
  "reduire-rejets-cpam": rejetsCpam,
  "portails-mutuelles-goulot": portailsMutuelles,
  "facturation-ehpad-controle-humain": ehpad,
  "rapprochement-noemie": laboratoire,
  "trois-boucles-pharmacie": pharmacie,
  "logs-agent-sante": securiteLogs,
  "ia-generative-sante-cadre": iaSante,
  "kpi-back-office-sante": kpiPilotage,
  "recouvrement-patient-empathie": recouvrement,
  "integration-doctolib-lgo": integrations,
  "optique-tiers-payant-amc": optique,
  "hopital-prive-ordonnancement": hopitalPrive,
  "sesam-vitale-evolutions-2025": sesamVitale,
  "ia-vs-rpa-sante": architectureIa,
  "groupes-multi-sites-pilotage": groupesMultisites,
  // EN (parallel slugs)
  "reduce-public-payer-rejections": rejetsCpam,
  "insurer-portals-bottleneck": portailsMutuelles,
  "care-home-billing-automation": ehpad,
  "noemie-bank-reconciliation": laboratoire,
  "pharmacy-three-loops": pharmacie,
  "healthcare-agent-logging": securiteLogs,
  "generative-ai-healthcare-framework": iaSante,
  "back-office-kpis-healthcare": kpiPilotage,
  "patient-collection-empathy": recouvrement,
  "integrate-doctolib-48h": integrations,
  "optical-amc-control": optique,
  "private-hospital-orchestration": hopitalPrive,
  "sesam-vitale-2025": sesamVitale,
  "agentic-ai-vs-rpa": architectureIa,
  "multi-site-groups-console": groupesMultisites,
};

export function getArticleCover(slug: string): string {
  return map[slug] ?? iaSante;
}
