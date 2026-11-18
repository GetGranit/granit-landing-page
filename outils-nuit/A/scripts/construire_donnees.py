"""Construit outils-nuit/A/donnees.json (outil A · codes rejet).

Usage : python3 -I construire_donnees.py <dossier_extraits> <fichier_sortie>

- Les entrées NOEMIE « sûres » sont rédigées à la main ci-dessous, chacune à partir des
  documents CPAM / ameli.fr cités dans `source_ids` (libellé recopié tel quel).
- Les tables officielles complètes (ARL de l'annexe 1-B, messages de service de l'annexe 4
  du cahier des charges SESAM-Vitale v8.60 du 11/04/2025) sont reprises entièrement depuis
  les extraits produits par extraire_tables.py.
- Le lexique CPAM Loire-Atlantique d'octobre 2010 est repris entièrement, mais seuls les codes
  confirmés par un document CPAM daté de 2016 ou après passent en « sur » (entrées rédigées à
  la main) ; les autres restent « a_verifier » (document ancien).
- Quelques codes de l'OCT Résopharma (2013) sont ajoutés en « a_verifier ».
Le script vérifie : slugs uniques, voisins existants, sources existantes, champs obligatoires.
"""
import json
import re
import sys

GENERE_LE = "2026-11-18"
CONSULTE = "2026-11-18"
TOUS = ["optique-audio", "dentaire", "centre-de-sante", "pharmacie", "clinique-laboratoire"]

SOURCES = [
    {"id": "ameli-medecin-rejets-2026", "titre": "Les rejets de facturation et les solutions en cas de rejet (ameli.fr, espace Médecin)",
     "url": "https://www.ameli.fr/medecin/exercice-liberal/accompagnement-l-installation/l-accompagnement-dans-la-premiere-annee-d-exercice/les-rejets-de-facturation-et-les-solutions-en-cas-de-rejet",
     "editeur": "Assurance Maladie", "date_source": "2026-01-26", "consulte_le": CONSULTE},
    {"id": "ameli-pharmacien-retour-noemie-2022", "titre": "Le retour NOEMIE (ameli.fr, espace Pharmacien)",
     "url": "https://www.ameli.fr/pharmacien/exercice-professionnel/teletransmission/retour-noemie",
     "editeur": "Assurance Maladie", "date_source": "2022-04-29", "consulte_le": CONSULTE},
    {"id": "ameli-pharmacien-fse-mode-emploi-2021", "titre": "La télétransmission des feuilles de soins électroniques (FSE) : mode d'emploi (ameli.fr, espace Pharmacien)",
     "url": "https://www.ameli.fr/pharmacien/exercice-professionnel/teletransmission/teletransmission/teletransmission-fse-mode-emploi",
     "editeur": "Assurance Maladie", "date_source": "2021-01-02", "consulte_le": CONSULTE},
    {"id": "cpam38-pharmaciens-2023", "titre": "Les principaux motifs de rejets. Mémo facturation pharmaciens",
     "url": "https://local.pastel.cpam-isere.fr/wp-content/uploads/2024/12/20230830_MemoPS_facturation-pharmaciens.pdf",
     "editeur": "CPAM de l'Isère", "date_source": "2023-08-30", "consulte_le": CONSULTE},
    {"id": "cpam33-infirmiers-2019", "titre": "Rejets de télétransmission les plus courants. Infirmiers (mémo, MAJ 22.11.19)",
     "url": "https://www.ameli.fr/sites/default/files/memo_infirmiers_rejets_ok.pdf",
     "editeur": "CPAM de la Gironde (publié sur ameli.fr)", "date_source": "2019-11-22", "consulte_le": CONSULTE},
    {"id": "cpam33-pharmaciens-2019", "titre": "Rejets de télétransmission les plus courants. Pharmaciens (mémo, MAJ 12.04.19)",
     "url": "https://www.ameli.fr/content/memo-rejets-de-teletransmission-les-plus-courants-pharmaciens",
     "editeur": "CPAM de la Gironde (publié sur ameli.fr)", "date_source": "2019-04-12", "consulte_le": CONSULTE},
    {"id": "cpam33-dentistes-2019", "titre": "Rejets de télétransmission les plus courants. Chirurgiens-dentistes (mémo, MAJ 10.04.19)",
     "url": "https://www.ameli.fr/content/memo-rejets-de-teletransmission-les-plus-courants-chirurgiens-dentistes",
     "editeur": "CPAM de la Gironde (publié sur ameli.fr)", "date_source": "2019-04-10", "consulte_le": CONSULTE},
    {"id": "cpam33-laboratoires-2018", "titre": "Rejets de télétransmission les plus courants. Laboratoires (mémo, MAJ 29.06.18)",
     "url": "https://www.ameli.fr/content/memo-rejets-de-teletransmission-les-plus-courants-laboratoires",
     "editeur": "CPAM de la Gironde (publié sur ameli.fr)", "date_source": "2018-06-29", "consulte_le": CONSULTE},
    {"id": "cpam-ets-publics-2018", "titre": "Rejets de télétransmission les plus courants. Établissements publics (mémo, MAJ 26.06.18)",
     "url": "https://www.ameli.fr/sites/default/files/memo_ets_publics_rejets.pdf",
     "editeur": "Assurance Maladie (mémo CPAM publié sur ameli.fr ; caisse non nommée dans le texte lu)", "date_source": "2018-06-26", "consulte_le": CONSULTE},
    {"id": "cpam33-fournisseurs-2016", "titre": "Rejets de télétransmission les plus courants. Fournisseurs (mémo, MAJ 23.11.16)",
     "url": "https://www.cpam-bordeaux.fr/newsletter/2016/images/images_1216/MEMO_FOURNISSEURS_REJETS_OK.pdf",
     "editeur": "CPAM de la Gironde", "date_source": "2016-11-23", "consulte_le": CONSULTE},
    {"id": "cpam33-pharmaciens-2016", "titre": "Rejets de télétransmission les plus courants. Pharmaciens (mémo, MAJ 23.11.16)",
     "url": "https://www.cpam-bordeaux.fr/newsletter/2016/images/images_1216/MEMO_PHARMACIENS_REJETS_OK.pdf",
     "editeur": "CPAM de la Gironde", "date_source": "2016-11-23", "consulte_le": CONSULTE},
    {"id": "cpam33-laboratoires-2016", "titre": "Rejets de télétransmission les plus courants. Laboratoires (mémo, MAJ 23.11.16)",
     "url": "https://www.cpam-bordeaux.fr/newsletter/2016/images/images_1216/MEMO_LABORATOIRES_REJETS_OK.pdf",
     "editeur": "CPAM de la Gironde", "date_source": "2016-11-23", "consulte_le": CONSULTE},
    {"id": "cpam33-dentistes-2016", "titre": "Rejets de télétransmission les plus courants. Chirurgiens-dentistes (mémo, MAJ 23.11.16)",
     "url": "https://www.cpam-bordeaux.fr/newsletter/2016/images/images_1216/MEMO_CHIRDEN_REJETS_OK.pdf",
     "editeur": "CPAM de la Gironde", "date_source": "2016-11-23", "consulte_le": CONSULTE},
    {"id": "cpam67-medecins", "titre": "Mémo des rejets. Médecins généralistes & spécialistes",
     "url": "https://www.ameli.fr/sites/default/files/cpam-basrhin_rejets-medecins.pdf",
     "editeur": "CPAM du Bas-Rhin (publié sur ameli.fr)", "date_source": "non datée dans le texte lu", "consulte_le": CONSULTE},
    {"id": "cpam67-pharmaciens", "titre": "Mémo des rejets. Pharmaciens",
     "url": "https://www.ameli.fr/sites/default/files/cpam-basrhin_glossaire-rejets-pharmaciens.pdf",
     "editeur": "CPAM du Bas-Rhin (publié sur ameli.fr)", "date_source": "non datée dans le texte lu", "consulte_le": CONSULTE},
    {"id": "cpam67-dentistes", "titre": "Mémo des rejets. Chirurgiens-dentistes",
     "url": "https://www.ameli.fr/sites/default/files/cpam-basrhin_rejets-dentistes.pdf",
     "editeur": "CPAM du Bas-Rhin (publié sur ameli.fr)", "date_source": "non datée dans le texte lu", "consulte_le": CONSULTE},
    {"id": "cpam44-optique-2010", "titre": "Lexique des rejets. Fournitures optiques (octobre 2010)",
     "url": "http://www.myeasyoptic.com/wp-content/uploads/2015/12/Lexique_Rejets_Opticien.pdf",
     "editeur": "CPAM de la Loire-Atlantique (document hébergé par un éditeur de logiciel optique)", "date_source": "2010-10", "consulte_le": CONSULTE},
    {"id": "fiche-rejets-opticiens-bretagne", "titre": "Fiche technique. Traitement des rejets. Profession : opticiens",
     "url": "https://www.prooptic-idm.com/wiki/wp-content/uploads/2015/05/traite_DOCAMOAMC.pdf",
     "editeur": "Émetteur non nommé (contenu de CPAM, caisses de Bretagne citées), hébergé par un éditeur de logiciel optique",
     "date_source": "2009-04 (fichier modifié en 2015-05)", "consulte_le": CONSULTE},
    {"id": "gie-cdc-annexe1b-2025", "titre": "Cahier des charges SESAM-Vitale 1.40 addendum 8, annexe 1-B : principe de traitement des retours et gestion des ARL (version 8.60)",
     "url": "https://www.sesam-vitale.fr/documents/d/sesam-vitale/corpus-cdc_v8-50-2025-t1-documents-individuels-zip",
     "editeur": "GIE SESAM-Vitale", "date_source": "2025-04-11", "consulte_le": CONSULTE},
    {"id": "gie-cdc-annexe4-2025", "titre": "Cahier des charges SESAM-Vitale 1.40 addendum 8, annexe 4 : télécommunications et chiffrement de pièce jointe (version 8.60)",
     "url": "https://www.sesam-vitale.fr/documents/d/sesam-vitale/corpus-cdc_v8-50-2025-t1-documents-individuels-zip",
     "editeur": "GIE SESAM-Vitale", "date_source": "2025-04-11", "consulte_le": CONSULTE},
    {"id": "gie-fiche-info-094-2012", "titre": "Fiche d'information n° 94 : ajout d'un nouveau libellé pour l'ARL 2004",
     "url": "https://www.sesam-vitale.fr/documents/20195/20710/PDT-INF-094.pdf/f6a79adf-ea3b-4c37-afc2-298b6f93b2de?version=1.0",
     "editeur": "GIE SESAM-Vitale", "date_source": "2012-06-06", "consulte_le": CONSULTE},
    {"id": "gie-actu-addendum-2023", "titre": "Report de l'arrêt des flux en addendum 2 bis et addendum 3 au 31 décembre 2023",
     "url": "https://www.sesam-vitale.fr/web/sesam-vitale/actualites/-/blogs/report-de-l-arret-des-flux-en-addendum-2-bis-et-addendum-3-au-31-decembre-2023",
     "editeur": "GIE SESAM-Vitale", "date_source": "2023-06-27", "consulte_le": CONSULTE},
    {"id": "gie-cdc-noemie-ps-2004", "titre": "Cahier des charges NOEMIE PS, mai 2004 (entité 294 « ligne rejet », annexes R et S)",
     "url": "https://www.sesam-vitale.fr/documents/20182/55864/cdc_noemie-ps-052004.pdf",
     "editeur": "Assurance Maladie (document hébergé par le GIE SESAM-Vitale)", "date_source": "2004-05", "consulte_le": CONSULTE},
    {"id": "orisha-desmos-arl-securite-lot", "titre": "DESMOS : comment traiter la réception d'ARL négatives « Sécurité lot erronée » ?",
     "url": "https://healthcare-orisha.my.site.com/CustomerCommunityKnowledge/s/article/DESMOS-Comment-traiter-la-r%C3%A9ception-d-ARL-n%C3%A9gatives-S%C3%A9curit%C3%A9-lot-erron%C3%A9e",
     "editeur": "Orisha Healthcare (éditeur de logiciel, base d'aide publique)", "date_source": "non datée", "consulte_le": CONSULTE},
    {"id": "julie-teletransmission-2023", "titre": "« Houston : on a un problème… de télétransmission ! »",
     "url": "https://www.julie.fr/article-houston-probleme-de-teletransmission/",
     "editeur": "Julie (éditeur de logiciel dentaire)", "date_source": "2023-02-10", "consulte_le": CONSULTE},
    {"id": "resopharma-oct-2013", "titre": "Nomenclature des codes rejets de l'OCT",
     "url": "https://www.resopharma.fr/documents/normes/nomenclature_des_rejets_OCT.pdf",
     "editeur": "Résopharma (organisme concentrateur technique)", "date_source": "2013-04-17", "consulte_le": CONSULTE},
]

