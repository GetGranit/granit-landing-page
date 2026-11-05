# Tableaux du marché du tiers payant optique

**03/11/2026 · document interne, ne pas publier.**

Pour Paul (GTM). Tout vient des fiches `content/concurrents/*.json`, des rapports d'enquête de la nuit du 03/11/2026 et
du relevé de prix `PRIX.json`. Rien n'est ajouté.

Légende :

- **NP** = non publié (l'acteur ne dit rien sur ce point, aucune source).
- `[clé]` = clé de source de la fiche ; la table des sources sous la grille donne l'URL et la date de consultation.
- Les fiches de Granit, Iremia et OptiBot sont relues par Paul (09/10/2026). **Toutes les autres sont à relire** (`aRelire: true`).
- « Modèle » et « métiers » viennent des champs `modele` et `identite.metiers` de chaque fiche, qui n'ont pas de clé de source.

---

## 1. Grille de tout le marché

| Acteur | Modèle | Qui fait | PEC | Rejets | Rapprochement | Avance | Engagement | HDS | Plateformes | Métiers |
|---|---|---|---|---|---|---|---|---|---|---|
| **Granit** | agents IA | agents logiciels, l'équipe reprend ce que l'agent ne finit pas [granit-accueil] | oui [granit-accueil] | oui [granit-accueil] | oui [granit-accueil] | non (sans source) | réversibilité totale [granit-tarifs] | certifié HDS [granit-tarifs] | logos affichés : Viamedis, Almerys, Santéclair, Carte Blanche, Actil… [granit-accueil] | non renseigné dans la fiche |
| **Iremia Santé** | prestataire | expert tiers payant + gestionnaire relation client attitrés [iremia-gestion] | oui, saisie par leurs experts [iremia-admin] | oui [iremia-gestion] | oui (Théo, Santé Bank) [iremia-accueil] | oui, J+1 avec BPCE [iremia-avance] | sans engagement [iremia-gestion] | hébergeur HDS (OVH) [iremia-mentions] | NP | 8 métiers dont optique, pharmacie, audio, dentaire |
| **OptiBot** | outil de saisie | l'opticien, avec une extension Chrome [optibot-accueil] | partiel : pré-remplissage, codes LPP et montants à la main [optibot-almerys] | détection et alertes [optibot-accueil] | NP | NP | sans engagement (Franchise : contrat annuel) [optibot-accueil] | hébergeur HDS (Scaleway) [optibot-mentions] | 47 portails annoncés + Smart Fill [optibot-accueil] | optique |
| **STPPS** | prestataire | binôme dédié, en Vendée [stpps-apropos] | NP | oui, reprise jusqu'à 2 ans et 3 mois [stpps-services] | oui [stpps-services] | NP | NP | NP | NP | 9 métiers dont optique, dentaire, pharmacie |
| **Tiers Payant Assistance** | prestataire | gestionnaires dédiés, à distance dans le logiciel [tpa-logiciels] | NP | oui [tpa-rejets] | oui [tpa-reconciliation] | NP | NP | HDS en France, hébergeur non nommé [tpa-securite] | NP | 7 métiers dont pharmacie, optique |
| **Sicorfé Santé** | prestataire | chargé de dossier dédié [sicorfe-santassist] | NP | oui (Santassist RO / RC) [sicorfe-santassist] | oui (Crésanté) [sicorfe-cash] | oui, J+5 [sicorfe-cash] | sans durée, préavis 3 mois (CGV Crésanté Cash) [sicorfe-cgv] | NP | NP | 12 métiers dont pharmacie, optique |
| **Sojema Santé** | prestataire | gestionnaires, interlocuteur unique [sojema-externalisation] | NP (« sécurise la prise en charge ») [sojema-opticiens] | oui [sojema-services] | oui [sojema-services] | NP | 1 an, tacite reconduction [sojema-services] | NP | NP (« portail de la complémentaire ») [sojema-services] | optique |
| **IziSanté** | prestataire | gestionnaires tiers payant optique [izisante-offres] | non : l'opticien la fait [izisante-offres] | oui, reprise jusqu'à 2 ans et 1 trimestre [izisante-offres] | oui [izisante-offres] | NP | NP | NP | NP [izisante-offres] | optique |
| **Backoffice** | prestataire | expert spécialisé optique [bo-optique] | oui, annoncé en 2022 (communiqué) [bo-presse] | oui [bo-optique] | oui [bo-optique] | NP | 90 jours ouvrés, reconduits tacitement [bo-cgu] | hébergeur agréé annoncé, non nommé [bo-cgu] | NP | pharmacie, optique |
| **Conseil Tiers Payant (CTP)** | prestataire | gestionnaire attitré, à distance, 1 fois par semaine [ctp-suivi] | oui, dentaire seulement [ctp-application] | oui [ctp-suivi] | oui, dentaire seulement [ctp-rapprochement] | NP | NP | NP | NP | 10 métiers dont pharmacie, optique |
| **France Tiers Payant** | prestataire | gestionnaire dédié, Meaux, sur site ou à distance [ftp-services] | NP | oui [ftp-services] | oui [ftp-services] | sur demande [ftp-services] | contrats modulables, sans frais [ftp-services] | NP | NP | 6 métiers dont pharmacie, optique |
| **GTP Gestion Tiers Payant** | prestataire | gestionnaire dédié, Villefranche-sur-Saône [gtp-accueil] | NP | oui [gtp-services] | oui [gtp-services] | non [gtp-linkedin] | 1 mois d'essai sans engagement [gtp-accueil] | NP | NP | 5 métiers dont pharmacie, optique |
| **DocetVita** | indépendante | une indépendante (EI), à distance ou sur site [docetvita-accueil] | NP | oui [docetvita-accueil] | oui [docetvita-gestion] | NP | ponctuel : sans ; régulier : 3 mois puis préavis 30 j [docetvita-tarifs] | NP | réseaux cités : Santéclair, Itelis, Kalixia [docetvita-opticiens] | optique, audio |
| **TP Zen** | prestataire | équipe d'experts, après audit [tpzen-accueil] | oui (DPEC) [tpzen-accueil] | oui [tpzen-accueil] | oui [tpzen-accueil] | NP | NP | NP | NP | « professionnels de santé médicaux et paramédicaux » (optique non citée) |

Les deux dernières lignes (DocetVita, TP Zen) sont dans la grille interne pour mémoire : la décision de cette nuit les
**exclut de la grille publiée** (voir partie 3).

### Table des sources de la grille

| Clé | URL | Consulté |
|---|---|---|
| granit-accueil | https://getgranit.ai/ | 2026-10-07 |
| granit-tarifs | https://getgranit.ai/tarifs | 2026-10-07 |
| iremia-accueil | https://iremia-sante.fr/ | 2026-10-07 |
| iremia-admin | https://iremia-sante.fr/admin-sante | 2026-10-07 |
| iremia-gestion | https://iremia-sante.fr/sante-gestion | 2026-10-07 |
| iremia-avance | https://iremia-sante.fr/avance-sante | 2026-10-07 |
| iremia-mentions | https://iremia-sante.fr/mentions-legales | 2026-10-07 |
| optibot-accueil | https://optibot.fr/ | 2026-10-09 |
| optibot-almerys | https://optibot.fr/mutuelles/almerys | 2026-10-09 |
| optibot-mentions | https://optibot.fr/legal/mentions-legales | 2026-10-09 |
| stpps-apropos | https://www.stpps.net/stpps | 2026-11-03 |
| stpps-services | https://www.stpps.net/nos-services | 2026-11-03 |
| tpa-logiciels | https://www.tierspayantassistance.com/agilite-expertise-logiciels-metiers | 2026-11-03 |
| tpa-rejets | https://www.tierspayantassistance.com/traitement-rejets-anomalies-tiers-payant | 2026-11-03 |
| tpa-reconciliation | https://www.tierspayantassistance.com/reconciliation-rapprochement-bancaire-tiers-payant | 2026-11-03 |
| tpa-securite | https://www.tierspayantassistance.com/securité-informatique-engagements-tpa | 2026-11-03 |
| sicorfe-santassist | https://sicorfe.com/nos-services/santassist/ | 2026-11-03 |
| sicorfe-cash | https://sicorfe.com/nos-services/cresante/cresante-cash/ | 2026-11-03 |
| sicorfe-cgv | https://sicorfe.com/cgv/ | 2026-11-03 |
| sojema-externalisation | https://sojema.fr/externalisation-du-tiers-payant/ | 2026-11-03 |
| sojema-opticiens | https://sojema.fr/pour-les-opticiens/ | 2026-11-03 |
| sojema-services | https://sojema.fr/services/ | 2026-11-03 |
| izisante-offres | https://izisante.net/nos-offres/ | 2026-11-03 |
| bo-optique | https://www.lagestiondutierspayant.fr/optique | 2026-11-03 |
| bo-presse | https://www.relations-publiques.pro/250706/backoffice-le-specialiste-de-la-gestion-du-tiers-payant-lance-une-offre-dediee-aux-opticiens-et-accompagne-les-pharmaciens-durant-lete.html | 2026-11-03 |
| bo-cgu | https://www.lagestiondutierspayant.fr/static/pdf/CGU.pdf | 2026-11-03 |
| ctp-suivi | https://conseiltierspayant.com/suivi-tiers-payant/ | 2026-11-03 |
| ctp-application | https://conseiltierspayant.com/facilitez-vous-le-tiers-payant-avec-lapplication-ctp/ | 2026-11-03 |
| ctp-rapprochement | https://conseiltierspayant.com/dentistes-et-centres-dentaires-le-rapprochement-bancaire-de-vos-prises-en-charges-tiers-payant-avec-lapplication-ctp/ | 2026-11-03 |
| ftp-services | https://www.francetierspayant.fr/nos-services/ | 2026-11-03 |
| gtp-accueil | https://www.tiers-payant-gtp.com/ | 2026-11-03 |
| gtp-services | https://www.tiers-payant-gtp.com/service/ | 2026-11-03 |
| gtp-linkedin | https://www.linkedin.com/in/gtpgestiontierspayant | 2026-11-03 |
| docetvita-accueil | https://docetvita.fr/ | 2026-11-03 |
| docetvita-gestion | https://docetvita.fr/gestion-tiers-payant.html | 2026-11-03 |
| docetvita-tarifs | https://docetvita.fr/tarifs-externalisation-tiers-payant.html | 2026-11-03 |
| docetvita-opticiens | https://docetvita.fr/externalisation-administrative-opticien.html | 2026-11-03 |
| tpzen-accueil | https://www.tpzen.com/ | 2026-11-03 |

---

## 2. Prix

Rappel : décision du 07/10/2026, **aucun prix sur les pages comparatives**. Ce tableau est pour usage interne seulement.

| Acteur | Prix | Type | Source | Date |
|---|---|---|---|---|
| **Granit** | à partir de 199 € HT/mois/centre (1 centre) ; à partir de 149 € HT/mois/centre de 5 à 10 centres ; sur devis au-delà de 10 ; + coût à l'usage par agent, non chiffré publiquement | affiché | https://getgranit.ai/tarifs | 2026-11-03 |
| **Iremia Santé** | Avance Santé : « à partir de 90 à 150 € par mois » selon le CA, HT ou TTC non précisé ; gestion optique : NP (audit gratuit). Presse 2024 (Santé Pros, pharmacies) : Avance Santé 99 € HT/mois, Santé Bank 27 € HT/mois, Santé Gestion 250 à 1 400 € HT/mois | mixte | https://iremia-sante.fr/avance-sante ; https://www.lemoniteurdespharmacies.fr/business/economie/strategie-et-gestion/bien-gerer-le-tiers-payant-pour-eviter-les-rejets-et-impayes | 2026-11-03 (article : 04/09/2024) |
| **OptiBot** | essai gratuit 1 mois ; Pro 69,90 € HT/mois (1 poste) ; Cabinet 179 € HT/mois (3) ; Réseau 299 € HT/mois (5, +30 €/poste) ; Franchise à partir de 500 € HT/mois, contrat annuel ; annuel −15 % | affiché | https://optibot.fr/pricing | 2026-11-03 |
| **STPPS** | NP : optique sur devis (offre « Standard ») ; les offres packagées n'affichent pas de montant. Seul prix vu : une formation (400 € HT par stagiaire), pas la gestion | non publié | https://www.stpps.net/votre-metier/centre-optique | 2026-11-03 |
| **Tiers Payant Assistance** | NP sur le site (diagnostic). Presse 2016 : un pharmacien client dit payer « 800 € HT par an » pour 4,5 h par semaine. LinkedIn (officine, extrait de recherche) : « environ 0,17 % du chiffre d'affaires » | rapporté par un tiers (en fait : non publié + chiffres pharmacie) | https://tierspayantassistance.com/opticiens ; https://www.lemoniteurdespharmacies.fr/business/numerique/digitalisation/externaliser-le-tiers-payant | 2026-11-03 (article : 26/10/2016) |
| **Sicorfé Santé** | NP : redevance mensuelle forfaitaire fixée au contrat, indexée Syntec ; Santassist payé « uniquement si l'action est aboutie » ; « Pack essentiel opticiens » sans prix ; −10 % pour les clients La Banque Postale | non publié | https://sicorfe.com/cgv/ ; https://sicorfe.com/fonctionnalites/par-metier/opticiens/ | 2026-11-03 |
| **Sojema Santé** | 5 € par dossier traité (RO et RC compris), HT ou TTC non précisé ; 0 € de mise en route | affiché | https://sojema.fr/externalisation-du-tiers-payant/ | 2026-11-03 |
| **IziSanté** | à partir de 150 € HT/mois, prestations sur devis ; conventionnement sur devis | affiché | https://izisante.net/nos-offres/ | 2026-11-03 |
| **Backoffice** | optique : NP, devis (communiqué 2022 : prix au dossier, à la prise en charge, après diagnostic, sans montants). Pharmacie, presse 2024 : abonnement moyen 300 € HT/mois, logiciel Kabeo 29,90 € HT/mois. Formations à partir de 250 € HT/heure | rapporté par un tiers | https://www.lagestiondutierspayant.fr/optique ; https://www.lemoniteurdespharmacies.fr/business/economie/strategie-et-gestion/bien-gerer-le-tiers-payant-pour-eviter-les-rejets-et-impayes | 2026-11-03 (article : 04/09/2024) |
| **Conseil Tiers Payant (CTP)** | NP : sur mesure après état des lieux gratuit ; « un tarif fixe, négocié à l'année », sans montant | non publié | https://conseiltierspayant.com/ | 2026-11-03 |
| **France Tiers Payant** | NP : audit gratuit, aucun frais d'installation, tarifs préférentiels pour groupements | non publié | https://www.francetierspayant.fr/ | 2026-11-03 |
| **GTP Gestion Tiers Payant** | NP : devis gratuit ; 1 mois d'essai sans engagement | non publié | https://www.tiers-payant-gtp.com/ | 2026-11-03 |
| **DocetVita** | reprise ponctuelle : 149 € HT (10 dossiers), 249 € HT (20), 329 € HT (30), 499 € HT (50), devis au-delà ; gestion régulière sur devis | affiché | https://docetvita.fr/tarifs-externalisation-tiers-payant.html | 2026-11-03 |
| **TP Zen** | gestion : à partir de 0,4 % du CA géré + à partir de 10 % des sommes récupérées ; PEC : 9 € l'unité, 259 € les 30, illimité à partir de 549 €/mois ; recouvrement : à partir de 5 % ; HT ou TTC non précisé | affiché | https://www.tpzen.com/ | 2026-11-03 |
| **Optiflux** | introuvable (seulement des homonymes hors sujet) | introuvable | https://www.optiflux-sas.com/top-10-des-logiciels-de-simulation-de-flux/ (homonyme) | 2026-11-03 |
| **Easy Santé** | introuvable (homonymes sans offre de tiers payant) | introuvable | https://annuaire-entreprises.data.gouv.fr/entreprise/easy-sante-892108341 (homonyme possible) | 2026-11-03 |
| **GTT** | introuvable (sans doute GTP) | introuvable | aucune | 2026-11-03 |

### Contradictions et pièges

- **Iremia, deux prix pour la même offre** : 90 à 150 € par mois sur le site (2026), 99 € HT par mois dans Le Moniteur
  (2024, sous le nom Santé Pros, pour des pharmacies). Le lien Santé Pros = Iremia est probable mais pas confirmé. Et ce
  prix porte sur l'**avance de trésorerie**, pas sur la gestion du tiers payant optique, qui n'est pas chiffrée.
- **Iremia, « non affiché par décision »** (`exclus.prix` de `iremia.json`) : Iremia affiche bien ce prix. Le « non
  affiché » est un **choix éditorial de Granit**, pas d'Iremia. La formule est à reformuler.
- **OptiBot** : 1 mois d'essai sur l'accueil et les tarifs, « 7 jours d'essai gratuit » sur les pages /mutuelles/ ;
  /comparatif affiche « 479€/an (plan Solo) » puis « 839€ » pour le plan Pro.
- **Prix de pharmacie, à ne pas transposer à l'optique** : Iremia (Moniteur 2024), Backoffice (300 € HT/mois en
  moyenne, Kabeo 29,90 € HT, Moniteur 2024), Tiers Payant Assistance (800 € HT par an, témoignage d'un pharmacien en
  2016, chiffre qui paraît faible ; 0,17 % du CA, officine). Le même article de 2016 donne une fourchette de 340 à 500 €
  attribuée à **aucun** prestataire : elle ne doit pas être imputée à France Tiers Payant.
