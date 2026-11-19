Données du lead magnet /pec. Ce dépôt est PUBLIC : on n'y met rien du code produit
(chemin, numéro de ligne, table de routage, catalogue de portail, nom de table ou d'accès à
la base). Ce qui en vient reste dans les dépôts privés.

platforms.json : les portails de tiers payant que /pec sait nommer (libellé, adresse de
connexion, double authentification, simulable ou non, note pour l'opticien). Liste reprise
du produit le 07/10/2026, tenue à la main depuis.
04/11/2026 : Oxantis a fermé le 26/10/2026, Viamedis reprend (Acuité). Dans platforms.json,
oxantis renvoie vers viamedis (url, tfa, reseau_via).

Carte → portail (resolve.ts) : seulement le portail ou le réseau écrit sur la carte
(gestionnaire, ligne optique, réseau). Aucune correspondance mutuelle → portail. Une carte
qui ne nomme aucun portail connu donne « inconnu », et l'opticien est orienté vers Paul.
Une table mutuelle → portail ne reviendra ici que construite sur des sources publiques,
chacune citée et datée.

estimations.json (21/10/2026) : fourchettes indicatives du remboursement complémentaire par
portail, pour l'écran résultat. Agrégats anonymes (p25/médiane/p75 par portail x équipement,
seuil n>=10, Oxantis exclu) : aucun dossier patient n'est embarqué. Ce n'est PAS le
remboursement d'un client donné (contrat, équipement, prix du magasin) : c'est dit à l'écran.
La procédure de régénération n'est pas dans ce dépôt public.

Tests : npm test (dont tests/pec/*.test.ts).