# ------------------------------------------------------------------ entrées NOEMIE rédigées
# Chaque texte reformule la source citée, sans rien y ajouter.
N = []


def noemie(code, libelle, explication, cause, action, metiers, sources, statut="sur", voisins=(),
           variantes=(), professions=(), questions=(), note=None, origine="source", page=True, ecritures=None):
    e = {
        "code": code,
        "slug": f"noemie-{code}",
        "famille": "noemie",
        "emetteur": "Assurance Maladie (caisse primaire, retour NOEMIE)",
        "libelle_officiel": libelle,
        "explication": explication,
        "cause": cause,
        "action": action,
        "cause_action_origine": origine,
        "metiers": metiers,
        "codes_voisins": list(voisins),
        "source_ids": list(sources),
        "statut": statut,
    }
    if questions:
        e["questions_reelles"] = list(questions)
    if note:
        e["note_verification"] = note
    if variantes:
        e["libelles_variantes"] = [{"texte": t, "source_id": s} for t, s in variantes]
    if professions:
        e["professions_citees_par_les_sources"] = list(professions)
    e["autres_ecritures"] = ecritures if ecritures is not None else [f"{code[:4]} {code[4:]}", f"{code[:4]}-{code[4:]}", code.lstrip("0")]
    e["page_conseillee"] = page
    N.append(e)


NOTE_CODES = ("Libellés publiés par des CPAM du régime général ; le libellé reçu dans votre propre retour "
              "fait foi et un autre régime peut employer un autre texte.")

noemie("0450054", "ETM NON TROUVEE EN BDO",
       "La facture demande une prise en charge à 100 % (exonération du ticket modérateur, ETM) que la caisse ne retrouve pas dans son fichier des assurés (BDO). Le patient n'est pas ou plus pris en charge à 100 %, ou le code d'exonération transmis est erroné.",
       "Exonération saisie à tort ou périmée (ALD, maternité, invalidité…), code d'exonération erroné ; en mode dégradé, exonération indiquée sans l'avoir vérifiée ; pour la CPAM du Bas-Rhin, forçage des données de la carte Vitale.",
       "Vérifiez les droits du patient avant de refacturer : ADRi dans votre logiciel, amelipro, attestation de droits et notification de prise en charge à 100 %. Retransmettez avec le bon code d'exonération (ou sans exonération si elle n'existe plus) et invitez le patient à mettre à jour sa carte Vitale.",
       TOUS, ["cpam33-infirmiers-2019", "cpam38-pharmaciens-2023", "cpam33-fournisseurs-2016", "cpam-ets-publics-2018", "cpam67-medecins", "cpam44-optique-2010", "fiche-rejets-opticiens-bretagne"],
       voisins=["noemie-0450056", "noemie-0450072", "noemie-0450082", "noemie-0700060", "noemie-0450057"],
       variantes=[("Exoneration du ticket modérateur absente au référentiel", "cpam38-pharmaciens-2023"),
                  ("ETM non trouvée en BDO", "cpam33-fournisseurs-2016"),
                  ("ETM NON TROUVE EN BDO", "cpam-ets-publics-2018")],
       professions=["infirmiers", "pharmaciens", "fournisseurs", "établissements publics", "médecins", "opticiens"],
       questions=["Patient en ALD et bénéficiaire de la CMU-C, facturé en mode dégradé : la facture revient « ETM non trouvée en BDO ». Comment régler la fiche patient avant de renvoyer ?"],
       note=NOTE_CODES)

noemie("0450056", "ETM CONNUE BDO NON TRANSMISE",
       "Le patient bénéficie d'une exonération du ticket modérateur (prise en charge à 100 %) connue de la caisse, mais la facture a été envoyée sans cette exonération.",
       "Exonération (ALD, régime exonérant, maternité) non saisie dans la facture ; en mode dégradé, facture transmise au taux normal alors que l'assuré est exonéré (CPAM de la Loire-Atlantique).",
       "Vérifiez les droits du patient (amelipro, identification du patient, ADRi, attestation de droits), puis retransmettez avec le code d'exonération adéquat. Invitez le patient à mettre à jour sa carte Vitale.",
       TOUS, ["cpam33-pharmaciens-2019", "cpam33-infirmiers-2019", "cpam38-pharmaciens-2023", "cpam33-fournisseurs-2016", "cpam44-optique-2010", "fiche-rejets-opticiens-bretagne"],
       voisins=["noemie-0450054", "noemie-0450082", "noemie-0450072", "noemie-0700060"],
       variantes=[("ETM CONNUE EN BDO MAIS NON TRANSMISE", "cpam33-infirmiers-2019"),
                  ("Exoneration du ticket modérateur connue au référentiel non transmise", "cpam38-pharmaciens-2023")],
       professions=["pharmaciens", "infirmiers", "fournisseurs", "opticiens"], note=NOTE_CODES)

noemie("0450072", "DIVERGENCE VITALE/EXO BDO ABSENTE",
       "Une exonération figure sur la carte Vitale, mais la caisse ne la retrouve pas dans son fichier à la date des soins.",
       "Carte Vitale pas à jour par rapport au fichier de la caisse ; exonération terminée ou différente de celle de la carte ; données de la facture (caisse, numéro de sécurité sociale, date de naissance) à revoir.",
       "Consultez les droits du patient (amelipro ou attestation de droits). Avant de retransmettre, vérifiez sur la facture la caisse d'affiliation, le numéro de sécurité sociale de l'assuré, la date de naissance et les exonérations. Actualisez votre fichier patients et rappelez au patient de mettre à jour sa carte Vitale.",
       TOUS, ["cpam33-laboratoires-2018", "cpam33-laboratoires-2016", "cpam38-pharmaciens-2023", "cpam67-medecins"],
       voisins=["noemie-0450054", "noemie-0450056", "noemie-0700060"],
       variantes=[("SITUATION D'EXONERATION INCONNUE POUR LE BENEFICIAIRE", "cpam33-laboratoires-2016"),
                  ("Situation d'exonération inconnue pour ce bénéficiaire", "cpam38-pharmaciens-2023")],
       professions=["laboratoires", "pharmaciens", "médecins"],
       note="Deux libellés publiés pour le même code selon la caisse et l'année (« DIVERGENCE VITALE/EXO BDO ABSENTE » en 2018, « Situation d'exonération inconnue… » en 2016 et 2023) ; le sens est le même. La CPAM du Bas-Rhin associe aussi le code 0450071 à ce libellé. " + NOTE_CODES)

noemie("0450082", "ETM MATERNITE EN BDO MAIS NON TRANSMISE",
       "La patiente a une exonération au titre de la maternité en cours, connue de la caisse, mais la facture a été envoyée sans exonération.",
       "Exonération maternité non saisie ; en mode dégradé, facture non établie à 100 % alors que l'assurée en bénéficie (CPAM de la Loire-Atlantique).",
       "Vérifiez les droits de la patiente (consultation des droits, carte Vitale à jour, attestation), corrigez l'exonération de la facture puis retransmettez. Pour les établissements, le mémo demande de retransmettre en changeant le numéro de facture.",
       TOUS, ["cpam-ets-publics-2018", "cpam38-pharmaciens-2023", "cpam44-optique-2010", "fiche-rejets-opticiens-bretagne"],
       voisins=["noemie-0450056", "noemie-0450054", "noemie-0700060"],
       variantes=[("Exonération maternité connue de notre référentiel n'a pas été transmise", "cpam38-pharmaciens-2023"),
                  ("ETM MAT EN BDO MAIS NON TRANSMISE", "cpam44-optique-2010")],
       professions=["établissements publics", "pharmaciens", "opticiens"], note=NOTE_CODES)

noemie("0250050", "ASSURE ABSENT DE LA BDO",
       "La caisse qui a reçu la facture ne connaît pas l'assuré dans son fichier : il ne dépend pas ou plus de cette caisse, ou son numéro d'identification est erroné.",
       "Mauvais organisme d'affiliation choisi (fréquent en mode dégradé) ; numéro de sécurité sociale erroné ; bénéficiaire connu sous son propre numéro.",
       "Vérifiez le numéro de sécurité sociale et la caisse d'affiliation (ADRi, amelipro, attestation de droits), puis transmettez la facture à l'organisme compétent. La CPAM de l'Isère recommande de mettre à jour la carte Vitale, de facturer en SESAM-Vitale sécurisé et d'éviter de forcer les données lues sur la carte.",
       TOUS, ["cpam33-laboratoires-2018", "cpam38-pharmaciens-2023", "cpam33-fournisseurs-2016", "cpam33-laboratoires-2016", "cpam67-medecins", "cpam44-optique-2010", "fiche-rejets-opticiens-bretagne"],
       voisins=["noemie-0270051", "noemie-0170050", "noemie-0317051"],
       variantes=[("Assuré absent de notre réferentiel assuré", "cpam38-pharmaciens-2023"),
                  ("Assuré absent en BDO", "cpam33-fournisseurs-2016"),
                  ("L'assuré est absent de notre référentiel", "cpam33-laboratoires-2016")],
       professions=["laboratoires", "pharmaciens", "fournisseurs", "médecins", "opticiens"], note=NOTE_CODES)

