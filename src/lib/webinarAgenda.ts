import { DEBUT, FIN, MEET_URL, t } from "@/lib/webinarIa";

/**
 * Liens « ajouter à mon agenda » pour le webinar, sans service tiers : Google
 * et Outlook ouvrent leur formulaire d'événement prérempli, Apple (et tout
 * agenda qui lit le format iCalendar) reçoit un fichier .ics.
 */

const PAGE = "https://www.getgranit.ai/webinar/ia-magasin";
const LIEU = MEET_URL || "En ligne (lien envoyé par mail)";
const DESCRIPTION = [
  "45 minutes, 5 cas d'usage concrets de l'IA pour gagner du temps en magasin.",
  MEET_URL ? `Lien de connexion : ${MEET_URL}` : "Le lien de connexion vous sera envoyé par mail.",
  `Page du webinar : ${PAGE}`,
].join("\n");

/** 20261126T121500Z : le format UTC compact de Google et d'iCalendar. */
const compact = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

export const lienGoogle = () =>
  "https://calendar.google.com/calendar/render?" +
  new URLSearchParams({
    action: "TEMPLATE",
    text: t.agendaTitre,
    dates: `${compact(DEBUT)}/${compact(FIN)}`,
    details: DESCRIPTION,
    location: LIEU,
  }).toString();

export const lienOutlook = () =>
  "https://outlook.live.com/calendar/0/action/compose?" +
  new URLSearchParams({
    subject: t.agendaTitre,
    startdt: DEBUT.toISOString(),
    enddt: FIN.toISOString(),
    body: DESCRIPTION,
    location: LIEU,
  }).toString();

/** Échappement des valeurs texte iCalendar (RFC 5545, 3.3.11). */
const ics = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

export const fichierIcs = () =>
  [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Granit//Webinar//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:webinar-ia-2026-11@getgranit.ai",
    `DTSTAMP:${compact(new Date())}`,
    `DTSTART:${compact(DEBUT)}`,
    `DTEND:${compact(FIN)}`,
    `SUMMARY:${ics(t.agendaTitre)}`,
    `DESCRIPTION:${ics(DESCRIPTION)}`,
    `LOCATION:${ics(LIEU)}`,
    `URL:${PAGE}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    `DESCRIPTION:${ics(t.agendaTitre)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
