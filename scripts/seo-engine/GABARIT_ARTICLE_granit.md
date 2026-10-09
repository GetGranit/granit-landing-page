# Granit · Gabarit des pages Ressources

> Complément de `BLOG_CMS_granit.md`. Le guide dit **quoi écrire**. Ce fichier dit **comment la page est construite** : l'ordre des blocs, ce que Claude renvoie, ce que le moteur ajoute, et comment est bâtie une page plateforme.
>
> En cas de conflit : ce fichier fait foi pour la mise en page et le format de sortie, le guide fait foi pour la rédaction.
>
> Maquette de référence : https://claude.ai/artifact/JVzToFenPq52RpKBaFqZTT (accueil, article, fiche Viamedis, annuaire, glossaire). Version 1 du 07/10/2026.

---

## 1. Les fichiers

| Fichier | Rôle | Qui l'écrit |
|---|---|---|
| `articles-queue.json` | La file : un objet par article (titre, mots-clés, FAQ, liens prévus, `granitData`) | Préparé une fois, puis le moteur passe `status` à `published` |
| `BLOG_CMS_granit.md` | Le guide de rédaction, envoyé en entier à Claude | Humain |
| `GABARIT_ARTICLE_granit.md` | Ce fichier. Les sections 5 et 6 sont envoyées à Claude | Humain |
| `article-output.schema.json` | Le schéma imposé à la réponse de Claude (`output_config.format`) | Humain |
| `plateformes/{nom}.json` | Les faits vérifiés et sourcés d'une plateforme (identité, chiffres, statuts, contacts, organismes). Exemple complet : `plateformes/viamedis.json` | Préparé à la main ou par un agent de recherche, relu, daté |

Règle d'or : **Claude ne trouve aucun fait lui-même.** Il rédige à partir de la file, du guide et, pour une plateforme, du fichier de faits. Tout ce qui est structuré (tableau des statuts, contacts, liste des organismes) est rendu par le gabarit depuis le fichier de faits, jamais réécrit par Claude.

---

## 2. Trois types de page

Le moteur choisit le type à partir de la file, sans le demander à Claude.