noemie("0270051", "BENEFICIAIRE INCONNU DANS LA BDO",
       "L'assuré est connu, mais pas le bénéficiaire des soins tel qu'il a été saisi : la date de naissance ou le rang ne correspondent pas, ou la personne est affiliée sous un autre numéro ou à un autre organisme.",
       "Date de naissance ou rang de naissance erronés ; bénéficiaire passé du statut d'ayant droit à celui d'assuré (il a son propre numéro) ; affiliation à un autre organisme.",
       "Vérifiez la date de naissance, le rang et le numéro sous lequel le patient est couvert (ADRi, amelipro, attestation de droits), puis retransmettez à la caisse dont il dépend avec ces données exactes. Pour les établissements, le mémo demande de changer le numéro de facture.",
       TOUS, ["cpam33-laboratoires-2018", "cpam-ets-publics-2018", "cpam38-pharmaciens-2023", "cpam33-laboratoires-2016", "cpam67-medecins", "cpam44-optique-2010", "fiche-rejets-opticiens-bretagne"],
       voisins=["noemie-0250050", "noemie-0270052", "noemie-0317051"],
       variantes=[("BENEFICIAIRE DE PRESTATIONS INCONNU DANS LA BDO", "cpam-ets-publics-2018"),
                  ("Bénéficiaire de prestations inconnu dans le référentiel assuré", "cpam38-pharmaciens-2023"),
                  ("Bénéficiaire de prestations inconnu dans BDO", "cpam67-medecins")],
       professions=["laboratoires", "établissements publics", "pharmaciens", "médecins", "opticiens"], note=NOTE_CODES)

noemie("0700060", "ECART TAUX DEMANDE / TAUX CALCULE",
       "Le taux de remboursement demandé dans la facture n'est pas celui que la caisse calcule pour la situation du patient.",
       "Taux de prise en charge ou nature d'assurance qui ne correspond pas à la situation de l'assuré : facture à 100 % sans motif d'exonération, exonération (invalidité, maternité…) non prise en compte, ou situation particulière (AME…).",
       "Avant de retransmettre, vérifiez pour chaque prestation le taux demandé au regard du taux de remboursement et des exonérations du patient (amelipro ou ADRi à partir du NIR ou de la carte Vitale). Invitez le patient à mettre à jour sa carte Vitale.",
       TOUS, ["cpam33-fournisseurs-2016", "cpam33-laboratoires-2016", "cpam38-pharmaciens-2023", "cpam67-medecins", "cpam67-pharmaciens", "cpam67-dentistes", "cpam44-optique-2010", "fiche-rejets-opticiens-bretagne"],
       voisins=["noemie-0450054", "noemie-0450056", "noemie-0450072", "noemie-0450082"],
       variantes=[("LE TAUX DE REMBOURSEMENT DEMAMDE EST DIFFERENT DU TAUX DE REMBOURSEMENT CALCULE", "cpam33-laboratoires-2016"),
                  ("Taux de remboursement demandé est différent du taux de remboursement calculé en fonction de la situation du bénéficiaire des soins (AME, maternité, invalidité,…)", "cpam38-pharmaciens-2023")],
       professions=["fournisseurs", "laboratoires", "pharmaciens", "médecins", "chirurgiens-dentistes", "opticiens"], note=NOTE_CODES)

noemie("0460051", "PRESCRIPTEUR INCONNU DANS LE REPERTOIRE NATIONAL",
       "Le numéro du prescripteur indiqué dans la facture est inconnu du répertoire national des professionnels de santé, ou erroné.",
       "Numéro de prescripteur mal saisi ou mal enregistré dans votre fichier des prescripteurs ; prescripteur salarié, remplaçant ou militaire saisi avec un numéro inadapté.",
       "Reprenez le numéro qui figure sur l'ordonnance (recherche par numéro, pas par nom) et corrigez votre fichier des prescripteurs. Prescripteur salarié : numéro de la structure, avec la spécialité. Remplaçant : numéro du médecin remplacé. Médecin militaire : FINESS 750821092 du Service de santé des armées (mémo infirmiers de la CPAM de la Gironde).",
       ["pharmacie", "optique-audio", "centre-de-sante", "clinique-laboratoire"],
       ["cpam33-pharmaciens-2019", "cpam33-infirmiers-2019", "cpam38-pharmaciens-2023", "cpam33-pharmaciens-2016", "cpam67-pharmaciens", "cpam44-optique-2010", "fiche-rejets-opticiens-bretagne"],
       voisins=["noemie-0460053", "noemie-0470049", "noemie-0460030"],
       variantes=[("PRESCRIPTEUR INCONNU DANS REPERTOIRE NATIONAL", "cpam33-pharmaciens-2019"),
                  ("Prescripteur inconnu au fichier des professionnels de santé", "cpam38-pharmaciens-2023"),
                  ("PRESCRIPT. INCONNU DANS REP. NAT.", "cpam67-pharmaciens")],
       professions=["pharmaciens", "infirmiers", "opticiens"],
       note="Les sources visent les pharmaciens, les infirmiers et les opticiens ; le rattachement aux centres de santé et aux laboratoires est déduit (soins sur prescription). " + NOTE_CODES)

noemie("0460053", "PRESCRIPTEUR ETABLISSEMENT INCONNU",
       "L'établissement prescripteur indiqué dans la facture est inconnu du fichier national des établissements.",
       "Numéro FINESS erroné ou mal enregistré ; numéro du médecin saisi à la place de celui de l'établissement ; FINESS juridique saisi au lieu du FINESS géographique (CPAM de l'Isère).",
       "Indiquez le numéro de l'établissement qui figure sur l'ordonnance (à défaut, recherchez-le sur finess.sante.gouv.fr), le FINESS géographique et non le juridique, et supprimez le numéro erroné de votre fichier des prescripteurs.",
       ["pharmacie", "optique-audio", "centre-de-sante", "clinique-laboratoire"],
       ["cpam33-pharmaciens-2019", "cpam38-pharmaciens-2023", "cpam33-pharmaciens-2016", "cpam67-pharmaciens", "cpam44-optique-2010"],
       voisins=["noemie-0460051", "noemie-0470049"],
       variantes=[("L'établissement prescripteur est inconnu au fichier national des établissements", "cpam38-pharmaciens-2023"),
                  ("PRESCRIPTEUR ETAB. INCONNU", "cpam67-pharmaciens")],
       professions=["pharmaciens", "opticiens"],
       note="Rattachement aux centres de santé et aux laboratoires déduit (soins sur prescription). " + NOTE_CODES)

noemie("0470049", "PRESCRIPTION INTERDITE A CETTE DATE",
       "À la date de prescription indiquée, le prescripteur n'était pas autorisé à prescrire selon le fichier de la caisse : date antérieure à son début d'exercice, postérieure à sa fin d'exercice, ou prescripteur décédé.",
       "Date de prescription mal saisie ; numéro de prescripteur qui n'était pas valide à cette date ; pour les dentistes, date d'accord préalable antérieure au début d'exercice ou changement de numéro de praticien.",
       "Vérifiez sur l'ordonnance le prescripteur et la date de prescription, ainsi que la validité du numéro utilisé (entre les dates de début et de fin d'exercice, en cas de changement de numéro), puis retransmettez.",
       TOUS, ["cpam33-laboratoires-2018", "cpam33-laboratoires-2016", "cpam33-dentistes-2019", "cpam67-dentistes", "cpam44-optique-2010", "fiche-rejets-opticiens-bretagne"],
       voisins=["noemie-0460051", "noemie-0730055", "noemie-0470004"],
       variantes=[("Prescription interdite à cette date", "cpam33-dentistes-2019"),
                  ("PRESC. INTERDITE A CETTE DATE", "cpam44-optique-2010")],
       professions=["laboratoires", "chirurgiens-dentistes", "opticiens"], note=NOTE_CODES)

noemie("0730055", "INCOMP. NATURE. EXERCICE. DATE PRESTATIONS",
       "Votre numéro d'exécutant n'est pas valide à la date des soins : la caisse vous connaît, mais les soins facturés sont antérieurs à votre date de début d'exercice (ou hors de la période sous laquelle vous êtes connu).",
       "Soins antérieurs à la date d'installation déclarée ; changement de numéro d'identification au cours d'une série d'actes ; nouvelle carte CPS non utilisée ou numéro mal paramétré dans le logiciel.",
       "Vérifiez que la facturation est dans la période où votre numéro est valide. En cas de changement de numéro, utilisez votre nouvelle carte CPS et vérifiez le paramétrage du logiciel ; la CPAM du Bas-Rhin conseille de scinder les soins en deux factures si le numéro a changé en cours de série.",
       TOUS, ["cpam33-infirmiers-2019", "cpam33-laboratoires-2018", "cpam67-dentistes", "cpam44-optique-2010"],
       voisins=["noemie-0470049", "noemie-0100052"],
       variantes=[("INCOMPATIBILITE NATURE EXERCICE / DATE PRESTATION", "cpam33-laboratoires-2018"),
                  ("La nature d'exercice du praticien exécutant n'est pas valide à la date des soins", "cpam67-dentistes"),
                  ("INCOMP. NAT. EXERCICE/DATE PREST.", "cpam44-optique-2010")],
       professions=["infirmiers", "laboratoires", "chirurgiens-dentistes", "opticiens"], note=NOTE_CODES)

noemie("0480054", "FACT TPC INCOM. TYPE CONTRAT",
       "Le type de contrat de complémentaire transmis dans la facture n'est pas celui que la caisse connaît pour ce patient. Le mémo de 2019 parle de contrat CMU-C ou ACS, celui de 2023 de contrat de complémentaire santé solidaire (C2S).",
       "Droits du patient pas à jour dans la facture ou sur la carte Vitale (contrat transmis différent de celui du référentiel).",
       "Vérifiez les droits du patient avant de refacturer (ADRi, amelipro, attestation de droits) et invitez-le à mettre à jour sa carte Vitale.",
       TOUS, ["cpam33-infirmiers-2019", "cpam38-pharmaciens-2023"],
       voisins=["noemie-0450054", "noemie-0700060"],
       variantes=[("Contrat C2S transmis différent de celui présent au référentiel", "cpam38-pharmaciens-2023")],
       professions=["infirmiers", "pharmaciens"], note=NOTE_CODES)