- **Type « rapporté par un tiers »** pour TPA et Backoffice : dans les deux cas, le site ne publie rien pour l'optique ;
  le seul chiffre vient de la presse pharmacie.
- **Backoffice** : la fiche range les 29,90 € HT comme abonnement à l'outil, d'après les CGU ; le relevé de prix les
  attribue au logiciel Kabeo, d'après le Moniteur. Même montant, deux sources.
- **GTP** : 1 mois d'essai sur le site, « formule découverte pendant 3 mois » sur une fiche Viadeo non datée.
- **France Tiers Payant** : « aucun engagement les six premiers mois » n'existe que dans la balise meta de l'accueil,
  pas dans le texte visible.
- **TP Zen** : la grille 9 € / 259 € / 549 € est attribuée aux demandes de prise en charge d'après la mise en page ; à
  vérifier visuellement.
- **Sicorfé** : la mention « pour 30 actions Santassist » laisse penser qu'un prix existe dans une image ou un pack ;
  aucun montant dans le texte.
- **Granit** : la grille publique saute de « 1 centre » à « 5 à 10 centres » (rien pour 2 à 4) ; le coût à l'usage par
  agent n'a pas de montant public.

---

## 3. Qui mérite une page VS

« Faits » = axes renseignés et sourcés + citations de la fiche. « Recouvrement » = ce que l'acteur publie sur les trois
briques de Granit, en optique.

