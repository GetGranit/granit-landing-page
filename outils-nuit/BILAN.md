# Outils de nuit · bilan du 18 au 19/11/2026

Trois outils gratuits pour getgranit.ai, construits sur des données publiques, chacun dans
sa PR brouillon. Rien n'est fusionné ni mis en ligne. Les trois PR partent du même commit de
socle (`2203351`) : fusionner l'une l'apporte, les deux autres restent fusionnables sans
conflit (sauf `src/routeTree.gen.ts`, à régénérer par `npm run build`).

| Outil | PR | État | Pages publiées | CI |
|---|---|---|---|---|
| A · Codes rejet | [#166](https://github.com/GetGranit/granit-landing-page/pull/166) | partiel | hub + 20 codes NOEMIE | verte |
| B · Remboursement | [#168](https://github.com/GetGranit/granit-landing-page/pull/168) | prêt, sous réserve de 3 décisions | hub + 7 groupes (optique, audio) | verte |
| C · Mutuelle → portail | [#167](https://github.com/GetGranit/granit-landing-page/pull/167) | partiel | hub (54 complémentaires) + 1 page | verte |

Chaque PR contient une fiche de relecture : 10 entrées tirées au sort et confrontées à leur
source, ce qui a été corrigé, l'avocat du diable, tests, build et check-marque.

## A · Codes rejet ([#166](https://github.com/GetGranit/granit-landing-page/pull/166)) : partiel

- **Entrées** : 27 codes NOEMIE sûrs dans le hub, dont 20 avec leur page (seuil de contenu de
  100 mots propres). 92 entrées « à vérifier » ne sont publiées nulle part. Les 83 ARL et
  messages de service SESAM-Vitale sont tenus hors du dépôt (voir décision 1).
- **Sources** : mémos CPAM et pages ameli.fr datés de 2016 à 2026, détail dans
  `outils-nuit/A/sources.md`. Chaque page affiche la caisse, la date et « le libellé de votre
  retour fait foi ».
- **Décisions pour Paul** :
  1. Tables du GIE SESAM-Vitale (ARL, messages de service) : son cahier des charges demande un
     accord pour toute reproduction. Trois options : demander l'accord, publier une page par
     code avec une citation courte, ou garder fermé. Les tables ne sont plus dans les
     fichiers de la branche, mais elles restent dans des commits antérieurs de la PR. Une
     fusion en squash suivie de la suppression de la branche les retire de `main` ; pour les
     effacer tout de suite de l'historique, il faut reconstruire la branche.
  2. Partage de la requête « liste » avec l'article `codes-rejets-noemie`, déjà en tête :
     retitrer l'article, et choisir la promesse du hub (« la liste, code par code » ou « les
     codes les plus courants », plus juste pour 27 codes).
  3. Seuil de contenu et vague : 100 mots propres par page, 20 pages en vague 1.
- **Risques** : cannibalisation avec l'article existant ; sources CPAM parfois anciennes
  (2016-2019) ; aucun code LPP optique n'est « sûr », donc l'outil reste faible pour les
  opticiens et audioprothésistes.

## B · Remboursement ([#168](https://github.com/GetGranit/granit-landing-page/pull/168)) : prêt, sous réserve des décisions

- **Entrées** : 7 pages de groupe (verres, montures, aides auditives) et un hub qui trouve les
  209 codes LPP sûrs. 627 adresses de code redirigent en 301 vers leur ligne. Dentaire (31
  actes sûrs) et pharmacie (23 médicaments sûrs) sont présents dans les données, fermés par une
  constante.
- **Sources** : base LPP de l'Assurance Maladie v910 du 13/11/2026, ameli.fr, Légifrance
  (R871-2, R160-5, décrets 2026-809, 2026-810, 2026-811 du JO du 22/08/2026). Les 209 codes
  ont été recoupés avec la base retéléchargée. Chaque montant porte la date de sa source.
- **Mise à jour** : `outils-nuit/B/scripts/maj.py` retélécharge les bases et régénère les
  données. Quand l'Uncam publie le taux 2027, il suffit de renseigner `TAUX_2027` dans
  `src/lib/outils/remboursement/publication.mjs`.
- **Décisions pour Paul** :
  1. Granularité : 7 pages de groupe plutôt qu'une page par code (sinon des centaines de pages
     quasi identiques).
  2. Périmètre : optique et audio seulement, ou ouverture du dentaire et de la pharmacie.
  3. Bandeau 2027 et règle « sans taux publié, aucun montant Sécu affiché à partir du
     01/01/2027 ».
- **Risques** : si le taux 2027 n'est pas publié à temps, les montants Sécu disparaissent le
  01/01/2027 (surveiller le JO dès décembre) ; l'article `ticket-moderateur-2027-tiers-payant`
  ne cite que le décret dentaire et doit être corrigé ; la première page Google est tenue par
  des comparateurs de mutuelles.

## C · Mutuelle → portail ([#167](https://github.com/GetGranit/granit-landing-page/pull/167)) : partiel

- **Entrées** : un hub avec les 54 complémentaires dans le HTML, filtrables par métier et par
  opérateur. 42 ont au moins un métier sûr. Une seule mutuelle passe le seuil et a sa page
  (Mutualia). 22 renvoient en 301 vers leur fiche `/ressources/portail-*` existante, 31 vers
  leur ligne dépliée du hub. Seuls les couples métier → opérateur sûrs sont affichés comme une
  réponse.
- **Sources** : listes publiques de SP santé et d'iSanté (métiers et dates), pages
  professionnelles des mutuelles, détail dans `outils-nuit/C/sources.md`. Chaque réponse
  rappelle que la carte de tiers payant du patient fait foi. Les correspondances qui n'ont
  pas de source publique ne sont pas publiées.
- **Décisions pour Paul** :
  1. Réutilisation des listes : les CGU d'iSanté interdisent toute reproduction sans
     autorisation, et celles de SP santé ne se chargent pas. Trois options : demander
     l'accord, publier sans libellés ni numéros AMC, ou publier en l'état.
  2. Où vit la page d'une mutuelle : enrichir les fiches `/ressources/portail-*` ou faire des
     pages d'outil. Il faut aussi aligner 9 fiches qui contredisent les listes publiques
     (MGEN, Klesia, LMF, April, MMA, Aésio, Generali, Groupama, et les « 281 mutuelles » de
     `mutuelle-quel-portail`).
  3. Seuil de mots : à 100, une seule page ; à 85, 3 pages ; à 70, 5 pages.
- **Risques** : cannibalisation avec `mutuelle-quel-portail`, déjà en tête ; la MGEN change
  d'opérateur au 30/11/2026, phrase à relire le 01/12/2026.

## Pour les trois

- **Maillage pas encore posé** : le contrôle du moteur SEO (`seo-verifier-articles.yml`,
  `ciblesDeLiens`) refuse les liens d'articles vers `/outils/…`. Les 3 liens de chaque outil
  sont listés « à poser » dans sa PR (article, endroit, phrase exacte). Il faut d'abord une
  PR du moteur qui ajoute les pages des outils aux cibles permises.
- **Pages indexées** (pas de noindex), déclarées au sitemap et à `llms.txt` par le socle.
- **Mesure** : à la date de fusion + 4 semaines, impressions et clics des pages `/outils/*`
  dans le relevé Search Console du dépôt internal (`seo/data/gsc/`).
- **Hors du dépôt public** : les écarts avec le code produit, les chiffres Search Console et
  la copie complète des tables du GIE ne sont pas dans ces PR.
- **Articles à corriger** (relevés cette nuit, non modifiés) :
  `ticket-moderateur-2027-tiers-payant`, `reste-a-charge-drees-expliquer-devis` (2027 : seul
  le décret dentaire est cité), `audioprothese-renouvellement-tiers-payant`.

## Comment relire en 20 minutes

1. Ce fichier, puis pour chaque PR : les captures, la fiche de relecture, les entrées « à
   vérifier » (`outils-nuit/<X>/sources.md`) et les 3 décisions.
2. Si un outil convient : CI verte dans la PR, test local (`npm ci`, `npm run build`,
   `npx wrangler dev --port 4173`), puis fusion en squash.
