# Récap de nuit : le blog passe aux 5 métiers

Pour Paul, le 4 novembre 2026. Lecture : 3 minutes. Rien n'est en ligne et rien n'est fusionné : ce sont des propositions, dans une PR en brouillon.

## Ce qu'on recommande

1. **Un tronc commun et 5 branches.** Une page de tête nouvelle, « Tiers payant des professionnels de santé », sert de porte d'entrée à tous les métiers. En dessous, une page principale par métier, puis ses articles. À côté, 28 articles communs à plusieurs métiers (rejets, NOEMIE, rapprochement, relances, AMO/AMC, CSS…), dont 22 étaient déjà dans la file en version optique et qu'on rend multi-métiers.
2. **On ne parle de Granit que là où il tourne vraiment**, c'est-à-dire en optique et en audio. Pour le dentaire, les centres, la pharmacie et les cliniques, les articles donnent la méthode sans rien promettre. C'est la règle qui a le plus élagué cette nuit.
3. **La file alterne** 2 articles optique ou communs, puis 1 article d'un autre métier, dans l'ordre dentaire → centres → cliniques → pharmacie. L'audio prend des cases optique.
4. **Les pages métier passent de 8 à 5** sans créer d'adresse : on garde `optique` (renommée « Opticiens et audioprothésistes »), `dentaire`, `centres`, `pharmacie` et `cliniques`. Trois redirections : audio → optique, laboratoires → cliniques, ehpad → /ressources.

## Les chiffres clés

| | Pages principales | Articles propres (à publier) | Articles communs qui le servent (à publier) |
|---|---|---|---|
| Opticiens et audioprothésistes | 1 existante + 1 audio | 21 optique (déjà en file, dont 3 en attente) + 4 audio | 25 |
| Centres dentaires | 1 | 2 | 28 |
| Centres de santé et ophtalmologie | 1 | 3 | 26 |
| Pharmacies | 1 | 0 | 22 |
| Cliniques et laboratoires | 1 (en attente) | 2 (en attente) | 21 |

- La nouvelle file : 97 entrées, dont 31 publiées (inchangées), 2 en relecture, 58 à publier et 6 en attente. Elle contient 22 nouveaux articles.
- On supprime 2 doublons de l'ancienne file et on en repousse 2 : les délais de paiement (données non validées) et l'article sur les congés (pour mai 2027).
- Au rythme d'un article par jour ouvré, l'alternance tient sur environ 45 articles, jusque vers mi-janvier. Ensuite il ne reste que de l'optique : il faudra préparer une deuxième vague d'articles métier en décembre.

## Les 5 décisions à prendre

1. **Corriger le moteur avant de brancher la nouvelle file.** Aujourd'hui, un article qui n'est pas une refonte est écrit pour un opticien quel que soit le lecteur indiqué. La consigne, la relecture, les sources de référence et l'encart final sont tous calés sur l'optique. Le premier article dentaire sortirait dès le 3e jour.
   **Ma reco : oui, une PR moteur d'abord** (détail dans `cocon-v5.md`, section 9), puis on remplace la file.
2. **Cliniques et laboratoires : publier maintenant ou attendre ?** Le tiers payant mutuelle existe bien chez eux. Mais aucun call ne vient d'une clinique, et les labos disent que leur part mutuelle est déjà automatisée : leur vrai problème, ce sont les rejets FSE et le pointage des paiements. La demande de recherche côté pro est faible.
   **Ma reco : attendre.** Les 3 articles sont dans la file, à leur place, mais en attente. Le métier avance quand même grâce à un article commun sur IDB, CLC et ROC. On les débloque quand le POC laboratoire a un résultat.
3. **Pharmacie : écrire sur le tiers payant alors que Granit y fait autre chose (la préparation des doses) ?**
   **Ma reco : une seule page principale, angle méthode** (ce qui se passe après la télétransmission : ARL, NOEMIE, rejets, relances), plus 3 articles communs. On a écarté 4 sujets officine, sans demande ou sans lien avec ce que fait Granit. À terme, la page Pharmacie devrait parler de ce que Granit y fait vraiment.
4. **Valider le passage de 8 à 5 pages métier**, avec ses 3 redirections, et garder en ligne l'article EHPAD hors des pages métier. Le dépublier ferait revenir 4 anciens articles qu'il remplace. Il est aussi tagué « pharmacie » par erreur.
   **Ma reco : oui, dans une PR de code** à fusionner avant le premier article non optique (détail dans `pages-metier.md`).
5. **Un article urgent sur 2027.** Deux décrets du 21 août 2026 font baisser la part de la Sécurité sociale au 1er janvier 2027, en dentaire (décret 2026-809, vérifié sur Légifrance) et en optique et audio (2026-810, à relire). Le taux n'est pas encore publié.
   **Ma reco : le publier en 7e position**, en relecture humaine, sans aucun taux tant que l'Assurance maladie n'a pas tranché.

## Ce qui reste incertain

- **Pas de volumes de recherche** (pas de Semrush). La demande est estimée en Faible, Moyen ou Fort à partir des suggestions Google et des pages de résultats. À recaler avec la Search Console 4 à 6 semaines après publication.
- **Ce que Granit sait faire par métier.** Il faut confirmer quels portails audio les agents traitent. Un signal contradictoire revient dans les calls sur la télétransmission et les cartes CPS : à vérifier avant de l'écrire.
- **Deux erreurs corrigées dans nos notes, et des points non confirmés.**
  - Erreurs corrigées : la date de l'avenant audio (4 novembre 2024) et un faux « délai de 2 ans pour facturer » côté professionnel.
  - Points non confirmés, à ne pas écrire tels quels :
    - le calendrier de ROC en clinique ;
    - le suivi audio à 0,01 € ;
    - un tiers payant obligatoire sur le 100 % Santé ;
    - le contrat Inter-AMC, dont nous n'avons lu qu'un modèle de 2022.
- **Deux articles en ligne à corriger** :
  - `recouvrement-patient-empathie` donne en exemple un dépassement d'honoraires impayé en centre de santé, alors que la loi les y interdit ;
  - la source ameli de l'article audio ne répond plus au moteur.
- **Tous les faits réglementaires de la carte ont une source**, avec leur statut, dans `cocon-v5.md` (section 8).

## Les fichiers

- `cocon-v5.md` : la carte complète (tronc, 5 métiers, mots-clés, demande estimée, FAQ, maillage, sources).
- `articles-queue.v5.json` : la proposition de file. **`articles-queue.json` n'est pas touchée**, le moteur continue de publier l'ancienne file.
- `pages-metier.md` : passage de 8 à 5 pages, redirections et changements de code.
