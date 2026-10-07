# Granit — Ressources : spec de publication et guide de rédaction

> Lire ce fichier en entier avant d'écrire ou de publier un article. Chaque règle a une raison SEO ou GEO. Ne sauter aucune section.
>
> Adapté de la fiche de Mathieu (Stealery, oct. 2026). Version 4 du 07/10/2026 : décisions de Paul intégrées, aligné sur `GABARIT_ARTICLE_granit.md`. Les points marqués **[À VALIDER]** attendent encore une réponse.
>
> **Mise en page, format de sortie et pages plateformes : voir `gabarit-seo-granit/GABARIT_ARTICLE_granit.md`** (avec le schéma `article-output.schema.json` et les fichiers de faits `plateformes/{nom}.json`).

---

## Ce qui se passe à chaque publication

1. Le moteur prend le premier article `pending` de `articles-queue.json`.
2. Il prépare la couverture de l'article (voir « Image de couverture »).
3. Il envoie à Claude les métadonnées de l'article + ce fichier en entier. Claude renvoie un JSON imposé par un schéma (voir « Sortie attendue »).
4. Il contrôle la réponse (voir « Contrôles automatiques »). Deux échecs : le run s'arrête en erreur.
5. Il écrit le fichier de l'article, l'ajoute à la page de sa catégorie, au hub `/ressources` et au `sitemap.xml`.
6. Il met à jour les liens internes des pages déjà publiées qui doivent pointer vers le nouvel article (parent, sœurs). Voir « Maillage au démarrage ».
7. Il marque l'article `published` dans la file, commite, pousse. Vercel redéploie.
8. Notification dans le canal Slack SEO (le même que la revue hebdo, secret `SLACK_CANAL_SEO`) : un message court avec le titre et l'URL, ou une alerte d'erreur avec le lien des logs. Pas de ntfy.

---

## Architecture du site

Retenu par la session « gabarit » (07/10/2026), aligné sur les URL existantes. Le pilier `portails-tiers-payant` sert d'annuaire des plateformes, le pilier `glossaire-tiers-payant` de glossaire A-Z :

```
www.getgranit.ai/
└── ressources/                         ← hub (liste toutes les catégories)
    ├── categorie/{category}            ← page de catégorie (une par cocon)
    └── {slug}                          ← article (URL plate, comme les 19 articles actuels)
```

**URL canonique d'un article :** `https://www.getgranit.ai/ressources/{slug}`
**Langue :** français uniquement (`lang="fr"`, `inLanguage: fr-FR`). Pas de version anglaise générée.

---

## Catégories (= cocons)

| Slug | Nom affiché | Ce qu'on y traite | Lecteur |
|---|---|---|---|
| `guide-tiers-payant` | Guide du tiers payant | Fonctionnement d'ensemble, 100 % Santé, remboursement, cas particuliers | Comptoir + gérant |
| `plateformes` | Plateformes et portails | Un portail par page : compte, prise en charge, statuts, paiement, contact | Comptoir |
| `rejets` | Rejets et corrections | Diagnostic et correction d'un rejet, checklist, contestation | Comptoir |
| `paiements` | Paiements et rapprochement | Rapprochement bancaire, NOEMIE, relances, délais, impayés | Comptoir + gérant |
| `gerer-son-tiers-payant` | Gérer son tiers payant | Interne / externalisé / automatisé, coûts, logiciels, indicateurs | Gérant |
| `glossaire` | Glossaire | Sigles et notions (AMO, AMC, NOEMIE, DRE…) | Comptoir |
| `conformite` | Conformité | Contrôle Assurance maladie, devis normalisé, LPP, RGPD, fraude | Gérant |

Chaque article appartient à une seule catégorie. Pas d'article audioprothèse pour l'instant (focus optique).

---

## Champs de chaque article

Les champs en **gras** viennent de `articles-queue.json`. Les autres sont produits par le moteur ou par Claude.

