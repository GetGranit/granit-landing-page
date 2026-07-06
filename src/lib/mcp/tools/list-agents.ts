import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const agents = [
  { vertical: "Dentaire", useCase: "Tiers-payant", name: "Gestion complète du tiers-payant dentaire", desc: "Vérification AMO/AMC, télétransmission SESAM-Vitale, suivi NOEMIE, correction des rejets.", stat: "99.1% first-pass" },
  { vertical: "Dentaire", useCase: "Recouvrement", name: "Relance automatique des impayés dentaires", desc: "Relances J+30/60/90 email/SMS et escalade.", stat: "÷3 délai recouvrement" },
  { vertical: "Optique", useCase: "Devis", name: "Devis tiers-payant optique en 5 secondes", desc: "Lecture carte mutuelle, calcul reste à charge 100% Santé.", stat: "< 5s par devis" },
  { vertical: "Optique", useCase: "Tiers-payant", name: "Rapprochement bancaire des virements optiques", desc: "Matching AMO/AMC avec factures, détection des écarts.", stat: "-85% temps" },
  { vertical: "Optique", useCase: "Conformité", name: "Vérification panier 100% Santé", desc: "Contrôle monture, verres LPP et devis normalisé.", stat: "100% conformité" },
  { vertical: "Audio", useCase: "Admissions", name: "Montage automatique des dossiers audioprothèse", desc: "Prescription ORL, audiogramme, devis LPP, envoi CPAM+mutuelle.", stat: "-75% montage" },
  { vertical: "Audio", useCase: "Suivi patient", name: "Suivi complet du parcours audioprothétique", desc: "Rappels essai, réglages M+1/3/6, renouvellement 4 ans.", stat: "+40% rétention" },
  { vertical: "Clinique", useCase: "Admissions", name: "Pré-admission digitalisée avec droits vérifiés", desc: "Collecte pièces, vérification AMO/AMC temps réel.", stat: "-60% accueil" },
  { vertical: "Clinique", useCase: "Recouvrement", name: "Recouvrement des restes à charge hospitaliers", desc: "Relances graduées, priorisation créances par service.", stat: "-45% créances" },
  { vertical: "EHPAD", useCase: "Admissions", name: "Constitution automatique des dossiers APA", desc: "Collecte pièces, CERFA, envoi Conseil Départemental.", stat: "-80% constitution" },
  { vertical: "EHPAD", useCase: "Facturation", name: "Facturation hébergement, dépendance et soins", desc: "Calcul par GIR et APA, facturation différenciée.", stat: "0 erreur facture" },
  { vertical: "Pharmacie", useCase: "Tiers-payant", name: "Traitement automatique des rejets SESAM-Vitale", desc: "Analyse causes, correction, re-soumission autonome.", stat: "-90% rejets" },
  { vertical: "Pharmacie", useCase: "Stock & commandes", name: "Alerte ruptures et commandes dépannage", desc: "Surveillance stock, alerte seuil critique, commande grossiste.", stat: "0 rupture" },
  { vertical: "Labo pharma", useCase: "Conformité", name: "Traitement des signalements d'effets indésirables", desc: "Tri gravité, pré-qualification MedDRA, CIOMS I.", stat: "-65% traitement" },
  { vertical: "Labo pharma", useCase: "Market access", name: "Analyse comparative HAS/CEPS", desc: "Avis transparence, comparaison ASMR, dossier médico-éco.", stat: "+25% efficacité" },
  { vertical: "Labo bio", useCase: "Facturation", name: "Cotation NABM automatique", desc: "Codes NABM, cumuls, plafonds, dérogations.", stat: "0 erreur cotation" },
  { vertical: "Labo bio", useCase: "Conformité", name: "Non-conformités pré-analytiques", desc: "Détection tube/volume/délai, notification, traçabilité COFRAC.", stat: "-50% rappels" },
  { vertical: "Orthodontie", useCase: "Devis", name: "Devis orthodontique multi-semestres", desc: "CCAM avec reste à charge par semestre.", stat: "-60% temps devis" },
];

export default defineTool({
  name: "list_agents",
  title: "List Granit agents",
  description: "List the Granit healthcare AI agents. Optionally filter by vertical (e.g. Dentaire, Optique, Pharmacie) or use case (e.g. Tiers-payant, Recouvrement, Devis).",
  inputSchema: {
    vertical: z.string().optional().describe("Filter by healthcare vertical."),
    useCase: z.string().optional().describe("Filter by use case / workflow."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ vertical, useCase }) => {
    const q = (s?: string) => (s ?? "").toLowerCase();
    const results = agents.filter(
      (a) =>
        (!vertical || a.vertical.toLowerCase().includes(q(vertical))) &&
        (!useCase || a.useCase.toLowerCase().includes(q(useCase))),
    );
    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      structuredContent: { count: results.length, agents: results },
    };
  },
});