| Acteur | Faits sourcés | Taille | Recouvrement avec Granit (PEC / rejets / rapprochement) | Reco | Raison |
|---|---|---|---|---|---|
| **STPPS** | 9 (3 axes + 6 citations) | 20 à 49 salariés (2024), créée en 2018 (micro-entreprise en 2016), GroupeFBO depuis 2023 | NP / oui / oui | **page VS** (rédigée) | Rejets et rapprochement réels, fiche solide. Mais l'optique est secondaire chez eux (cœur visible : dentaire, centres de santé) ; le rapport disait « à défaut, grille seulement ». |
| **Tiers Payant Assistance** | 9 (4 + 5) | 10 à 19 salariés (2024), créée en 2002 ; revendique « + 100 gestionnaires » | NP / oui / oui | **page VS** (rédigée) | Opticiens cités, gros volume revendiqué, et contraste net : « aucune intelligence artificielle » contre agents IA. Leur argument HDS est à traiter honnêtement. |
| **Sicorfé Santé** | 10 (5 + 5) | 20 à 49 salariés (2024), créée en 1991 ; la Société Centrale des Opticiens parmi les administrateurs | NP / oui / oui | **page VS** (rédigée) | Acteur historique, lié aux opticiens, page Opticiens dédiée. Angle : fort sur la trésorerie (J+5) et la télétransmission, ne publie rien sur la PEC. |
| **Sojema Santé** | 8 (4 + 4) | 6 à 9 salariés (2024), créée en 2016 ; équipe d'environ 11 personnes sur le site | NP / oui / oui | **page VS** (rédigée) | 100 % optique, équipe salariée, offre lisible, même terrain que Granit en aval de la PEC. |
| **IziSanté** | 8 (4 + 4) | 3 à 5 salariés (2024), créée en 2020, fondée par deux opticiennes | non (dit explicitement) / oui / oui | **page VS** (rédigée) | 100 % optique, visible dans la presse optique, même cible. Angle « qui fait la PEC » : chez IziSanté, c'est l'opticien. |
| **Iremia Santé** | 11 (7 + 4) | non relevé (pas de champ taille) | oui / oui / oui | **grille** | Fiche relue le 09/10, pas de rapport cette nuit ; hors du lot de pages VS de cette nuit. Le recouvrement le plus complet du marché (plus l'avance J+1). |
| **OptiBot** | 11 (6 + 5) | non relevé (pas de champ taille) | partiel / détection et alertes / NP | **grille** | Fiche relue le 09/10, pas de rapport cette nuit ; hors du lot de cette nuit. Outil de saisie pour l'opticien, pas un service. |
| **Backoffice** | 10 (6 + 4) | 3 à 5 salariés (2024), créée en 2016 | oui (communiqué 2022 seulement) / oui / oui | **grille** | Recouvrement réel sur le papier, mais offre optique mince en ligne (chiffres d'une étude de 2011), cœur pharmacie, PEC sourcée par un communiqué d'agence. À revoir si l'offre optique se confirme sur le terrain. |
| **Conseil Tiers Payant (CTP)** | 9 (4 + 5) | 6 à 9 salariés (2024), créée en 2017 | dentaire seulement / oui / dentaire seulement | **grille** | Généraliste, axé récupération d'impayés, rien sur la PEC en optique, site peu tenu à jour. Page VS seulement si des opticiens le citent en démo. « CTP » = Conseil Tiers Payant. |
| **France Tiers Payant** | 10 (5 + 5) | 20 à 49 salariés (2024), Litipharma créée en 2003 | NP / oui / oui | **grille** | Acteur établi mais tourné vers la pharmacie ; l'optique n'est qu'une vignette, rien sur la PEC. |
| **GTP Gestion Tiers Payant** | 10 (5 + 5) | 10 à 19 salariés (2024), SARL créée en 2010 | NP / oui / oui | **grille** | Prestataire régional centré pharmacie, optique citée sur une seule page, rien sur la PEC. |
| **DocetVita** | 9 (5 + 4) | entreprise individuelle, créée en 2018, effectif non renseigné | NP / oui / oui | **ignorer** (hors grille publiée) | Une indépendante seule, offre surtout ponctuelle ; la raison sociale porte le nom d'une personne. Le rapport proposait la grille ; la décision de cette nuit l'en retire. |
| **TP Zen** | 9 (4 + 5) | 3 à 5 salariés (2024), créée en 2024, capital 1 000 € | oui / oui / oui (hors optique) | **ignorer** (hors grille publiée) | Les trois briques sur le papier, mais pour cabinets et dentistes : aucune optique publiée sur le site. Très jeune et très petite. |
| **Optiflux** | 0 | introuvable | sans objet | **ignorer** | Seulement des homonymes hors sujet (agtech, assurance transports, simulation industrielle). |
| **Easy Santé** | 0 | introuvable | sans objet | **ignorer** | Homonymes sans offre de tiers payant ; peut-être une confusion avec IziSanté. Ne rien publier sur « Easy Santé TP » (personne physique sans présence publique). |
| **GTT** | 0 | introuvable | sans objet | **ignorer** | Aucun acteur de ce nom ; très probablement GTP. |

---

## 4. Points à trancher par Paul

1. **Relire les 11 fiches marquées `aRelire: true`** avant toute publication (grille ou page VS).
2. **Iremia** : reformuler « non affiché par décision » (c'est un choix Granit, Iremia affiche son prix) ; confirmer ou non que Santé Pros = Iremia.
3. **Sources acceptées ou non** : LinkedIn (GTP, avance = « non »), communiqué d'agence payé (Backoffice, PEC « annoncé en 2022 »), balise meta (France Tiers Payant, « six premiers mois »). Si seules les sources officielles comptent, ces cases passent en NP.
4. **CTP** : garder PEC et rapprochement « dentaire seulement » ou les passer en NP sur une page centrée optique ; ne pas reprendre le « suivi quotidien » (connexion une fois par semaine).
5. **Tiers Payant Assistance** : comment traiter honnêtement « aucune IA » et leur argument HDS ; « + 100 gestionnaires » contre 10 à 19 salariés dans l'annuaire ; requalifier le type de prix en « non publié ».
6. **Sicorfé** : l'avance J+5 est sans garantie de bonne fin (sommes reprises après trois mois) ; citer exactement, sans dénigrer. Logos « certifié » sans norme : rien sur l'HDS.
7. **Sojema** : « contrat de 1 an avec tacite reconduction » contre « aucun engagement inutile » ; laisser de côté les chiffres « 100 % ».
8. **STPPS** : page VS validée alors que l'optique est secondaire chez eux ; création 2016 ou 2018 ; « leader français » non vérifiable.
9. **Noms à clarifier** : Optiflux (lien ou contexte ?), Easy Santé (IziSanté ?), GTT (GTP ?) ; fusionner la clé `ctp` du relevé de prix avec `conseil-tiers-payant`.
10. **Granit** : la grille publique ne dit rien de 2 à 4 centres, et le coût à l'usage par agent n'a pas de montant public.
11. **Règle « aucun client »** : plusieurs sites et posts LinkedIn nomment des clients, dont un réseau d'optique chez TPA ; rien n'est repris, à garder ainsi.
