# granit-landing-page : repères pour une session

Le site getgranit.ai : React 19, Vite, TanStack Start (routes dans `src/routes/`), Tailwind 4
(`src/styles.css`, `src/ressources.css`), déployé sur Cloudflare. Le moteur SEO (articles, sitemap,
IndexNow) vit dans `scripts/seo-engine/` et tourne par GitHub Actions. Tout en français : code
commenté, commits, PR.

## Commandes

```bash
npm ci                         # installer (package-lock.json ; bun.lock est tenu à jour en parallèle)
npm run dev                    # serveur de dev, http://localhost:8080
npm run build                  # sitemap + llms.txt + build Vite (réécrit public/sitemap.xml et llms.txt)
npx wrangler dev --port 4173   # sert le build Cloudflare (`npm run preview` / vite preview est cassé)
npm run lint                   # ESLint + Prettier (déjà rouge sur main : Prettier, non bloquant en CI)
npm test                       # tests node:test (tests/ et scripts/seo-engine/tests/)
npm run check-marque           # le filet de la marque, voir plus bas
npm run planche                # captures de toutes les pages, 375 et 1280 px → planche/index.html
```

## La marque

La référence est `DESIGN.md` (jetons YAML en tête, puis les règles) et `TON.md` pour les mots. Ce sont des
copies de `internal/marque/` : on ne les modifie pas ici, on les recopie quand la source change.

- **Seulement les jetons de DESIGN.md.** Aucune couleur en dur hors palette (hex, rgb, hsl, oklch),
  aucune police en dur. On passe par les variables CSS du thème.
- **Deux familles** : Source Serif 4 pour les titres, toujours réglée `font-variation-settings: "opsz" 20`,
  et Geist pour le texte. Dans un mail : Georgia et Helvetica/Arial. Rien d'autre.
- **Ancienne marque à éliminer** : `--terra*`, `--sage*`, `--font-hand`, ombres brunes `rgba(28,17,8,…)`,
  Inter Tight, Libre Caslon, JetBrains Mono, Just Me Again Down Here.
- **Les logos viennent de `public/`** (SVG fabriqués dans internal par `marque/sources/fabriquer.cjs`).
  On ne les recompose jamais (pas de nom tapé au clavier à côté d'un symbole), on ne les retouche pas.
- **Les textes** (titres, boutons, accroches, articles) suivent `TON.md` : vouvoiement, mots du métier,
  rien d'affirmé qui ne soit validé, typographie française, pas d'emoji.

## Le filet : check-marque et planche

- `scripts/check-marque.mjs` scanne `src/`, `public/*.html` et `scripts/` et compte quatre règles :
  `ancienne-variable`, `couleur-hors-palette`, `police-hors-marque`, `ombre-brune`.
- **Cliquet** : `scripts/check-marque.baseline.json` garde le compte par fichier et par règle. Une PR peut
  le faire baisser, jamais monter. En CI, on compare à la baseline de la branche cible : la réécrire
  dans la PR ne fait pas passer un ajout.
- Quand vos comptes baissent : `node scripts/check-marque.mjs --update-baseline`, et commitez la baseline.
- Un cas légitime (numéro qui ressemble à un hex, couleur d'un tiers) va dans
  `scripts/check-marque.exceptions.json`, avec sa raison. Ce n'est pas un endroit pour garder l'ancienne marque.
- `--report` écrit un récap par règle et par fichier ; `--strict` exige zéro (fin de bascule).
- `npm run planche` (après `npm run build` ; lance wrangler dev lui-même au besoin) capture chaque page en 375 et
  1280 px, relève statut HTTP, erreurs console et liens internes cassés. `--compare <dossier>` met une
  planche « avant » à côté.

## Règles pendant la bascule de marque

- **check-marque vert avant fusion.** Toujours. Une PR qui ajoute une violation ne se fusionne pas.
- **Un seul propriétaire de `src/styles.css`** pendant la bascule : les jetons et les variables du thème
  changent dans une seule PR à la fois. Les autres PR consomment les variables, elles ne les redéfinissent pas.
- On garde la mise en page : la bascule change couleurs, polices et logo, pas la structure des pages.
- Une branche par tâche, une PR même seul, la CI verte avant de fusionner.
- Jamais de secret dans le dépôt (`.env` est ignoré, les clés vivent dans les secrets du repo).
