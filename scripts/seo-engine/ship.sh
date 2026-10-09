#!/usr/bin/env bash
# Envoie le résultat du moteur. Variables : SLUG, TITLE, REVIEW (true/false), GH_TOKEN.
# Facultatives : VERDICT (pret/humain) et VERDICT_MD (verdict de la boucle de relecture, ajouté au corps de la PR).
# REVIEW=false : commit direct sur main (Vercel publie).
# REVIEW=true  : la file passe l'article en « review » sur main, l'article part dans une PR à relire.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
Q=scripts/seo-engine/articles-queue.json
git config user.name "granit-seo-bot"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

envoyer_main() {
  git pull --rebase --autostash origin main
  git push origin HEAD:main
}

if [ "$REVIEW" != "true" ]; then
  git add content "$Q"
  git commit -m "Ressources : $TITLE"
  envoyer_main
  exit 0
fi

git add "$Q"
git commit -m "Ressources : « $TITLE » en relecture"
envoyer_main

BRANCHE="seo/$SLUG"
git checkout -b "$BRANCHE"
node scripts/seo-engine/set-status.mjs "$SLUG" published
git add content "$Q"
git commit -m "Ressources : $TITLE"
git push -u origin "$BRANCHE"
node scripts/seo-engine/corps-pr.mjs "$SLUG" > "$RUNNER_TEMP/corps-pr.md"
if [ -n "${VERDICT_MD:-}" ] && [ -f "$VERDICT_MD" ]; then
  printf '\n\n' >> "$RUNNER_TEMP/corps-pr.md"
  cat "$VERDICT_MD" >> "$RUNNER_TEMP/corps-pr.md"
fi
TITRE="Ressources · $TITLE"
[ "${VERDICT:-}" = "humain" ] && TITRE="Ressources · 🟡 décision humaine · $TITLE"
# Si le repo n'autorise pas encore les Actions à ouvrir des PR, on envoie le lien pour l'ouvrir à la main
PR=$(gh pr create --base main --head "$BRANCHE" --title "$TITRE" --body-file "$RUNNER_TEMP/corps-pr.md") \
  || PR="https://github.com/$GITHUB_REPOSITORY/compare/main...$BRANCHE?expand=1"
# Libellé en plus du titre (sans effet si la PR n'a pas pu être ouverte)
if [ "${VERDICT:-}" = "humain" ] && [[ "$PR" == */pull/* ]]; then
  gh label create "decision-humaine" --color FBCA04 --description "Boucle de relecture : un humain doit trancher" 2>/dev/null || true
  gh pr edit "$PR" --add-label "decision-humaine" || true
fi
echo "pr=$PR" >> "$GITHUB_OUTPUT"
