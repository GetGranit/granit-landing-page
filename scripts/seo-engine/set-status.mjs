#!/usr/bin/env node
// Change le statut d'un article dans la file : node set-status.mjs <slug> <pending|review|published>
import { ecrireFile, lireFile } from "./lib/site.mjs";

const [slug, statut] = process.argv.slice(2);
if (!["pending", "review", "published"].includes(statut)) throw new Error(`statut invalide : ${statut}`);
const file = lireFile();
const a = file.find((x) => x.slug === slug);
if (!a) throw new Error(`slug inconnu : ${slug}`);
a.status = statut;
ecrireFile(file);
console.log(`${slug} → ${statut}`);