| Champ | Source | Règles |
|---|---|---|
| **`slug`** | file | Minuscules, tirets, sans accent. Jamais modifié après publication. |
| **`category`** | file | Un des slugs ci-dessus. |
| **`title`** | file | Mot-clé principal dans les premiers mots. **60 caractères max dans la balise `<title>`** (le titre affiché peut être plus long). Factuel, précis, pas de racolage. |
| `metaDescription` | Claude | 140 à 160 caractères. Contient le mot-clé principal. Un bénéfice concret. Finit sur une raison de cliquer. |
| **`primaryKeyword`** | file | La requête exacte visée (ex. `almerys pec`). |
| **`keywordCluster`** | file | 5 à 10 termes associés, à répartir naturellement. |
| **`faqQuestions`** | file | Questions de départ de la FAQ (réelles : Semrush, forums, calls). Claude peut reformuler légèrement, jamais inventer un sujet. |
| **`internalLinks`** | file | Liens prévus (cible, ancre, type). Le moteur ne garde que ceux dont la cible est publiée. |
| **`parentSlug`** | file | Page parente dans le cocon. |
| **`granitData`** | file | Données Granit autorisées pour cet article (voir « Faits »). |
| **`toValidate`** | file | Points à vérifier avant publication. Si non vide sur un des 5 premiers articles : relecture humaine obligatoire. |
| `datePublished` | moteur | `YYYY-MM-DD`. **Jamais modifiée ensuite.** |
| `dateModified` | moteur | Égale à `datePublished` au départ, mise à jour à chaque révision. |
| `readTime` | moteur | Calculé sur le nombre de mots (≈ 230 mots/min). |
| `author` | `config.json` | Selon la catégorie : Arthur Pelong (plateformes, rejets, paiements), Paul Pietra (guide, glossaire), Jenny Mansour (gestion, conformité). Vraies personnes, avec photo et fonction (E-E-A-T). |
| `coverImage`, `coverImageAlt` | moteur | Voir « Image de couverture ». Le alt contient le mot-clé principal. |
| `reviewer` | `config.json` | Un autre membre de l'équipe, affiché (« Relu par… ») seulement si l'article est vraiment passé par une relecture humaine. |
| `sources` | Claude | Toutes les sources externes citées dans le corps, 2 au minimum (voir « Sources de référence »). Un lien externe du corps doit y figurer. |

---

## Image de couverture

La couverture n'apparaît **pas en haut de l'article** (la réponse doit être visible sans défiler) : seulement sur les cartes et en `og:image`. **Décidé le 07/10/2026 : couverture typographique générée par le site** (titre + couleur de la catégorie + trait du logo Granit). Pas de photo Unsplash, pas de clé d'API, pas de registre anti-doublon. Claude ne s'en occupe pas.

---

## Balises `<head>`

```html
<title>{title} | Granit</title>
<meta name="description" content="{metaDescription}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://www.getgranit.ai/ressources/{slug}" />
<meta property="og:type" content="article" />
<meta property="og:locale" content="fr_FR" />
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{metaDescription}" />
<meta property="og:url" content="https://www.getgranit.ai/ressources/{slug}" />
<meta property="og:image" content="https://www.getgranit.ai/{coverImage}" />
<meta property="og:site_name" content="Granit" />
<meta property="article:published_time" content="{datePublished}T00:00:00Z" />
<meta property="article:modified_time" content="{dateModified}T00:00:00Z" />
<meta property="article:author" content="{author}" />
<meta property="article:section" content="{nom de la catégorie}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{title}" />
<meta name="twitter:description" content="{metaDescription}" />
<meta name="twitter:image" content="https://www.getgranit.ai/{coverImage}" />
```

---

## Données structurées (JSON-LD) : trois blocs

1. **`BlogPosting`** : headline, description, image, datePublished, dateModified, author (`Person`, avec `jobTitle`), publisher (`Organization` Granit, logo), url, mainEntityOfPage, keywords (= keywordCluster), articleSection, wordCount, `inLanguage: "fr-FR"`.
2. **`BreadcrumbList`** : Accueil → Ressources → {catégorie} → {titre}.
3. **`FAQPage`** : les mêmes questions et **exactement** les mêmes réponses que la FAQ visible.

> Choix Granit, différent de la fiche Stealery : on **garde** `FAQPage`. Google n'affiche plus de résultat enrichi FAQ pour la plupart des sites depuis 2023, donc on n'en attend aucun. Mais le balisage ne coûte rien, et le texte de la FAQ visible reste le vrai levier GEO.

---

## Structure de la page et format de sortie