noemie("2900005", "FACTURE DEJA PAYEE",
       "Une facture portant le même numéro a déjà été réglée pour le même bénéficiaire : la caisse considère l'envoi comme un doublon.",
       "Facture renvoyée alors qu'elle avait déjà été payée ; facture rectificative télétransmise ; compteur de numéros de facture revenu en arrière après restauration d'une sauvegarde (CPAM de la Loire-Atlantique).",
       "Ne retransmettez pas. Vérifiez vos ARL, vos retours NOEMIE et vos paiements sur amelipro. Si le paiement est introuvable ou s'il s'agit d'une régularisation, faites une réclamation à votre caisse : le mémo de la CPAM de la Gironde précise qu'en cas de litige la télétransmission spontanée n'est pas autorisée.",
       TOUS, ["cpam33-pharmaciens-2019", "cpam38-pharmaciens-2023", "cpam33-pharmaciens-2016", "cpam67-medecins", "cpam67-pharmaciens", "cpam44-optique-2010", "fiche-rejets-opticiens-bretagne"],
       voisins=["noemie-0180051", "noemie-2900230", "noemie-traitement-caisse"],
       variantes=[("Facture déjà payée", "cpam38-pharmaciens-2023")],
       professions=["pharmaciens", "médecins", "opticiens"],
       questions=["Après correction d'un rejet de la caisse, faut-il renvoyer la facture avec le même numéro ou un nouveau, et comment éviter de créer un doublon sur la part mutuelle ?"],
       note=NOTE_CODES)

noemie("0180051", "FACT. DEJA EN TRAITEMENT IRIS",
       "Une facture portant le même numéro est déjà en cours de traitement à la caisse : c'est un doublon.",
       "Facture déjà transmise dans un autre lot ; délivrance familiale où le même bénéficiaire a été sélectionné pour plusieurs personnes (CPAM de l'Isère) ; restauration d'une sauvegarde qui a fait revenir le compteur de factures en arrière (CPAM de la Loire-Atlantique).",
       "Ne refacturez pas. En cas de doute sur la réception de vos lots, demandez à la caisse s'ils ont déjà été traités avant toute nouvelle transmission ; pour une régularisation, faites une réclamation à la caisse gestionnaire. En délivrance familiale, sélectionnez le bon bénéficiaire pour chaque délivrance. La CPAM de la Gironde (dentistes) conseille de contacter votre assistance informatique.",
       TOUS, ["cpam38-pharmaciens-2023", "cpam33-dentistes-2019", "cpam67-pharmaciens", "cpam44-optique-2010", "fiche-rejets-opticiens-bretagne"],
       voisins=["noemie-2900005", "noemie-0172050", "noemie-traitement-caisse"],
       variantes=[("Facture déjà en traitement IRIS", "cpam38-pharmaciens-2023"),
                  ("Facture déjà en cours de traitement IRIS", "cpam33-dentistes-2019")],
       professions=["pharmaciens", "chirurgiens-dentistes", "opticiens"],
       questions=["Après correction d'un rejet de la caisse, faut-il renvoyer la facture avec le même numéro ou un nouveau, et comment éviter de créer un doublon sur la part mutuelle ?"],
       note=NOTE_CODES)

noemie("2900230", "Multiples facturations dentistes",
       "Deux actes identiques ont été facturés le même jour pour le même bénéficiaire.",
       "Erreur de saisie (même acte saisi deux fois, actes de plusieurs patients saisis sur un seul) ; ou actes réellement répétés le même jour, que la caisse vérifie.",
       "Si la feuille de soins électronique n'est pas encore partie, annulez-la (avec l'aide de votre éditeur si besoin). Si elle est déjà télétransmise, demandez son annulation à votre caisse le jour même (la CPAM de la Gironde donne une adresse dédiée). Pour la CPAM du Bas-Rhin, des actes réellement effectués peuvent donner lieu à une vérification par un agent, et une erreur de bénéficiaire se corrige par une feuille de soins rectificative.",
       ["dentaire"], ["cpam33-dentistes-2019", "cpam33-dentistes-2016", "cpam67-dentistes"],
       voisins=["noemie-2900005", "noemie-2600710", "noemie-0450097"],
       variantes=[("Multiple facturation dentiste à J", "cpam67-dentistes")],
       professions=["chirurgiens-dentistes"], note=NOTE_CODES)

noemie("0450097", "Soins de suite sans date d'examen valide",
       "Des soins de suite du dispositif de prévention bucco-dentaire (M'T dents) ont été facturés hors de la période de prise en charge, ou avant que l'examen de prévention ne soit réglé et enregistré par la caisse.",
       "Prise en charge M'T dents plus valable ; soins saisis avant la date anniversaire de l'enfant ; enfant rattaché sous un autre numéro que celui de la prise en charge ; soins de suite facturés avant que l'examen de prévention soit réglé et enregistré.",
       "Vérifiez la période de prise en charge ou l'âge de l'enfant, et le numéro de sécurité sociale sous lequel il est couvert (celui de la prise en charge M'T dents). Établissez deux factures distinctes : une pour l'examen de prévention, une seconde pour les soins de suite.",
       ["dentaire"], ["cpam33-dentistes-2019", "cpam33-dentistes-2016", "cpam67-dentistes"],
       voisins=["noemie-0600064", "noemie-0600069", "noemie-2900230"],
       professions=["chirurgiens-dentistes"], note=NOTE_CODES)

noemie("0600064", "Rubrique bucco-dentaire absente",
       "La prise en charge de prévention bucco-dentaire du bénéficiaire n'existe pas sous le numéro d'immatriculation transmis.",
       "Examen ou soins facturés sous un autre numéro de sécurité sociale que celui inscrit sur l'imprimé de prévention bucco-dentaire envoyé à l'assuré.",
       "Vérifiez le numéro de sécurité sociale sous lequel l'enfant est couvert et reprenez celui de l'imprimé « Examen de prévention bucco-dentaire » (M'T dents) : l'examen et les soins de suite doivent être télétransmis sous ce numéro.",
       ["dentaire"], ["cpam33-dentistes-2019"],
       voisins=["noemie-0450097", "noemie-0600069"],
       professions=["chirurgiens-dentistes"],
       note="Le texte extrait du mémo coupe le mot en « bucco- dentaire » (fin de ligne) ; libellé recollé. " + NOTE_CODES)

noemie("0600069", "Rubrique Prévention absente",
       "La rubrique prévention est absente du dossier du bénéficiaire : la caisse n'a pas de prise en charge de prévention bucco-dentaire enregistrée pour lui (le mémo cite la prévention des femmes enceintes).",
       "Dossier de l'assuré à mettre à jour par la caisse ; aucune prise en charge délivrée sous le numéro transmis ; bénéficiaire rattaché à une autre caisse.",
       "Vérifiez sous quel numéro de sécurité sociale l'imprimé de prévention a été délivré et l'organisme d'affiliation du bénéficiaire. Quand le dossier doit être mis à jour, les CPAM de la Gironde et du Bas-Rhin indiquent prendre en charge le traitement de la facture.",
       ["dentaire"], ["cpam33-dentistes-2019", "cpam67-dentistes"],
       voisins=["noemie-0450097", "noemie-0600064"],
       variantes=[("La rubrique prévention de type EBFE est absente au référentiel", "cpam67-dentistes")],
       professions=["chirurgiens-dentistes"],
       note="Le mémo de 2019 précise une période de grossesse ouvrant droit à la prévention : elle n'est pas reprise ici car la règle a pu évoluer ; à vérifier sur ameli.fr avant de la citer. " + NOTE_CODES)

noemie("2600710", "Localisation dentaire numéro de dent. transmis incompatible avec l'acte",
       "Le numéro de dent (ou la localisation) indiqué n'est pas compatible avec l'acte CCAM facturé.",
       "Localisation non conforme à la CCAM pour cet acte (numéro de dent, sextant, quadrant, maxillaire, mandibule) ; table des localisations du logiciel pas à jour (CPAM du Bas-Rhin).",
       "Vérifiez la compatibilité de l'acte CCAM avec la localisation dentaire (document de synthèse CCAM sur ameli.fr) et, si besoin, la mise à jour des localisations dentaires de votre logiciel, puis retransmettez.",
       ["dentaire"], ["cpam33-dentistes-2016", "cpam67-dentistes"],
       voisins=["noemie-2600649", "noemie-2600700", "noemie-0568002"],
       variantes=[("Localisation dentaire numéro de dent transmis incompatible avec l'acte dentaire.", "cpam67-dentistes")],
       professions=["chirurgiens-dentistes"],
       note="Libellé recopié tel qu'il apparaît dans le texte du mémo (« dent. », coupure de ligne). " + NOTE_CODES)

noemie("2600649", "Code association transmis différent",
       "Le code association saisi sur un acte CCAM est erroné, ou certains actes facturés ensemble ne peuvent pas être associés.",
       "Codes association incompatibles entre eux ou mal choisis au regard des règles d'association de la CCAM.",
       "Vérifiez les codes association avec les règles de la CCAM (document de synthèse et cahier d'exemples sur ameli.fr). Le mémo rappelle notamment que le code association 4 est incompatible avec les codes 1 et 2, et qu'avec des actes en codes 1 et 2, les autres actes à taux plein prennent le code 1.",
       ["dentaire"], ["cpam33-dentistes-2016"],
       voisins=["noemie-2600710", "noemie-2600650"],
       professions=["chirurgiens-dentistes"],
       note="Règles d'association citées d'après le mémo de novembre 2016 ; à confronter à la version en vigueur de la CCAM. " + NOTE_CODES)

noemie("2600650", "CODE « ASSOCIATION NON PREVUE » NON RENSEIGNE ET PAS D'ASSOCIATION MEDICALE PREVUE",
       "Le code association n'a pas été transmis alors qu'il est obligatoire pour l'acte CCAM facturé avec un autre acte.",
       "Zone association laissée vide alors que l'association des deux actes n'est pas prévue par la CCAM.",
       "Saisissez le code association dès que l'association des actes n'est pas prévue par la CCAM. Inutile s'il s'agit d'un acte de la partie « Associations » ; mais si la facture contient au moins un acte qui ne peut pas être associé, un code association est à indiquer sur tous les actes.",
       ["clinique-laboratoire"], ["cpam-ets-publics-2018"],
       voisins=["noemie-2600649", "noemie-0710060"],
       professions=["établissements publics"],
       note="Source rédigée pour les établissements publics de santé ; le rattachement aux cliniques est à confirmer. " + NOTE_CODES)

noemie("0710060", "LE MONTANT DEMANDE EST SUPERIEUR AU MONTANT CALCULE EN T2A PUBLIQUE",
       "Le montant demandé en part obligatoire est supérieur à celui que calcule la caisse. Ce rejet concerne la facturation des établissements publics (T2A publique).",
       "Parcours de soins coordonnés mal saisi : la base de remboursement dépend de la déclaration d'un médecin traitant et du respect du parcours.",
       "Saisissez le parcours de soins (obligatoire) et ajustez le montant en conséquence, puis retransmettez en changeant le numéro de la facture, comme le demande le mémo.",
       ["clinique-laboratoire"], ["cpam-ets-publics-2018"],
       voisins=["noemie-2600650", "noemie-0700060"],
       professions=["établissements publics"],
       note="Les taux de base cités par le mémo de 2018 ne sont pas repris ici (à vérifier avant publication). Concerne les établissements publics, pas les cliniques privées. " + NOTE_CODES,
       page=False)

