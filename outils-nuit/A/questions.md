# Outil A · Codes rejet · questions réelles des professionnels

Relevé du 18/11/2026. Questions reformulées, sans nom de personne, avec le lien public d'origine. Les forums lus sont surtout
ceux d'infirmiers et de kinés (les plus actifs sur le sujet) : les mécanismes (droits, doublons, ARL) sont les mêmes pour les
cinq métiers ciblés. Les questions de patients sont gardées à part : elles montrent ce qui bloque côté complémentaire.

## Par code

| Code (slug) | Question reformulée | Lien |
|---|---|---|
| 0450054 `noemie-0450054` | Patient en ALD et bénéficiaire de la CMU-C, facturé en mode dégradé : la facture revient « ETM non trouvée en BDO ». Comment régler la fiche patient avant de renvoyer ? | [infirmiers.com](https://www.infirmiers.com/forum/teletransmission-degradee-cmu-et-ald-t120885.html) |
| 0270051 `noemie-0270051` | Comment traiter un rejet « Bénéficiaire inconnu en BDO » dans mon logiciel ? (question d'aide d'éditeur ; requête déjà visible en Search Console) | [aide Caree](https://tuto.caree.fr/fr/article/comment-traiter-le-rejet-beneficiaire-inconnu-en-bdo-uk7a4m/) |
| 2900005, 0180051 | Après correction d'un rejet de la caisse, faut-il renvoyer la facture avec le même numéro ou un nouveau, et comment éviter un doublon sur la part mutuelle ? | [forum Vega](https://forum.epsilog.com/viewtopic.php?t=10696&start=16) |
| ARL 2502 `arl-2502` | Que faire quand on reçoit des ARL négatifs « Sécurité lot erronée » ? (question d'aide d'éditeur) | [aide Orisha](https://healthcare-orisha.my.site.com/CustomerCommunityKnowledge/s/article/DESMOS-Comment-traiter-la-r%C3%A9ception-d-ARL-n%C3%A9gatives-S%C3%A9curit%C3%A9-lot-erron%C3%A9e) |
| ARL (tous) | La caisse écrit qu'un lot a reçu un ARL négatif et reste impayé : comment le retransmettre, et faut-il tout refaire en mode dégradé ? | [forum L'Infirmière Libérale](https://www.l-idel.fr/forum/messages.html?idsujet=13803&page=0&pgi=0&show=) |
| « 153 », « 159 » (aucun code officiel) | Que veut dire le code rejet 153 (ou 159) de la CPAM ? (requête déjà visible en Search Console ; un site d'éditeur infirmier répond qu'un tel numéro seul n'a pas de sens universel) | [La Ruche](https://laruche.cbainfo.fr/gerer-cabinet-infirmier/facturation-idel/code-rejet-153-cpam/) |

## Par thème

### Droits du patient (exonération, bénéficiaire, caisse)
- Le patient a une ALD et une complémentaire gérée par la caisse, la facture revient « ETM non trouvée en BDO » : faut-il facturer
  à 100 % ou au taux normal ? ([infirmiers.com](https://www.infirmiers.com/forum/teletransmission-degradee-cmu-et-ald-t120885.html))
  → `noemie-0450054`, `noemie-0480054`.
- Comment traiter « bénéficiaire inconnu en BDO » ? ([aide Caree](https://tuto.caree.fr/fr/article/comment-traiter-le-rejet-beneficiaire-inconnu-en-bdo-uk7a4m/))
  → `noemie-0270051`.

### Doublons et renvois
- Refacturer après un rejet de la caisse crée-t-il un doublon sur la part complémentaire ? La caisse peut-elle demander le même
  numéro de facture ? ([forum Vega](https://forum.epsilog.com/viewtopic.php?t=10696&start=16)) → `noemie-2900005`, `noemie-0180051`,
  `noemie-traitement-caisse`.

### ARL négatif, absence d'ARL, sécurisation
- Un lot en ARL négatif signalé par courrier de la caisse : comment le renvoyer ? La caisse rejette-t-elle tout le lot ou une seule
  facture ? ([L'Infirmière Libérale](https://www.l-idel.fr/forum/messages.html?idsujet=13803&page=0&pgi=0&show=)) → réponse sourcée :
  `arl-*` (ARL de lot ou de facture, réémission unique, duplicata papier).
- « Sécurité lot erronée » : que faire ? ([aide Orisha](https://healthcare-orisha.my.site.com/CustomerCommunityKnowledge/s/article/DESMOS-Comment-traiter-la-r%C3%A9ception-d-ARL-n%C3%A9gatives-S%C3%A9curit%C3%A9-lot-erron%C3%A9e),
  [Julie](https://www.julie.fr/article-houston-probleme-de-teletransmission/)) → `arl-2502`.

### Part complémentaire (mutuelle, plateforme)
- La part mutuelle est rejetée (erreur de numéro d'organisme complémentaire) alors que la part caisse est déjà payée : comment
  renvoyer seulement à la complémentaire sans créer de facture en double ? ([forum Vega](https://forum.epsilog.com/viewtopic.php?t=12524))
  → pas de code officiel public ; à traiter dans un article ou dans l'outil C.
- Une mutuelle demande les « bordereaux NOEMIE » du patient pour régulariser des factures impayées : où les trouver ?
  ([forum Vega](https://forum.epsilog.com/viewtopic.php?p=141935)) → sujet d'article (retour NOEMIE et complémentaire).
- Une aide d'éditeur indique que le bouton « DRE d'annulation », proposé après un rejet de la part complémentaire, ne peut pas
  servir car les mutuelles ne traitent pas encore ces flux ([aide Maiia](https://maiia.zendesk.com/hc/fr/articles/16314500853650-G%C3%A9rer-les-retours)).

### Paiement et coordonnées
- Rejet au motif que la caisse du patient n'a pas le RIB du professionnel : qui appeler, la caisse ou l'éditeur ?
  ([infirmiers.com](https://www.infirmiers.com/forum/erreur-de-teletrans-avec-noemie-que-faire-t112467.html)) → pas de code lu ; à garder
  pour la page d'index (« rejets sans code »).
- Indu réclamé pour des pièces SCOR « non reçues » alors qu'elles ont été renvoyées ([forum Vega](https://forum.epsilog.com/viewtopic.php?p=141835))
  → hors codes rejet, sujet d'article.

### Côté patients (centres dentaires, orthodontie, ophtalmologie)
- Un centre dentaire a fait une erreur de télétransmission rejetée par la caisse : le remboursement de la mutuelle est bloqué faute
  de décompte ([forum ameli](https://forum-assures.ameli.fr/questions/3258388-teletransmission-effectuee-dois-faire)).
- Rejet de télétransmission chez l'orthodontiste, feuille papier envoyée, délai de 2 à 3 mois annoncé par la caisse
  ([forum ameli](https://forum-assures.ameli.fr/questions/3323120-delai-traitement-suite-probleme-teletransmission-orthodontiste)).
- Feuille de soins électronique rejetée pour un problème de codification des actes ; le patient demande une feuille papier
  ([forum ameli](https://forum-assures.ameli.fr/questions/1932023-refus-faire-feuille-soins-suite-rejet-teletransmission)).

Ces questions montrent l'enjeu pour un centre : un rejet non traité bloque aussi la part mutuelle du patient.

## Codes les plus demandés

1. **Requêtes déjà visibles en Search Console** (sans chiffre ici) : « liste codes rejets noemie », « code noemie »,
   « liste code rejet télétransmission », « liste des codes rejets cpam », « code rejet cpam », « motif rejet tiers payant »,
   « beneficiaire inconnu en bdo », « arl négatif », « code rejet 153 cpam ». Elles demandent d'abord **une liste** (page d'index de
   l'outil), puis des libellés précis (« bénéficiaire inconnu en BDO »).
2. **Codes repris par le plus de documents CPAM** (signe de fréquence, toutes professions) : 0700060 (8 documents) ; 0450054,
   0250050, 0270051, 2900005 et 0460051 (7) ; 0450056 et 0470049 (6) ; 0180051, 0460053 et 0650001 (5).
3. **Fréquence publiée par une CPAM** (optique, Loire-Atlantique, 2010, part des rejets) : 0450056 « ETM connue BDO non transmise »
   21,5 %, 0250050 « assuré absent de la BDO » 10,4 %, 0170050 « assuré non géré par la caisse » 9,0 %, 0460051 « prescripteur inconnu »
   6,4 %, 0270051 « bénéficiaire inconnu » 5,6 %, 2500064 « âge bénéficiaire > âge maximal » 5,0 %, 0180051 « facture déjà en traitement
   IRIS » 4,4 %, 2500079 « incompatibilité PRS-NAT/code LPP » 4,0 %. Chiffres anciens (2010), à citer avec leur date et leur source.
4. **Pages prioritaires proposées** : 0450054, 0450056, 0250050, 0270051, 0700060, 0460051, 2900005, 0180051, `noemie-traitement-caisse`,
   ARL 2004 (deux libellés), 2502, 3001, 4003, 5001 ; pour l'optique, les codes LPP (2500064, 2500079…) dès qu'ils sont confirmés.
