# Stratégie de requêtes des 3 outils gratuits

Outils : **A** codes rejet, **B** remboursement, **C** mutuelle → portail de tiers payant.
Rédigé le 18/11/2026 par l'agent seo de l'équipe de nuit, à relire avant toute mise en ligne. Aucun chiffre de la
Search Console de getgranit.ai dans ce fichier (ils sont dans le dossier privé de la nuit).

---

## 0. En bref

1. **Une page statique par entrée, un hub par outil, la recherche par-dessus.** Le hub porte la liste
   complète dans le HTML serveur (comme l'annuaire des plateformes), jamais derrière un formulaire.
2. **A · codes rejet** : la demande « un code précis » est réelle mais personne ne la sert en HTML propre.
   Les mémos CPAM en PDF, des copies sur studylib et des blogs d'éditeurs centrés sur les infirmiers
   occupent la page 1. Une page par code, libellé exact, source CPAM datée, métiers : c'est le format qui
   manque. Requêtes déjà visibles en Search Console sur des numéros et libellés de rejet alors que le site
   ne publie aucun code.
3. **A · cannibalisation** : l'article `codes-rejets-noemie` vise aujourd'hui « liste codes rejets
   noemie » et dit « cette page ne reproduit aucun code ». Le hub `/outils/codes-rejet` prend la liste ;
   l'article se recentre sur « comprendre et traiter un rejet NOEMIE ». Ordre : hub d'abord, retitrage de
   l'article une fois le hub indexé.
4. **C · cannibalisation forte** : 24 fiches `/ressources/portail-<mutuelle>` (22 mutuelles, Kalixia,
   Carte Blanche) existent déjà avec le gabarit « X tiers payant : quel portail pour l'opticien ? ».
   Recommandation : **une seule URL par mutuelle**. Les pages d'entrée de C sont ces fiches, enrichies
   d'un tableau « par métier » ; le hub `/outils/mutuelle-portail` est l'annuaire et la recherche. Créer
   `/outils/mutuelle-portail/<mutuelle>` en plus des fiches doublerait chaque page.
5. **C · promesse à tenir** : l'article `mutuelle-quel-portail` annonce « outil gratuit » et un relevé de
   281 mutuelles, mais aucun outil n'existe dans `src/`. Le hub C est cet outil ; l'article se recentre
   sur « numéro AMC ».
6. **B · terrain neuf et saturé côté grand public** : les comparateurs de mutuelles tiennent « remboursement
   couronne », « remboursement lunettes », avec des chiffres qui se contredisent d'une page à l'autre.
   Le créneau pour Granit : la page par code (LPP, CCAM) écrite pour le professionnel, avec tarif daté et
   source officielle. Pas de page par code individuel fabricant ni par CIP en V0.
7. **Données structurées** : BreadcrumbList partout (affiché sur ordinateur seulement). Plus de résultat
   enrichi FAQ dans Google depuis le 7 mai 2026 ; Dataset ne sert qu'à Dataset Search. Le gain viendra du
   contenu visible, pas du balisage.
8. **Publier par vagues** : les 24 fiches publiées d'un coup le 06/11 étaient encore pour la plupart
   « Détectée, actuellement non indexée » une semaine après. Hub + 15 à 25 entrées par outil, liées depuis
   les pages qui ont déjà du trafic, puis vague suivante quand l'indexation suit.
9. **Les trois outils se tiennent** : C (où faire la PEC) → B (combien rembourse chaque part) → A (pourquoi
   la facture revient). Chaque page d'entrée renvoie vers l'outil voisin quand la correction en dépend.

---

## 1. Méthode et limites

- **Pas de volumes DataForSEO.** Quatre sources à la place :
  1. la Search Console de getgranit.ai (6 relevés hebdomadaires, du 09/10 au 13/11/2026), citée ici sans
     chiffre ;
  2. les volumes mensuels **indicatifs** déjà notés dans la file du moteur SEO
     (`scripts/seo-engine/articles-queue.json`, champ `searchVolume`, quand `primaryKeywordMeasured` vaut
     `true`). Leur source n'est pas documentée dans le dépôt : ordres de grandeur, à confirmer ;
  3. la lecture des résultats de recherche le 18/11/2026 avec WebSearch et Linkup. **Ce ne sont pas
     exactement les résultats de google.fr** (moteurs et index différents) : ils montrent qui publie quoi,
     pas un classement exact ;
  4. le site lui-même : `content/ressources/*.json`, `content/plateformes/*.json`, la file du moteur,
     `src/lib/seo.ts`, `src/lib/ressources/seo.ts`, `src/components/JsonLd.tsx`, `src/components/Seo.tsx`.
- **« Autres questions posées » non lisibles** avec ces outils. Les questions listées plus bas viennent des
  FAQ des pages qui rankent et des requêtes en forme de question vues en Search Console. Elles sont à
  confirmer dans un navigateur sur google.fr avant de figer les FAQ.
- Les codes, tarifs et libellés cités ici sont des **exemples relevés dans les pages qui rankent**, pour
  illustrer les gabarits. Ils ne valent pas donnée : ce sont les agents A, B et C qui les sourcent dans
  `donnees.json`.

---

## 2. Règles communes aux trois outils

### 2.1 Pages et rendu

- Une page par entrée « sûre », rendue côté serveur (TanStack Start), lisible sans JavaScript : H1, réponse
  en deux phrases, encadré « L'essentiel », contenu propre, source et date visibles, liens voisins.
- Le hub porte **la liste complète dans le HTML serveur**, avec un filtre JavaScript en plus. C'est déjà le
  principe de `src/components/ressources/Annuaire.tsx` (« La liste complète est dans le HTML serveur ; le
  filtre n'est qu'un plus en JavaScript »).
- Une page `/outils` liste les trois outils (navigation, maillage, et un lien de pied de page « Outils
  gratuits »). Les deux pages de campagne actuelles (`/outils/tri-des-marques`,
  `/outils/heures-de-decembre`) restent hors de cette page.

### 2.2 Indexation

- **Ne pas recopier le `head` des outils existants** : ils sont en `noindex, nofollow` (pages de campagne).
  Les nouveaux outils sont indexables.
- `scripts/gen-sitemap.mjs` ne connaît pas `/outils` : y ajouter les hubs et les entrées publiées, avec
  `lastmod` = date de vérification de l'entrée. `scripts/gen-llms.mjs` suit le sitemap.
- Le canonical est déjà calculé par `src/components/Seo.tsx` (chemin sans barre finale). Les URL de
  recherche (`?q=…`) ne doivent pas être liées ; leur canonical est le hub.
- Les variantes d'un identifiant (code collé, sans zéro initial, avec espace) redirigent en **301** vers
  l'URL canonique, comme `ressources.$slug.tsx` le fait déjà pour les anciens slugs.
- Une entrée qui passe à `a_verifier` ou disparaît d'une source officielle : la page reste en ligne avec la
  mention, ou part en 301 vers le hub ; jamais de 404 sur une page indexée.
- IndexNow (`scripts/seo-engine/indexnow.mjs`) à chaque vague, pour Bing.

### 2.3 Titre, description, H1

Règles du guide du moteur (`scripts/seo-engine/BLOG_CMS_granit.md`), appliquées aux outils :

- `<title>` : **60 caractères maximum, espaces comprises**, requête exacte au début, sans « Granit » en
  suffixe. Le H1 peut être plus long.
- Meta description : **140 à 160 caractères**, une phrase normale, un bénéfice concret, finit sur une
  raison de cliquer. Jamais une suite de mots-clés en ouverture.
- Mots du métier exacts, guillemets français, pas de tiret long (`TON.md`).
- Date visible « Vérifié le … » et nom du relecteur, comme les articles (`reviewer`). En santé, Google
  juge la fiabilité : un tarif ou un code sans date ni source est le premier défaut que nos concurrents ont.

### 2.4 Données structurées

Ce que le site fait déjà : `Organization` sur toutes les pages et `WebSite` sur l'accueil
(`src/components/Seo.tsx`), `BlogPosting`, `FAQPage` et `BreadcrumbList` sur les articles
(`src/lib/ressources/seo.ts`), `faqPageLd` sur /tarifs, /securite et les pages métier,
`SoftwareApplication` sur /tarifs. `src/components/JsonLd.tsx` rend une liste de blocs.

| Type | Où | Pourquoi |
|---|---|---|
| `BreadcrumbList` | hub et chaque entrée (`breadcrumbLd` existe) | Fil d'Ariane affiché dans Google, **sur ordinateur seulement** depuis janvier 2025 (journal des mises à jour de Google Search Central). Accueil › Outils › Codes rejet › 0460 051 |
| `WebPage` avec `dateModified`, `citation` (URL des sources), `publisher` = `organizationRef` | chaque entrée | Dit la date et les sources ; pas `BlogPosting` (ce ne sont pas des articles) |
| `FAQPage` | seulement là où une FAQ visible apporte du contenu | **Google n'affiche plus le résultat enrichi FAQ depuis le 7 mai 2026** et a retiré sa documentation en juin 2026. Sans effet sur l'affichage ; à garder léger. Pas de FAQ gabarit répétée sur des centaines de pages |
| `Dataset` | hubs, si le fichier de données est téléchargeable (licence, date, créateur, sources) | Utilisé **par Dataset Search seulement**, pas par Google Search, et retiré progressivement des résultats (journal Google, fin 2025). Priorité basse |
| `DefinedTermSet` / `DefinedTerm` | hub A et entrées A (facultatif) | Décrit une liste de codes. Aucun affichage Google : priorité basse |
| À éviter | `Product`, `Offer`, `AggregateRating`, `SoftwareApplication` avec notes | Rien à vendre ni de vraies notes : pas de balisage trompeur |

### 2.5 Seuil commun pour qu'une entrée ait sa page

Une page d'entrée n'existe que si **toutes** ces conditions tiennent ; sinon l'entrée reste une ligne du
hub et de la recherche, sans page :

1. statut `"sur"` dans `donnees.json`, source officielle ou de référence citée, date de la source et date
   de consultation ;
2. au moins **150 mots propres** à l'entrée, hors gabarit, hors liens et hors encadré de marque ;
3. les champs propres à l'outil remplis (détaillés par outil plus bas) ;
4. au moins **2 voisins publiés** à lier.

Les entrées `"a_verifier"` ne sont pas publiées du tout. Deux signaux de la Search Console appuient ce
seuil sans chiffre : la page `/ressources/categorie/rejets`, liste sans texte propre, est « Explorée,
actuellement non indexée » ; et les fiches publiées en lot restent longtemps « Détectée, actuellement non
indexée ».

### 2.6 Vagues de publication

- **Vague 1** : `/outils`, les trois hubs, 15 à 25 entrées par outil choisies par fréquence (mémos CPAM
  qui publient une fréquence, mutuelles déjà cherchées, codes LPP les plus courants). Liens depuis les pages qui
  ont déjà du trafic : fiches plateformes (`portail-almerys`, `portail-isante`, `almerys-prise-en-charge`,
  `portail-viamedis`…), `codes-rejets-noemie`, `mutuelle-quel-portail`.
- **Vague 2** : quand la Search Console montre la vague 1 indexée (compter 2 à 4 semaines, c'est le délai
  constaté pour les fiches plateformes d'octobre), 30 à 50 entrées de plus par outil.
- Mesure : pages indexées / pages publiées par outil, impressions et clics des URL `/outils/`, requêtes
  nouvelles. À ajouter à la revue hebdomadaire Search Console.

### 2.7 Maillage entre outils

| De | Vers | Quand |
|---|---|---|
| C (mutuelle) | B | « Combien la mutuelle prend en charge » : lien vers le hub B ou le code |
| C (mutuelle) | A | Rejets côté complémentaire (« bénéficiaire inconnu », organisme non reconnu) |
| B (code) | A | Rejets liés au code ou au taux (ex. écart taux demandé / taux calculé) |
| B (code) | C | « Où faire la prise en charge de la part mutuelle » |
| A (code) | C | Correction = vérifier l'organisme ou les droits complémentaires |
| A (code) | B | Correction = taux, tarif, code LPP ou CCAM |

---

## 3. Outil A · Codes rejet

### 3.1 Ce que le site a déjà

| Page | Requête visée (`primaryKeyword`) | Ce qu'elle fait | Risque face à l'outil |
|---|---|---|---|
| `/ressources/codes-rejets-noemie` | liste codes rejets noemie | Méthode : lire, classer en 4 familles, corriger, relancer. **Ne reproduit aucun code** (« un code faux vous ferait corriger le mauvais champ ») | **Fort** : même requête « liste » que le hub |
| `/ressources/rejet-beneficiaire-inconnu` | rejet bénéficiaire inconnu mutuelle | Rejet côté mutuelle (AMC), sans doubler l'AMO | Moyen : proche des codes AMO « bénéficiaire inconnu en BDO », « assuré absent de la BDO » |
| `/ressources/rejet-tiers-payant` | motif rejet tiers payant | Pilier optique : AMO ou AMC, causes, correction | Faible : « comprendre » |
| `/ressources/checklist-prise-en-charge` | checklist prise en charge optique | Prévention avant envoi | Faible |
| `/ressources/quand-relancer-mutuelle` | relancer une mutuelle | Calendrier PEC, facture, ARL, NOEMIE | Faible |
| `/ressources/virement-mutuelle-inferieur` | virement mutuelle inférieur facture | Rejet partiel, écart | Faible |
| `/ressources/indus-assurance-maladie-pharmacie-protections-menstruelles` | indu assurance maladie pharmacie | Indus officine | Faible |
| `/ressources/reduire-rejets-cpam`, `/ressources/rapprochement-noemie` (anciens articles) | | Rejets CPAM, rapprochement | Faible ; à relier au hub |

Déjà visible en Search Console : « liste codes rejets noemie », « liste code
rejet télétransmission », « code rejet cpam », « liste des codes rejets cpam », et des requêtes **sur un
code ou un libellé précis** (« code rejet 153 cpam », « beneficiaire inconnu en bdo », « bénéficiaire
réfractaire noemie code g ») : Google nous montre déjà sur des rejets précis alors que le site n'en publie
aucun. « Code G / réfractaire » : aucune source trouvée cette nuit, à vérifier par l'agent A.

**Partage proposé**

| Intention | Page qui la porte | Ce que l'autre page fait |
|---|---|---|
| « un code précis » (numéro ou libellé) | page d'entrée `/outils/codes-rejet/<code>` | l'article renvoie vers elle quand il cite un code |
| « la liste » (liste codes rejets noemie, liste code rejet télétransmission, codes rejet cpam) | hub `/outils/codes-rejet` | l'article garde une phrase « la liste des codes, un par un » vers le hub |
| « comprendre / traiter » (rejet noemie, retour noemie, que faire après un rejet, ARL négatif, traitement caisse) | article `codes-rejets-noemie`, retitré | le hub renvoie vers l'article pour la méthode |
| rejet côté mutuelle (bénéficiaire inconnu, acte hors périmètre…) | articles `rejet-beneficiaire-inconnu` et ceux de la file | l'entrée AMO renvoie vers l'article AMC, et inversement |

Retitrage de l'article (après indexation du hub) : `seoTitle` « Rejet NOEMIE : lire le retour, corriger,
renvoyer la facture » (60 caractères), `primaryKeyword` « rejet noemie », URL inchangée. Retirer la phrase
« cette page ne reproduit aucun code » et la remplacer par le renvoi vers la liste sourcée.

### 3.2 Ce que montrent les résultats de recherche

Requêtes lues : « rejet noemie », « liste codes rejets noemie », « liste code rejet télétransmission »,
« code rejet ameli pharmacie », « code rejet 153 cpam », « ARL négatif », « rejet noemie opticien »,
« code rejet noemie dentiste », et des codes réels relevés dans les mémos CPAM et les guides d'éditeurs : « 0460 051 », « 0450 054 »,
« 0460 002 », « 0250 050 », « 0270 051 ».

| Qui ranke | Type de page | Format |
|---|---|---|
| ameli.fr | Mémos CPAM en PDF par profession (infirmiers, établissements privés et publics, médecins, glossaire pharmaciens du Bas-Rhin) ; page « Les rejets de facturation et les solutions » (médecin, 26/01/2026) ; documentation de la norme NOEMIE | Tableaux code / libellé / explication / que faire ; page texte |
| cpam-bordeaux.fr, local.pastel.cpam-isere.fr | Mémos CPAM en PDF (2016 par profession ; pharmaciens, août 2023) | Tableaux |
| studylibfr.com | Copies de mémos (dont un « lexique des rejets opticiens » de la CPAM de Loire-Atlantique, avec la fréquence de chaque code) | PDF recopié |
| static.televitale.org | Dictionnaire des anomalies IRIS | Très long PDF technique |
| laruche.cbainfo.fr | Guide NOEMIE + **une page par code** (« Code rejet 153 CPAM ») | Article par code |
| swily.io, azurparafac.fr, soutiain.fr, agatheyou.fr, maisondesinfirmiers.fr, caducee.net | Guides d'éditeurs et de sociétés de facturation, surtout infirmiers | Tableaux de codes avec sources CPAM |
| sapsante.com, lequotidiendupharmacien.fr | Rejets en pharmacie | Interview, actualité |
| prooptic-idm.com | Fiche technique d'un éditeur opticien | PDF |
| forum-assures.ameli.fr, infirmiers.com | Forums | Questions d'assurés et de soignants |
| getgranit.ai | `codes-rejets-noemie` | Méthode, sans code |

**Ce qui manque**

- Une page HTML par code, avec le libellé exact, la source CPAM datée et la date de vérification. Les
  meilleures réponses sont des PDF de 2016 à 2023 ou des copies.
- Les métiers hors infirmiers : opticiens, audioprothésistes, dentaires, centres de santé, pharmacies n'ont
  presque que des PDF. C'est exactement la cible de Granit.
- Les variantes d'écriture d'un même code : « 0270 051 » dans un mémo, « 270051 » dans le lexique
  opticiens, « 0450-072 » dans le mémo pharmaciens. Personne ne les rassemble.
- Les différences de libellé d'une caisse à l'autre (plusieurs pages le disent, aucune ne les montre).
- Le côté complémentaire : motifs de rejet des plateformes et des mutuelles (ex. libellé « FACT TPC INCOMP
  TYPE CONTRAT » cité par un éditeur), rarement sourcés.
- Ce qui n'est pas un rejet : « Traitement caisse », ARL positif, absence de retour.

**Questions relevées** (FAQ des pages qui rankent, requêtes question)

- Qu'est-ce qu'un code rejet NOEMIE ? Où trouver la liste des codes ?
- Que faire selon le code reçu ? Faut-il annuler la facture avant de la renvoyer ?
- Un rejet NOEMIE veut-il dire que je ne serai pas payé ?
- ARL négatif ou rejet (RSP) : quelle différence ?
- « Traitement caisse » : est-ce un rejet ? Faut-il renvoyer ?
- Un code « doublon » : renvoyer ou non ?
- Combien de temps pour corriger et renvoyer une facture rejetée ?

### 3.3 Requêtes cibles et demande

| Intention | Exemples de requêtes | Page | Demande estimée | Pourquoi |
|---|---|---|---|---|
| Un code précis | « code rejet 0460 051 », « rejet 0270 051 », « 270051 rejet », « code rejet 153 cpam », « prescripteur inconnu dans le répertoire national », « bénéficiaire inconnu en BDO », « ETM non trouvée en BDO » | entrée | **Niche par code, moyenne en cumulé** | Requêtes de ce type déjà visibles en Search Console ; un éditeur fait une page par code ; des PDF CPAM rankent faute de mieux ; des dizaines de codes fréquents |
| La liste | « liste codes rejets noemie » (≈ 110/mois selon la file), « liste code rejet télétransmission », « liste des codes rejets cpam », « code rejet cpam » | hub | **Moyenne** | Revient presque chaque semaine en Search Console, sur l'article actuel |
| La liste par métier | « code rejet pharmacie », « rejet noemie opticien », « rejet cpam dentiste », « codes rejet infirmier » | hub, ancres et filtre par métier | **Niche à moyenne** | Mémos CPAM par profession en page 1 : la demande se découpe par métier |
| Comprendre | « rejet noemie », « retour noemie » (≈ 230/mois selon la file), « télétransmission noémie » (≈ 4 790/mois, intention large), « ARL négatif », « traitement caisse noemie », « motif rejet tiers payant » (≈ 50/mois) | articles (existants et file) | **Moyenne à forte** pour « télétransmission noémie » | Intention « apprendre », pas « un code » : les articles, pas l'outil |
| Côté mutuelle | « rejet mutuelle bénéficiaire inconnu », « rejet mutuelle acte hors périmètre », « rejet mutuelle pharmacie » | articles ; entrée seulement pour un code sourcé | **Niche** | Libellés de plateformes rarement publiés : peu d'entrées « sûres » possibles |

### 3.4 Gabarits

| Élément | Hub `/outils/codes-rejet` | Entrée `/outils/codes-rejet/<code>` |
|---|---|---|
| `<title>` (≤ 60) | « Liste des codes rejet NOEMIE : sens, cause et correction » (56) | « Code rejet {code} : {libellé court}, que corriger » ; si plus de 60 : « Code rejet {code} : {libellé court} ». Ex. « Code rejet 0460 051 : prescripteur inconnu, que corriger » (56) |
| Meta (140 à 160) | « La liste des codes rejet NOEMIE de l'Assurance maladie, code par code : libellé exact, cause probable, correction et métiers concernés, avec la source datée. » (157) | « Code rejet {code} « {libellé} » : ce que la caisse reproche, la cause probable et quoi corriger avant de renvoyer la facture. Source {émetteur}, {année}. » (raccourcir le libellé si plus de 160) |
| H1 | « Codes rejet NOEMIE et télétransmission : la liste, code par code » | « Code rejet {code} : « {libellé officiel} » » |
| Ouverture | Deux phrases : ce qu'est un code rejet, et que le libellé de votre retour fait foi | Deux phrases : ce que la caisse reproche, et la correction la plus probable |

`{libellé court}` : reformulation fidèle du libellé officiel en 30 caractères au plus (« prescripteur
inconnu », « bénéficiaire inconnu en BDO »). Le libellé complet reste dans le H1 et le corps.

**Structure d'une entrée** : réponse en deux phrases ; « L'essentiel » (sens, cause probable, correction,
métiers) ; **le libellé exact par source** (tableau source / date / libellé, pour montrer les écarts entre
caisses) ; « Aussi écrit » (variantes relevées dans les sources : « 270051 », « 0270-051 ») ; causes
probables ; quoi corriger, étape par étape ; ce qu'il ne faut pas faire (renvoyer à l'identique, forcer les
droits lus sur la carte Vitale) ; métiers concernés ; codes voisins et codes souvent confondus ; sources,
« Vérifié le » ; un seul encart Granit.

**Structure du hub** : introduction de 300 à 500 mots propres (comment lire un code, ce qui n'est pas un
rejet, le libellé fait foi) ; recherche (code ou libellé, accepte « 0460051 », « 460051 », « 0460 051 ») ;
tableau complet en HTML (code, libellé, famille, métiers, lien si la page existe), regroupé en ancres par
famille (droits du bénéficiaire, identification, contenu de la facture, transmission : les quatre familles
de l'article) ; sources et dates ; liens vers les articles. **Pas de sous-pages par famille ou par métier**
au départ : des ancres et un filtre (leçon de `/ressources/categorie/rejets`).

**URL et slug**

- `/outils/codes-rejet/<code>`, avec `<code>` = le code tel qu'imprimé par la source principale, chiffres
  groupés par un tiret : « 0460 051 » → `0460-051`.
- Toutes les autres écritures (`0460051`, `460051`, `0460 051`) redirigent en 301 vers `0460-051`.
- Code alphanumérique : minuscules (`a12-3` si un tel code existe dans une source).
- Même numéro dans deux référentiels au sens différent (ARL, motif d'une plateforme) : préfixe du
  référentiel, `arl-<code>`, `<plateforme>-<code>`, seulement une fois le code sourcé.
- Jamais le libellé dans le slug : il change d'une caisse à l'autre, le code non.

### 3.5 Maillage

- **Entrée → hub** : fil d'Ariane (Accueil › Outils › Codes rejet › {code}) et lien « tous les codes de la
  famille {famille} » vers l'ancre du hub.
- **Entrée → voisins** (3 à 6) : même famille, même premier groupe de chiffres (0460 0xx), codes souvent
  confondus (« assuré absent de la BDO » et « bénéficiaire inconnu en BDO »).
- **Entrée → articles** (1 à 3) : `codes-rejets-noemie` (méthode), `rejet-beneficiaire-inconnu` (codes de
  droits), `quand-relancer-mutuelle`, `checklist-prise-en-charge`, `rejet-tiers-payant` (optique), page
  métier `/ressources/metier/<v>`.
- **Entrée → B ou C** selon la correction (voir 2.7).
- **Articles → entrées** : `codes-rejets-noemie` reçoit un bloc « Les codes les plus fréquents » (10 liens)
  et le lien vers le hub ; `rejet-beneficiaire-inconnu` lie les codes de droits ; `reduire-rejets-cpam` et
  `quand-relancer-mutuelle` lient le hub.
- **Fiches plateformes → hub A** dans leur section « rejet » : ce sont les pages qui ont le plus de trafic
  et d'exploration, elles accélèrent la découverte des nouvelles URL.

### 3.6 Données structurées

BreadcrumbList (hub, entrées) ; WebPage avec `dateModified` et `citation` (entrées) ; FAQPage seulement sur
le hub si une FAQ visible y a sa place (3 à 5 questions de la liste 3.2) ; DefinedTermSet facultatif.

### 3.7 Seuil d'une entrée A

En plus des règles communes (2.5) :

- libellé exact lu dans une source officielle ou de référence (mémo CPAM, ameli.fr, cahier des charges
  NOEMIE), avec sa date ;
- sens rédigé + au moins **1 cause probable** + au moins **2 actions de correction concrètes** ;
- au moins **1 métier concerné** nommé par la source ou déduit sans ambiguïté (sinon « tous métiers » n'est
  permis que si la source est un document multi-professions) ;
- un code présent seulement dans un dictionnaire technique, sans cause ni correction publiées : ligne du
  hub, pas de page.

**Ordre de la vague 1** : les codes de droits et d'identification communs à toutes les professions,
présents dans plusieurs mémos (assuré absent de la BDO, bénéficiaire inconnu dans la BDO, assuré non géré
par la caisse, prescripteur inconnu, exonération non trouvée ou non transmise, écart de taux), puis les
codes que le lexique opticiens de la CPAM de Loire-Atlantique classe parmi les plus fréquents (à retrouver
à la source, la version lue est une copie studylib).

---

## 4. Outil C · Mutuelle → portail de tiers payant

### 4.1 Ce que le site a déjà

| Page(s) | Requête visée | Ce qu'elle fait | Risque face à l'outil |
|---|---|---|---|
| 24 fiches `/ressources/portail-<mutuelle>` publiées le 06/11 (Aésio, Alan, Allianz, Apicil, April, Generali, Groupama, Harmonie Mutuelle, Intériale, Klesia, MAAF, Malakoff Humanis, Matmut, MGEN, MMA, MNT, Mutuelle Familiale, Prévifrance, Pro BTP, Solimut, Swiss Life, Viasanté, plus Kalixia et Carte Blanche) | « {mutuelle} tiers payant » | Portail annoncé, portail relevé, libellé du sélecteur, réseau, sources, contact. Données dans `content/plateformes/<slug>.json` (`acces`, `identite`, `aiguillage` par métier, `faits`) | **Très fort** : c'est déjà la page d'entrée de C, en optique |
| 9 fiches plateformes et réseaux publiées en octobre `/ressources/portail-<plateforme>` (Viamedis, Almerys, iSanté, SP Santé, Itelis, Actil, Santéclair, Sévéane, Oxantis), plus Carte Blanche et Kalixia publiées le 06/11 | « {plateforme} tp » | Connexion, PEC, paiement ; certaines listent les mutuelles du sélecteur | Moyen : elles portent « quelles mutuelles passent par X » |
| `/ressources/mutuelle-quel-portail` | numéro amc c'est quoi | Numéro AMC, carte, et « notre outil mutuelle → portail » de 281 mutuelles **qui n'existe pas sur le site** | Fort : son titre H1 promet l'outil |
| `/ressources/portails-tiers-payant` (pilier) | portail tiers payant opticien | Ce qu'est un portail, comment travailler sur plusieurs | Faible |
| `/ressources/categorie/plateformes` | | L'annuaire des fiches (composant `Annuaire`) | Moyen : premier brouillon du hub |
| `/ressources/checklist-prise-en-charge`, `/ressources/rejet-beneficiaire-inconnu` | | Renvoient déjà vers `mutuelle-quel-portail` | Faible |

Déjà visibles en Search Console : surtout des requêtes « plateforme → connexion » (espace pro, PEC, tp),
déjà servies par les fiches plateformes ; et, en longue traîne, des requêtes « mutuelle → portail »
(« harmonie mutuelle viamedis », « code amc harmonie mutuelle », « harmonie mutuelle partenaire
opticien », « mgen accolade », « carte tiers payant malakoff humanis », « alan opticien partenaire »),
des recherches **par numéro AMC** (« amc » suivi d'un numéro, « numero amc » suivi d'un nom) et
« portail mutuelle », « amc portail ». Le guide du moteur cite déjà « l'outil mutuelle → portail » comme
page transverse, et 54 liens internes de la file visent `mutuelle-quel-portail`.

**Recommandation : une seule URL par mutuelle**

- **Option a (recommandée)** : les pages d'entrée de C **sont** les fiches `/ressources/portail-<mutuelle>`.
  On les enrichit d'un tableau « Portail par métier » nourri par les données de C ; les nouvelles mutuelles
  qui passent le seuil reçoivent une fiche du même gabarit. Le hub `/outils/mutuelle-portail` est
  l'annuaire complet et la recherche, et lie chaque mutuelle à sa fiche. Avantages : aucune page en double,
  on garde des URL déjà découvertes par Google, le gabarit, l'annuaire, le sitemap et `llms.txt` existent.
- **Option b** : `/outils/mutuelle-portail/<mutuelle>` pour les seules mutuelles sans fiche. Deux schémas
  d'URL pour le même type de page : acceptable seulement avec le même gabarit et des liens croisés.
- **À ne jamais faire** : deux URL pour la même mutuelle. Si l'on veut un jour tout sous `/outils`, migrer
  toutes les fiches en une fois, en 301, après leur indexation.
- Le brief prévoit `/outils/mutuelle-portail/<mutuelle>` : l'option a s'en écarte volontairement, à
  trancher à la relecture.

**Partage avec les articles**

| Intention | Page qui la porte |
|---|---|
| « quel portail pour quelle mutuelle », « portail mutuelle », « liste des mutuelles par portail » | hub `/outils/mutuelle-portail` |
| « {mutuelle} tiers payant (opticien, dentiste, pharmacie) », « {mutuelle} {plateforme} », « code amc {mutuelle} » | fiche de la mutuelle |
| « {plateforme} liste mutuelles », « quelle mutuelle {plateforme} » | fiche de la plateforme, section « Quelles mutuelles passent par {plateforme} », nourrie par C |
| « numéro AMC c'est quoi », « où trouver le numéro AMC », « liste des AMC » | article `mutuelle-quel-portail` : changer son H1 vers « Numéro AMC : c'est quoi, où le lire sur la carte ? » (50) et remplacer la section « Comment lire le résultat de notre outil » par un lien vers le hub |
| « portail tiers payant opticien », « pourquoi plusieurs portails » | pilier `portails-tiers-payant` |
| « {plateforme} espace pro / connexion / pec » | fiches plateformes (inchangé) |

### 4.2 Ce que montrent les résultats de recherche

Requêtes lues : « viamedis liste mutuelles », « quelle mutuelle passe par almerys », « MGEN tiers payant
opticien quel portail », « harmonie mutuelle tiers payant opticien portail », « numéro AMC mutuelle c'est
quoi ».

| Qui ranke | Type de page | Format |
|---|---|---|
| compareil.fr, cmamutuelle.fr, mutuelle-seniors-info.fr, masantepratique.fr (« Liste des mutuelles Almerys »), mutuellefr.info, aayassur.com, elly-assurance.fr, annuaire-mutuelle.net, comparateur-assurances.net, mystarweb.fr, lydexperience.fr, technolafargue.fr, vite-un-avocat.fr, baticef.fr, nuxii.fr, ariam.fr | Comparateurs, courtiers, sites éditoriaux grand public | Listes « mutuelles partenaires de X », non datées, pensées pour l'assuré |
| be-almerys.com | Page officielle « mutuelles » | Discours commercial, sans liste par métier |
| optibot.fr | Pages par plateforme (« OptiBot × Viamedis ») et glossaire | Pages éditeur pour opticiens : concurrent direct sur le public pro |
| acuite.fr, mnt.fr, ivoirnet.com | Presse pro, communiqués | Changements d'opérateur (MGEN, Oxantis) |
| selectra.info, alan.com, april.fr, sidecare.com, lecomparateurassurance.com, forum-assures.ameli.fr | Numéro AMC | Définitions côté assuré |
| getgranit.ai | `portail-mgen`, `portail-viamedis`, `portail-oxantis` | Déjà présentes sur « MGEN tiers payant opticien » |

**Ce qui manque**

- Le sens « mutuelle → portail » **par métier** pour le professionnel, daté et sourcé. Les listes grand
  public vont dans l'autre sens (plateforme → mutuelles) et se contredisent : le nombre de complémentaires
  annoncé pour Viamedis va d'environ 75 à plus de 250 selon les pages.
- Les changements récents : fermeture d'Oxantis le 26/10/2026, reprise par Viamedis, passage de la MGEN.
- Les libellés exacts à choisir dans le sélecteur du portail.
- Quoi faire quand la carte dit autre chose que la liste, ou quand la mutuelle est introuvable.

**Questions relevées**

- Comment savoir si une mutuelle passe par Viamedis, Almerys, SP Santé ?
- Quelles mutuelles utilisent Viamedis ? Almerys ?
- Où trouver le numéro AMC sur la carte ? Qu'est-ce que le numéro AMC ?
- Une mutuelle peut-elle passer par plusieurs portails ?
- Que faire si la mutuelle n'apparaît dans aucun portail ?
- La liste des mutuelles d'une plateforme change-t-elle ?

### 4.3 Requêtes cibles et demande

| Intention | Exemples | Page | Demande estimée | Pourquoi |
|---|---|---|---|---|
| Trouver le portail d'une mutuelle | « {mutuelle} tiers payant », « {mutuelle} tiers payant opticien », « {mutuelle} opticien partenaire », « {mutuelle} viamedis », « carte tiers payant {mutuelle} » | fiche mutuelle | **Niche par mutuelle, moyenne en cumulé** | Déjà visibles en Search Console sur plusieurs mutuelles ; des centaines d'organismes |
| Lister les mutuelles d'une plateforme | « viamedis liste mutuelles », « quelle mutuelle almerys », « mutuelles partenaires sp santé » | fiche plateforme (section) + hub filtré | **Moyenne** | Une quinzaine de pages grand public se disputent ces requêtes |
| Trouver par numéro AMC | « amc {numéro} », « numéro amc {mutuelle} », « code amc {mutuelle} » | recherche du hub ; numéro sur la fiche si une source publique le donne | **Niche** | Requêtes de ce type déjà visibles en Search Console |
| Comprendre | « numéro amc c'est quoi » (≈ 1 300/mois selon la file), « liste des amc », « portail tiers payant opticien » (≈ 1 930/mois), « portail mutuelle » | articles | **Moyenne** | Intention « apprendre » |
| Se connecter à une plateforme | « viamedis tp » (≈ 24 910/mois selon la file), « almerys tp » (≈ 24 270/mois), « {plateforme} espace pro » | fiches plateformes existantes | **Forte** | Le gros du trafic actuel ; pas le rôle de l'outil, qui doit seulement y renvoyer |

### 4.4 Gabarits

| Élément | Hub `/outils/mutuelle-portail` | Entrée (fiche mutuelle) |
|---|---|---|
| `<title>` (≤ 60) | « Quel portail pour quelle mutuelle ? Tiers payant par métier » (59) | Deux métiers sourcés ou plus : « {Mutuelle} tiers payant : le portail, métier par métier » ; si plus de 60 : « {Mutuelle} tiers payant : portail par métier » (ex. Malakoff Humanis, 50). Optique seule : garder le titre actuel de la fiche |
| Meta (140 à 160) | « Quel portail de tiers payant pour quelle mutuelle ? Cherchez la complémentaire : portail par métier, libellé à choisir, date du relevé et source. » (145) | « {Mutuelle} : quel portail de tiers payant, métier par métier ? Le portail annoncé, le libellé à choisir, la date du relevé et quoi faire si la carte diffère. » (ajuster au nom) |
| H1 | « Quel portail de tiers payant pour quelle mutuelle ? » | « {Mutuelle} tiers payant : quel portail, métier par métier ? » |

**Structure du hub** : deux phrases de réponse (la carte de tiers payant tranche ; l'annuaire dit où
chercher en premier) ; recherche par nom ou numéro AMC ; filtres métier et plateforme ; **liste A à Z
complète en HTML** (mutuelle, portail par métier, date du relevé, lien vers la fiche si elle existe) ;
encadré « changements récents » (Oxantis, MGEN) ; méthode « de la carte au portail » ; sources.

**Structure d'une fiche** : ce qui existe aujourd'hui, plus un tableau « Portail par métier » (métier,
portail, libellé du sélecteur, source, date) ; « si la carte dit autre chose » ; voisins.

**URL et slug** (option a) : `/ressources/portail-<slug>`, `<slug>` = nom usuel de l'organisme en
minuscules, sans accents ni forme juridique, mots séparés par des tirets, identique au fichier
`content/plateformes/<slug>.json` (`harmonie-mutuelle`, `malakoff-humanis`, `mgen`). Une page par
organisme complémentaire, pas par libellé de sélecteur ni par contrat (« MGEN SOLUTION », « Ma Mutuelle
MGEN » restent dans la page MGEN). Fusion ou changement de nom : 301 vers la page du nouvel organisme, avec
une mention. En option b, même règle de slug sous `/outils/mutuelle-portail/`.

### 4.5 Maillage

- Fiche mutuelle ↔ fiche(s) de sa plateforme (`portail-viamedis`…) ↔ hub.
- Voisins : même groupe (ex. Harmonie Mutuelle, MGEN, MNT pour le Groupe VYV), même plateforme, même
  réseau (Kalixia, Santéclair, Itelis…).
- Articles : `mutuelle-quel-portail` (AMC), `portails-tiers-payant`, `checklist-prise-en-charge`,
  `rejet-beneficiaire-inconnu`.
- Outils : B (part mutuelle), A (rejets côté complémentaire).
- Les 54 liens de la file qui visent « l'outil mutuelle → portail » via `mutuelle-quel-portail` pointent
  vers le hub une fois en ligne, quand l'ancre parle de l'outil.

### 4.6 Données structurées

BreadcrumbList ; WebPage avec `dateModified` et `citation` ; sur les fiches, le `about` Organization que
`blogPostingLd` pose déjà. Dataset facultatif sur le hub.

### 4.7 Seuil d'une entrée C

En plus des règles communes (2.5) :

- au moins **un portail pour un métier** en statut `"sur"`, appuyé sur une source publique (page de la
  mutuelle ou de la plateforme, presse professionnelle datée) ou sur un relevé daté et décrit ;
- comment le vérifier sur la carte, et quoi faire si la mutuelle est introuvable ;
- une mutuelle connue seulement comme libellé d'un sélecteur, sans aucune source publique : ligne du hub,
  pas de page.

**Ordre de la vague 1** : enrichir les 22 fiches mutuelles existantes (tableau par métier), puis 15 à 20
nouvelles mutuelles parmi celles déjà cherchées et celles des grands groupes.

---

## 5. Outil B · Remboursement (V0 optique)

### 5.1 Ce que le site a déjà

| Page | Requête visée | Ce qu'elle fait | Risque face à l'outil |
|---|---|---|---|
| `/ressources/ticket-moderateur-2027-tiers-payant` | ticket modérateur 2027 | Décrets d'août 2026, part Sécu dentaire 2027 | Faible : « comprendre une réforme » ; à lier aux pages dentaires |
| `/ressources/dentaire-paniers-100-sante-tiers-payant` | panier 100 santé dentaire | Paniers, devis, rejets | Moyen quand B couvrira le dentaire |
| `/ressources/reste-a-charge-drees-expliquer-devis` | reste à charge drees | Expliquer un devis | Faible |
| `/ressources/refus-pec-verres-myopie-miyosmart-courrier` | refus prise en charge verres myopie | Contestation | Faible |
| `/ressources/audioprothese-renouvellement-tiers-payant`, `/ressources/orthodontie-facturation-traitements-longs`, `/ressources/tiers-payant-opticien` | | Guides métier | Faible |

Search Console : presque aucun signal sur ce territoire (seules des requêtes de cotation dentaire et de
devis, loin dans les résultats). Le site n'a pas encore de page qui ranke sur « base de remboursement »,
« code LPP » ou « CCAM ». La demande de B se lit dans les résultats de recherche et dans la file.

### 5.2 Ce que montrent les résultats de recherche

Requêtes lues : « base de remboursement verres classe A », « code LPP monture », « remboursement couronne
dentaire sécu », « ticket modérateur optique classe A », « code LPP 2222124 », « HBLD634 », « verres classe
A V01 V02 ».

| Qui ranke | Type de page | Format |
|---|---|---|
| selectra.info, jechange.fr, magnolia.fr, mutuellefacile.com, partner-assurances.com, assurances.fm, arkendia.com, mutuelle-sante-guide.fr, la-revue-sante.fr, accrosante.com, kf-finances.com, skarlett.fr, mutuelles-comparateur.fr, lecomparateurassurance.com | Comparateurs et courtiers | Guides grand public, tableaux d'exemples, liens vers un devis de mutuelle |
| laboradental.fr | **Une page par code CCAM** (`/codes-ccam/hbld073`…), tableaux par couronne, version CCAM, tarifs au 01/01/2026, 2027 | Le modèle à suivre pour le dentaire |
| sante-clarte.fr, sidecare.com, aideaucodage.fr | Pages par code CCAM | Pages par code, plus ou moins riches |
| mutualib.fr | Simulateur **par code LPP individuel** (une page par code fabricant) | Beaucoup de pages, peu de texte |
| gifo.org, optikia.com, optibot.fr, acuite.fr, opticien-lunetier.media, prooptic.axess.fr, sesam-vitale.fr (fiche 183, codes de regroupement V01 à V04) | Codes LPP optique, côté profession | PDF, articles, glossaires |
| ameli.fr (professionnel de la LPP) | Actualités (ex. supplément de 42 € sur un équipement complet de classe A) | Page officielle |
| mavuemeslunettes.fr, lindice-opticien.fr | Sites d'opticiens et éditoriaux | Guides |

**Ce qui manque**

- Des chiffres fiables : d'une page à l'autre, le taux dentaire annoncé varie (60 % ou 70 %), la base
  d'une monture de classe B aussi (0,05 € ou 2,84 €), et les plafonds de classe A sont donnés tantôt pour
  les verres seuls, tantôt pour l'équipement complet, avec des montants qui ne concordent pas toujours.
  Une page datée, sourcée sur la base officielle, se distingue tout de suite.
- La vue du professionnel : quoi mettre sur le devis et la facture (code de regroupement sur le devis, code
  individuel sur la feuille de soins, selon Optikia et le GIFO), quels rejets suivent une erreur de code.
- L'optique par code LPP : seul mutualib publie une page par code, sans explication.
- Ce qui change en 2027 (décret 2026-809 pour le dentaire, cité par laboradental et par notre article).

**Questions relevées**

- Combien rembourse la Sécurité sociale pour une monture, un verre, une couronne ?
- Quelle base de remboursement pour une monture de classe A ou de classe B ?
- Peut-on panacher classe A et classe B ? (les pages lues se contredisent sur les verres)
- Quel est le prix limite de vente d'une monture de classe A ?
- Quelle différence entre code de regroupement et code individuel ?
- Le ticket modérateur dentaire change-t-il en 2027 ?
- Qui peut facturer le supplément de classe A ?

### 5.3 Requêtes cibles et demande

| Intention | Exemples | Page | Demande estimée | Pourquoi |
|---|---|---|---|---|
| Un code précis | « code lpp 2222124 », « code lpp monture classe a », « hbld634 », « code ccam hbld073 » | entrée | **Moyenne pour le CCAM dentaire, niche pour le LPP optique** | Au moins quatre sites font une page par code CCAM : la demande existe ; en optique, surtout des professionnels et des éditeurs |
| Combien rembourse (question du patient, posée au comptoir) | « base de remboursement verres classe A », « remboursement monture sécu », « remboursement couronne dentaire sécu » | entrée par code + hub | **Forte mais grand public** | « lunettes 100 santé » ≈ 6 180/mois selon la file ; page 1 tenue par des comparateurs : viser la longue traîne professionnelle, pas la tête de requête |
| Comprendre une règle | « 100 % santé classe A B », « panachage classe A classe B », « ticket modérateur 2027 dentaire », « code de regroupement LPP » | articles | **Moyenne** | Articles existants ou dans la file |
| Calculer | « calcul remboursement optique », « simulateur remboursement couronne » | hub interactif, calcul prérempli sur l'entrée | **Moyenne** | Simulateurs existants (mutualib, comparateurs) |
| Pharmacie (CIP) | « remboursement {médicament} » | pas de page en V0 | Forte mais hors de portée | Base publique des médicaments et sites spécialisés en place ; des milliers de pages quasi identiques |

### 5.4 Gabarits

| Élément | Hub `/outils/remboursement` | Entrée LPP | Entrée CCAM (après la V0) |
|---|---|---|---|
| `<title>` (≤ 60) | V0 : « Remboursement optique par code LPP : base, taux, mutuelle » (57). Plus tard : « Remboursement par code LPP ou CCAM : base Sécu et mutuelle » (58) | « Code LPP {code} : {désignation courte}, remboursement » | « {CODE} : {acte court}, base et remboursement » (le code en tête : on cherche « hbld634 ») |
| Meta (140 à 160) | « Base de remboursement Sécu, taux, ticket modérateur et part mutuelle pour chaque code LPP d'optique, 100 % Santé compris, avec le tarif daté et sa source. » (154) | « {Désignation} (code LPP {code}) : base de remboursement, taux, part Sécu, ticket modérateur et part mutuelle. Tarif lu dans la base LPP au {date}. » | Même phrase, « (code CCAM {CODE}) » et « dans la CCAM au {date} » |
| H1 | « Base de remboursement et part mutuelle, code par code » | « Code LPP {code} : {désignation officielle} » | « {CODE} : {libellé CCAM} » |

**Structure d'une entrée** : réponse en deux phrases avec les chiffres ; tableau (base, taux, montant de la
Sécu, ticket modérateur, prix limite de vente ou honoraire limite, part minimale de la mutuelle pour un
contrat responsable, reste à charge en 100 % Santé), avec date d'effet et source ; « ce qui change au
1er janvier 2027 » si une source le dit ; « sur le devis et la facture » (code de regroupement, code
individuel, panachage) ; rejets liés (A) ; voisins ; calcul prérempli ; sources, « Vérifié le ». Si le code
générique n'est plus facturable tel quel (montures : codes individuels obligatoires depuis le
1er juillet 2021 selon L'OL MAG et Optikia, à vérifier par l'agent B), la page le dit dès l'ouverture.

**URL et slug** : `/outils/remboursement/<nomenclature>-<code>` en minuscules : `lpp-2222124`,
`ccam-hbld634`. Pas de page par code individuel fabricant (des milliers, contenu identique) : la recherche
les accepte et renvoie vers la description générique. Pas de page par CIP en V0. Codes de regroupement
(V01 à V04…) : section du hub ; page seulement si la demande se confirme.

### 5.5 Maillage

- Entrée ↔ voisins : même description en classe A et B, même tranche de correction, adulte et enfant ; en
  dentaire, même dent ou même panier.
- Entrée ↔ hub ↔ articles (`ticket-moderateur-2027-tiers-payant`, `reste-a-charge-drees-expliquer-devis`,
  `dentaire-paniers-100-sante-tiers-payant`, `refus-pec-verres-myopie-miyosmart-courrier`,
  `audioprothese-renouvellement-tiers-payant`, et `100-sante-classe-a-b-opticien` à sa publication).
- Outils : A (rejets de taux ou de code), C (où faire la PEC de la part mutuelle).

### 5.6 Données structurées

BreadcrumbList ; WebPage avec `dateModified` et `citation` (la base LPP ou CCAM consultée). Pas de
`Product` ni d'`Offer` : on ne vend rien.

### 5.7 Seuil d'une entrée B

En plus des règles communes (2.5) :

- code présent dans la base officielle (LPP ou CCAM de l'Assurance maladie), base et taux lus à une date,
  date d'effet connue ;
- statut 100 % Santé ou panier, et prix limite ou honoraire limite quand il existe ;
- un texte propre sur ce que le professionnel vérifie (devis, facture, rejets, panachage) ;
- code fermé sans usage actuel, code individuel fabricant : pas de page.

**Vague 1 (V0 optique)** : montures adulte et enfant de classe A et B, verres de classe A par tranche,
suppléments les plus courants.

---

## 6. Articles de la file à ajuster

| Article (statut `pending` sauf mention) | Requête | Ce qui change avec les outils |
|---|---|---|
| `sigles-tiers-payant-noemie` | télétransmission noémie (≈ 4 790/mois) | Reste « comprendre » ; lien vers le hub A ; ne liste pas de codes |
| `retour-noemie-sans-virement` | retour noemie (≈ 230/mois) | « Traitement caisse », absence de retour ; lien vers le hub A |
| `glossaire-tiers-payant` | glossaire tiers payant | Lien vers les trois hubs |
| `rejet-mutuelle-pharmacie`, `rejet-mutuelle-acte-hors-perimetre`, `refacturer-part-mutuelle`, `prise-en-charge-refusee`, `reduire-taux-rejet-tiers-payant` | côté mutuelle | Liens vers les entrées A quand un code est sourcé |
| `justificatifs-cpam-officine-reponses-indu` | (cluster : « accusé de réception logique ARL ») | ARL : lien vers le hub A |
| `100-sante-classe-a-b-opticien` | lunettes 100 santé (≈ 6 180/mois) | « Comprendre » ; les montants par code restent dans B, l'article y renvoie |
| `devis-normalise-codes-lpp`, `codes-lpp-individuels-2027-eviter-rejets`, `codes-lpp-audioprothese-facturation`, `aides-auditives-css-tiers-payant` | codes LPP | Article sur la facturation ; pas de tableau de tarifs en double avec B |
| `amo-amc` | part amc (≈ 2 330/mois) | Lien vers le calcul de B |
| `controle-cotations-ccam-centres-dentaires-checklist` | contrôle cotation CCAM | Lien vers B dentaire quand il existera |
| `inter-amc-tiers-payant-complementaire`, `idb-clc-roc-tiers-payant`, `pec-dentaire-portails-mutuelles`, `pec-audio-plateformes-tiers-payant` | AMC, PEC par métier | Liens vers le hub C et les fiches mutuelles |
| `contacts-plateformes-tiers-payant` (`review`) | viamedis contact | Lien depuis les fiches mutuelles (« contacter la plateforme ») |

---

## 7. Sources consultées le 18/11/2026

Site et dépôt :

- `granit-landing-page` : `content/ressources/*.json`, `content/plateformes/*.json`,
  `scripts/seo-engine/articles-queue.json`, `scripts/seo-engine/BLOG_CMS_granit.md`, `TON.md`,
  `src/lib/seo.ts`, `src/lib/ressources/seo.ts`, `src/components/JsonLd.tsx`, `src/components/Seo.tsx`,
  `src/components/ressources/Annuaire.tsx`, `src/routes/outils.tri-des-marques.tsx`,
  `src/routes/ressources.$slug.tsx`, `scripts/gen-sitemap.mjs`.

Google :

- Google Search Central, journal des mises à jour de la documentation :
  https://developers.google.com/search/updates (FAQ : retrait du résultat enrichi le 7 mai 2026 et de la
  documentation en juin 2026 ; Dataset réservé à Dataset Search ; fil d'Ariane sur ordinateur seulement
  depuis janvier 2025)
- https://developers.google.com/search/blog/2023/08/howto-faq-changes

A · codes rejet :

- https://www.ameli.fr/medecin/exercice-liberal/accompagnement-l-installation/l-accompagnement-dans-la-premiere-annee-d-exercice/les-rejets-de-facturation-et-les-solutions-en-cas-de-rejet (26/01/2026)
- https://www.ameli.fr/assure/documentation-technique/norme-noemie
- https://www.ameli.fr/sites/default/files/memo_infirmiers_rejets_ok.pdf
- https://www.ameli.fr/sites/default/files/memo_ets_prives_rejets.pdf
- https://www.ameli.fr/sites/default/files/memo_ets_publics_rejets.pdf
- https://www.ameli.fr/sites/default/files/cpam-basrhin_rejets-medecins.pdf
- https://www.ameli.fr/sites/default/files/cpam-basrhin_glossaire-rejets-pharmaciens.pdf
- https://local.pastel.cpam-isere.fr/wp-content/uploads/2024/12/20230830_MemoPS_facturation-pharmaciens.pdf
- https://www.cpam-bordeaux.fr/newsletter/2016/images/images_1216/MEMO_INFIRMIERS_REJETS_OK.pdf
- https://studylibfr.com/doc/7241182/lexique-des-rejets-opticiens_plaquette-4-pages.qxp (copie, original à retrouver)
- https://static.televitale.org/pdf/060%20-%20Dictionnaire%20rejet%20IRIS.pdf
- https://www.prooptic-idm.com/wiki/wp-content/uploads/2015/05/traite_DOCAMOAMC.pdf
- https://laruche.cbainfo.fr/gerer-cabinet-infirmier/facturation-idel/code-rejet-153-cpam/
- https://laruche.cbainfo.fr/gerer-cabinet-infirmier/facturation-idel/rejets-noemie/
- https://swily.io/guide/rejets-noemie-infirmier
- https://www.azurparafac.fr/rejets-cpam-infirmier-liberal/
- https://www.soutiain.fr/rejet-teletransmission-cpam-correction/
- https://www.agatheyou.fr/vos-questions/motifs-rejet-tiers-payant/
- https://www.sapsante.com/a-propos/3402146_rejets-tiers-payant-noemie-scor-concentrateurs-et-cession-d-officine-l-interview-croisee-d-auriane-et-nicolas-caudmont
- https://www.caducee.net/actualite-medicale/16904/rejets-fse-et-retours-noemie-causes-delais-et-methode-anti-pertes-pour-le-cabinet-liberal.html

B · remboursement :

- https://laboradental.fr/codes-ccam-prothese-dentaire et https://laboradental.fr/guide/remboursement-prothese-dentaire-2026
- https://sante-clarte.fr/hbld634-code-acte-dentaire-tarif-remboursement-couronne-ceramique/
- https://www.sidecare.com/code-ccam/hbld634-pose-d-une-couronne-dentaire-dentoportee-ceramometallique-sur-une-incisive-une-canine-ou-une-premiere-premolaire
- https://www.aideaucodage.fr/ccam-hbld634
- https://mutualib.fr/simulateur/calcul_remboursement_biens_medicaux.php?lpp=7227824&nom=optique,+monture+adulte+de+classe+a,mpl+vision
- https://gifo.org/app/uploads/2020/06/20200727-GIFO-FAQ-Code-LPP-code-fabricant-code-de-regroupement_MAJ.pdf
- https://optikia.com/blog/code-lpp-optique-fabricant-regroupement
- https://opticien-lunetier.media/2021/12/16/codes-lpp-ce-qui-change-pour-loptique-au-1er-janvier-2022/
- https://www.sesam-vitale.fr/documents/20195/20692/Fiche+n%C2%B0+183/dacd74a9-066e-421d-943c-a6c9f4d7e35b
- https://www.ameli.fr/professionnel-de-la-lpplatm/actualites/supplement-tarifaire-de-42-eu-sur-les-equipements-optiques-de-classe-qui-peut-en-beneficier
- https://selectra.info/assurance/mutuelle-sante/remboursement/lunettes
- https://www.jechange.fr/assurance/mutuelle-sante/remboursement/lunettes
- https://www.assurances.fm/remboursement-couronne-dentaire/
- https://www.mutuelles-comparateur.fr/remboursement-mutuelle-sante/mutuelle-optique-dentaire/lunettes
- https://www.magnolia.fr/mutuelle-sante/remboursement/optique/verre-progressif

C · mutuelle → portail :

- https://www.be-almerys.com/mutuelles
- https://www.compareil.fr/guide/mutuelle-sante/mutuelle-viamedis
- https://www.cmamutuelle.fr/mutuelles/viamedis.html
- https://masantepratique.fr/mutuelles-almerys/
- https://mutuelle-seniors-info.fr/espaces-adherents-mutuelles-7704-comment-acceder-a-la-liste-des-mutuelles-partenaires-du-reseau-viamedis
- https://optibot.fr/mutuelles/viamedis
- https://www.acuite.fr/actualite/ocam/224229/la-mgen-modifie-son-contrat-de-tiers-payant
- https://www.mnt.fr/articles/groupe-vyv-facilite-gestion-tiers-payant
- https://selectra.info/assurance/mutuelle-sante/numero-amc