**`GABARIT_ARTICLE_granit.md` fait foi** pour l'ordre des blocs, les composants HTML autorisés dans `contentHtml` (section 5), les pages plateformes et leurs marqueurs `data-bloc` (section 6). Claude reçoit ces deux sections avec ce guide.

Claude renvoie uniquement le JSON imposé par `article-output.schema.json` : `metaDescription`, `contentHtml`, `tocItems`, `faqItems`, `sources`. Pas de H1, pas de FAQ, pas d'encart final, pas d'image dans `contentHtml` : la page les ajoute.

---

## Contrôles automatiques avant publication

Le script refuse l'article (et réessaie une fois) si l'une de ces règles, ou l'une de celles de `GABARIT_ARTICLE_granit.md` section 8, n'est pas respectée :

- `stop_reason` n'est pas `end_turn`, ou un champ est vide ;
- `contentHtml` fait moins de 1 400 mots ;
- aucun H2 n'est une question (au moins 70 % des H2 doivent finir par « ? ») ;
- l'encadré « L'essentiel » est absent ;
- `faqItems` contient moins de 4 éléments ;
- le mot-clé principal n'apparaît pas dans les 100 premiers mots ;
- un lien interne pointe vers une page non publiée ou inconnue ;
- le texte contient un mot de la **liste rouge** (voir « Faits ») ;
- le texte contient « — » (tiret long) ou un terme de la liste « jargon interdit ».

---
---

# GUIDE DE RÉDACTION

Pour la personne ou le modèle qui écrit. Ce sont des règles, pas des suggestions.

---

## Les deux objectifs de chaque article

1. **Se positionner sur Google** sur une requête précise (le `primaryKeyword`).
2. **Être cité par les IA** : Google AI Overviews, ChatGPT, Perplexity, Claude.

Les deux demandent la même chose : une structure claire, des réponses directes, des faits sourcés, un ton sûr.

---

## Le lecteur

**Par défaut : la personne qui fait le tiers payant dans un magasin d'optique**, au comptoir ou en back-office (opticienne, conseiller de vente, gestionnaire tiers payant). Pour les catégories `gerer-son-tiers-payant` et `conformite` : **le gérant** d'un ou plusieurs magasins.

Cette personne :

- **Est dans l'action.** Elle a un dossier bloqué devant elle. Elle veut savoir quoi faire maintenant.
- **Manque de temps.** Elle survole d'abord. La valeur doit se voir en 30 secondes.
- **Connaît son métier.** Inutile d'expliquer ce qu'est une mutuelle. Il faut aller plus loin que la première page de Google.
- **Se méfie des vendeurs.** Elle a déjà vu des dizaines de pages commerciales de prestataires. On gagne sa confiance par la précision.

---

## Longueur

- **1 500 mots minimum. Cible : 1 800 à 2 500.**
- La profondeur prime sur la longueur. Chaque paragraphe apporte une information nouvelle.
- Ce qui se dit en 3 phrases ne prend pas 8 phrases.

---

## Règles de structure

### L'ouverture (200 premiers mots) : la partie la plus importante

**Répondre tout de suite.** Ne jamais commencer par :

- « Dans un contexte où… », « Aujourd'hui plus que jamais… »
- « Le tiers payant est un enjeu majeur pour les opticiens… »
- « Si vous lisez cet article, c'est que… »
- toute phrase qui pourrait ouvrir n'importe quel blog.

L'ouverture :

- donne la réponse ou l'idée clé dans les 1 à 2 premières phrases ;
- met en **gras** la phrase la plus importante ;
- contient le mot-clé principal ;
- apprend déjà quelque chose au lecteur avant qu'il ne fasse défiler la page.

**Bonne ouverture :**
> **Sur Almerys, une prise en charge optique se fait depuis l'espace professionnel, dossier par dossier, avec la carte de tiers payant du client et le devis.** La réponse arrive en général dans le portail ; c'est ce statut, pas le devis, qui engage la mutuelle.

**Mauvaise ouverture :**
> Le tiers payant occupe une place de plus en plus importante dans le quotidien des opticiens. Dans cet article, nous allons voir comment fonctionne Almerys…

*(Les exemples illustrent la forme. Leurs faits sont à vérifier avant tout usage.)*

### L'encadré « L'essentiel » : juste après l'ouverture

3 à 5 puces qui résument l'article. C'est la partie la plus reprise par les IA. Obligatoire.

