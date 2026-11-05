# Récap de la nuit du 3 au 4 novembre 2026 : pages comparatives

Branche : `claude/comparatifs-nuit-0411`, partie de `comparatifs-stpps-tpa`. Rien n'a été fusionné, aucune PR n'a été ouverte et `main` n'a pas été modifié.
Document interne, à ne pas publier.

## En bref

- **11 fiches concurrents** : 2 complétées (STPPS, TPA) et 9 créées. Toutes sont marquées `aRelire: true`.
- **6 pages rédigées** : 5 pages « Granit vs » et la grille du marché.
- **Relecture** : chaque page a été relue par un agent qui ne l'avait pas écrite.
- **Contrôles** :
  - le vérificateur ne laisse sur mes pages que l'erreur attendue « fichier de faits non relu » ;
  - `npm test` : 79 tests sur 79 passent ;
  - `npm run build` réussit ;
  - `check-marque` ne signale aucune violation ajoutée.
- **3 acteurs introuvables** : Optiflux, Easy Santé et GTT.

## Ce qui a été fait

### Fiches concurrents (`content/concurrents/`)

| Fiche | Statut | Modèle | Optique ? | Reco |
|---|---|---|---|---|
| stpps.json | complétée et re-vérifiée. 2 détails mal sourcés corrigés, taille ajoutée. Les axes « non publié » le restent | prestataire | oui, mais secondaire | page VS |
| tiers-payant-assistance.json | re-vérifiée : citations confirmées, taille ajoutée. Les axes « non publié » le restent | prestataire | oui | page VS |
| sicorfe.json | créée (SNP SA, marque Sicorfé Santé) | prestataire | oui | page VS |
| sojema.json | créée | prestataire | oui, uniquement | page VS |
| izisante.json | créée | prestataire | oui, uniquement | page VS |
| backoffice.json | créée (slug `backoffice`, offre « Backoffice Optique ») | prestataire | oui, cœur pharmacie | grille |
| conseil-tiers-payant.json | créée (c'est aussi le « CTP » de la liste) | prestataire | oui, généraliste | grille |
| gtp-gestion-tiers-payant.json | créée | prestataire | cité, cœur pharmacie | grille |
| france-tiers-payant.json | créée (société LITIPHARMA) | prestataire | vignette, cœur pharmacie | grille |
| docetvita.json | créée | freelance | oui | aucune page (voir plus bas) |
| tpzen.json | créée | prestataire | non publié | aucune page |

Introuvables ou hors sujet, donc sans fiche :
- **Optiflux** : trois homonymes sans rapport (fruits, coassurance, flux industriels).
- **Easy Santé** : blog bien-être, appli AXA, holding dentaire. Vous pensiez peut-être à IziSanté.
- **GTT** : sans doute une confusion avec GTP Gestion Tiers Payant.

Les prix sont rangés dans `exclus.prix`, plus `exclus.prixType` et `exclus.prixAnalyste`, ce dernier avec ses sources. Ils ne sont jamais dans les axes. Je n'ai **pas** modifié les fiches déjà relues (granit, iremia, optibot) : les remettre à relire bloquerait la page Iremia publiée. Leurs prix sont dans TABLEAUX.md.

### Pages rédigées (`content/ressources/`)

| Page | Mots | Entrée de la file |
|---|---|---|
| granit-vs-stpps.json | 1 485 | E2c (existante) |
| granit-vs-tiers-payant-assistance.json | 1 459 | E2d (existante) |
| granit-vs-sicorfe.json | 1 495 | **E2e (nouvelle, waiting)** |
| granit-vs-sojema.json | 1 355 | **E2f (nouvelle, waiting)** |
| granit-vs-izisante.json | 1 488 | **E2g (nouvelle, waiting)** |
| solutions-tiers-payant-optique.json (grille, 12 acteurs) | 2 782 | E2 |

- **Format** : celui de granit-vs-iremia. Auteur Laura, relecteur Olivier, datées du 03/11/2026.
- **Contenu** : aucun prix, aucun client, rien du champ `exclus`. Chaque page dit quand le concurrent est le meilleur choix.
- **File** (`articles-queue.json`) : 3 entrées ajoutées (E2e à E2g). La liste `concurrents` de E2 est élargie de 5 à 12 acteurs, avec les liens enfants des nouvelles pages. Je n'ai changé aucun statut.
- **Page TPA** : elle répond au « aucune intelligence artificielle » de TPA. Elle cite la phrase en entier, présente les deux modèles comme deux choix de travail sans en déclarer un meilleur, et explique ce qui change au magasin : quand le travail se fait, ce que vous voyez, qui est votre interlocuteur.

### Documents internes (`scripts/seo-engine/comparatifs/`)

- `TABLEAUX.md` contient trois tableaux, avec une source par case :
  - la grille de tout le marché ;
  - les prix de chaque acteur, en distinguant prix affiché, prix rapporté par un tiers et prix non publié ;
  - les acteurs qui méritent une page VS.
- `RECAP-NUIT.md` : ce fichier.

## Ce que vous devez trancher

### 1. Bloquant : relire les fiches

Les 9 fiches utilisées par les pages sont en `aRelire: true` : le vérificateur refuse les pages tant que ce n'est pas levé. Après relecture, passez `aRelire` à `false`.

Attention : sur la branche d'origine, stpps.json et tiers-payant-assistance.json étaient à `false` alors que leur `_relu` disait « PAS ENCORE RELU ». Je les ai remises à `true`.

### 2. Statuts incohérents dans la file

Je n'y ai pas touché, mais la fusion avec `main` posera problème :
- sur la branche d'origine, E2, E2b, E2c et E2d sont en `pending` ;
- sur `main`, E2 est en `waiting` et E2b en `review`.

Si ces `pending` arrivent sur `main`, le moteur du matin réécrira ces pages lui-même et écrasera mes textes. Remettez E2, E2c et E2d en `waiting` avant de fusionner.

### 3. Affirmations sensibles, par page

- **TPA**
  - La citation « aucune IA » est en ligne, pas en bloc. Le contrôle des citations ne décode pas les entités HTML du site de TPA (`&eacute;`) : un petit correctif dans `lib/html.mjs` permettrait de la remettre en bloc.
  - « Com'In » dans la fiche, « ComIN » sur le site : il faut unifier.
  - La citation ComIN vient d'une page générique, sans contenu propre à l'optique.
- **STPPS**
  - « Intégralement ou partiellement » ne vient que de la page d'accueil, que le vérificateur refuse comme source.
  - Le conventionnement d'un nouvel établissement ne repose que sur `meilleurSi`.
  - SAS d'après l'annuaire, SARL d'après les mentions légales.
- **Sicorfé**
  - La page cite les CGV : les sommes non recouvrées sous trois mois sont déduites du virement.
  - « Ne facturer que les actions abouties » : vérifiez que ce n'est pas trop proche de la règle « aucun prix ».
  - « Sans engagement de durée » ne vaut que pour Crésanté Cash, mais l'axe de la fiche n'a pas cette nuance.
- **Sojema**
  - « Contrat de 1 an avec tacite reconduction » sur une page, « Aucun engagement inutile » sur une autre.
  - La demande de prise en charge est floue : « sécuriser la prise en charge avant facturation ».
  - L'étape « garder le dernier rapport mensuel » est un conseil ajouté par le rédacteur.
- **IziSanté**
  - Le siège est à Vaugneray d'après l'annuaire, à Craponne d'après d'autres sources.
  - La page dit que les deux offres peuvent se compléter. C'est honnête, mais à valider côté commercial.
- **Grille**
  - **GTP** : le refus de l'avance vient d'un post LinkedIn qui vise les pharmacies. Acceptez-vous LinkedIn comme source ?
  - **Backoffice** : la PEC ne s'appuie que sur un communiqué d'agence payé de 2022.
  - **Conseil Tiers Payant** : la PEC et le rapprochement ne sont décrits que pour le dentaire. Faut-il les passer en « non publié » ?
  - **Granit** : la seule source avec un chemin est getgranit.ai/tarifs. Ajouter une page /agents ou sécurité dans granit.json éviterait de citer une page de tarifs sur une page sans prix.
- **Toutes les pages**
  - Elles écrivent que la reprise des anciennes factures et le conventionnement « ne font pas partie de l'offre décrite par Granit ». Si Granit les fait, il faut les ajouter à granit.json et revoir ces phrases.

### 4. Prix trouvés

Le détail est dans TABLEAUX.md, section 2. Rien n'est publié.

- **Affichés par l'acteur** : OptiBot, Sojema, IziSanté, TP Zen, DocetVita, Iremia (avance seulement) et Granit. Pour Granit, le cas de 2 à 4 centres n'est pas écrit sur /tarifs.
- **Non publiés** : STPPS, Sicorfé, Conseil Tiers Payant, GTP et France Tiers Payant.
- **Rapportés par un tiers** : TPA et Backoffice. Ce sont des chiffres de la presse pharmacie, à ne pas transposer à l'optique.
- **Iremia** : la mention « non affiché par décision » dans iremia.json est un choix de Granit, puisque le prix est bien affiché sur le site d'Iremia. Le site donne 90 à 150 €, Le Moniteur 2024 donnait 99 € HT.

### 5. Autres choix faits cette nuit

- **DocetVita** n'a pas de page et n'est pas dans la grille : c'est une entreprise individuelle, au nom d'une personne. L'enquêteur la proposait pour la grille.
- **TP Zen** est écarté : la société ne publie rien sur l'optique.
- **Pages VS** : faites pour Sicorfé, Sojema et IziSanté. STPPS reste discutable, l'optique y est secondaire.

## Ce qui n'a pas marché

- 3 acteurs introuvables (voir plus haut).
- Pour STPPS et TPA, aucune nouvelle source publique sur la PEC, l'avance, l'engagement, l'HDS ou les plateformes. Ces axes restent « non publié ».
- Certaines sources n'ont pas pu être vérifiées automatiquement : pages en JavaScript (Iremia, annuaire) ou délai dépassé (une page Sicorfé). Les citations de ces pages avaient été vérifiées à la main par les agents.
- Les fichiers de travail des agents sont restés dans le scratchpad de la session, hors du dépôt. Les rapports par acteur sont repris dans TABLEAUX.md.

## Ordre de relecture conseillé

1. `scripts/seo-engine/comparatifs/TABLEAUX.md`, sections 3 et 4, pour valider les choix.
2. Les fiches stpps.json et tiers-payant-assistance.json, puis granit-vs-stpps et granit-vs-tiers-payant-assistance, déjà prévues dans la file.
3. sicorfe.json, sojema.json, izisante.json, puis leurs pages.
4. backoffice, conseil-tiers-payant, gtp-gestion-tiers-payant, france-tiers-payant, puis la grille `solutions-tiers-payant-optique`.
5. Avant la PR : les statuts de la file (point 2) et `aRelire` à `false` sur les fiches validées. Relancez ensuite :

```bash
node scripts/seo-engine/verifier-article.mjs granit-vs-stpps granit-vs-tiers-payant-assistance granit-vs-sicorfe granit-vs-sojema granit-vs-izisante solutions-tiers-payant-optique
```
