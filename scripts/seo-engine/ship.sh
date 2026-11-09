#!/usr/bin/env bash
# Envoie le résultat du moteur. Variables : SLUG, TITLE, REVIEW (true/false), GH_TOKEN.
# Facultatives : VERDICT (pret/humain) et VERDICT_MD (verdict de la boucle de relecture, ajouté au corps de la PR).
# REVIEW=false : commit direct sur main (Vercel publie).
# REVIEW=true  : article relu par les agents. Contrôles du moteur repassés, puis commit direct sur main
#   (sortie en_ligne=true). Si les contrôles échouent : PR, article non publié.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
Q=scripts/seo-engine/articles-queue.json
git config user.name "granit-seo-bot"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

envoyer_main() {
  git pull --rebase --autostash origin main
  git push origin HEAD:main
}

# Image de partage : si elle manque, l'article garde celle de la marque.
npm install --no-save --no-package-lock --ignore-scripts playwright-core@1.64.1 >/dev/null \
  && node scripts/ressources/og-couvertures.mjs "$SLUG" \
  || echo "::warning::image de partage non générée pour $SLUG"

if [ "$REVIEW" != "true" ]; then
  git add content public/ressources/og "$Q"
  git commit -m "Ressources : $TITLE"
  envoyer_main
  exit 0
fi

# Plus de relecture humaine : relu (ou non) par les agents, l'article part en ligne dès que les contrôles
# du moteur passent, quel que soit le verdict. Le verdict est gardé dans la fiche (moteur.relecture) et
# rappelé dans l'annonce Slack. Seul un échec des contrôles (lien mort, mot interdit, source morte…)
# renvoie l'article en PR, avec une alerte « non publié ».
if node scripts/seo-engine/verifier-article.mjs "$SLUG"; then
  node scripts/seo-engine/set-status.mjs "$SLUG" published
  # aucun humain n'a relu : pas de relecteur affiché ; verdict des agents gardé pour l'annonce
  node -e '
    const f = require("fs"), [p, verdict] = process.argv.slice(1), a = JSON.parse(f.readFileSync(p, "utf8"));
    a.reviewer = null;
    if (verdict) a.moteur = { ...a.moteur, relecture: { ...a.moteur?.relecture, verdict } };
    f.writeFileSync(p, JSON.stringify(a, null, 2) + "\n");
  ' "content/ressources/$SLUG.json" "${VERDICT:-}"
  git add content public/ressources/og "$Q"
  git commit -m "Ressources : $TITLE"
  envoyer_main
  echo "en_ligne=true" >> "$GITHUB_OUTPUT"
  exit 0
fi
echo "::warning::$SLUG : contrôles du moteur en échec, l'article part en PR sans être publié"
VERDICT=controles

git add "$Q"
git commit -m "Ressources : « $TITLE » en relecture"
envoyer_main

BRANCHE="seo/$SLUG"
git checkout -b "$BRANCHE"
node scripts/seo-engine/set-status.mjs "$SLUG" published
git add content public/ressources/og "$Q"
git commit -m "Ressources : $TITLE"
git push -u origin "$BRANCHE"
node scripts/seo-engine/corps-pr.mjs "$SLUG" > "$RUNNER_TEMP/corps-pr.md"
if [ -n "${VERDICT_MD:-}" ] && [ -f "$VERDICT_MD" ]; then
  printf '\n\n' >> "$RUNNER_TEMP/corps-pr.md"
  cat "$VERDICT_MD" >> "$RUNNER_TEMP/corps-pr.md"
fi
TITRE="Ressources · $TITLE"
[ "${VERDICT:-}" = "controles" ] && TITRE="Ressources · 🔴 contrôles en échec · $TITLE"
# Si le repo n'autorise pas encore les Actions à ouvrir des PR, on envoie le lien pour l'ouvrir à la main
PR=$(gh pr create --base main --head "$BRANCHE" --title "$TITRE" --body-file "$RUNNER_TEMP/corps-pr.md") \
  || PR="https://github.com/$GITHUB_REPOSITORY/compare/main...$BRANCHE?expand=1"
# Libellé en plus du titre (sans effet si la PR n'a pas pu être ouverte)
if [ "${VERDICT:-}" = "controles" ] && [[ "$PR" == */pull/* ]]; then
  gh label create "controles-en-echec" --color D93F0B --description "Contrôles du moteur en échec : article non publié" 2>/dev/null || true
  gh pr edit "$PR" --add-label "controles-en-echec" || true
fi
echo "pr=$PR" >> "$GITHUB_OUTPUT"