| Type | Quand | Ce qui change |
|---|---|---|
| **Standard** | `guide-tiers-payant`, `gerer-son-tiers-payant`, `conformite`, `glossaire` | Rien de plus que le gabarit commun |
| **Résolution** | `rejets`, `paiements` | Plan imposé en 7 temps (cas, ce qu'on voit, diagnostic, action, preuve, délai, escalade : voir le guide). Composant `ol.steps` obligatoire pour l'action |
| **Plateforme** | `category = plateformes` et slug `portail-*` | Logo et fiche d'identité dans l'en-tête, 7 H2 imposés (voir le guide), blocs de données insérés par marqueurs (section 6) |

Les piliers (`level` commence par « Pilier ») utilisent le type de leur catégorie. Le pilier `portails-tiers-payant` sert aussi d'annuaire : sous l'ouverture, le gabarit affiche la grille des plateformes publiées avec un filtre par nom.

---

## 3. Anatomie d'une page, dans l'ordre

| # | Bloc | Source | Règles |
|---|---|---|---|
| 1 | Barre du site | Site | Identique partout, « Ressources » actif |
| 2 | Sous-navigation du guide | Moteur (liste des catégories) | « Tout le guide » + une pastille par catégorie + Glossaire. Défile horizontalement sur mobile |
| 3 | En-tête teinté | Moteur | Fond = teinte de la catégorie (section 9). Contient les blocs 4 à 6 |
| 4 | Fil d'Ariane | Moteur | Accueil › Ressources › {Catégorie} › {Titre}. Tous cliquables sauf le dernier. Balisé `BreadcrumbList` |
| 5 | H1 | File (`title`) | Le titre de la file, tel quel. Plateforme : logo à gauche du H1 (64 px, fond blanc, bord fin) si `logo` est renseigné, sinon monogramme (initiale sur la couleur de la catégorie) |
| 6 | Signature | Moteur | Photo + nom + fonction de l'auteur · « Relu par {reviewer} » si renseigné · « Mis à jour le {dateModified} » · temps de lecture. Plateforme : « Informations relevées le {checkedOn} » remplace « Mis à jour le » |
| 7 | Ouverture | Claude (`contentHtml`) | La réponse directe, phrase clé en gras. Pas de couverture au-dessus : la réponse doit être visible sans défiler |
| 8 | « L'essentiel » | Claude (`contentHtml`) | 3 à 5 puces, juste après l'ouverture |
| 9 | Fiche d'identité (plateforme) | Gabarit, depuis `identite` | 4 cases : Type, Optique, Portail, Connexion. Insérée juste après « L'essentiel » |
| 10 | Sections H2 | Claude (`contentHtml`) | H2 en questions, `id` = slug. Composants de la section 5 uniquement |
| 11 | Questions fréquentes | Claude (`faqItems`) | Accordéon, première question ouverte. Balisé `FAQPage`, texte identique |
| 12 | Sources | Claude (`sources`) + fichier de faits | Liste « Site · page », liens externes en `rel="noopener"`. Plateforme : ajouter la mention « Relevé par les agents Granit le {date} » pour les données du connecteur |
| 13 | Encart final | Fixe (guide, « L'encart final ») | Texte validé, seul endroit où figure la promesse « 48 h » |
| 14 | « À lire ensuite » | Moteur (`internalLinks` publiés) | 3 cartes : parent d'abord, puis sœurs, puis transverses. Étiquette par type : « Pour aller plus haut », « Même thème », « Outil », « À lire aussi ». Jamais les 3 derniers articles parus |
| 15 | Pied de page | Site | |

**Colonne de droite** (écrans de 980 px et plus), collée en haut au défilement :

- **Sommaire** : `tocItems`, puis « Questions fréquentes » et « Sources ». L'entrée de la section lue est surlignée.
- **Carte agent** : fond sombre, un titre par catégorie (section 9), une phrase, un bouton « Voir la démo » vers `/demo`. Pas de promesse de délai ici.

**Mobile** : une seule colonne. Le sommaire devient un bloc repliable sous la signature (fermé par défaut). La carte agent disparaît (l'encart final suffit). Tableaux en défilement horizontal dans leur cadre, jamais la page.

**Rendu** : tout le texte est dans le HTML servi par le serveur. Aucune animation ne masque le contenu au chargement.

---

## 4. Données structurées

Inchangé par rapport au guide (`BlogPosting`, `BreadcrumbList`, `FAQPage`), avec deux précisions :

- `BlogPosting.citation` liste les URL de `sources`.
- Page plateforme : `BlogPosting.about` = `{ "@type": "Organization", "name": "{nom}", "url": "{site officiel}" }`. On décrit la plateforme, on ne parle pas en son nom.

---

## 5. Composants autorisés dans `contentHtml`

Section envoyée à Claude. Tout autre balisage est retiré par le moteur avant publication : pas d'attribut `style`, pas de `class` hors de cette liste, pas d'image, pas de script, pas de H1, pas de `<div>` hors des composants ci-dessous.

**Texte** : `<p>`, `<strong>`, `<em>`, `<a href>`, `<ul>`, `<ol>`, `<li>`, `<h2 id>`, `<h3>`.

**L'essentiel** (une fois, juste après l'ouverture) :

```html
<div class="key-takeaways">
  <strong>L'essentiel</strong>
  <ul>
    <li>…</li>
  </ul>
</div>
```

**Étapes** (actions dans l'ordre ; obligatoire dans une page résolution) :

```html
<ol class="steps">
  <li><strong>Vérifier les droits du client.</strong> Une phrase d'explication.</li>
</ol>
```

**Encadré** (deux variantes, au plus deux encadrés par article) :

```html
<div class="callout callout--warn"><p><strong>Le piège :</strong> …</p></div>
<div class="callout callout--tip"><p><strong>Le bon réflexe :</strong> …</p></div>
```

**Tableau** (comparaisons, cause / où vérifier / action) :

```html
<div class="tbl"><table>
  <tr><th>Cause</th><th>Où vérifier</th><th>Correction</th></tr>
  <tr><td>…</td><td>…</td><td>…</td></tr>
</table></div>
```

**Citation** (réelle uniquement, avec sa source) :

```html
<blockquote><p>« … »</p><cite>viamedis.fr, Professionnels de santé</cite></blockquote>
```

**Liens** : internes en chemin relatif (`/ressources/{slug}`), externes en URL complète. Un lien externe doit figurer dans `sources`.

---

## 6. Page plateforme : faits et marqueurs

Section envoyée à Claude pour les pages plateformes.

### Ce que Claude reçoit en plus

Le contenu de `plateformes/{nom}.json` : `identite`, `chiffres`, `faits`, `conventionnement`, `statuts`, `contacts`, `organismes` (la liste complète) et `sources`. Chaque fait porte la clé de sa source.

### Ce que Claude doit faire

- Rédiger **uniquement à partir de `faits` et `conventionnement`**. Un fait absent du fichier n'existe pas. Si une question du plan n'a pas de réponse dans le fichier, le dire en une phrase (« Viamedis ne publie pas de délai propre à l'optique. ») et passer.
- Citer chaque chiffre avec un lien vers sa source (`sources[clé].url`). Les données du connecteur Granit (`url` vide) se formulent « relevé par nos agents sur le portail », sans lien.
- **Ne pas réécrire** les blocs que le gabarit affiche lui-même : poser à la place un marqueur, une seule fois chacun, à l'endroit indiqué.

| Marqueur | Où le poser | Ce que le gabarit affiche |
|---|---|---|
| `<div data-bloc="chiffres"></div>` | Sous le H2 n°1, après la première phrase | 4 tuiles de chiffres clés, avec leur source |
| `<div data-bloc="organismes"></div>` | Sous le H2 n°1, après le paragraphe qui présente la liste | La liste complète des organismes, avec un champ de recherche et le compte |
| `<div data-bloc="statuts"></div>` | Sous le H2 n°4, après la phrase d'introduction | Le tableau Statut / Ce que ça veut dire / Que faire |
| `<div data-bloc="contacts"></div>` | Sous le H2 n°7 | La carte des contacts (téléphone, formulaires, adresse) |

Claude peut citer un ou deux organismes en exemple dans son texte, jamais en dresser la liste.

### Squelette attendu (Viamedis)

```html
<p><strong>Viamedis est un opérateur de tiers payant : il paie l'opticien pour le compte de plus de 75 complémentaires santé.</strong> …</p>
<div class="key-takeaways">…</div>

<h2 id="viamedis-mutuelles">Qu'est-ce que Viamedis et quelles mutuelles passent par lui ?</h2>
<p>… (fondé en 2000, source) …</p>
<div data-bloc="chiffres"></div>
<p>Lors d'une demande optique, le portail fait choisir l'organisme dans une liste de 122 complémentaires, relevée par nos agents …</p>
<div data-bloc="organismes"></div>
<div class="callout callout--tip"><p><strong>Le bon réflexe :</strong> … carte valide portant le logo Viamedis …</p></div>

<h2 id="viamedis-espace-pro">Comment accéder à l'espace pro Viamedis ?</h2>
<ol class="steps">… (les 5 étapes de conventionnement) …</ol>
<p>… double authentification …</p>

<h2 id="viamedis-prise-en-charge">Comment faire une prise en charge optique sur Viamedis ?</h2>
<h2 id="viamedis-statuts">Que veulent dire les statuts d'une prise en charge Viamedis ?</h2>
<p>…</p>
<div data-bloc="statuts"></div>
<h2 id="viamedis-vous-bloquez">Vous bloquez sur Viamedis ?</h2>
<h3>Je ne trouve pas la mutuelle dans la liste</h3> <h3>La prise en charge est refusée</h3>
<h3>Elle reste en attente, sans réponse</h3> <h3>L'accord est obtenu, mais le paiement n'arrive pas</h3>
<h2 id="viamedis-paiement">Quand et comment Viamedis paie-t-il l'opticien ?</h2>
<h2 id="viamedis-contact">Comment contacter Viamedis ?</h2>
<div data-bloc="contacts"></div>
```

---

## 7. L'appel à Claude

- **Modèle** : `claude-sonnet-5` (choix de la fiche moteur), en streaming, `max_tokens` large (64 000).
- **Système** : `BLOG_CMS_granit.md` en entier, puis les sections 5 et 6 de ce fichier. Ce bloc ne change pas d'un article à l'autre : le mettre en cache (`cache_control`).
- **Message** : les métadonnées de l'article (l'objet de la file), la liste des slugs déjà publiés (pour les liens), et pour une plateforme le fichier de faits.
- **Sortie** : `output_config.format` avec `article-output.schema.json`.
- Le schéma imposé ne sait pas vérifier les longueurs ni les nombres d'éléments (140–160 caractères, 4 à 7 questions…). Ces règles sont vérifiées par les contrôles du guide et par ceux de la section 8.

---

## 8. Contrôles ajoutés à ceux du guide

Le moteur refuse l'article (et réessaie une fois) si :

- `contentHtml` contient une balise ou une classe hors de la section 5 (après nettoyage, il compare : si le nettoyage a retiré du texte, refus) ;
- l'encadré `key-takeaways` n'est pas le premier bloc après l'ouverture ;
- un `id` de H2 n'a pas son entrée dans `tocItems`, ou l'inverse ;
- un lien externe du corps n'est pas dans `sources`, ou `sources` contient moins de 2 entrées ;
- page plateforme : un des 4 marqueurs manque ou apparaît deux fois, ou un nombre du texte n'apparaît pas dans le fichier de faits ;
- page résolution : pas de `ol.steps`.

---

## 9. Repères visuels

Charte du site existant : titres en Libre Caslon Text, texte en Inter Tight, étiquettes en JetBrains Mono, accent terracotta `#d4583a`, fonds `#ffffff` et `#faf6ee`. Colonne de texte limitée à 68 caractères environ.

| Catégorie | Couleur (texte) | Teinte (fond d'en-tête) | Titre de la carte agent |
|---|---|---|---|
| `guide-tiers-payant` | `#3f7a4d` | `#e9f2eb` | L'agent dépose vos prises en charge |
| `plateformes` | `#b94a2f` | `#fbeae3` | L'agent dépose vos PEC {nom de la plateforme} |
| `rejets` | `#8a6416` | `#f6eedb` | L'agent vérifie la plateforme avant l'envoi |
| `paiements` | `#3e5f84` | `#e6ecf4` | L'agent rapproche vos virements chaque matin |
| `gerer-son-tiers-payant` | `#7a4a74` | `#f3e9f1` | L'agent dépose vos prises en charge |
| `conformite` | `#2f6f75` | `#e2f0f1` | L'agent dépose vos prises en charge |
| `glossaire` | `#5e574b` | `#f1ede5` | L'agent dépose vos prises en charge |

Le titre de la carte agent « plateformes » n'est utilisé que si la plateforme fait partie de celles que Granit traite (`granitData`). Sinon : « L'agent dépose vos prises en charge ».

---

## 10. À trancher

- **Couverture** : le guide prévoit Unsplash. La maquette propose une couverture typographique générée (titre + couleur de la catégorie + trait du logo Granit), sans photo de stock, sans clé d'API ni registre anti-doublon. Dans les deux cas, la couverture n'apparaît que sur les cartes et en `og:image`, pas en haut de l'article.
- **Logos des plateformes** : le site les affiche déjà sur l'accueil. Un logo par fiche : à confirmer (droit des marques), sinon monogramme.
- **Liste des organismes publiée** : elle rend chaque fiche unique, mais engage notre fiabilité. À confirmer avec Jenny avant la première fiche.
- **Relecteur** : le champ `reviewer` existe ; la ligne « Relu par » n'apparaît que s'il est renseigné.
