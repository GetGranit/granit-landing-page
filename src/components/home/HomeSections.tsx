import { type ReactElement, useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";

import { Reveal } from "@/components/Reveal";
import { useLanguage } from "@/lib/i18n";
import { articles as articlesData } from "@/lib/articles";
import { submitDemo } from "@/lib/submitDemo";
import heroPhoto from "@/assets/hero-photo.jpg";

/* ============================================================
   COPY
   ============================================================ */
const copy = {
  fr: {
    eyebrow: "Plateforme d'agents IA pour la santé",
    h1Line1: "Vos équipes soignent.",
    h1Line2: "Granit gère le reste.",
    h1Line3: "",
    subtitle:
      "Granit se branche sur votre logiciel métier et exécute vos tâches administratives à votre place : tiers-payant, facturation, traitement des rejets, relances et recouvrement. Sans intégration technique. Opérationnel en 48h.",
    howEyebrow: "Comment ça marche",
    howTitle: "Ne changez rien,",
    howTitleAccent: "déléguez simplement.",
    howSteps: [
      {
        n: "01",
        title: "On se branche sur vos outils",
        text: "Granit se connecte à votre logiciel métier et à vos portails de gestion. Aucune intégration technique, rien à installer.",
      },
      {
        n: "02",
        title: "Les agents font le travail",
        text: "Prise en charge, facturation, télétransmission, traitement des rejets, relances : chaque agent exécute une tâche précise, automatiquement.",
      },
      {
        n: "03",
        title: "Vous gardez le contrôle",
        text: "Vous validez et suivez tout depuis un tableau de bord clair. Vos équipes se concentrent sur les patients, plus sur la paperasse.",
      },
    ],
    ctaPrimary: "Demander une démo gratuite",
    ctaSecondary: "Découvrir les agents",
    proofs: [
      { t: "Déployé en 48h", s: "en moyenne" },
      { t: "Sécurisé & conforme", s: "HDS & RGPD" },
      { t: "+50 centres", s: "déjà équipés" },
      { t: "Support réactif", s: "7j/7" },
    ],
    dashGreeting: "Bonjour Marie",
    dashSub: "Voici l'activité de vos agents aujourd'hui.",
    dashKpis: [
      { label: "Rejets", value: "28", unit: "traités", delta: "+33%" },
      { label: "Facturation", value: "1 256", unit: "€ HT", delta: "+18%" },
      { label: "Courriers patients", value: "43", unit: "traités", delta: "+12%" },
    ],
    dashActivityTitle: "Activité récente",
    dashActivity: [
      { tag: "Rejet #12453", agent: "Pris en charge par Agent Rejets", status: "Traité", when: "il y a 2 min", tone: "sage" },
      { tag: "Facture #F-2024-0456", agent: "Pris en charge par Agent Facturation", status: "Validé", when: "il y a 10 min", tone: "sage" },
      { tag: "Courrier patient #C-7890", agent: "Pris en charge par Agent Courriers Patients", status: "Traité", when: "il y a 15 min", tone: "sage" },
    ],
    dashSeeAll: "Voir toute l'activité",
    dashLive: "Démo live",
    /* Agents */
    agentsEyebrow: "Catalogue d'agents",
    agentsTitle: "Des agents IA spécialisés par métier",
    agentsTitle2: "et par tâche",
    agentsText: "Choisissez les agents dont vous avez besoin. Déployés rapidement, ils s'intègrent à vos outils.",
    filters: ["Tous", "Dentaire", "Optique", "Audio", "Clinique", "EHPAD", "Pharmacie", "Labo pharma", "Labo bio", "Orthodontie"],
    agents: [
      { cats: ["Dentaire"], icon: "shield", name: "Gestion complète du tiers-payant dentaire", desc: "Vérification AMO/AMC avant chaque acte, télétransmission SESAM-Vitale, suivi NOEMIE, détection et correction des rejets.", metric: "99.1% first-pass" },
      { cats: ["Dentaire"], icon: "bank", name: "Relance automatique des impayés dentaires", desc: "Détection des factures à J+30, J+60 et J+90, relances email/SMS personnalisées et escalade vers le gestionnaire.", metric: "÷3 délai recouv." },
      { cats: ["Optique"], icon: "user", name: "Demande de prise en charge", desc: "Interrogation des plateformes AMC, calcul du reste à charge et envoi de la demande de prise en charge, automatiquement.", metric: "< 5s par demande" },
      { cats: ["Optique"], icon: "doc", name: "Facturation tiers-payant", desc: "Facturation AMO/AMC, télétransmission SESAM-Vitale et suivi des retours NOEMIE, sans oubli.", metric: "99% first-pass" },
      { cats: ["Optique"], icon: "shield", name: "Traitement des rejets", desc: "Analyse des causes de rejet, correction et re-soumission automatique du flux.", metric: "-90% rejets" },
      { cats: ["Optique"], icon: "bank", name: "Réconciliation bancaire", desc: "Matching des virements AMO/AMC avec les factures, détection des écarts et des impayés.", metric: "-85% temps" },
      { cats: ["Optique"], icon: "folder", name: "Gestion des bons de livraison", desc: "Suivi des commandes verres et montures, rapprochement des bons de livraison et des factures fournisseurs.", metric: "0 écart" },
      { cats: ["Optique"], icon: "mail", name: "Prospection & renouvellement", desc: "Relance des devis en attente et rappels de renouvellement pour faire revenir vos clients.", metric: "+30% renouvellement" },
      { cats: ["Audio"], icon: "user", name: "Demande de prise en charge", desc: "Montage du dossier audioprothèse (prescription ORL, audiogramme, devis LPP) et envoi AMO/AMC.", metric: "-75% montage" },
      { cats: ["Audio"], icon: "doc", name: "Facturation tiers-payant", desc: "Facturation AMO/AMC, télétransmission et suivi des retours NOEMIE pour les appareils auditifs.", metric: "99% first-pass" },
      { cats: ["Audio"], icon: "shield", name: "Traitement des rejets", desc: "Analyse et correction automatique des rejets de télétransmission.", metric: "-90% rejets" },
      { cats: ["Audio"], icon: "bank", name: "Réconciliation bancaire", desc: "Rapprochement des virements AMO/AMC avec les factures et détection des écarts.", metric: "-85% temps" },
      { cats: ["Audio"], icon: "folder", name: "Gestion des bons de livraison", desc: "Suivi des commandes d'appareils, rapprochement des bons de livraison et des factures fournisseurs.", metric: "0 écart" },
      { cats: ["Audio"], icon: "mail", name: "Prospection & renouvellement", desc: "Relance des essais non transformés et rappels de renouvellement à 4 ans.", metric: "+40% rétention" },
      { cats: ["Clinique"], icon: "user", name: "Pré-admission digitalisée avec droits vérifiés", desc: "Collecte des pièces, vérification AMO/AMC en temps réel et pré-remplissage du dossier administratif avant admission.", metric: "-60% accueil" },
      { cats: ["Clinique"], icon: "bank", name: "Recouvrement des restes à charge hospitaliers", desc: "Identification des restes à charge, relances graduées, priorisation des créances et suivi par service.", metric: "-45% créances" },
      { cats: ["EHPAD"], icon: "user", name: "Constitution automatique des dossiers APA", desc: "Collecte des pièces, pré-remplissage CERFA, envoi au Conseil Départemental et relance si délai dépassé.", metric: "-80% constitution" },
      { cats: ["EHPAD"], icon: "doc", name: "Facturation hébergement, dépendance et soins", desc: "Calcul des tarifs selon GIR et décisions APA, facturation différenciée aide sociale et reste à charge famille.", metric: "0 erreur facture" },
      { cats: ["Pharmacie"], icon: "shield", name: "Traitement automatique des rejets SESAM-Vitale", desc: "Analyse des causes de rejet, correction des anomalies et re-soumission sans intervention humaine dans la majorité des cas.", metric: "-90% rejets" },
      { cats: ["Pharmacie"], icon: "folder", name: "Alerte ruptures de stock et commandes dépannage", desc: "Surveillance des niveaux de stock, alerte sous seuil critique et commande dépannage chez le grossiste.", metric: "0 rupture" },
      { cats: ["Labo pharma"], icon: "shield", name: "Traitement des signalements d'effets indésirables", desc: "Collecte multi-sources, tri par gravité, pré-qualification MedDRA et génération des formulaires CIOMS I.", metric: "-65% traitement" },
      { cats: ["Labo pharma"], icon: "calendar", name: "Analyse comparative HAS/CEPS", desc: "Analyse des avis de transparence, comparaison ASMR concurrents et aide à la constitution du dossier médico-économique.", metric: "+25% efficacité" },
      { cats: ["Labo bio"], icon: "doc", name: "Cotation NABM automatique", desc: "Application des codes NABM, gestion des règles de cumul, plafonds quotidiens et dérogations.", metric: "0 erreur cotation" },
      { cats: ["Labo bio"], icon: "shield", name: "Non-conformités pré-analytiques", desc: "Détection tube incorrect, volume insuffisant ou délai dépassé, notification prescripteur et patient, traçabilité COFRAC.", metric: "-50% rappels" },
      { cats: ["Orthodontie"], icon: "doc", name: "Devis orthodontique multi-semestres", desc: "Génération CCAM avec reste à charge par semestre, plafonds de prise en charge et envoi patient + mutuelle.", metric: "-60% temps devis" },
      { cats: ["Tous"], icon: "more", name: "Et bien d'autres…", desc: "De nouveaux agents ajoutés chaque mois selon vos besoins.", metric: "" },
    ],
    seeAgent: "Voir l'agent",
    seeAllAgents: "Voir tous les agents",
    /* KPI/Integrations */
    kpiSectionTitle: "Conçu pour la santé. Intégré à vos outils.",
    kpiCards: [
      { pre: "Plus de", value: "250", label: "structures de santé équipées", sub: "nous font confiance" },
      { value: "97%", pre: "Jusqu'à", label: "de temps gagné", sub: "sur les tâches administratives" },
      { value: "5 jours", pre: "Déployé en", label: "en moyenne", sub: "" },
    ],
    integrationsTitle: "Connecté à vos outils",
    /* Articles */
    resourcesEyebrow: "Ressources",
    resourcesTitle: "Nos derniers articles",
    seeAllResources: "Voir toutes les ressources",
    readArticle: "Lire l'article",
    /* CTA */
    ctaTitle: "Prêt à transformer votre organisation ?",
    ctaText: "Échangeons sur vos enjeux et voyons comment Granit peut vous aider.",
    ctaButton: "Demander une démo gratuite",
    /* Demo form */
    demo: {
      eyebrow: "Démo gratuite",
      title: "Nos experts sont là pour vous.",
      intro: "En 15 minutes, nous vous ferons découvrir comment gagner de nombreuses heures de productivité grâce aux agents Granit.",
      bullets: ["Réponse sous 24h", "Sans engagement", "100% gratuit"],
      contact: { email: "contact@getgranit.ai", site: "getgranit.ai", city: "Paris, France" },
      labels: ["Email", "Site", "Adresse"],
      fields: ["Prénom et nom", "Email professionnel", "Téléphone", "Nom de l'établissement", "Type d'établissement", "Quel est votre principal défi administratif ?"],
      placeholders: ["Marie Dupont", "marie@centre-vision.fr", "06 12 34 56 78", "Centre Vision Paris", "Tiers-payant, rejets CPAM, recouvrement, rapprochement…"],
      choose: "Choisir…",
      cta: "Demander une démo gratuite",
      note: "Gratuit. Sans engagement. Réponse sous 24h.",
      sending: "Envoi…",
      success: "Merci ! Votre demande est bien reçue — nous vous recontactons sous 24h.",
      error: "Une erreur est survenue. Réessayez, ou écrivez-nous à contact@getgranit.ai.",
      options: ["Centre dentaire", "Centre optique", "Audioprothésiste", "Pharmacie", "EHPAD", "Hôpital / Clinique", "Laboratoire", "Orthodontie", "Autre"],
    },
  },
  en: {
    eyebrow: "AI Agents Platform for Healthcare",
    h1Line1: "Your teams care.",
    h1Line2: "Granit handles the rest.",
    h1Line3: "",
    subtitle:
      "Granit plugs into your existing software and runs your administrative tasks for you: third-party payment, billing, rejection handling, follow-ups and collection. No technical integration. Live in 48h.",
    howEyebrow: "How it works",
    howTitle: "Change nothing,",
    howTitleAccent: "just delegate.",
    howSteps: [
      {
        n: "01",
        title: "We plug into your tools",
        text: "Granit connects to your business software and your payer portals. No technical integration, nothing to install.",
      },
      {
        n: "02",
        title: "The agents do the work",
        text: "Prior authorization, billing, e-transmission, rejection handling, follow-ups: each agent runs one precise task, automatically.",
      },
      {
        n: "03",
        title: "You stay in control",
        text: "You validate and track everything from a clear dashboard. Your teams focus on patients, not paperwork.",
      },
    ],
    ctaPrimary: "Book a free demo",
    ctaSecondary: "Explore agents",
    proofs: [
      { t: "Live in 48h", s: "on average" },
      { t: "Secure & compliant", s: "HDS & GDPR" },
      { t: "+50 sites", s: "already live" },
      { t: "Reactive support", s: "7 days a week" },
    ],
    dashGreeting: "Good morning Marie",
    dashSub: "Here is your agents' activity today.",
    dashKpis: [
      { label: "Payer rejections", value: "28", unit: "handled", delta: "+33%" },
      { label: "Invoicing", value: "1,256", unit: "€", delta: "+18%" },
      { label: "Patient letters", value: "43", unit: "handled", delta: "+12%" },
    ],
    dashActivityTitle: "Recent activity",
    dashActivity: [
      { tag: "Rejection #12453", agent: "Handled by Rejections Agent", status: "Done", when: "2 min ago", tone: "sage" },
      { tag: "Invoice #F-2024-0456", agent: "Handled by Invoicing Agent", status: "Validated", when: "10 min ago", tone: "sage" },
      { tag: "Patient letter #C-7890", agent: "Handled by Letters Agent", status: "Done", when: "15 min ago", tone: "sage" },
    ],
    dashSeeAll: "See all activity",
    dashLive: "Live demo",
    agentsEyebrow: "Agents catalog",
    agentsTitle: "Specialized AI agents per role",
    agentsTitle2: "and per task",
    agentsText: "Pick the agents you need. Deployed fast, they plug into your existing tools.",
    filters: ["All", "Dental", "Optical", "Hearing care", "Clinic", "Care homes", "Pharmacy", "Pharma lab", "Bio lab", "Orthodontics"],
    agents: [
      { cats: ["Dental"], icon: "shield", name: "Complete dental third-party billing", desc: "AMO/AMC eligibility checks, SESAM-Vitale transmission, NOEMIE monitoring, rejection detection and correction.", metric: "99.1% first-pass" },
      { cats: ["Dental"], icon: "bank", name: "Automatic dental unpaid follow-ups", desc: "Detects invoices at D+30, D+60 and D+90, sends email/SMS reminders and escalates unresolved cases.", metric: "÷3 collection time" },
      { cats: ["Optical"], icon: "user", name: "Prior authorization requests", desc: "Queries payer platforms, calculates the remaining balance and files the coverage request automatically.", metric: "< 5s per request" },
      { cats: ["Optical"], icon: "doc", name: "Third-party billing", desc: "Public/private payer billing, SESAM-Vitale transmission and NOEMIE return tracking, with nothing missed.", metric: "99% first-pass" },
      { cats: ["Optical"], icon: "shield", name: "Rejection handling", desc: "Analyzes rejection causes, then corrects and resubmits the claim automatically.", metric: "-90% rejections" },
      { cats: ["Optical"], icon: "bank", name: "Bank reconciliation", desc: "Matches payer transfers with invoices and flags gaps and unpaid claims.", metric: "-85% time" },
      { cats: ["Optical"], icon: "folder", name: "Delivery note management", desc: "Tracks lens and frame orders, reconciling delivery notes with supplier invoices.", metric: "0 mismatch" },
      { cats: ["Optical"], icon: "mail", name: "Prospecting & renewal", desc: "Follows up on pending quotes and sends renewal reminders to bring customers back.", metric: "+30% renewal" },
      { cats: ["Hearing care"], icon: "user", name: "Prior authorization requests", desc: "Assembles the hearing-aid file (ENT prescription, audiogram, LPP quote) and sends it to payers.", metric: "-75% assembly" },
      { cats: ["Hearing care"], icon: "doc", name: "Third-party billing", desc: "Payer billing, transmission and NOEMIE return tracking for hearing aids.", metric: "99% first-pass" },
      { cats: ["Hearing care"], icon: "shield", name: "Rejection handling", desc: "Automatically analyzes and corrects transmission rejections.", metric: "-90% rejections" },
      { cats: ["Hearing care"], icon: "bank", name: "Bank reconciliation", desc: "Matches payer transfers with invoices and flags gaps.", metric: "-85% time" },
      { cats: ["Hearing care"], icon: "folder", name: "Delivery note management", desc: "Tracks device orders, reconciling delivery notes with supplier invoices.", metric: "0 mismatch" },
      { cats: ["Hearing care"], icon: "mail", name: "Prospecting & renewal", desc: "Follows up on unconverted trials and four-year renewal reminders.", metric: "+40% retention" },
      { cats: ["Clinic"], icon: "user", name: "Digital pre-admission with eligibility checks", desc: "Collects documents, verifies coverage in real time and pre-fills the administrative file before admission.", metric: "-60% intake" },
      { cats: ["Clinic"], icon: "bank", name: "Hospital remaining-balance collections", desc: "Identifies patient balances, runs graduated reminders, prioritizes receivables and tracks by department.", metric: "-45% receivables" },
      { cats: ["Care homes"], icon: "user", name: "Automatic APA and social-aid files", desc: "Collects documents, pre-fills forms, sends them to local authorities and follows up on delays.", metric: "-80% file prep" },
      { cats: ["Care homes"], icon: "doc", name: "Accommodation, dependency and care invoicing", desc: "Calculates fees by GIR and APA decision, then separates social aid from family remaining balance.", metric: "0 invoice error" },
      { cats: ["Pharmacy"], icon: "shield", name: "Automatic SESAM-Vitale rejection handling", desc: "Analyzes rejection causes, corrects anomalies and resubmits most cases without human intervention.", metric: "-90% rejections" },
      { cats: ["Pharmacy"], icon: "folder", name: "Stock shortage alerts and emergency orders", desc: "Monitors stock levels, alerts under critical thresholds and prepares emergency wholesaler orders.", metric: "0 shortage" },
      { cats: ["Pharma lab"], icon: "shield", name: "Adverse event signal processing", desc: "Collects multi-source signals, triages by severity, pre-qualifies MedDRA and generates CIOMS I forms.", metric: "-65% processing" },
      { cats: ["Pharma lab"], icon: "calendar", name: "HAS/CEPS comparative analysis", desc: "Analyzes transparency opinions, compares competitor ASMR results and supports medico-economic dossiers.", metric: "+25% efficiency" },
      { cats: ["Bio lab"], icon: "doc", name: "Automatic NABM coding", desc: "Applies NABM codes, manages accumulation rules, daily caps and derogations.", metric: "0 coding error" },
      { cats: ["Bio lab"], icon: "shield", name: "Pre-analytical non-compliance detection", desc: "Flags wrong tubes, insufficient volume or late transport, then notifies prescriber and patient with audit traceability.", metric: "-50% recalls" },
      { cats: ["Orthodontics"], icon: "doc", name: "Multi-semester orthodontic quotes", desc: "Generates CCAM-compliant quotes with remaining balance by semester, reimbursement caps and patient + payer sending.", metric: "-60% quote time" },
      { cats: ["All"], icon: "more", name: "And many more…", desc: "New agents added every month based on your needs.", metric: "" },
    ],
    seeAgent: "See agent",
    seeAllAgents: "See all agents",
    kpiSectionTitle: "Built for healthcare. Plugged into your tools.",
    kpiCards: [
      { pre: "More than", value: "250", label: "healthcare organizations", sub: "trust us" },
      { value: "97%", pre: "Up to", label: "time saved", sub: "on administrative tasks" },
      { value: "5 days", pre: "Deployed in", label: "on average", sub: "" },
    ],
    integrationsTitle: "Connected to your tools",
    resourcesEyebrow: "Resources",
    resourcesTitle: "Our latest articles",
    seeAllResources: "See all resources",
    readArticle: "Read article",
    ctaTitle: "Ready to transform your organization?",
    ctaText: "Let's discuss your operations and see how Granit can help.",
    ctaButton: "Book a free demo",
    demo: {
      eyebrow: "Free demo",
      title: "Our experts are here for you.",
      intro: "In 15 minutes, we'll show you how to save hours of productivity with Granit agents.",
      bullets: ["Reply within 24h", "No commitment", "100% free"],
      contact: { email: "contact@getgranit.ai", site: "getgranit.ai", city: "Paris, France" },
      labels: ["Email", "Website", "Address"],
      fields: ["Full name", "Work email", "Phone", "Organization name", "Organization type", "What is your main administrative challenge?"],
      placeholders: ["Marie Dupont", "marie@clinic.com", "+33 6 12 34 56 78", "Paris Health Center", "Billing, payer rejections, collections, reconciliation…"],
      choose: "Choose…",
      cta: "Book a free demo",
      note: "Free. No commitment. Response within 24h.",
      sending: "Sending…",
      success: "Thank you! Your request is in — we'll get back to you within 24h.",
      error: "Something went wrong. Please try again, or email us at contact@getgranit.ai.",
      options: ["Dental center", "Optical center", "Hearing care", "Pharmacy", "Care home", "Hospital / Clinic", "Laboratory", "Orthodontics", "Other"],
    },
  },
};

const connectorsList: { name: string; domain: string }[] = [
  { name: "Cosium", domain: "cosium.com" },
  { name: "Pennylane", domain: "pennylane.com" },
  { name: "Viamedis", domain: "viamedis.com" },
  { name: "Almerys", domain: "almerys.com" },
  { name: "Santéclair", domain: "santeclair.fr" },
  { name: "Carte Blanche", domain: "carteblanchepartenaires.fr" },
  { name: "SP Santé", domain: "sp-sante.fr" },
  { name: "Itelis", domain: "itelis.fr" },
  { name: "Actil", domain: "actil.com" },
  { name: "Cegedim", domain: "cegedim.fr" },
  { name: "OptoAMC", domain: "optoamc.fr" },
  { name: "Ameli", domain: "ameli.fr" },
];

/* Metrics displayed at the bottom of each agent card. Keyed by agent name. */
const agentMetrics: Record<string, { fr: string; en: string }> = {
  "Rejets CPAM": { fr: "−80% de traitement manuel", en: "−80% manual handling" },
  Facturation: { fr: "+15% de trésorerie", en: "+15% cash flow" },
  "Courriers patients": { fr: "+40% de satisfaction", en: "+40% satisfaction" },
  "Rapprochement bancaire": { fr: "−75% de temps", en: "−75% time spent" },
  Mutuelles: { fr: "−60% d'erreurs", en: "−60% errors" },
  "Planning intelligent": { fr: "+25% de productivité", en: "+25% productivity" },
  "Onboarding collaborateur": { fr: "−50% de temps", en: "−50% time" },
  "Gestion des documents": { fr: "+90% de précision", en: "+90% accuracy" },
  "Payer rejections": { fr: "−80% de traitement manuel", en: "−80% manual handling" },
  Invoicing: { fr: "+15% de trésorerie", en: "+15% cash flow" },
  "Patient letters": { fr: "+40% de satisfaction", en: "+40% satisfaction" },
  "Bank reconciliation": { fr: "−75% de temps", en: "−75% time spent" },
  Insurers: { fr: "−60% d'erreurs", en: "−60% errors" },
  "Smart scheduling": { fr: "+25% de productivité", en: "+25% productivity" },
  "Employee onboarding": { fr: "−50% de temps", en: "−50% time" },
  "Document management": { fr: "+90% de précision", en: "+90% accuracy" },
};

/* Healthcare centers logos band — favicons from real domains with text fallback. */
const trustCenters: { name: string; domain: string; serif?: boolean }[] = [
  { name: "Centre Vision", domain: "centre-vision.fr", serif: true },
  { name: "VIVALTO SANTÉ", domain: "vivalto-sante.com" },
  { name: "Ramsay Santé", domain: "ramsaysante.fr", serif: true },
  { name: "ELSAN", domain: "elsan.care" },
  { name: "Almaviva Santé", domain: "almaviva-sante.com" },
  { name: "ACUITIS", domain: "acuitis.com" },
];

/* Pain points (low-value tasks) — 6 items aligned in a row */
const painPoints = {
  fr: {
    title: "Vos équipes passent encore des heures sur des tâches",
    titleAccent: "purement administratives",
    items: [
      { icon: "shield", label: "Rejets CPAM\nchronophages" },
      { icon: "bank", label: "Relances impayés\nmanuelles" },
      { icon: "doc", label: "Rapprochements\nbancaires longs" },
      { icon: "heart", label: "Vérifications mutuelles\ncomplexes" },
      { icon: "folder", label: "Dossiers incomplets\nà traiter" },
      { icon: "mail", label: "Appels & courriers\nà répétition" },
    ],
  },
  en: {
    title: "Your teams still spend hours on",
    titleAccent: "purely administrative tasks",
    items: [
      { icon: "shield", label: "Time-consuming\nCPAM rejections" },
      { icon: "bank", label: "Manual payment\nfollow-ups" },
      { icon: "doc", label: "Slow bank\nreconciliations" },
      { icon: "heart", label: "Complex insurer\nchecks" },
      { icon: "folder", label: "Incomplete files\nto process" },
      { icon: "mail", label: "Repeated calls\n& letters" },
    ],
  },
};

/* ============================================================
   ICONS
   ============================================================ */
function AgentIcon({ name }: { name: string }) {
  const c = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const map: Record<string, ReactElement> = {
    shield: <svg {...c}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>,
    doc: <svg {...c}><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6M9 14h6M9 17h4"/></svg>,
    mail: <svg {...c}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>,
    bank: <svg {...c}><path d="M3 21h18M5 21V10M9 21V10M15 21V10M19 21V10M3 10l9-6 9 6"/></svg>,
    heart: <svg {...c}><path d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z"/></svg>,
    calendar: <svg {...c}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>,
    user: <svg {...c}><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>,
    folder: <svg {...c}><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
    more: <svg {...c}><circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>,
  };
  return map[name] ?? null;
}

function ProofIcon({ i }: { i: number }) {
  const c = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const list = [
    <svg key="0" {...c}><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3"/></svg>,
    <svg key="1" {...c}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/></svg>,
    <svg key="2" {...c}><circle cx="9" cy="9" r="3"/><circle cx="17" cy="9" r="3"/><path d="M3 21c0-3 3-5 6-5s6 2 6 5M14 21c0-2 2-4 4-4s4 2 4 4"/></svg>,
    <svg key="3" {...c}><path d="M12 3v9l5 3"/><circle cx="12" cy="12" r="9"/></svg>,
  ];
  return list[i % list.length];
}

/* ============================================================
   DASHBOARD PANEL (right of hero)
   ============================================================ */
function HeroDashboard({ t, lang }: { t: typeof copy["fr"]; lang: "fr" | "en" }) {
  return (
    <div
      className="relative overflow-hidden rounded-[16px]"
      style={{
        background: "var(--surface)",
        border: "1px solid color-mix(in oklab, var(--border) 80%, transparent)",
        boxShadow: "0 30px 60px -28px rgba(28,17,8,0.18), 0 8px 24px -12px rgba(28,17,8,0.10)",
      }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 border-b px-5 py-3.5" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[7px]" style={{ background: "var(--terra-light)", color: "var(--terra)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h3l2-7 4 14 2-7h7"/></svg>
          </div>
          <div>
            <div className="text-[14px]" style={{ fontWeight: 600 }}>{t.dashGreeting} <span aria-hidden>👋</span></div>
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{t.dashSub}</div>
          </div>
        </div>
        <Link to="/demo" className="ml-auto inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] transition-colors hover:border-[color:var(--terra)]" style={{ borderColor: "var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          <span className="status-dot" /> {t.dashLive} ↗
        </Link>
      </div>

      <div className="flex">
        {/* Sidebar nav (icons only) — hidden on mobile to save horizontal space */}
        <aside className="hidden w-12 shrink-0 flex-col items-center gap-2 border-r py-4 sm:flex" style={{ borderColor: "var(--border)", background: "color-mix(in oklab, var(--bg2) 50%, transparent)" }}>
          {[
            <svg key="h" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7H10v7H6a2 2 0 01-2-2z"/></svg>,
            <svg key="c" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
            <svg key="d" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h18M3 12h18M3 17h12"/></svg>,
            <svg key="m" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>,
          ].map((icon, i) => (
            <button
              key={i}
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-[8px]"
              style={{
                background: i === 0 ? "var(--terra-light)" : "transparent",
                color: i === 0 ? "var(--terra)" : "var(--text-muted)",
              }}
            >
              {icon}
            </button>
          ))}
        </aside>

        {/* Main area */}
        <div className="flex-1 p-4 sm:p-5">
          {/* KPIs */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {t.dashKpis.map((k) => (
              <div key={k.label} className="rounded-[10px] border p-3" style={{ borderColor: "var(--border)" }}>
                <div className="text-[10.5px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{k.label}</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-[20px]" style={{ fontWeight: 600, letterSpacing: "-0.01em" }}>{k.value}</span>
                  <span className="text-[10.5px]" style={{ color: "var(--text-muted)" }}>{k.unit}</span>
                </div>
                <div className="mt-1 inline-flex items-center gap-1 text-[10px]" style={{ color: "var(--sage)", fontFamily: "var(--font-mono)" }}>
                  <span>{k.delta}</span>
                  <span style={{ color: "var(--text-muted)" }}>{lang === "fr" ? "vs la semaine dernière" : "vs last week"}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Activity */}
          <div className="mt-4 rounded-[10px] border" style={{ borderColor: "var(--border)" }}>
            <div className="border-b px-3 py-2 text-[11px]" style={{ borderColor: "var(--border)", color: "var(--text-soft)", fontWeight: 500 }}>
              {t.dashActivityTitle}
            </div>
            {t.dashActivity.map((row, i) => (
              <div
                key={row.tag}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-3 py-2.5"
                style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
              >
                <div>
                  <div className="text-[12px]" style={{ fontWeight: 500 }}>{row.tag}</div>
                  <div className="text-[10.5px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{row.agent}</div>
                </div>
                <span className="rounded-full px-2 py-0.5 text-[10px]" style={{ background: "var(--sage-light)", color: "var(--sage)", fontFamily: "var(--font-mono)" }}>
                  {row.status}
                </span>
                <span className="text-[10.5px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{row.when}</span>
              </div>
            ))}
            <Link
              to="/"
              hash="demo-live"
              className="block border-t py-2.5 text-center text-[11.5px] transition-colors hover:text-[color:var(--terra)]"
              style={{ borderColor: "var(--border)", color: "var(--text-soft)" }}
            >
              {t.dashSeeAll}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PLATFORM PREVIEW — real product (public/demo.html), scaled
   Single source of truth: the actual platform UI, shown as a
   non-interactive, responsively-scaled live preview.
   ============================================================ */
function PlatformPreview({ t, lang }: { t: typeof copy["fr"]; lang: "fr" | "en" }) {
  return (
    <div
      className="relative overflow-hidden rounded-[16px]"
      style={{
        background: "var(--surface)",
        border: "1px solid color-mix(in oklab, var(--border) 80%, transparent)",
        boxShadow: "0 30px 60px -28px rgba(0,0,0,0.6), 0 8px 24px -12px rgba(0,0,0,0.4)",
      }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: "var(--border)", background: "var(--bg2)" }}>
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#febc2e" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#28c840" }} />
        </span>
        <span className="ml-2 text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
          app.getgranit.ai
        </span>
        <Link
          to="/demo"
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] transition-colors hover:border-[color:var(--terra)]"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
        >
          <span className="status-dot" /> {t.dashLive} ↗
        </Link>
      </div>

      {/* Real platform, responsively scaled (250% size × scale 0.4 = fills box, desktop layout inside) */}
      <div className="relative" style={{ width: "100%", aspectRatio: "16 / 11", overflow: "hidden" }}>
        <iframe
          src="/demo.html"
          title={lang === "fr" ? "Aperçu de la plateforme Granit" : "Granit platform preview"}
          loading="lazy"
          scrolling="no"
          tabIndex={-1}
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "200%",
            height: "200%",
            border: 0,
            transform: "scale(0.5)",
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        />
        {/* click-through overlay opens the full interactive demo */}
        <Link
          to="/demo"
          aria-label={lang === "fr" ? "Ouvrir la démo interactive" : "Open the interactive demo"}
          className="absolute inset-0"
          style={{ zIndex: 2 }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export function HomeSections() {
  const { lang } = useLanguage();
  const t = copy[lang];
  const [filter, setFilter] = useState<string>(t.filters[0]);

  const filteredAgents = filter === t.filters[0] ? t.agents : t.agents.filter((a) => a.cats.includes(filter) || a.cats.includes(t.filters[0]));
  const articles = articlesData[lang].slice(0, 3);

  // Force scroll to #demo whenever the route hash changes (works on cross-page nav and repeated clicks)
  const hash = useRouterState({ select: (s) => s.location.hash });
  useEffect(() => {
    if (hash !== "demo" && hash !== "demo-live") return;
    const id = window.setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
    return () => window.clearTimeout(id);
  }, [hash]);

  return (
    <>
      {/* ============== HERO ============== */}
      <section className="relative overflow-hidden" style={{ background: "var(--bg)" }}>
        {/* Subtle dotted texture top-right */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-32 h-[420px] w-[420px] opacity-25"
          style={{
            backgroundImage: "radial-gradient(circle, var(--terra) 1px, transparent 1.4px)",
            backgroundSize: "16px 16px",
            maskImage: "radial-gradient(circle at 70% 60%, black, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle at 70% 60%, black, transparent 70%)",
          }}
        />

        <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16 lg:pb-32 lg:pt-20">
          {/* LEFT */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[11px]"
              style={{ color: "var(--terra)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}
            >
              {t.eyebrow}
            </motion.div>

            <h1
              className="mt-7 font-serif"
              style={{ fontSize: "clamp(34px,4.4vw,60px)", lineHeight: 1.05, letterSpacing: "-0.025em", color: "var(--text)", fontWeight: 400, whiteSpace: "nowrap" }}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                {t.h1Line1}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="block"
                style={{ color: "var(--terra)", fontStyle: "italic" }}
              >
                {t.h1Line2}
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-8 max-w-[480px] text-[15.5px] leading-[1.65]"
              style={{ color: "var(--text-soft)" }}
            >
              {t.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link to="/" hash="demo" className="btn-primary">
                {t.ctaPrimary} <span className="arrow">↗</span>
              </Link>
              <Link
                to="/agents"
                className="inline-flex items-center gap-2 rounded-full border bg-white px-5 py-[11px] text-[14px] transition-colors hover:border-[color:var(--text)]"
                style={{ borderColor: "var(--border2)", color: "var(--text)", fontWeight: 500 }}
              >
                {t.ctaSecondary}
              </Link>
            </motion.div>

          </div>

          {/* RIGHT — DASHBOARD with soft photo backdrop and -80% badge */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Photo backdrop */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-10 hidden overflow-hidden rounded-[20px] sm:block lg:-right-16 lg:-top-16"
              style={{
                width: "min(620px, 100%)",
                height: "min(520px, 70vh)",
              }}
            >
              <img
                src={heroPhoto}
                alt=""
                width={1024}
                height={1024}
                className="h-full w-full object-cover"
                style={{ filter: "saturate(0.95) contrast(0.96)" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, color-mix(in oklab, var(--bg) 30%, transparent) 0%, color-mix(in oklab, var(--bg) 70%, transparent) 100%)",
                }}
              />
            </div>

            <div className="relative">
              <PlatformPreview t={t} lang={lang} />

              {/* Floating -80% badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -left-4 -bottom-8 hidden w-[180px] rounded-[14px] p-4 sm:block lg:-left-12 lg:-bottom-10"
                style={{
                  background: "var(--surface)",
                  border: "1px solid color-mix(in oklab, var(--border) 80%, transparent)",
                  boxShadow: "0 20px 40px -18px rgba(28,17,8,0.22), 0 6px 18px -10px rgba(28,17,8,0.10)",
                }}
              >
                <div className="text-[10.5px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  {lang === "fr" ? "Jusqu'à" : "Up to"}
                </div>
                <div className="mt-0.5 flex items-end gap-2">
                  <div className="font-serif leading-none" style={{ fontSize: "40px", letterSpacing: "-0.02em", color: "var(--sage)" }}>
                    80%
                  </div>
                  {/* mini sparkline */}
                  <svg width="44" height="28" viewBox="0 0 44 28" fill="none" className="mb-1">
                    <path d="M2 22 L10 18 L18 20 L26 10 L34 12 L42 4" stroke="var(--sage)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M38 4 L42 4 L42 8" stroke="var(--sage)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="mt-2 text-[11.5px] leading-[1.35]" style={{ color: "var(--text-soft)" }}>
                  {lang === "fr" ? "de tâches administratives en moins" : "fewer admin tasks"}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="relative py-20" style={{ background: "var(--bg2)" }}>
        <div className="mx-auto max-w-[1200px] px-6">
          <Reveal>
            <p className="eyebrow">{t.howEyebrow}</p>
            <h2 className="h2-section mt-4 max-w-2xl">
              {t.howTitle}{" "}
              <em style={{ color: "var(--terra)", fontStyle: "italic" }}>{t.howTitleAccent}</em>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-3">
            {t.howSteps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="rule h-full pt-6">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[13px]" style={{ color: "var(--terra)", letterSpacing: "0.1em" }}>
                      {s.n}
                    </span>
                    <h3 className="font-serif text-[22px] leading-none whitespace-nowrap" style={{ letterSpacing: "-0.01em" }}>
                      {s.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-[15px] leading-[1.6]" style={{ color: "var(--text-soft)" }}>
                    {s.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============== PAIN POINTS ============== */}
      <section className="relative py-16" style={{ background: "var(--bg)" }}>
        <div className="mx-auto max-w-[1240px] px-6">
          <Reveal>
            <div className="grid items-start gap-10 md:grid-cols-[minmax(0,360px)_1fr] md:gap-14">
              <h2 className="font-serif" style={{ fontSize: "clamp(24px,2.4vw,32px)", lineHeight: 1.2, letterSpacing: "-0.015em", fontWeight: 400 }}>
                {painPoints[lang].title}{" "}
                <em style={{ color: "var(--terra)", fontStyle: "italic" }}>{painPoints[lang].titleAccent}</em>
              </h2>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
                {painPoints[lang].items.map((it) => (
                  <li key={it.label} className="flex flex-col items-start gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[9px]" style={{ background: "var(--terra-light)", color: "var(--terra)" }}>
                      <AgentIcon name={it.icon} />
                    </span>
                    <span className="whitespace-pre-line text-[12.5px] leading-[1.35]" style={{ color: "var(--text-soft)" }}>
                      {it.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ============== AGENTS ============== */}
      <section className="relative py-28" style={{ background: "var(--bg2)" }}>
        <div className="mx-auto max-w-[1240px] px-6">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-[11px]" style={{ color: "var(--terra)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
                {t.agentsEyebrow}
              </div>
              <h2 className="mt-5 font-serif" style={{ fontSize: "clamp(32px,3.8vw,52px)", lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 400 }}>
                {t.agentsTitle} {t.agentsTitle2}
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-[15px]" style={{ color: "var(--text-soft)" }}>
                {t.agentsText}
              </p>
            </div>
          </Reveal>

          {/* Filter pills */}
          <Reveal delay={0.05}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {t.filters.map((f) => {
                const active = f === filter;
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className="rounded-full border px-3.5 py-1.5 text-[12.5px] transition-all"
                    style={{
                      borderColor: active ? "var(--terra)" : "var(--border)",
                      background: active ? "var(--terra)" : "transparent",
                      color: active ? "#fff" : "var(--text-soft)",
                      fontWeight: active ? 500 : 400,
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Grid */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((a, i) => {
              const metric = a.metric;
              return (
                <Reveal key={a.name} delay={i * 0.03}>
                  <Link
                    to="/agents"
                    className="card-hover group flex h-full flex-col rounded-[14px] p-7 transition-all"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid color-mix(in oklab, var(--border) 80%, transparent)",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]" style={{ background: "var(--terra-light)", color: "var(--terra)" }}>
                        <AgentIcon name={a.icon} />
                      </span>
                      <div>
                        <div className="text-[16px]" style={{ fontWeight: 600, letterSpacing: "-0.005em" }}>{a.name}</div>
                      </div>
                    </div>
                    <p className="mt-4 flex-1 text-[13.5px] leading-[1.6]" style={{ color: "var(--text-soft)" }}>
                      {a.desc}
                    </p>
                    {metric && (
                      <div
                        className="mt-5 text-[12px]"
                        style={{ color: "var(--terra)", fontFamily: "var(--font-mono)", fontWeight: 500 }}
                      >
                        {metric}
                      </div>
                    )}
                    <div className="mt-3 inline-flex items-center gap-1 text-[12.5px] transition-colors" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                      {t.seeAgent} <span className="transition-transform group-hover:translate-x-0.5">↗</span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/agents"
              className="inline-flex items-center gap-2 rounded-full border bg-white px-5 py-[11px] text-[14px] transition-colors hover:border-[color:var(--text)]"
              style={{ borderColor: "var(--border2)", color: "var(--text)", fontWeight: 500 }}
            >
              {t.seeAllAgents}
            </Link>
          </div>
        </div>
      </section>

      {/* ============== INTERACTIVE LIVE DEMO ============== */}
      <section id="demo-live" className="relative py-28" style={{ background: "var(--bg)" }}>
        <div className="mx-auto max-w-[1320px] px-6">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-[11px]" style={{ color: "var(--terra)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
                {lang === "fr" ? "Démo interactive" : "Interactive demo"}
              </div>
              <h2 className="mt-5 font-serif" style={{ fontSize: "clamp(32px,3.8vw,52px)", lineHeight: 1.1, letterSpacing: "-0.02em", fontWeight: 400 }}>
                {lang === "fr" ? "Essayez " : "Try "}
                <em style={{ color: "var(--terra)", fontStyle: "italic" }}>
                  {lang === "fr" ? "la plateforme" : "the platform"}
                </em>
                <br />
                {lang === "fr" ? "directement ci-dessous" : "directly below"}
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-[15px]" style={{ color: "var(--text-soft)" }}>
                {lang === "fr"
                  ? "Cliquez, naviguez, explorez. C'est une vraie maquette interactive - comme si vous étiez déjà client."
                  : "Click, navigate, explore. This is a real interactive prototype - as if you were already a customer."}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              className="demo-mockup-frame relative mt-12 overflow-hidden rounded-[18px]"
              style={{
                background: "var(--surface)",
                border: "1px solid color-mix(in oklab, var(--border) 80%, transparent)",
                boxShadow: "0 40px 80px -32px rgba(28,17,8,0.22), 0 12px 32px -16px rgba(28,17,8,0.12)",
              }}
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: "var(--border)", background: "color-mix(in oklab, var(--bg2) 60%, transparent)" }}>
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#febc2e" }} />
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#28c840" }} />
                </div>
                <div className="mx-auto flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px]" style={{ borderColor: "var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", background: "var(--surface)" }}>
                  <span className="status-dot" />
                  app.granit.ai / demo
                </div>
                <Link
                  to="/demo"
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors hover:border-[color:var(--terra)]"
                  style={{ borderColor: "var(--border)", color: "var(--text-soft)", fontFamily: "var(--font-mono)" }}
                >
                  {lang === "fr" ? "Plein écran" : "Fullscreen"} ↗
                </Link>
              </div>

              {/* Greeting banner */}
              <div className="flex items-center gap-3 border-b px-5 py-3.5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                <div className="flex h-9 w-9 items-center justify-center rounded-[8px]" style={{ background: "var(--terra-light)", color: "var(--terra)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h3l2-7 4 14 2-7h7"/></svg>
                </div>
                <div className="min-w-0">
                  <div className="text-[14px]" style={{ fontWeight: 600 }}>{t.dashGreeting} <span aria-hidden>👋</span></div>
                  <div className="text-[11.5px]" style={{ color: "var(--text-muted)" }}>{t.dashSub}</div>
                </div>
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px]" style={{ borderColor: "var(--border)", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  <span className="status-dot" /> {t.dashLive} ↗
                </span>
              </div>

              <iframe
                src="/demo.html"
                title={lang === "fr" ? "Démo interactive Granit" : "Granit interactive demo"}
                className="block w-full"
                style={{ height: "min(82vh, 820px)", border: "none", background: "var(--surface)" }}
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============== KPI + INTEGRATIONS ROW ============== */}
      <section className="relative py-24" style={{ background: "var(--bg)" }}>
        <div className="mx-auto max-w-[1240px] px-6">
          <Reveal>
            <h2 className="text-center font-serif" style={{ fontSize: "clamp(26px,2.6vw,34px)", letterSpacing: "-0.02em", fontWeight: 400 }}>
              {t.kpiSectionTitle}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.6fr]">
              {t.kpiCards.map((k) => (
                <div key={k.label} className="rounded-[14px] border bg-white p-7" style={{ borderColor: "var(--border)" }}>
                  {k.pre && (
                    <div className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{k.pre}</div>
                  )}
                  <div className="mt-1 font-serif leading-none" style={{ fontSize: "clamp(36px,3.6vw,48px)", letterSpacing: "-0.02em" }}>
                    {k.value}
                  </div>
                  <div className="mt-3 text-[13px]" style={{ fontWeight: 500 }}>{k.label}</div>
                  {k.sub && <div className="mt-1 text-[12px]" style={{ color: "var(--text-muted)" }}>{k.sub}</div>}
                </div>
              ))}
              <div className="rounded-[14px] border bg-white p-7" style={{ borderColor: "var(--border)" }}>
                <div className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: "var(--terra)", fontFamily: "var(--font-mono)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M5 12l4-4M5 12l4 4"/></svg>
                  {t.integrationsTitle}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-4">
                  {connectorsList.map((c) => (
                    <img
                      key={c.name}
                      src={`https://logo.clearbit.com/${c.domain}`}
                      alt={c.name}
                      loading="lazy"
                      className="h-7 w-auto opacity-90 transition-opacity hover:opacity-100"
                      style={{ objectFit: "contain" }}
                      onError={(e) => {
                        const el = e.currentTarget;
                        const step = el.dataset.fallback ?? "0";
                        if (step === "0") {
                          el.dataset.fallback = "1";
                          el.src = `https://icons.duckduckgo.com/ip3/${c.domain}.ico`;
                        } else if (step === "1") {
                          el.dataset.fallback = "2";
                          el.src = `https://www.google.com/s2/favicons?domain=${c.domain}&sz=128`;
                        } else {
                          const span = document.createElement("span");
                          span.textContent = c.name;
                          span.style.fontFamily = "var(--font-serif)";
                          span.style.fontSize = "15px";
                          span.style.color = "var(--text-soft)";
                          el.replaceWith(span);
                        }
                      }}
                    />
                  ))}
                  <span className="text-[15px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>…</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============== ARTICLES ============== */}
      <section className="relative py-24" style={{ background: "var(--bg2)" }}>
        <div className="mx-auto max-w-[1240px] px-6">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-[11px]" style={{ color: "var(--terra)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
                  {t.resourcesEyebrow}
                </div>
                <h2 className="mt-3 font-serif" style={{ fontSize: "clamp(28px,3vw,40px)", letterSpacing: "-0.02em", fontWeight: 400 }}>
                  {t.resourcesTitle}
                </h2>
              </div>
              <Link
                to="/ressources"
                className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-[13px] transition-colors hover:border-[color:var(--text)]"
                style={{ borderColor: "var(--border2)", color: "var(--text)", fontWeight: 500 }}
              >
                {t.seeAllResources}
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {articles.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.05}>
                <Link
                  to="/ressources/$slug"
                  params={{ slug: a.slug }}
                  className="card-hover group flex h-full flex-col rounded-[14px] bg-white p-7"
                  style={{ border: "1px solid color-mix(in oklab, var(--border) 80%, transparent)" }}
                >
                  <div className="text-[10.5px]" style={{ color: "var(--terra)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>
                    {a.category} · {a.time}
                  </div>
                  <h3 className="mt-4 font-serif text-[20px] leading-[1.25]" style={{ letterSpacing: "-0.01em" }}>
                    {a.title}
                  </h3>
                  <p className="mt-4 flex-1 text-[13.5px] leading-[1.6]" style={{ color: "var(--text-soft)" }}>
                    {a.desc}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-1 text-[12.5px]" style={{ color: "var(--terra)", fontFamily: "var(--font-mono)" }}>
                    {t.readArticle} <span className="transition-transform group-hover:translate-x-0.5">↗</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============== TESTIMONIALS ============== */}
      <section className="relative py-24" style={{ background: "var(--bg)" }}>
        <div className="mx-auto max-w-[1240px] px-6">
          <Reveal>
            <div className="max-w-2xl">
              <div className="text-[11px]" style={{ color: "var(--terra)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500 }}>
                {lang === "fr" ? "Témoignages" : "Testimonials"}
              </div>
              <h2 className="mt-3 font-serif" style={{ fontSize: "clamp(28px,3vw,40px)", letterSpacing: "-0.02em", fontWeight: 400 }}>
                {lang === "fr" ? "Ils nous font confiance" : "They trust us"}
              </h2>
              <p className="mt-3 text-[15px]" style={{ color: "var(--text-soft)" }}>
                {lang === "fr"
                  ? "Des gérants de magasins d'optique qui ont récupéré des heures chaque semaine grâce à Granit."
                  : "Optical store managers who reclaimed hours every week thanks to Granit."}
              </p>
            </div>
          </Reveal>

          {(() => {
            const items = lang === "fr"
              ? [
                  {
                    quote: "Avant Granit, je passais mes soirées à traiter les rejets CPAM. Aujourd'hui, c'est automatique. J'ai récupéré près de 10 heures par semaine pour mes patients et mon équipe.",
                    name: "Julien Marchand",
                    role: "Gérant, Optique du Centre",
                    city: "Lyon",
                    metric: "−10 h / semaine",
                  },
                  {
                    quote: "Le tiers-payant et le rapprochement bancaire étaient un cauchemar. En 48h, l'agent était en place. Notre trésorerie est suivie en temps réel et les rejets sont traités le jour même.",
                    name: "Sophie Lefèvre",
                    role: "Gérante, Vision & Co",
                    city: "Bordeaux",
                    metric: "+15% trésorerie",
                  },
                  {
                    quote: "On gère 3 magasins. Granit a divisé par 4 le temps administratif de mes responsables. Ils sont enfin disponibles pour le conseil client, ce qui était notre priorité depuis longtemps.",
                    name: "Karim Benali",
                    role: "Dirigeant, Réseau Optic Plus",
                    city: "Marseille",
                    metric: "−75% d'administratif",
                  },
                  {
                    quote: "L'intégration avec notre LGO s'est faite en deux jours. Les contrôles avant télétransmission ont éliminé 70% de nos rejets dès le premier mois. Notre comptable nous remercie chaque semaine.",
                    name: "Camille Rousseau",
                    role: "Directrice, Centre Dentaire Lumière",
                    city: "Nantes",
                    metric: "−70% de rejets",
                  },
                  {
                    quote: "Le rapprochement NOEMIE/banque me prenait deux jours par mois. Maintenant je traite uniquement les exceptions, en quelques heures. Et je vois les écarts en temps réel.",
                    name: "Antoine Mercier",
                    role: "DAF, Laboratoires BioSud",
                    city: "Toulouse",
                    metric: "−90% de temps",
                  },
                ]
              : [
                  {
                    quote: "Before Granit, I spent my evenings on payer rejections. Now it's automated. I got back nearly 10 hours a week for my patients and my team.",
                    name: "Julien Marchand",
                    role: "Owner, Optique du Centre",
                    city: "Lyon",
                    metric: "−10 hrs / week",
                  },
                  {
                    quote: "Third-party payment and bank reconciliation were a nightmare. In 48h the agent was live. Cash is tracked in real time and rejections handled same-day.",
                    name: "Sophie Lefèvre",
                    role: "Owner, Vision & Co",
                    city: "Bordeaux",
                    metric: "+15% cash flow",
                  },
                  {
                    quote: "We run 3 stores. Granit cut my managers' admin time by 4x. They're finally available for customer advice, which was our priority all along.",
                    name: "Karim Benali",
                    role: "CEO, Réseau Optic Plus",
                    city: "Marseille",
                    metric: "−75% admin",
                  },
                  {
                    quote: "Integration with our practice software took two days. Pre-submission checks eliminated 70% of rejections in the first month. Our accountant thanks us every week.",
                    name: "Camille Rousseau",
                    role: "Director, Centre Dentaire Lumière",
                    city: "Nantes",
                    metric: "−70% rejections",
                  },
                  {
                    quote: "Bank reconciliation used to take me two days a month. Now I only handle exceptions, in a few hours. And I see discrepancies in real time.",
                    name: "Antoine Mercier",
                    role: "CFO, Laboratoires BioSud",
                    city: "Toulouse",
                    metric: "−90% time spent",
                  },
                ];
            const loop = [...items, ...items];
            return (
              <div
                className="testimonials-marquee mt-10"
                style={{
                  WebkitMaskImage: "linear-gradient(to right, transparent 0, black 6%, black 94%, transparent 100%)",
                  maskImage: "linear-gradient(to right, transparent 0, black 6%, black 94%, transparent 100%)",
                }}
              >
                <div className="testimonials-track">
                  {loop.map((tm, i) => (
                    <figure
                      key={`${tm.name}-${i}`}
                      className="testimonial-card flex flex-col rounded-[14px] bg-white p-7"
                      style={{ border: "1px solid color-mix(in oklab, var(--border) 80%, transparent)" }}
                    >
                      <div aria-hidden className="font-serif text-[42px] leading-none" style={{ color: "var(--terra)" }}>“</div>
                      <blockquote className="mt-2 text-[15px] leading-[1.6]" style={{ color: "var(--text)" }}>
                        {tm.quote}
                      </blockquote>
                      <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[11.5px]"
                           style={{ background: "color-mix(in oklab, var(--sage) 14%, transparent)", color: "var(--sage)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                        {tm.metric}
                      </div>
                      <figcaption className="mt-6 flex items-center gap-3 border-t pt-5" style={{ borderColor: "var(--border2)" }}>
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-serif text-[15px]"
                          style={{ background: "var(--bg2)", color: "var(--terra)" }}
                        >
                          {tm.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13.5px]" style={{ color: "var(--text)", fontWeight: 600 }}>{tm.name}</div>
                          <div className="text-[12px]" style={{ color: "var(--text-soft)" }}>{tm.role} · {tm.city}</div>
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ============== ORANGE CTA BAND ============== */}
      <section className="relative py-12" style={{ background: "var(--bg)" }}>
        <div className="mx-auto max-w-[1240px] px-6">
          <Reveal>
            <div
              className="flex flex-col items-start justify-between gap-6 rounded-[18px] p-7 md:flex-row md:items-center md:p-8"
              style={{ background: "var(--gradient-terra)", color: "#fff", boxShadow: "var(--shadow-terra)" }}
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px]" style={{ background: "rgba(255,255,255,0.18)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h3l2-7 4 14 2-7h7"/></svg>
                </span>
                <div>
                  <div className="text-[18px]" style={{ fontWeight: 600 }}>{t.ctaTitle}</div>
                  <div className="mt-1 text-[14px]" style={{ color: "rgba(255,255,255,0.85)" }}>{t.ctaText}</div>
                </div>
              </div>
              <Link
                to="/" hash="demo"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 text-[14px] transition-transform hover:-translate-y-0.5"
                style={{ color: "var(--terra)", fontWeight: 600 }}
              >
                {t.ctaButton} <span>↗</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============== DEMO FORM ============== */}
      <section id="demo" className="relative scroll-mt-24 py-24" style={{ background: "var(--bg)" }}>
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <div>
                <div className="eyebrow mb-5">{t.demo.eyebrow}</div>
                <h2 className="font-serif" style={{ fontSize: "clamp(34px,4vw,56px)", lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 400 }}>
                  {t.demo.title}
                </h2>
                <p className="body-lg mt-7 max-w-md">{t.demo.intro}</p>
                <ul className="mt-8 space-y-2.5 text-[14px]" style={{ color: "var(--text-soft)" }}>
                  {t.demo.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: "var(--terra-light)", color: "var(--terra)" }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <DemoForm t={t} />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

function DemoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <div className="w-20 shrink-0 text-[11px] uppercase tracking-[0.12em]" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{label}</div>
      <div>{value}</div>
    </div>
  );
}
function DemoField({ label, type = "text", placeholder, name, required }: { label: string; type?: string; placeholder?: string; name: string; required?: boolean }) {
  return (
    <label className="mb-4 block">
      <div className="mb-1.5 text-[12px]" style={{ color: "var(--text-soft)", fontWeight: 500 }}>{label}</div>
      <input name={name} type={type} placeholder={placeholder} required={required} className="w-full rounded-[8px] border bg-transparent px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-[color:var(--terra)]" style={{ borderColor: "var(--border)" }} />
    </label>
  );
}
function DemoSelect({ label, options, choose, name }: { label: string; options: string[]; choose: string; name: string }) {
  return (
    <label className="mb-4 block">
      <div className="mb-1.5 text-[12px]" style={{ color: "var(--text-soft)", fontWeight: 500 }}>{label}</div>
      <select name={name} className="w-full rounded-[8px] border bg-white px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-[color:var(--terra)]" style={{ borderColor: "var(--border)" }} defaultValue="">
        <option value="" disabled>{choose}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
function DemoArea({ label, placeholder, name }: { label: string; placeholder?: string; name: string }) {
  return (
    <label className="mb-5 block">
      <div className="mb-1.5 text-[12px]" style={{ color: "var(--text-soft)", fontWeight: 500 }}>{label}</div>
      <textarea name={name} rows={4} placeholder={placeholder} className="w-full rounded-[8px] border bg-transparent px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-[color:var(--terra)]" style={{ borderColor: "var(--border)" }} />
    </label>
  );
}

function DemoForm({ t }: { t: typeof copy["fr"] }) {
  const submit = useServerFn(submitDemo);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  if (status === "success") {
    return (
      <div
        className="flex h-full flex-col items-center justify-center rounded-[14px] border bg-white p-10 text-center"
        style={{ borderColor: "var(--border)", boxShadow: "var(--shadow-soft)" }}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "var(--terra-light)", color: "var(--terra)" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
        </span>
        <p className="mt-5 max-w-xs font-serif text-[22px]" style={{ letterSpacing: "-0.01em", lineHeight: 1.25 }}>{t.demo.success}</p>
      </div>
    );
  }

  return (
    <form
      className="rounded-[14px] border bg-white p-7 md:p-8"
      style={{ borderColor: "var(--border)", boxShadow: "var(--shadow-soft)" }}
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setStatus("submitting");
        try {
          await submit({
            data: {
              name: String(fd.get("name") || ""),
              email: String(fd.get("email") || ""),
              phone: String(fd.get("phone") || ""),
              company: String(fd.get("company") || ""),
              orgType: String(fd.get("orgType") || ""),
              challenge: String(fd.get("challenge") || ""),
            },
          });
          setStatus("success");
        } catch {
          setStatus("error");
        }
      }}
    >
      <DemoField name="name" required label={t.demo.fields[0]} placeholder={t.demo.placeholders[0]} />
      <DemoField name="email" type="email" required label={t.demo.fields[1]} placeholder={t.demo.placeholders[1]} />
      <DemoField name="phone" type="tel" label={t.demo.fields[2]} placeholder={t.demo.placeholders[2]} />
      <DemoField name="company" label={t.demo.fields[3]} placeholder={t.demo.placeholders[3]} />
      <DemoSelect name="orgType" label={t.demo.fields[4]} options={t.demo.options} choose={t.demo.choose} />
      <DemoArea name="challenge" label={t.demo.fields[5]} placeholder={t.demo.placeholders[4]} />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary mt-2 w-full justify-center"
        style={status === "submitting" ? { opacity: 0.7, cursor: "wait" } : undefined}
      >
        {status === "submitting" ? t.demo.sending : t.demo.cta} <span className="arrow">↗</span>
      </button>
      {status === "error" && (
        <p className="mt-3 text-center text-[12px]" style={{ color: "#c0392b" }}>{t.demo.error}</p>
      )}
      <p className="mt-4 text-center text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{t.demo.note}</p>
    </form>
  );
}
