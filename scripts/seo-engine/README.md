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

## Refontes d'anciens articles

Une entrée de la file avec `"refonte": true` réécrit un ancien article de `src/lib/articles.ts` **à la même adresse**. L'ancien texte est donné à Claude comme matière première. Le lecteur et le métier viennent de `reader` et `verticales`, la signature de `auteur` et `relecteur`. Une refonte passe toujours par une PR de relecture. Une fois publiée, la version JSON remplace l'ancienne sur la page, dans les listes et dans le sitemap. Le build accepte ce slug partagé uniquement pour une refonte.

## Lancer à la main

```bash
node scripts/seo-engine/publish-article.mjs --slug portail-viamedis --dry --out /tmp/essai   # essai, rien n'est modifié
node --test scripts/seo-engine/tests/*.test.mjs                                               # tests des contrôles
```

En local, la clé est lue dans `ANTHROPIC_API_KEY`, sinon dans `~/.config/granit/anthropic.key`. Sur GitHub, l'onglet Actions propose « Run workflow » avec un slug et une case « Essai ».

## Boucle de relecture (lot de nuit)

Après la rédaction, `relire-article.mjs --slug {slug}` relit l'article avec trois appels distincts au modèle :

1. **relecteur** : une passe sur 4 angles (faits, conformité, SEO, copy), qui sort une liste de points `BLOQUANT`, `A_CORRIGER` ou `DETAIL`. Les règles sont écrites en dur dans `lib/relecture.mjs` (`REGLES`) ;
2. **correcteur** : il renvoie l'article corrigé au schéma de `article-output.schema.json`. Il ne touche jamais au fichier de faits : un fait à changer part dans `decision_humaine` ;
3. **contrôles du moteur** repassés (`controler` + `verifierSources`), puis **contre-relecture** par un appel qui n'a pas corrigé. Elle rend le verdict `pret` ou `humain`.

Il y a au plus 2 tours de correction. Le verdict `humain` ne tombe que s'il reste un point de fond (faits, conformité, SEO), une erreur de contrôle ou une décision humaine : des phrases encore longues ne suffisent pas. Le verdict en markdown est ajouté au corps de la PR. Avec `humain`, le titre de la PR le dit et la PR reçoit le libellé `decision-humaine`. Rien n'est fusionné automatiquement. Le coût de la boucle compte dans le plafond du lot : environ 1,2 $ par article avec 2 tours (essai réel sur portail-actil le 09/10/2026 : 1,17 $).

```bash
node scripts/seo-engine/relire-article.mjs --slug portail-actil --simuler --dry --out /tmp/essai   # sans clé ni dépense
node scripts/seo-engine/verifier-article.mjs portail-actil                                           # contrôles seuls
```

## Secrets du repo

| Secret | Usage |
|---|---|
| `ANTHROPIC_API_KEY` | Rédaction |
| `SLACK_BOT_TOKEN` | Bot qui poste dans le canal (celui de la revue hebdo). Le message donne le lien de la PR, les mots-clés, la taille, la signature, le coût et les avertissements (`lib/slack.mjs`) |
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
| `refonte`, `verticales` | Refonte d'un ancien article à la même adresse ; métiers concernés (`optique`, `audio`, `pharmacie`, `dentaire`, `centres`) |
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
