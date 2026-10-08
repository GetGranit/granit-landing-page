// Texte du message Slack du moteur SEO (testable sans réseau).
export function message({ etat, fiche, titre, url, pr, cout, runUrl }) {
  if (etat === "erreur")
    return `⚠️ Moteur SEO en erreur, rien n'est publié. <${runUrl}|Voir les logs>`;
  const prOuverte = pr && pr.includes("/pull/");
  const tete = pr
    ? `👀 *Article à relire* : ${titre}\n${prOuverte ? `<${pr}|Ouvrir la PR>` : `<${pr}|Créer la PR> (le bot n'a pas le droit de l'ouvrir)`} · fusionner = publier`
    : `📝 *Article publié* : <${url}|${titre}>`;
  if (!fiche) return tete;
  const lignes = [tete, ""];
  lignes.push(`• Adresse : ${url}`);
  lignes.push(`• Mot-clé principal : *${fiche.primaryKeyword}*`);
  if (fiche.keywordCluster?.length)
    lignes.push(`• Mots-clés secondaires : ${fiche.keywordCluster.join(", ")}`);
  lignes.push(
    `• Catégorie : ${fiche.categoryName} · ${fiche.level ?? ""} · type ${fiche.type}${fiche.refonte ? " · refonte" : ""}`,
  );
  lignes.push(
    `• Taille : ${fiche.wordCount.toLocaleString("fr-FR")} mots (${fiche.readTime} min) · ${fiche.faqItems?.length ?? 0} FAQ · ${fiche.sources?.length ?? 0} sources · ${fiche.figures?.length ?? 0} schéma(s)`,
  );
  lignes.push(
    `• Signature : ${fiche.author?.name ?? "?"}${fiche.reviewer ? `, relu par ${fiche.reviewer.name}` : ""}`,
  );
  if (fiche.remplace?.length) lignes.push(`• Remplace (301) : ${fiche.remplace.join(", ")}`);
  if (cout) lignes.push(`• Coût : ${cout} $`);
  const av = fiche.moteur?.avertissements ?? [];
  lignes.push(
    av.length
      ? `• Avertissements :\n${av.map((a) => `   ◦ ${a}`).join("\n")}`
      : "• Avertissements : aucun",
  );
  return lignes.join("\n");
}