```html
<div class="key-takeaways">
  <strong>L'essentiel</strong>
  <ul>
    <li>[L'information la plus importante, précise]</li>
    <li>[La deuxième, avec un chiffre sourcé si possible]</li>
    <li>[Une action que le lecteur peut faire aujourd'hui]</li>
  </ul>
</div>
```

### H1 : le titre

- Un seul H1, le titre. Jamais répété en H2.
- Mot-clé principal dans les premiers mots.

### H2 : des questions que les gens tapent vraiment

Chaque H2 est une question réelle, telle qu'un opticien la taperait dans Google ou la poserait à ChatGPT.

**Bons H2 :**
- « Comment accéder à l'espace pro Almerys ? »
- « Que veut dire "bénéficiaire inconnu" sur un rejet mutuelle ? »
- « Au bout de combien de temps relancer une mutuelle ? »

**Mauvais H2 :**
- « L'accès au portail » ← pas une question
- « Étape 3 : vérifier les droits » ← pas une requête
- « L'importance du rapprochement » ← vague

Chaque section H2 suit ce schéma :
1. **Réponse directe en 1 à 2 phrases** (c'est elle que les IA extraient) ;
2. développement en 2 à 4 paragraphes ;
3. si utile : liste, tableau ou exemple.

### H3

- Pour les étapes, exemples ou sous-cas d'un H2. Jamais de H3 sans H2 parent.
- Pas besoin d'être des questions. Précis et faciles à repérer.

### Paragraphes

- **3 à 4 phrases maximum.** Une idée par paragraphe.
- La conclusion d'abord, la justification ensuite.

### Listes et tableaux

- Liste à puces : 4 éléments ou plus, sans ordre.
- Liste numérotée : étapes dans l'ordre.
- Tableau : comparaisons (portail A / portail B, avant / après, statut / signification / action).
- Pas de liste juste pour aérer.

---

## Gabarits par type d'article

### Page « plateforme » (catégorie `plateformes`)

Toujours les mêmes H2, dans cet ordre (formulés en questions avec le nom du portail) :

1. Qu'est-ce que {portail} et quelles mutuelles passent par lui ?
2. Comment accéder à l'espace pro {portail} ? (création de compte, connexion, mot de passe, blocage)
3. Comment faire une prise en charge optique sur {portail} ? (pièces, champs, étapes)
4. Que veulent dire les statuts d'une prise en charge {portail} ?
5. Que faire en cas de rejet ou de refus ?
6. Quand et comment {portail} paie-t-il l'opticien ?
7. Comment contacter {portail} ?

Les faits viennent **uniquement** du fichier `plateformes/{nom}.json` (voir le gabarit, section 6). La page affiche elle-même « Informations relevées le {checkedOn} ». Les portails changent : la date protège le lecteur et notre crédibilité.

### Page « résolution » (catégories `rejets` et `paiements`)

Format « base de résolution de problèmes » :

1. **Le cas** : la situation concrète (ex. la mutuelle a payé 40 € de moins que prévu).
2. **Ce que le lecteur voit** : le statut, le message, le libellé exact s'il est connu et sourcé.
3. **Le diagnostic** : les causes possibles, de la plus fréquente à la plus rare.
4. **L'action** : quoi faire maintenant, étape par étape.
5. **La preuve à garder.**
6. **Le délai** : quand relancer.
7. **Quand escalader**, et vers qui.

---

## Faits : ce qu'on a le droit d'écrire

C'est la section la plus importante pour Granit. Un fait faux sur un portail ou une règle de remboursement détruit la confiance d'un professionnel qui connaît son métier.

### Règle générale

- **Un chiffre = une source**, avec un lien vers la source primaire. Sinon, on décrit sans chiffre.
- **Une règle réglementaire = un lien** vers le texte officiel ou ameli.fr, avec la date.
- **Un délai de paiement ou un délai de réponse** n'est jamais universel : on donne celui annoncé par la plateforme, avec la source et la date, ou on n'en donne pas.
- **Un code de rejet** n'est publié qu'avec son libellé exact, sa source et sa date de validité.
- En cas de doute : on n'écrit pas.

### Données Granit utilisables (champ `granitData`)

Seulement celles listées dans `granitData` pour l'article, et toujours **datées** :

- le relevé « mutuelles → portail » (281 mutuelles, relevé au {date}), formulé comme « ce que propose le sélecteur du portail », jamais « cette mutuelle passe uniquement par ce portail » ;
- les champs obligatoires d'une demande de prise en charge par portail ;
- la lecture des statuts (accord, accord sous réserve de pièces, en instance, refus) ;
- les libellés de virement par payeur ;
- **la conformité HDS** : formulation exacte « Granit est certifié HDS (hébergeur de données de santé) ». À citer seulement là où c'est utile (données de santé, RGPD, conformité), jamais comme argument dans une page plateforme ;
- les constats d'expérience, formulés sans chiffre non mesuré (« dans les dossiers que traitent nos agents, la cause la plus fréquente est… »). Autorisé **sans chiffre**, sans nom de client ni de magasin.

### Liste rouge : jamais dans un article

- Toute certification autre que HDS (ISO 27001, SOC 2…) tant qu'elle n'est pas confirmée.
- « Branché en 48 h », « sans API en 48 h » ou toute promesse de délai de déploiement **dans le corps de l'article**. Cette promesse est réservée à l'encart final (voir « L'encart final »).
- Un nombre précis de plateformes. Formulation validée : « Granit travaille avec toutes les plateformes de tiers payant ». Dans une page plateforme, ne jamais affirmer qu'on gère un portail qui n'est pas dans `granitData`.
- Un taux de rejet, un taux d'accord ou un gain de temps non mesuré.
- Le nom d'un client ou d'un magasin client, sans accord écrit.
- Toute donnée patient, même anonymisée en apparence.
- Les prix planchers ou les grilles tarifaires d'un client.
- Les prix d'un concurrent sans lien vers sa page publique.
- Une capture d'écran de portail **non floutée**, ou générée par le moteur. Voir « Captures de portail ».
- Des conseils de remboursement côté patient (ce n'est pas notre lecteur).

### Captures de portail

Autorisées, parce qu'elles prouvent qu'on connaît les écrans mieux que personne, mais à quatre conditions :

1. **Source** : uniquement les captures que nos agents enregistrent pendant leurs soumissions.
2. **Floutage complet** de toute donnée personnelle ou de santé : nom, NIR, n° d'adhérent, date de naissance, ordonnance, montants d'un dossier réel, identifiant du magasin.
3. **Vérification humaine de chaque capture** avant publication. Une seule donnée patient visible est une faute grave (secret médical, RGPD, HDS).
4. **Ajoutées à la main après la publication**, jamais par le moteur. Le moteur ne gère que l'image de couverture.

**[À VALIDER : les conventions et CGU des plateformes autorisent-elles la reproduction de leurs écrans ? À vérifier avec Jenny avant la première capture publiée.]**

### Sources de référence

À privilégier, en lien direct :

- **ameli.fr** (espace professionnels de santé), **service-public.fr**, **legifrance.gouv.fr**
- **sesam-vitale.fr**, nomenclature LPP sur **codage.ext.cnamts.fr**
- les **sites officiels des plateformes** (Viamedis, Almerys, Santéclair, Itelis, Kalixia, SP Santé, Actil, iSanté, Sévéane, Carte Blanche)
- **Acuité** (actualité de la profession), les syndicats (ROF, FNOF) 
- les rapports officiels (DREES, Cour des comptes, CNAM)

Jamais un blog de prestataire comme source d'un fait.

---

## Signaux de crédibilité : obligatoires

1. **Au moins 2 faits sourcés** par article, avec lien inline vers la source primaire.
2. **Au moins une citation** en `<blockquote>`, réelle uniquement : extrait d'un texte officiel, d'une page de plateforme, ou d'un client avec son accord (« gérante d'un magasin indépendant, Hauts-de-France »). Jamais de citation inventée.
3. **Des précisions plutôt que des généralités** : le nom du champ, le nom du statut, l'écran concerné, l'étape exacte.
4. **Un point de vue de terrain** : écrire comme quelqu'un qui voit passer des dossiers tous les jours, pas comme un observateur extérieur. Uniquement avec des faits autorisés.

---

## Mots-clés

- **Mot-clé principal** dans : le H1, les 100 premiers mots, un H2, la meta description, le alt de l'image, le slug.
- Jamais de bourrage. Si la phrase sonne faux, la reformuler.
- **Les termes du `keywordCluster`** se répartissent naturellement dans les H2, H3 et paragraphes.
- **Profondeur du sujet** : employer les notions qu'un expert citerait naturellement (AMO, AMC, ouvrant droit, bénéficiaire, DRE, NOEMIE, devis normalisé, classe A/B, LPP, prise en charge, réseau de soins…), chacune définie à sa première apparition.
- **Pas de cannibalisation** : un mot-clé principal = un seul article. La file y veille ; ne jamais viser le mot-clé principal d'un autre article.

---

## Maillage interne

- **3 à 8 liens internes** dans le corps du texte, posés naturellement.
- Utiliser **uniquement** les liens de `internalLinks` dont la cible est publiée : parent, filles (si pilier), sœurs, pages transverses (outil mutuelle → portail, contacts, checklist).
- **Ancre = le texte fourni dans `internalLinks`**, ou une variante proche. Jamais « cliquez ici », « en savoir plus ».
- Le gabarit ajoute en plus : fil d'Ariane, page catégorie, hub `/ressources`, bloc « À lire aussi ».
- Pas de page orpheline : chaque article publié est lié depuis sa page catégorie et le hub le jour même ; le moteur ajoute aussi le lien depuis le parent et les sœurs déjà en ligne.

---

### Maillage au démarrage

Les articles sortent un par un, donc les premiers ont peu de voisins publiés. Quatre règles évitent un maillage pauvre :

1. **L'ordre de la file publie les piliers en premier** (guide général, puis pilier Plateformes, puis les pages plateformes). Chaque nouvel article a donc toujours au moins son parent déjà en ligne.
2. **Les liens reviennent en arrière.** À chaque publication, le moteur ajoute un lien vers le nouvel article dans son parent et dans ses sœurs déjà publiées. Le maillage se densifie tout seul, sans réécrire les anciens articles.
3. **Le bloc « À lire aussi » et les pages catégorie sont calculés à chaque déploiement** à partir de la file (statut `published`), sans appel à Claude : ils sont toujours à jour.
4. **On s'appuie sur l'existant dès le premier jour** : les 7 articles actuels de `/ressources` rattachables à l'optique et les pages produit (`/agents`, `/demo`) servent de cibles en attendant que le cocon se remplisse. Pas plus de 2 liens vers des pages produit par article.

Au bout de la vague 1 (20 articles), chaque page plateforme est reliée au pilier, à 2 sœurs, à l'outil mutuelle → portail, aux contacts et à la checklist.

## FAQ : obligatoire, 4 à 7 questions

- Partir des `faqQuestions` de la file (questions réelles). Claude peut en ajuster la formulation, en fusionner deux, ou en ajouter une si elle vient d'une recherche réelle (« Autres questions posées »). Jamais une question inventée.
- **Chaque réponse : 2 à 4 phrases, compréhensible seule** (sans « comme vu plus haut »). Une IA doit pouvoir la citer telle quelle.
- La première phrase répond directement à la question.
- Pas de nouveau fait dans la FAQ qui ne serait pas sourcé dans l'article.
- La FAQ visible et le JSON-LD `FAQPage` sont **identiques mot pour mot**.

---

## GEO : écrire pour les IA

- **Définition d'abord.** Pour chaque notion clé, une phrase du type « X est Y qui fait Z ». Ex. : « La DRE (demande de remboursement électronique) est le flux qui transmet la part mutuelle d'une facture à l'organisme complémentaire. » *(à vérifier avant usage)*
- **Pyramide inversée.** Sous chaque H2, la réponse directe avant le développement.
- **Formules d'autorité** : « La méthode la plus sûre est… », « Il y a trois causes possibles : … », « Selon ameli.fr, … », « La différence entre X et Y est… », « Concrètement, … ».
- **Pas d'hésitation inutile** (« il se pourrait que », « certains pensent que »), sauf incertitude réelle, à dire franchement.
- **Couvrir tout le sujet** : la question principale et les questions voisines. Si une question voisine a son propre article, faire un lien.
- **Sources primaires**, jamais un résumé de seconde main.

---

## Ton et style Granit

Repris de la plateforme de marque (Notion) :

- **Phrases courtes.** Une idée par phrase.
- **Chiffré et précis**, jamais vague. Un chiffre seulement s'il est sourcé.
- **Pas de superlatifs** : « le meilleur », « révolutionnaire », « incontournable », « puissant ».
- **Vocabulaire exact du métier** : prise en charge, ouvrant droit, AMC, DRE, statut, rejet. Les sigles sont définis à leur première apparition.
- **Pas de tiret long (—).** Utiliser une virgule, deux-points ou des parenthèses.
- **D'égal à égal** : un praticien qui parle à un praticien. On vouvoie le lecteur.
- **Français simple** : pas d'anglicismes inutiles (« process », « workflow », « leverage », « game-changer », « best practice »).
- **Jargon interdit** : « dans le paysage actuel », « il est essentiel de », « plongeons dans », « en fin de compte », « levier de croissance », « synergie », « holistique ».

---

## Mention de Granit : discrète et méritée

Chaque article mentionne Granit **une fois** dans le corps, puis dans l'encart final.

- **Jamais en ouverture.** La mention arrive après que le lecteur a reçu une vraie réponse.
- **Là où Granit résout le problème qu'on vient de décrire.** Ça doit se lire comme une recommandation, pas comme une publicité.
- **Une seule mention dans le corps.**
- **Parler du résultat pour le lecteur**, pas des fonctionnalités : « ces demandes peuvent être saisies sans vous sur le portail », pas « Granit dispose d'un module de saisie ».
- **Sans emphase** : pas de « solution puissante », « plateforme révolutionnaire ».
- **Seulement des capacités réelles et validées** (voir « Faits »).

**Bonne mention :**
> Quand ces demandes se comptent par dizaines chaque jour, la saisie sur chaque portail devient le goulot du magasin. C'est ce que fait [Granit](https://www.getgranit.ai) : des agents saisissent les prises en charge directement sur les portails des plateformes, puis renvoient le statut à l'équipe.

**Mauvaise mention :**
> Granit est la meilleure solution pour automatiser votre tiers payant. Essayez-la dès aujourd'hui !

### L'encart final (texte fixe, ne pas modifier)

Texte validé le 07/10/2026. La promesse « 48 h » vit uniquement ici, jamais dans le corps des articles.

```html
<div class="post-cta">
  <h3>Vos prises en charge prennent trop de temps ?</h3>
  <p>Granit saisit les demandes sur les portails des plateformes et suit les réponses à votre place. Branché sur vos portails en 48 h, sans API à demander.</p>
  <a href="https://www.getgranit.ai/demo" class="btn btn-primary">Demander une démo</a>
</div>
```

---

## À éviter

- **Les ouvertures génériques.** Toute phrase qui pourrait ouvrir n'importe quel blog est à couper.
- **Les chiffres sans source.** Retirés.
- **Les pages orphelines.**
- **Deux articles sur le même mot-clé principal.**
- **Les citations et statistiques inventées.** Sans source réelle, décrire le constat sans chiffre.
- **Modifier `datePublished`.** Seule `dateModified` change.
- **Le remplissage pour atteindre la longueur.**
- **Les conseils destinés aux patients** (« comment être mieux remboursé ») : ce n'est pas notre lecteur.
- **Tout ce qui figure dans la liste rouge.**

---

## Exemple de métadonnées envoyées à Claude

```json
{
  "slug": "almerys-prise-en-charge",
  "category": "plateformes",
  "title": "Almerys : faire une prise en charge (PEC) optique",
  "primaryKeyword": "almerys pec",
  "keywordCluster": ["pec almerys", "prise en charge almerys", "almerys prise en charge", "www almerys com demande de prise en charge"],
  "faqQuestions": [
    "Comment faire une demande de prise en charge sur Almerys ?",
    "Quelles pièces joindre à une PEC Almerys ?",
    "Combien de temps pour une réponse d'Almerys ?",
    "Que faire si la PEC Almerys est refusée ?"
  ],
  "parentSlug": "portail-almerys",
  "internalLinks": [
    { "slug": "portail-almerys", "anchor": "almerys tp", "type": "parent" },
    { "slug": "prise-en-charge-refusee", "anchor": "Prise en charge refusée", "type": "transverse" },
    { "slug": "checklist-prise-en-charge", "anchor": "checklist avant d'envoyer une prise en charge", "type": "transverse" }
  ],
  "granitData": "Parcours DPEC Almerys de l'agent, champs, statuts",
  "toValidate": ""
}
```
