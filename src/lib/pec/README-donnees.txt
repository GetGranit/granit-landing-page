Données carte mutuelle -> portail TP (optique), exportées de GetGranit/granit@d016145 (07/10/2026).
Sources : tp/platforms.py:101 (registre, alias, réseaux), tp/routing.py:19-38 (fold, catalogue),
tp/classify.py:53 (candidates_for_card), connectors/*/name_options_optique.json (catalogues),
connectors/*/constants.py Url.LOGIN (url), connectors/*/manifest.json + otp_email.py (tfa),
agents/agent_pec/simulation_optique.py:42 (simulable), medical_file_ocr/mutuelle_card.py (prompt).
Fermeture d'Oxantis le 26/10/2026 : source Acuité, absente du code. Le catalogue isanté n'est pas branché dans le registre, donc ignoré.
Réexporter : cloner le repo produit, puis `python3 pec-export.py <clone> pec-data` (scratchpad/pec-export.py).
url, tfa et note sont des tables écrites à la main dans le script : à revoir si un connecteur change.
Tests : copier dans un dossier, ajouter `with { type: "json" }` aux imports JSON,
puis `node --experimental-strip-types --test classify.test.ts`. Résultat au 07/10 : 20/20 OK.
Note de fermeture Oxantis réécrite à la main pour l'opticien dans src/lib/pec/platforms.json (le script d'export met une note interne).