noemie("0650001", "Prix unitaire absent",
       "Pour la prestation facturée, le prix unitaire doit être renseigné et différent de zéro ; il manque dans la facture.",
       "Acte non remboursable télétransmis à la caisse ; ou acte remboursable envoyé sans prix unitaire, souvent faute de mise à jour des tarifs du logiciel.",
       "Vérifiez le prix unitaire en vigueur à la date des actes et ne télétransmettez que les actes remboursables par la caisse. Pour un acte non remboursable, la CPAM du Bas-Rhin indique de remettre au patient une facture sur papier libre pour sa complémentaire. Mettez à jour votre logiciel lors des changements de tarifs.",
       ["dentaire", "optique-audio"], ["cpam33-dentistes-2019", "cpam33-dentistes-2016", "cpam67-dentistes", "cpam44-optique-2010", "fiche-rejets-opticiens-bretagne"],
       voisins=["noemie-1170001", "noemie-2520001"],
       variantes=[("PRIX UNITAIRE ABSENT", "cpam44-optique-2010")],
       professions=["chirurgiens-dentistes", "opticiens"], note=NOTE_CODES)

noemie("4000067", "PU TRANSMIS > PU OPPOSABLE",
       "Le prix unitaire transmis pour un médicament n'est plus celui en vigueur à la date de délivrance (il est supérieur au prix opposable).",
       "Prix du médicament changé, ancien prix encore présent dans la facture ou dans la base du logiciel.",
       "Vérifiez que le prix unitaire des médicaments de la facture n'est pas supérieur à celui en vigueur à la date de délivrance (bases de codage et base des médicaments sur ameli.fr), puis retransmettez.",
       ["pharmacie"], ["cpam33-pharmaciens-2019", "cpam33-pharmaciens-2016"],
       voisins=["noemie-4000055", "noemie-4000057", "noemie-4000072"],
       professions=["pharmaciens"], note=NOTE_CODES)

noemie("4000055", "Le prix unitaire transmis est supérieur à celui de la base des médicaments",
       "Le prix unitaire transmis pour un médicament dépasse celui de la base des médicaments.",
       "Changement de tarif pas encore pris en compte ou date d'entrée en vigueur du nouveau tarif mal appliquée.",
       "En cas de changement tarifaire, vérifiez la date d'entrée en vigueur du nouveau tarif avant de retransmettre.",
       ["pharmacie"], ["cpam38-pharmaciens-2023"],
       voisins=["noemie-4000067", "noemie-4000057"],
       professions=["pharmaciens"],
       note="Texte de la colonne « Motif » du mémo 2023 (le mémo ne distingue pas libellé du retour et motif). " + NOTE_CODES)

noemie("4000057", "La quantité de conditionnement délivrée est supérieure au seuil maximal autorisé",
       "La quantité délivrée pour un code CIP dépasse le seuil autorisé dans la base des médicaments.",
       "Délivrance non conforme à la prescription ou au-delà de la durée autorisée (la CPAM du Bas-Rhin cite les délivrances de plus de 6 mois et les stupéfiants au-delà de 28 jours).",
       "En cas de doute sur le seuil, vérifiez la base nationale des médicaments et délivrez conformément à la prescription. Pour un départ à l'étranger hors Union européenne, la CPAM de l'Isère rappelle qu'une délivrance de plus d'un mois est soumise à l'envoi d'une attestation sur l'honneur avec la prescription.",
       ["pharmacie"], ["cpam38-pharmaciens-2023", "cpam67-pharmaciens"],
       voisins=["noemie-4000067", "noemie-4000055"],
       variantes=[("QTE DELIVREE ABERRANTE POUR 1 CIP", "cpam67-pharmaciens")],
       professions=["pharmaciens"],
       note="Texte de la colonne « Motif » du mémo 2023 ; libellé court du retour cité par la CPAM du Bas-Rhin en variante. " + NOTE_CODES)

noemie("4000072", "Le vaccin anti grippal a été transmis sans le code exonération PREVENTION (7)",
       "Le vaccin contre la grippe a été facturé sans le code d'exonération « prévention » (7).",
       "Vaccin antigrippal facturé au taux habituel au lieu de 100 % au titre de la prévention.",
       "Corrigez la facture et transmettez systématiquement le vaccin antigrippal à 100 % au titre de la prévention (code 7), comme l'indique la CPAM de l'Isère.",
       ["pharmacie"], ["cpam38-pharmaciens-2023"],
       voisins=["noemie-4000067", "noemie-0700060"],
       professions=["pharmaciens"],
       note="Texte de la colonne « Motif » du mémo 2023. " + NOTE_CODES)

noemie("0100052", "HABILITATION ENVOI DE MESSAGES",
       "Vous n'êtes pas habilité à télétransmettre auprès de cette caisse.",
       "Habilitation à transmettre absente pour cette caisse dans le fichier des options tiers (CPAM de la Loire-Atlantique).",
       "Demandez à la caisse l'habilitation à transmettre (la CPAM de la Gironde indique une adresse dédiée) et ne télétransmettez qu'une fois l'accord confirmé.",
       ["optique-audio"], ["cpam33-fournisseurs-2016", "cpam44-optique-2010"],
       voisins=["noemie-0100056", "noemie-0730055"],
       professions=["fournisseurs", "opticiens"], note=NOTE_CODES)

noemie("TRAITEMENT CAISSE", "Traitement Caisse",
       "Ce n'est pas un rejet : la facture fait l'objet d'une étude particulière par la caisse. Un second retour NOEMIE indiquera le résultat (paiement ou rejet).",
       "Facture qui demande un examen par un agent de la caisse.",
       "Attendez le retour suivant et ne renvoyez pas la facture en attendant (un nouvel envoi serait un doublon). Si le résultat tarde ou reste incompris, contactez votre caisse (téléservice « Réclamation paiements » dans amelipro).",
       TOUS, ["ameli-medecin-rejets-2026", "ameli-pharmacien-retour-noemie-2022"],
       voisins=["noemie-2900005", "noemie-0180051"],
       professions=["médecins", "pharmaciens"],
       note="Motif sans code numérique dans les pages ameli.fr. La mise en garde contre le renvoi découle du rejet « facture déjà payée » / « déjà en traitement » décrit par les CPAM.",
       ecritures=["Traitement caisse", "TRAITEMENT CAISSE"])
N[-1]["slug"] = "noemie-traitement-caisse"

# ---- codes NOEMIE publiés uniquement par la CPAM du Bas-Rhin (non datée) : à vérifier
NOTE_67 = ("Lu uniquement dans un mémo de la CPAM du Bas-Rhin dont la date n'apparaît pas dans le texte lu ; "
           "ouvrir le PDF dans un navigateur pour lire sa date, puis confirmer.")
noemie("0450071", "DIVERGENCE VITALE/EXO BDO ABSENTE",
       "Comme 0450072 : une exonération figure sur la carte Vitale mais pas dans le fichier de la caisse à la date des soins.",
       "Exonération absente ou différente au fichier (par exemple ALD transmise alors que seule une exonération pour stérilité existe, selon la CPAM du Bas-Rhin).",
       "Vérifiez les droits du patient (ADRi, amelipro) et le code d'exonération ; pour l'aide médicale d'État, la CPAM du Bas-Rhin indique de transmettre à 0 % part caisse et 100 % part complémentaire.",
       TOUS, ["cpam67-medecins"], statut="a_verifier", voisins=["noemie-0450072", "noemie-0450054"],
       professions=["médecins"], note=NOTE_67 + " Le mémo cite « 0450071 ou 0450072 » pour le même libellé.", page=False)
noemie("0450057", "MTM NON TROUVEE BDO",
       "Une modulation du ticket modérateur (régime local d'Alsace-Moselle ou Fonds national de solidarité) a été transmise alors qu'elle ne figure pas au fichier de la caisse.",
       "Régime local Alsace-Moselle transmis pour un assuré du régime général ; en mode dégradé, modulation indiquée à tort.",
       "Vérifiez les droits du patient (ADRi, amelipro) et la mise à jour de sa carte Vitale, puis retransmettez au bon régime.",
       TOUS, ["cpam67-pharmaciens", "cpam67-medecins", "cpam67-dentistes", "cpam44-optique-2010", "fiche-rejets-opticiens-bretagne"], statut="a_verifier",
       voisins=["noemie-0450058", "noemie-0450054"], professions=["pharmaciens", "médecins", "chirurgiens-dentistes", "opticiens"],
       note="Sources concordantes mais anciennes (2009-2015) ou non datées (Bas-Rhin). Concerne surtout l'Alsace-Moselle.", page=False)
noemie("0450058", "INCOMP.MODULATION TRANSMISE/BDO",
       "Le ticket modérateur transmis ne correspond pas à celui du fichier de la caisse : régime général transmis pour un assuré du régime local d'Alsace-Moselle, ou l'inverse.",
       "Erreur de régime (général ou local) dans la fiche patient ; régime local présent à une date mais pas à l'autre ; paramétrage du logiciel.",
       "Vérifiez les droits du patient (amelipro, attestation récente), la fiche patient et le paramétrage du logiciel, puis retransmettez.",
       TOUS, ["cpam67-pharmaciens", "cpam67-medecins", "cpam67-dentistes", "cpam44-optique-2010", "fiche-rejets-opticiens-bretagne"], statut="a_verifier",
       voisins=["noemie-0450057", "noemie-0700060"], professions=["pharmaciens", "médecins", "chirurgiens-dentistes", "opticiens"],
       note="Sources concordantes mais anciennes (2009-2015) ou non datées (Bas-Rhin). Concerne surtout l'Alsace-Moselle.", page=False)
noemie("0317051", "INCOMPATIBILITE ASU-NAT / REGIME",
       "La nature d'assurance transmise (maladie, accident du travail…) n'est pas compatible avec le régime de l'assuré, ou ce régime est fermé à la date des soins.",
       "Date des soins hors de la période du régime ; assuré connu sous un autre numéro ou plus affilié à la caisse ; risque professionnel non géré par la caisse.",
       "Vérifiez les droits (amelipro, attestation récente) et la nature d'assurance, puis transmettez à l'organisme compétent.",
       TOUS, ["cpam67-pharmaciens", "cpam67-medecins", "cpam44-optique-2010", "fiche-rejets-opticiens-bretagne"], statut="a_verifier",
       voisins=["noemie-0250050", "noemie-0270051"], professions=["pharmaciens", "médecins", "opticiens"],
       note="Sources concordantes mais anciennes (2009-2015) ou non datées (Bas-Rhin).", page=False)
noemie("2900010", "Acte déjà télétransmis",
       "Ces soins ont déjà été transmis et payés.", "Double envoi des mêmes soins.",
       "Consultez vos retours NOEMIE et vos paiements sur amelipro avant tout nouvel envoi.",
       ["centre-de-sante"], ["cpam67-medecins"], statut="a_verifier", voisins=["noemie-2900005", "noemie-2900001"],
       professions=["médecins"], note=NOTE_67 + " Rattachement aux centres de santé déduit (actes de médecins).", page=False)
