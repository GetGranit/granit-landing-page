#!/usr/bin/env node
// Texte de la PR de relecture, tiré du fichier de l'article : node corps-pr.mjs <slug>
import { join } from "node:path";
import { CONTENU, lireFile, lireJson } from "./lib/site.mjs";

const slug = process.argv[2];
const f = lireJson(join(CONTENU, `${slug}.json`));
const q = lireFile().find((a) => a.slug === slug);
const lignes = [
  `Article rédigé par le moteur SEO : **${f.title}**`,
  "",
  `- Catégorie : ${f.categoryName} · type ${f.type} · ${f.wordCount} mots · ${f.faqItems.length} questions de FAQ · ${f.sources.length} sources`,
  `- Mot-clé principal : \`${f.primaryKeyword}\``,
  "",
  `Signé par **${f.author.name}**${f.reviewer ? `, relu par **${f.reviewer.name}** : la page affichera « Relu par ${f.reviewer.name} », donc c'est à cette personne de relire avant de fusionner.` : "."}`,
  "",
  "### À vérifier avant de fusionner",
  "- [ ] Chaque fait et chaque chiffre correspond à sa source",
  "- [ ] Aucun point de la liste rouge (BLOG_CMS_granit.md, « Faits »)",
  "- [ ] Le ton : un praticien qui parle à un praticien",
];
if (q?.toValidate) lignes.push(`- [ ] Point non tranché dans la file : ${q.toValidate}`);
if (f.moteur.avertissements.length) {
  lignes.push("", "### Avertissements du moteur", ...f.moteur.avertissements.map((a) => `- ${a}`));
}
lignes.push(
  "",
  "### Sources citées",
  ...f.sources.map((s) => `- [${s.label}](${s.url})`),
  "",
  "Fusionner = publier. Fermer sans fusionner : remettre l'article en `pending` dans la file pour qu'il soit réécrit.",
);
console.log(lignes.join("\n"));
