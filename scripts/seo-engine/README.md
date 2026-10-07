# Moteur SEO · rubrique Ressources

Chaque jour ouvré à 8 h 17 (heure de Paris), le workflow `.github/workflows/seo-article-du-jour.yml` fait les étapes ci-dessous.

1. prend le premier article `pending` de `articles-queue.json` ;
2. demande l'article à Claude (`claude-opus-5-5`, choisi le 07/10/2026 après comparaison avec Sonnet 5, en streaming, JSON imposé par `article-output.schema.json`). Le message système contient `BLOG_CMS_granit.md` en entier, plus les sections 5 et 6 de `GABARIT_ARTICLE_granit.md` ;
3. contrôle la réponse (`lib/checks.mjs`) : règles du guide, section 8 du gabarit, et chaque source doit répondre. En cas de refus, il réessaie une fois en renvoyant les erreurs à Claude. S'il échoue deux fois, il s'arrête sans rien publier ;
4. écrit `content/ressources/{slug}.json` et ajoute le lien de retour dans le parent et les sœurs déjà en ligne (`liensEntrants`) ;
5. publie, de deux façons possibles :
   - **relecture** pour les 5 premiers articles et pour ceux dont `toValidate` est renseigné : la file passe l'article en `review` sur main, et l'article part dans une PR. Fusionner la PR revient à publier ;
   - **direct** dans tous les autres cas : commit sur main, puis Vercel redéploie ;
6. poste une ligne dans le canal Slack SEO (ou une alerte avec le lien des logs).

## Lancer à la main

```bash
node scripts/seo-engine/publish-article.mjs --slug portail-viamedis --dry --out /tmp/essai   # essai, rien n'est modifié
node --test scripts/seo-engine/tests/*.test.mjs                                               # tests des contrôles
```

En local, la clé est lue dans `ANTHROPIC_API_KEY`, sinon dans `~/.config/granit/anthropic.key`. Sur GitHub, l'onglet Actions propose « Run workflow » avec un slug et une case « Essai ».

## Secrets du repo

| Secret | Usage |
|---|---|
| `ANTHROPIC_API_KEY` | Rédaction |
| `SLACK_BOT_TOKEN` | Bot qui poste dans le canal (celui de la revue hebdo) |
| `SLACK_CANAL_SEO` | ID du canal Slack SEO |

Il faut aussi cocher, dans les réglages du repo, *Actions → General → Allow GitHub Actions to create and approve pull requests*.

## Contrat du fichier article (lu par la page `/ressources/{slug}`)

`content/ressources/{slug}.json` :

| Champ | Contenu |
|---|---|
| `slug`, `id`, `category`, `categoryName`, `title`, `primaryKeyword`, `keywordCluster`, `parentSlug`, `level` | Repris de la file |
| `type` | `standard`, `resolution`, `plateforme`, `vs` ou `grille` (gabarit, section 2) |
| `concurrents` | Pages comparatives seulement : slugs des fichiers `content/concurrents/{slug}.json`, dans l'ordre d'affichage (Granit en dernier) |
| `plateforme` | Nom du fichier de faits `content/plateformes/{nom}.json` (sinon `null`) : source des blocs `data-bloc` et du logo |
| `author` `{name, jobTitle, photo, url}`, `reviewer` (même forme, ou `null`) | Signature selon la catégorie (`config.json`, `signatures`). Photos dans `public/auteurs/`. `reviewer` n'est renseigné que pour un article passé en relecture (PR) : « Relu par » ne s'affiche que s'il est non nul |
| `datePublished`, `dateModified`, `checkedOn` | `YYYY-MM-DD` ; `checkedOn` pour une plateforme, ou date du plus ancien relevé pour une page comparative |
| `wordCount`, `readTime` | `readTime` en minutes (230 mots par minute) |
| `metaDescription`, `contentHtml`, `tocItems`, `faqItems`, `sources` | Réponse de Claude, déjà contrôlée |
| `internalLinks` | Liens prévus dont la cible était en ligne à la rédaction |
| `liensEntrants` | `{slug, anchor, type}` des articles publiés après lui qui doivent apparaître dans « À lire ensuite » |
| `remplace` | Anciens articles de `src/lib/articles.ts` que celui-ci remplace : dès sa publication, ils redirigent en 301 vers lui et sortent des listes et du sitemap (champ `remplace` de la file) |
| `moteur` | Modèle, date de génération, avertissements |

Un article est en ligne quand son fichier existe **et** que son statut dans la file est `published`. Le sitemap, les pages catégorie, le hub et « À lire ensuite » se calculent à la compilation à partir de ces fichiers. Le moteur n'y touche pas.

## Une PR de relecture refusée

Fermez la PR, puis remettez l'article en `pending` pour qu'il soit réécrit au prochain passage :

```bash
node scripts/seo-engine/set-status.mjs <slug> pending
```

## Pages comparatives (Granit vs X, grille du marché)

Décidées à l'atelier du 07/10/2026 (gabarit, section 6 bis). Une entrée de la file avec un champ `concurrents` devient une **fiche VS** (slug `granit-vs-*` ou `granit-ou-*`) ou la **grille** (autre slug).

- Faits : un fichier par acteur dans `content/concurrents/`, Granit compris (`granit.json`). Le champ `exclus` (prix, chiffres déclarés) n'est jamais envoyé à Claude ni affiché.
- Un fichier avec `aRelire: true` bloque la publication. Après relecture humaine, passer `aRelire` à `false`.
- Les entrées comparatives sont en statut `waiting` : le moteur ne les prend pas. Pour lancer une page : relire ses fichiers, puis `node scripts/seo-engine/set-status.mjs <slug> pending`.
- Toujours une PR de relecture. Contrôles en plus : aucun prix, aucun mot de dénigrement près du nom d'un concurrent, nombres et citations tirés des fichiers.