noemie("2900001", "MULTIPLES FACTURES MEDECINS A J",
       "Doublon : même acte, même jour, même exécutant, même bénéficiaire.",
       "Double facturation, ou soins d'une même séance facturés à la fois en maladie et en accident du travail.",
       "Si l'acte est justifié, la CPAM du Bas-Rhin demande une feuille de soins papier précisant l'heure du second passage ; une rectification se fait sur feuille papier mentionnant « rectificative de la FDS n°… ».",
       ["centre-de-sante"], ["cpam67-medecins"], statut="a_verifier", voisins=["noemie-2900010", "noemie-2900005"],
       professions=["médecins"], note=NOTE_67 + " Rattachement aux centres de santé déduit (actes de médecins).", page=False)
noemie("0540152", "MAJO NON AUTORISEE TP",
       "Une majoration réservée au médecin traitant a été facturée en tiers payant par un médecin qui n'est pas le médecin traitant déclaré.",
       "Majoration facturée par un autre médecin que le médecin traitant (ou hors de son cabinet de groupe).",
       "Vérifiez le médecin traitant déclaré (ADRi, IMTi, amelipro) avant de facturer la majoration.",
       ["centre-de-sante"], ["cpam67-medecins"], statut="a_verifier", voisins=["noemie-0700060"],
       professions=["médecins"], note=NOTE_67 + " Rattachement aux centres de santé déduit (actes de médecins).", page=False)
noemie("0315058", "STATUT ACCIDENT DU TRAVAIL = REJET",
       "L'accident du travail invoqué n'est pas reconnu, ou il est consolidé.",
       "Accident non reconnu, ou fin de prise en charge au titre de l'accident du travail.",
       "Selon la CPAM du Bas-Rhin, transmettez la facture au titre du risque maladie.",
       TOUS, ["cpam67-medecins"], statut="a_verifier", voisins=["noemie-0315062", "noemie-0317051"],
       professions=["médecins"], note=NOTE_67, page=False)
noemie("1050060", "JOD OU JQB ABSENT POUR MIGRANT",
       "Les droits de frontalier (migrant) sont fermés pour le bénéficiaire des soins.",
       "Bénéficiaire plus affilié, connu sous un autre numéro, ou sans ouverture de droits à la date des soins.",
       "Vérifiez les droits (amelipro, carte Vitale à jour) et invitez le patient à mettre à jour son dossier.",
       ["pharmacie"], ["cpam67-pharmaciens"], statut="a_verifier", voisins=["noemie-0250050"],
       professions=["pharmaciens"], note=NOTE_67, page=False)
noemie("2600700", "Absence de numéro de dent",
       "L'acte CCAM facturé exige une localisation dentaire qui n'a pas été indiquée.", "Numéro de dent non saisi.",
       "Indiquez la localisation dentaire lors de la facturation.",
       ["dentaire"], ["cpam67-dentistes"], statut="a_verifier", voisins=["noemie-2600710", "noemie-0568002"],
       professions=["chirurgiens-dentistes"], note=NOTE_67, page=False)
noemie("0568002", "Localisation dentaire",
       "La localisation dentaire indiquée n'existe pas dans la table CCAM.",
       "Par exemple un détartrage saisi avec la localisation « 00 » (CPAM du Bas-Rhin).",
       "Pour un détartrage, la CPAM du Bas-Rhin indique « 01 » (maxillaire), « 02 » (mandibulaire), « 01 » et « 02 » (complet).",
       ["dentaire"], ["cpam67-dentistes"], statut="a_verifier", voisins=["noemie-2600710", "noemie-2600700"],
       professions=["chirurgiens-dentistes"], note=NOTE_67, page=False)
noemie("1170001", "Base de remboursement absente",
       "Le prix unitaire ou la base de remboursement de l'acte n'ont pas été transmis.",
       "Acte non remboursable télétransmis, ou acte remboursable sans base de remboursement (tarifs du logiciel pas à jour).",
       "Mettez à jour les tarifs du logiciel et ne télétransmettez que les actes remboursables.",
       ["dentaire"], ["cpam67-dentistes"], statut="a_verifier", voisins=["noemie-0650001"],
       professions=["chirurgiens-dentistes"],
       note=NOTE_67 + " Le mémo écrit « 117001 » : l'écriture à 7 chiffres est incertaine (0117001 ou 1170001 ; un document hospitalier de 2011 cite « 1170001 BASE REMBOURSEMENT ABSENTE »).",
       ecritures=["117001", "1170 001", "0117001"], page=False)

# ---- signalements et codes vus seulement dans la fiche opticiens « Bretagne » (2009, modifiée 2015)
NOTE_BZH = "Lu seulement dans une fiche opticiens ancienne (2009, modifiée en 2015), d'origine CPAM non nommée, hébergée par un éditeur."
for code, lib, expl, voisins in [
    ("2500051", "Code LPP inexistant", "La clé du code LPP est erronée (selon la fiche).", ["noemie-2500052", "noemie-2510002"]),
    ("2500059", "Incompatibilité PRS/ NAT code LPP", "Le code acte (nature de prestation) ne correspond pas au code LPP ; la caisse indique le code acte attendu.", ["noemie-2500079"]),
    ("2520001", "Prix unitaire absent", "Le prix unitaire est obligatoire pour cette prestation LPP.", ["noemie-0650001"]),
    ("0315032", "Clé du numéro d'AT erronée", "La clé du numéro d'accident du travail ou de maladie professionnelle transmis est erronée.", ["noemie-0315062"]),
    ("0480055", "Absence contrat 8x et mut fictif", "Un numéro de mutuelle fictif a été transmis pour un bénéficiaire sans contrat CMU au fichier (dispositif cité par la fiche).", ["noemie-0480054"]),
    ("0250053", "Bénéficiaire erroné", "Signalement (pas un rejet) : le numéro d'immatriculation a été modifié dans le fichier de la caisse ; la caisse indique le numéro à utiliser.", ["noemie-0250050"]),
    ("0270053", "Bénéficiaire erroné", "Signalement (pas un rejet) : la date de naissance a été modifiée dans le fichier de la caisse ; la caisse indique celle à transmettre.", ["noemie-0270051"]),
    ("0720051", "Paiement incompatible CMU", "Signalement : le bénéficiaire est pris en charge au titre de la CMU à la date des soins.", ["noemie-0480054"]),
]:
    note = NOTE_BZH
    if code == "2500059":
        note += " Conflit : le lexique de la CPAM de la Loire-Atlantique (2010) donne 2500079 pour « INCOMPATIBILITE PRS-NAT/CODE LPP »."
    if code == "2500051":
        note += " Conflit : le lexique de la CPAM de la Loire-Atlantique (2010) donne 2500052 « CODE LPP INEXISTANT » avec un autre sens (code absent de la base)."
    if code in ("0480055", "0720051"):
        note += " Mentionne la CMU, dispositif remplacé depuis (le mémo CPAM de 2023 parle de C2S) : probablement caduc."
    noemie(code, lib, expl, "Cause indiquée par la fiche : voir l'explication.",
           "Mettez à jour votre fichier patient ou la facture selon l'information donnée par la caisse, puis retransmettez (consigne de la fiche).",
           ["optique-audio"], ["fiche-rejets-opticiens-bretagne"], statut="a_verifier", voisins=voisins,
           professions=["opticiens"], note=note, page=False)

# ---------------------------------------------------------------------------- ARL (GIE 2025)
ACTION_LOT = ("Le lot n'a pas été pris en charge par la caisse. Votre logiciel doit reconstituer un nouveau lot à partir des mêmes factures "
              "(nouveau numéro de lot), le sécuriser comme un nouveau lot et le réémettre. Un lot qui a reçu un ARL négatif ne se réémet qu'une fois : "
              "après un second échec, les factures sont éditées en duplicata papier et traitées manuellement. Si le nouvel essai échoue aussi, ameli.fr conseille de contacter la caisse concernée.")
ACTION_FACTURE = ("L'ARL indique le numéro de la première facture en erreur du lot (il peut y en avoir d'autres). Votre logiciel reconstitue un nouveau lot "
                  "avec toutes les autres factures, sans celle-ci, et le réémet ; la facture en erreur est éditée en duplicata papier.")
ARL_TEXTES = {
    "1001": ("La structure du lot envoyé n'est pas conforme au format attendu par la caisse.", "Lot mal constitué par le logiciel de facturation.", True),
    "2001": ("La signature électronique du lot n'a pas pu être vérifiée.", "Problème de signature du lot au moment de sa constitution.", False),
    "2002": ("Le lot reçu n'est pas intègre : son contrôle de sécurité ne correspond pas à son contenu.", "Lot altéré ou mal sécurisé.", True),
    "2003": ("L'enregistrement de fin de lot n'est pas intègre.", "Lot altéré ou mal sécurisé.", False),
    "2005": ("Le lot a été sécurisé avec une clé interdite.", "Clé de sécurisation non autorisée.", False),
    "2502": ("La sécurité du lot est erronée.", "D'après deux éditeurs de logiciel : lot constitué avec une carte CPS ou CPE révoquée ou obsolète.", True),
    "3001": ("La carte (CPS du professionnel ou CPE d'un salarié) qui a constitué le lot est en opposition.", "Carte en opposition utilisée pour la mise en lot.", True),
    "4001": ("L'agrément du logiciel de facturation est absent.", "Logiciel sans agrément pour la télétransmission.", False),
    "4002": ("Le logiciel de facturation n'est pas agréé.", "Logiciel ou version non agréé.", True),
    "4003": ("La date de validité de votre logiciel (ou de sa version) est dépassée : les flux qu'il produit ne sont plus acceptés.", "Version de logiciel trop ancienne. Le GIE SESAM-Vitale l'a rappelé lors de l'arrêt des flux en addendum 2 bis et 3, refusés à partir de fin 2023.", True),
    "4004": ("La date de validité de votre logiciel n'est pas encore atteinte.", "Version de logiciel utilisée avant sa date de validité.", False),
    "4005": ("Le terminal lecteur applicatif (TLA) utilisé n'est pas homologué.", "TLA non homologué.", False),
    "4006": ("La date de validité du terminal lecteur applicatif (TLA) est dépassée.", "Version du TLA trop ancienne.", False),
    "4007": ("La date de validité du terminal lecteur applicatif (TLA) n'est pas encore atteinte.", "Version du TLA utilisée avant sa date de validité.", False),
    "4008": ("Le logiciel n'est pas agréé pour produire des flux issus d'un TLA.", "Logiciel non agréé pour les flux TLA.", False),
    "4009": ("Le numéro de version de norme n'est pas valide pour l'homologation du TLA.", "Version de norme invalide.", False),
    "4010": ("Le numéro de version de norme n'est pas valide pour l'agrément du logiciel.", "Version de norme invalide.", False),
    "4011": ("La version du cahier des charges indiquée n'est pas valide.", "Version de cahier des charges invalide.", False),
    "5001": ("Le lot a été créé il y a plus de 90 jours : il est refusé.", "Lot resté trop longtemps sans être envoyé.", True),
    "5002": ("Le lot est postdaté de plus de 2 jours : sa date de création est trop loin dans le futur.", "Date de création du lot postérieure de plus de 2 jours à la réception.", True),
    "1002": ("La structure de la facture dont le numéro est indiqué n'est pas conforme.", "Facture mal constituée.", False),
    "2004": ("La facture dont le numéro est indiqué n'est pas intègre.", "Facture altérée ou mal sécurisée.", True),
    "2004c": ("Le certificat de la carte Vitale de la facture indiquée n'est pas reconnu par le système SESAM-Vitale : tout le lot est refusé.", "Selon le GIE SESAM-Vitale, facture suspectée d'avoir été faite avec une carte Vitale frauduleuse (clone).", True),
    "2007": ("La facture indiquée utilise un mode de certification interdit.", "Mode de certification non autorisé.", False),
    "2500": ("La facture indiquée n'a pas pu être déchiffrée.", "Problème de chiffrement de la facture.", False),
    "2501": ("Le chiffrement de la facture indiquée est erroné.", "Problème de chiffrement de la facture.", False),
    "2503": ("La signature de la facture indiquée est incontrôlable.", "Problème de signature de la facture.", False),
    "2504": ("La sécurité de la facture indiquée est erronée.", "Problème de sécurisation de la facture.", False),
    "3002": ("La facture indiquée a été faite avec une carte CPS en opposition.", "Carte CPS en opposition utilisée pour la facture.", True),
    "2006": ("La facture indiquée utilise une clé interdite.", "Clé de sécurisation non autorisée.", False),
}
EXTRA_ACTION = {
    "2005": " Avec un lecteur SESAM-Vitale, contactez la société qui vous l'a fourni ; avec un lecteur PC/SC, contactez votre éditeur de logiciel (cas prévu par l'annexe 1-B).",
    "2006": " Avec un lecteur SESAM-Vitale, contactez la société qui vous l'a fourni ; avec un lecteur PC/SC, contactez votre éditeur de logiciel (cas prévu par l'annexe 1-B).",
    "2502": " Un éditeur conseille de demander à la caisse quelles cartes CPS ou CPE sont révoquées, puis de refaire la mise en lot avec une carte valide.",
    "4003": " Mettez votre logiciel à jour avec votre éditeur avant de reconstituer le lot.",
    "2004c": " Le GIE précise que, dans ce cas, vous n'avez pas à contacter votre éditeur, votre industriel ou votre OCT ; pour l'autre libellé du code 2004 (« FSE ou DRE non intègre »), contactez votre maintenance, éditeur ou OCT.",
    "2004": " Selon le GIE, pour ce libellé, prenez contact avec votre maintenance, votre éditeur ou votre OCT selon le cas.",
}


