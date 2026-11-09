#!/usr/bin/env bash
# Envoie le résultat du moteur. Variables : SLUG, TITLE, REVIEW (true/false), GH_TOKEN.
# Facultatives : VERDICT (pret/humain) et VERDICT_MD (verdict de la boucle de relecture, ajouté au corps de la PR).
# REVIEW=false : commit direct sur main (Vercel publie).
# REVIEW=true  : la file passe l'article en « review » sur main, l'article part dans une PR à relire.
# REVIEW=true + VERDICT=pret (boucle des agents) : contrôles repassés, puis commit direct sur main sans PR
#   (sauf page comparative). Sortie en_ligne=true.
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

# Verdict « pret » de la boucle des agents : en ligne sans PR, sauf page comparative (toujours relue par un humain).
# Les contrôles du moteur repassent d'abord ; au moindre échec, l'article part en PR comme avant.
comparatif() {
  node -e 'const q=require("./'"$Q"'");const a=q.find((x)=>x.slug===process.argv[1]);process.exit(a?.concurrents?.length?0:1)' "$SLUG"
}
if [ "${VERDICT:-}" = "pret" ] && ! comparatif; then
  if node scripts/seo-engine/verifier-article.mjs "$SLUG"; then
    node scripts/seo-engine/set-status.mjs "$SLUG" published
    # aucun humain n'a relu : pas de relecteur affiché sur l'article
    node -e 'const f=require("fs"),p=process.argv[1],a=JSON.parse(f.readFileSync(p,"utf8"));a.reviewer=null;f.writeFileSync(p,JSON.stringify(a,null,2)+"\n")' "content/ressources/$SLUG.json"
    git add content public/ressources/og "$Q"
    git commit -m "Ressources : $TITLE"
    envoyer_main
    echo "en_ligne=true" >> "$GITHUB_OUTPUT"
    exit 0
  fi
  echo "::warning::$SLUG : verdict prêt mais contrôles du moteur en échec, l'article part en PR"
  VERDICT=humain
fi

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