def entrees_arl(arl):
    out = []
    vus = {}
    for e in arl:
        code = e["code"]
        cle = code
        if code == "2004" and "certificat" in e["libelle"]:
            cle = "2004c"
        expl, cause, page = ARL_TEXTES[cle]
        action = (ACTION_FACTURE if e["niveau"] == "facture" else ACTION_LOT) + EXTRA_ACTION.get(cle, "")
        slug = "arl-2004-certificat-vitale" if cle == "2004c" else f"arl-{code}"
        src = ["gie-cdc-annexe1b-2025"]
        if e["niveau"] == "lot":
            src.append("ameli-pharmacien-fse-mode-emploi-2021")
        if code == "2004":
            src.append("gie-fiche-info-094-2012")
        if code == "4003":
            src.append("gie-actu-addendum-2023")
        if code == "2502":
            src += ["orisha-desmos-arl-securite-lot", "julie-teletransmission-2023"]
        item = {
            "code": code, "slug": slug, "famille": "arl",
            "emetteur": "Assurance Maladie (système d'accueil des flux, ARL SESAM-Vitale)",
            "libelle_officiel": e["libelle"], "explication": expl, "cause": cause, "action": action,
            "cause_action_origine": "source",
            "metiers": TOUS, "codes_voisins": [], "source_ids": src, "statut": "sur",
            "niveau_arl": e["niveau"], "page_conseillee": page,
        }
        notes = ["Table officielle des ARL négatifs (annexe 1-B, version 8.60 du 11/04/2025). L'action vient de la table ; la cause est la reformulation du libellé."]
        if code == "4005":
            notes.append("Ne pas confondre avec le message de service 4005 « Pièce jointe chiffrée en erreur » (même numéro, autre famille : voir sv-chiffrement-4005).")
        if code in ("5001", "5002"):
            notes.append("Les numéros 5001 et 5002 désignent aussi, ailleurs dans le cahier des charges, des rejets de rapports de réclamation : autre famille, non reprise ici.")
        if code == "2004":
            notes.append("Même code ARL pour deux libellés : « FSE ou DRE non intègre » et « FSE ou DRE certificat Vitale incorrect » (fiche GIE n° 94 de 2012).")
        if code == "2502":
            notes.append("La cause (carte CPS ou CPE révoquée ou obsolète) vient de deux éditeurs de logiciel, pas du GIE.")
        item["note_verification"] = " ".join(notes)
        item["autres_ecritures"] = [f"ARL {code}", f"ARL négatif {code}"]
        out.append(item)
    groupes = [["arl-2001", "arl-2002", "arl-2003", "arl-2502", "arl-1001"],
               ["arl-2004", "arl-2004-certificat-vitale", "arl-1002", "arl-2504"],
               ["arl-3001", "arl-3002", "arl-2502"],
               ["arl-4001", "arl-4002", "arl-4003", "arl-4004", "arl-4011"],
               ["arl-4005", "arl-4006", "arl-4007", "arl-4008", "arl-4009"],
               ["arl-5001", "arl-5002", "arl-1001"],
               ["arl-2005", "arl-2006", "arl-2007"],
               ["arl-2500", "arl-2501", "arl-2503", "arl-2504"]]
    lier(out, groupes)
    return out


# ------------------------------------------------------------- messages de service (GIE 2025)
ACTION_SERVICE = ("Le fichier envoyé n'a pas été accepté (en-tête du message ou structure du fichier) : aucun lot de ce fichier n'a été pris en charge. "
                  "Votre logiciel note les lots à réémettre (s'ils n'ont été transmis qu'une fois) et permet de recréer le message après analyse ; "
                  "un lot déjà retransmis une fois se traite manuellement. Le message contient une fiche détaillée de l'incident : transmettez-la à votre éditeur pour analyse.")
SERVICE_SPECIFIQUE = {
    "chiffrement-4005": ("Le flux chiffré n'a pas pu être déchiffré par l'Assurance Maladie (le certificat peut notamment être révoqué au niveau du frontal) : il est rejeté.",
                         "Flux chiffré avec un mauvais certificat.",
                         "Réémettez le flux à l'identique, chiffré avec le bon certificat (consigne de l'annexe 4).", True),
    "chiffrement-4015": ("Simple avertissement : le flux a bien été déchiffré, mais le certificat utilisé est périmé (il en existe un plus récent).",
                         "Certificat de chiffrement périmé.",
                         "Rien à renvoyer ; utilisez le nouveau certificat pour vos prochaines télétransmissions (consigne de l'annexe 4).", True),
    "chiffrement-4025": ("Le flux reçu n'était pas chiffré alors qu'il devait l'être.",
                         "Pièce jointe envoyée sans chiffrement.",
                         "Réémettez le flux à l'identique en chiffrant la pièce jointe (consigne de l'annexe 4).", True),
    "smtp-1070": ("Le même message a déjà été reçu : c'est un envoi en double.", "Message renvoyé avec un sujet identique à un envoi précédent.", None, True),
    "fichier-2011": ("Un flux réel contient un numéro de facturation de test.", "Mélange entre flux de test et flux réel.", None, False),
    "fichier-2040": ("Le numéro d'organisme complémentaire (AMC) est incohérent dans le fichier.", "Numéro AMC discordant entre les parties du fichier.", None, False),
}


def entrees_service(tables):
    out = []
    for table, prefixe in (("REJET_SMTP", "smtp"), ("REJET_FICHIER", "fichier"), ("CHIFFREMENT", "chiffrement")):
        for e in tables[table]:
            cle = f"{prefixe}-{e['code']}"
            spec = SERVICE_SPECIFIQUE.get(cle)
            if spec:
                expl, cause, action, page = spec
                action = action or ACTION_SERVICE
                origine = "source"
            else:
                expl = "Message de service de l'Assurance Maladie : le fichier transmis a été refusé avant tout traitement. Motif indiqué : « " + e["libelle"] + " »."
                cause = "Message transmis incorrect, soit dans le format de son en-tête, soit dans la structure du fichier joint (définition des messages de service par le GIE SESAM-Vitale)."
                action, page, origine = ACTION_SERVICE, False, "source"
            nature = {"REJET_SMTP": "message de service « rejet SMTP » (en-tête du message)",
                      "REJET_FICHIER": "message de service « rejet fichier » (structure du fichier)",
                      "CHIFFREMENT": "message de service « erreur de chiffrement »"}[table]
            out.append({
                "code": e["code"], "slug": f"sv-{cle}", "famille": "sesam-vitale",
                "emetteur": "Assurance Maladie (organismes AMO et AMC, messagerie SESAM-Vitale)",
                "libelle_officiel": e["libelle"], "explication": expl, "cause": cause, "action": action,
                "cause_action_origine": origine, "metiers": TOUS, "codes_voisins": [],
                "source_ids": ["gie-cdc-annexe4-2025", "gie-cdc-annexe1b-2025"], "statut": "sur",
                "type_message": nature, "page_conseillee": page,
                "note_verification": "Table officielle (annexe 4, version 8.60 du 11/04/2025), liste déclarée non exhaustive par le GIE. Action tirée de l'annexe 1-B (§ 4)."
                                     + (" Ne pas confondre avec l'ARL 4005 « TLA non homologué » (voir arl-4005)." if cle == "chiffrement-4005" else "")
                                     + (" Le code 9999 « autre erreur » existe dans deux tables (rejet SMTP et rejet fichier)." if e["code"] == "9999" else ""),
                "autres_ecritures": [f"message de service {e['code']}"],
            })
    lier(out, [["sv-chiffrement-4005", "sv-chiffrement-4015", "sv-chiffrement-4025", "sv-smtp-1032"],
               ["sv-smtp-1060", "sv-smtp-1061", "sv-smtp-1062", "sv-smtp-1063", "sv-smtp-1070"],
               ["sv-smtp-1010", "sv-smtp-1020", "sv-smtp-1030", "sv-smtp-1031"],
               ["sv-fichier-2010", "sv-fichier-2011", "sv-fichier-2012", "sv-fichier-2020"],
               ["sv-fichier-2216", "sv-fichier-2217", "sv-fichier-2300", "sv-fichier-3004"]])
    return out


# ------------------------------------------------------------ lexique optique 2010 (à vérifier)
def entrees_lexique(lex, deja):
    out = []
    for e in lex:
        if e["code"] == "0600050":
            e = dict(e, explication_source="la date de début des prestations est trop ancienne au regard du délai de remboursement visé par le libellé.")
        slug = f"noemie-{e['code']}"
        if slug in deja:
            continue
        note = ("Lu uniquement dans le lexique de la CPAM de la Loire-Atlantique d'octobre 2010 (document ancien, hébergé par un éditeur) ; "
                f"code écrit « {e['code_lu']} » dans le document, complété à 7 chiffres. "
                f"Part des rejets optique dans ce département en 2010 : {e['part_des_rejets']}.")
        if "CMU" in e["explication_source"] or "OP1" in e["explication_source"]:
            note += " Cite la CMU ou ses forfaits, dispositif remplacé depuis (le mémo CPAM de 2023 parle de C2S) : probablement caduc."
        if e["code"] == "0600050":
            note += " Le lexique cite un délai de remboursement : non repris ici, à vérifier avant tout usage."
        out.append({
            "code": e["code"], "slug": slug, "famille": "noemie",
            "emetteur": "Assurance Maladie (caisse primaire, retour NOEMIE)",
            "libelle_officiel": e["libelle"],
            "explication": "Explication donnée par la CPAM : " + (e["explication_source"][:1].lower() + e["explication_source"][1:] if e["explication_source"][1:2].islower() else e["explication_source"]),
            "cause": "Voir l'explication de la CPAM.",
            "action": "Vérifiez dans votre logiciel la donnée désignée par le libellé, corrigez-la puis retransmettez ; en cas de doute, demandez à votre caisse ou à votre éditeur.",
            "cause_action_origine": "deduit_du_libelle",
            "metiers": ["optique-audio"], "codes_voisins": [], "source_ids": ["cpam44-optique-2010"],
            "statut": "a_verifier", "note_verification": note,
            "professions_citees_par_les_sources": ["opticiens"],
            "autres_ecritures": [f"{e['code'][:4]} {e['code'][4:]}", e["code_lu"]],
            "page_conseillee": False,
        })
    lier(out, [["noemie-2500064", "noemie-2500079", "noemie-2500052", "noemie-2500069", "noemie-2526010"],
               ["noemie-2510001", "noemie-2510002", "noemie-0560059", "noemie-2500052"],
               ["noemie-2522001", "noemie-2522015", "noemie-2526015", "noemie-2500078"],
               ["noemie-0460030", "noemie-0460002", "noemie-0460001", "noemie-0460054", "noemie-0465002"],
               ["noemie-0470004", "noemie-0470003", "noemie-0470051", "noemie-0470052"],
               ["noemie-0172050", "noemie-0172054", "noemie-0180053", "noemie-0180054"],
               ["noemie-0270052", "noemie-0270001", "noemie-0250031", "noemie-0250003"]])
    return out


# --------------------------------------------------------------- OCT Résopharma (à vérifier)
RESO_RETENUS = {
    "R5003": ("arl", "Le lot a déjà été transmis : l'OCT refuse ce nouvel envoi."),
    "R5008": ("arl", "L'organisme destinataire du lot n'est pas renseigné."),
    "R5013": ("arl", "Le lot contient des factures pour plusieurs organismes obligatoires (débiteurs RO) différents."),
    "R5016": ("arl", "Le centre payeur indiqué est inconnu de l'OCT."),
    "R5021": ("arl", "La facture a déjà été transmise auparavant."),
    "R5027": ("arl", "L'organisme obligatoire (RO) indiqué est inconnu de l'OCT."),
    "R5029": ("arl", "Le lot contient plusieurs modes de règlement."),
    "R5080": ("autre", "L'abonnement du professionnel auprès de l'OCT est suspendu ou son contrat résilié."),
    "R6030": ("amc-tiers-payant", "La facture destinée à la complémentaire (RC) a déjà été transmise auparavant."),
    "R6037": ("amc-tiers-payant", "L'OCT signale l'organisme complémentaire indiqué comme « hors convention »."),
    "R6039": ("amc-tiers-payant", "L'organisme complémentaire (RC) indiqué est inconnu de l'OCT."),
    "R6040": ("amc-tiers-payant", "Le code d'organisme complémentaire (RC) est incorrect."),
    "R6045": ("amc-tiers-payant", "L'OCT signale la facture comme « hors cadre conventionnel »."),
    "R6068": ("amc-tiers-payant", "Le code d'organisme complémentaire est obsolète ; l'OCT indique d'utiliser SP Santé."),
}


def entrees_resopharma(reso):
    par_code = {}
    for e in reso:
        par_code.setdefault(e["code"], e)
    out = []
    for code, (famille, expl) in RESO_RETENUS.items():
        e = par_code[code]
        out.append({
            "code": code, "slug": f"oct-resopharma-{code.lower()}", "famille": famille,
            "emetteur": "plateforme Résopharma (organisme concentrateur technique des pharmacies)",
            "libelle_officiel": e["libelle"], "explication": expl + " Rejet émis par l'OCT, avant transmission à l'organisme.",
            "cause": "Voir l'explication (déduite du libellé).",
            "action": "Vérifiez dans votre logiciel la donnée désignée par le libellé (organisme, numéro, lot), corrigez puis renvoyez ; en cas de doute, contactez Résopharma ou votre éditeur.",
            "cause_action_origine": "deduit_du_libelle", "metiers": ["pharmacie"], "codes_voisins": [],
            "source_ids": ["resopharma-oct-2013"], "statut": "a_verifier",
            "note_verification": f"Nomenclature publiée par l'OCT Résopharma, datée du 17/04/2013 (type {e['type']}) : ancienne, et propre aux pharmacies qui passent par cet OCT. Codes « R… » sans rapport avec les codes NOEMIE de même allure.",
            "autres_ecritures": [code],
            "page_conseillee": False,
        })
    lier(out, [["oct-resopharma-r5003", "oct-resopharma-r5021", "oct-resopharma-r6030"],
               ["oct-resopharma-r6037", "oct-resopharma-r6045", "oct-resopharma-r6039", "oct-resopharma-r6040", "oct-resopharma-r6068"],
               ["oct-resopharma-r5008", "oct-resopharma-r5016", "oct-resopharma-r5027", "oct-resopharma-r5013"]])
    return out


# ------------------------------------------------------------------------------- outils
def lier(entrees, groupes):
    par_slug = {e["slug"]: e for e in entrees}
    for g in groupes:
        for s in g:
            if s in par_slug:
                for v in g:
                    if v != s and v in par_slug and v not in par_slug[s]["codes_voisins"] and len(par_slug[s]["codes_voisins"]) < 6:
                        par_slug[s]["codes_voisins"].append(v)


NBSP = " "


def typo(s):
    s = s.replace("'", "’")
    s = re.sub(r"\s*([:;!?])(?=\s|$)", NBSP + r"\1", s)
    s = re.sub(r"«\s*", "«" + NBSP, s)
    s = re.sub(r"\s*»", NBSP + "»", s)
    s = re.sub(r"(\d)\s*%", r"\1" + NBSP + "%", s)
    s = s.replace("—", ",")
    return s


CHAMPS_PROSE = ("explication", "cause", "action", "note_verification", "emetteur")


def appliquer_typo(e):
    for c in CHAMPS_PROSE:
        if c in e:
            e[c] = typo(e[c])
    if "questions_reelles" in e:
        e["questions_reelles"] = [typo(q) for q in e["questions_reelles"]]


def valider(entrees, sources):
    ids = {s["id"] for s in sources}
    slugs = [e["slug"] for e in entrees]
    doublons = sorted({s for s in slugs if slugs.count(s) > 1})
    if doublons:
        raise SystemExit(f"slugs en double : {doublons}")
    tous = set(slugs)
    for e in entrees:
        if not re.fullmatch(r"[a-z0-9-]+", e["slug"]):
            raise SystemExit(f"slug invalide : {e['slug']}")
        for c in ("code", "famille", "emetteur", "libelle_officiel", "explication", "cause", "action", "cause_action_origine", "metiers", "source_ids", "statut"):
            if not e.get(c):
                raise SystemExit(f"{e['slug']} : champ {c} vide")
        if e["famille"] not in ("noemie", "sesam-vitale", "arl", "amc-tiers-payant", "autre"):
            raise SystemExit(f"{e['slug']} : famille {e['famille']}")
        if e["statut"] not in ("sur", "a_verifier"):
            raise SystemExit(f"{e['slug']} : statut {e['statut']}")
        if e["statut"] == "a_verifier" and not e.get("note_verification"):
            raise SystemExit(f"{e['slug']} : note_verification manquante")
        for s in e["source_ids"]:
            if s not in ids:
                raise SystemExit(f"{e['slug']} : source inconnue {s}")
        for v in e["codes_voisins"]:
            if v not in tous:
                raise SystemExit(f"{e['slug']} : voisin inconnu {v}")
        for m in e["metiers"]:
            if m not in TOUS:
                raise SystemExit(f"{e['slug']} : métier inconnu {m}")
        for t in ("explication", "cause", "action"):
            if "—" in e[t]:
                raise SystemExit(f"{e['slug']} : tiret long dans {t}")
    utilisees = {s for e in entrees for s in e["source_ids"]}
    inutiles = ids - utilisees
    return inutiles


def main():
    extraits, sortie = sys.argv[1], sys.argv[2]
    lire = lambda n: json.load(open(f"{extraits}/{n}", encoding="utf-8"))
    entrees = list(N)
    deja = {e["slug"] for e in entrees}
    # voisins des entrées NOEMIE rédigées qui pointent vers des codes du lexique : gardés si présents
    entrees += entrees_lexique(lire("lexique_optique_cpam44_2010.json"), deja)
    entrees += entrees_arl(lire("arl_annexe1b_2025.json"))
    entrees += entrees_service(lire("messages_service_2025.json"))
    entrees += entrees_resopharma(lire("resopharma_oct_2013.json"))
    tous = {e["slug"] for e in entrees}
    for e in entrees:
        e["codes_voisins"] = [v for v in e["codes_voisins"] if v in tous]
        if e["slug"] == "noemie-0600050":
            e["explication"] = "La date de début des prestations est trop ancienne au regard du délai de remboursement visé par le libellé (« 2A + 3M »). Reformulation prudente, le lexique de 2010 citant un délai non vérifié ici."
    for e in entrees:
        appliquer_typo(e)
    inutiles = valider(entrees, SOURCES)
    sources = [s for s in SOURCES if s["id"] not in inutiles]
    donnees = {"genere_le": GENERE_LE, "sources": sources, "entrees": entrees}
    with open(sortie, "w", encoding="utf-8") as f:
        json.dump(donnees, f, ensure_ascii=False, indent=1)
    from collections import Counter
    print("entrées :", len(entrees))
    print("par statut :", dict(Counter(e["statut"] for e in entrees)))
    print("par famille :", dict(Counter(e["famille"] for e in entrees)))
    print("sûres par famille :", dict(Counter(e["famille"] for e in entrees if e["statut"] == "sur")))
    print("pages conseillées :", sum(1 for e in entrees if e.get("page_conseillee")))
    print("sources non utilisées (retirées) :", sorted(inutiles))


if __name__ == "__main__":
    main()
