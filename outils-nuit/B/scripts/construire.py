"""Construit donnees.json (outil B · Remboursement).

Lit uniquement des fichiers déjà téléchargés (dossiers passés en argument) et les saisies de
scripts/B/saisie/. N'invente aucun montant : chaque valeur vient d'une source listée dans SOURCES.

Usage :
  python3 -I construire.py --lpp <dossier lpp extrait> --lpp-version 910 \
      --bdmit <dossier fiches BdM_IT> --sortie <donnees.json> [--date AAAA-MM-JJ]
La sélection pharmacie (saisie/pharmacie_retenus.json) est produite avant par selection_pharmacie.py
à partir des fichiers BDPM ; les montants dentaires viennent de saisie/dentaire_ameli_2026.json.
"""
import argparse
import datetime
import html
import json
import re
import sys
import unicodedata

ICI = __import__("os").path.dirname(__import__("os").path.abspath(__file__))
sys.path.insert(0, ICI)
from lib_b import lire_dbf, dbf_date, nombre, arrondi  # noqa: E402

# Date de la mise à jour : remplacée par --date au lancement (défaut : aujourd'hui). Elle donne
# consulte_le, genere_le et la ligne de tarif en vigueur (LPP, BdM_IT).
AUJ = datetime.date.today().isoformat()
SAISIE = f"{ICI}/saisie"

# ---------------------------------------------------------------- sources
SOURCES = [
    {"id": "lpp-cnam-v910", "titre": "Base LPP (TIPS) de l'Assurance Maladie, version 910 (fichier LPP910.zip : lpp_fiche_tot910.dbf, lpp_histo_tot910.dbf)",
     "url": "http://www.codage.ext.cnamts.fr/codif/tips//telecharge/index_tele.php?p_site=AMELI", "editeur": "Caisse nationale de l'Assurance Maladie",
     "date_source": "2026-11-13", "consulte_le": AUJ},
    {"id": "ameli-taux", "titre": "Tableaux récapitulatifs des taux de remboursement (ameli.fr, assuré)",
     "url": "https://www.ameli.fr/assure/remboursements/rembourse/tableau-recapitulatif-taux-remboursement", "editeur": "Assurance Maladie",
     "date_source": "2026-09-30", "consulte_le": AUJ},
    {"id": "ameli-optique", "titre": "Lunettes et lentilles : quelle prise en charge ? (ameli.fr)",
     "url": "https://www.ameli.fr/assure/remboursements/rembourse/soins-protheses-dentaires-optique-audition/lunettes-lentilles", "editeur": "Assurance Maladie",
     "date_source": "2026-01-13", "consulte_le": AUJ},
    {"id": "ameli-audio", "titre": "Aides auditives : quelle prise en charge ? (ameli.fr)",
     "url": "https://www.ameli.fr/assure/remboursements/rembourse/soins-protheses-dentaires-optique-audition/protheses-auditives", "editeur": "Assurance Maladie",
     "date_source": "2026-02-20", "consulte_le": AUJ},
    {"id": "ameli-dentiste-tarifs-hlf", "titre": "Les tarifs conventionnels des chirurgiens-dentistes, tableau « Honoraires limites de facturation des prothèses dentaires (au 1er janvier 2026) » (ameli.fr, chirurgien-dentiste)",
     "url": "https://www.ameli.fr/chirurgien-dentiste/exercice-liberal/facturation-remuneration/tarifs-conventionnels/tarifs", "editeur": "Assurance Maladie",
     "date_source": "2026-02-03", "consulte_le": AUJ},
    {"id": "ameli-assure-soins-dentaires", "titre": "Consultations et soins dentaires : vos remboursements (ameli.fr)",
     "url": "https://www.ameli.fr/assure/remboursements/rembourse/soins-protheses-dentaires-optique-audition/consultations-soins-protheses-dentaires/consultations-soins-dentaires", "editeur": "Assurance Maladie",
     "date_source": "2026-02-02", "consulte_le": AUJ},
    {"id": "ameli-franchise", "titre": "La franchise médicale (ameli.fr)",
     "url": "https://www.ameli.fr/assure/remboursements/reste-charge/franchise-medicale", "editeur": "Assurance Maladie",
     "date_source": "2026-09-29", "consulte_le": AUJ},
    {"id": "bdpm-cis-cip", "titre": "Base de données publique des médicaments : fichiers CIS_bdpm.txt et CIS_CIP_bdpm.txt",
     "url": "https://base-donnees-publique.medicaments.gouv.fr/telechargement", "editeur": "ANSM / HAS / UNCAM (ministère de la Santé)",
     "date_source": "2026-11-03", "consulte_le": AUJ},
    {"id": "bdmit-cnam", "titre": "BdM_IT, base des médicaments de l'Assurance Maladie : fiche CIP (historique remboursement, groupe TFR), version 1541",
     "url": "http://www.codage.ext.cnamts.fr/codif/bdm_it/index.php?p_site=AMELI", "editeur": "Caisse nationale de l'Assurance Maladie",
     "date_source": "2026-11-17", "consulte_le": AUJ},
    {"id": "css-r871-2", "titre": "Code de la sécurité sociale, article R871-2 (cahier des charges du contrat responsable), version en vigueur depuis le 28/11/2025",
     "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038035521", "editeur": "Légifrance (DILA)",
     "date_source": "2025-11-28", "consulte_le": AUJ},
    {"id": "css-l871-1", "titre": "Code de la sécurité sociale, article L871-1 (contrats responsables : exclusion de la participation forfaitaire et de la franchise, tiers payant 100 % Santé), version en vigueur depuis le 28/02/2025",
     "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000051382496", "editeur": "Légifrance (DILA)",
     "date_source": "2025-02-28", "consulte_le": AUJ},
    {"id": "css-r160-5-2026", "titre": "Code de la sécurité sociale, article R160-5 (limites de la participation de l'assuré), version en vigueur depuis le 01/01/2026",
     "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053285637", "editeur": "Légifrance (DILA)",
     "date_source": "2026-01-01", "consulte_le": AUJ},
    {"id": "css-r160-5-2027", "titre": "Code de la sécurité sociale, article R160-5, version applicable au 01/01/2027 (issue des décrets n° 2026-809 à 2026-812)",
     "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000054739003/2027-01-01", "editeur": "Légifrance (DILA)",
     "date_source": "2027-01-01", "consulte_le": AUJ},
    {"id": "decret-2026-809", "titre": "Décret n° 2026-809 du 21 août 2026 (participation de l'assuré, soins dentaires), JORF n° 0195 du 22/08/2026",
     "url": "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054733581", "editeur": "Légifrance (DILA)",
     "date_source": "2026-08-22", "consulte_le": AUJ},
    {"id": "decret-2026-810", "titre": "Décret n° 2026-810 du 21 août 2026 (participation de l'assuré, produits et prestations de la LPP), JORF n° 0195 du 22/08/2026",
     "url": "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054733591", "editeur": "Légifrance (DILA)",
     "date_source": "2026-08-22", "consulte_le": AUJ},
    {"id": "decret-2026-811", "titre": "Décret n° 2026-811 du 21 août 2026 (participation de l'assuré, médicaments à SMR modéré ou faible), JORF n° 0195 du 22/08/2026",
     "url": "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054733601", "editeur": "Légifrance (DILA)",
     "date_source": "2026-08-22", "consulte_le": AUJ},
    {"id": "jorf-dila-novembre-2026", "titre": "Journal officiel, archives quotidiennes DILA du 08/11/2026 au 18/11/2026 (recherche d'une décision Uncam ou d'un arrêté fixant les taux 2027)",
     "url": "https://echanges.dila.gouv.fr/OPENDATA/JORF/", "editeur": "DILA",
     "date_source": "2026-11-18", "consulte_le": AUJ},
]

# ---------------------------------------------------------------- textes réutilisés
TAUX_LPP = 60.0  # ameli-taux : Optique 60 %, Prothèses auditives 60 %
TAUX_DENTAIRE = 60.0  # ameli-taux : chirurgiens-dentistes 60 % ; ameli-assure-soins-dentaires : soins 60 %

CHANGE_LPP = ("Décret n° 2026-810 : au 01/01/2027, la participation de l'assuré sur les produits de la LPP passe de 40-50 % à 50-60 % "
              "(R160-5, 8°). Le taux Sécu sera donc compris entre 40 et 50 % au lieu de 60 % ; le taux exact doit être fixé par l'Uncam "
              "(ou par arrêté) et n'était pas publié au 18/11/2026 (JO consultés jusqu'au 18/11/2026). La base de remboursement et le prix "
              "limite ne changent pas : la base LPP v910 (13/11/2026) ne contient aucune date d'effet postérieure au 18/11/2026 pour l'optique et l'audio.")
CHANGE_LPP_100S = (" En contrat responsable, la complémentaire reste tenue de couvrir le ticket modérateur et les frais au-delà de la base dans la limite "
                   "du prix limite (R871-2) : le reste à charge du patient reste nul, c'est la part complémentaire qui augmente.")
CHANGE_DENT = ("Décret n° 2026-809 : au 01/01/2027, la participation de l'assuré sur les honoraires et actes des chirurgiens-dentistes passe de "
               "35-45 % à 50-60 % (R160-5, 3° bis). Le taux Sécu sera compris entre 40 et 50 % au lieu de 60 % ; le taux exact n'était pas "
               "publié au 18/11/2026. Aucune revalorisation de base de remboursement ou d'honoraire limite au 01/01/2027 n'a été trouvée dans une source officielle.")
CHANGE_MED = {
    "65": "Aucun changement de fourchette au 01/01/2027 pour les médicaments à 65 % dans les décrets d'août 2026 (le décret n° 2026-811 vise les SMR modéré et faible).",
    "100": "Aucun changement de fourchette au 01/01/2027 pour les médicaments à 100 % dans les décrets d'août 2026.",
    "30": ("Décret n° 2026-811 : au 01/01/2027, la participation de l'assuré pour les médicaments à SMR modéré (R160-5, 6°) passe de 70-75 % à "
           "85-95 % : le taux Sécu serait compris entre 5 et 15 % au lieu de 30 %. Taux exact non publié au 18/11/2026. À vérifier : "
           "rattachement de ce médicament au 6° (SMR modéré) plutôt qu'à un autre alinéa."),
    "15": ("Décret n° 2026-811 : au 01/01/2027, la participation de l'assuré pour les médicaments à SMR faible (R160-5, 14°) passe de 80-90 % à "
           "93-97 % : le taux Sécu serait compris entre 3 et 7 % au lieu de 15 %. Taux exact non publié au 18/11/2026."),
}

RENOUV_OPTIQUE = ("Prise en charge sur prescription. Renouvellement (ameli) : 2 ans à partir de 16 ans, 1 an de 6 à 16 ans, 1 an jusqu'à 6 ans "
                  "(6 mois si mauvaise adaptation de la monture) ; renouvellement anticipé possible (dégradation des performances oculaires : "
                  "1 an à partir de 16 ans, pas de délai avant 16 ans ; situations médicales listées : pas de délai). Bris ou perte : pas de renouvellement anticipé. "
                  "Verres de deux classes différentes interdits ; monture et verres de classes différentes autorisés.")


def slugifier(t):
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode().lower()
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-")
    return re.sub(r"-+", "-", t)[:80].strip("-")


def montants(br, taux):
    r = arrondi(br * taux / 100.0)
    return r, arrondi(br - r)


# ---------------------------------------------------------------- LPP
def charger_lpp(dossier, version):
    _, fiches = lire_dbf(f"{dossier}/lpp_fiche_tot{version}.dbf")
    _, histo = lire_dbf(f"{dossier}/lpp_histo_tot{version}.dbf")
    h = {}
    for l in histo:
        h.setdefault(l["CODE_TIPS"], []).append(l)
    return fiches, h


def ligne_en_vigueur(lignes, date_ref=None):
    """Ligne d'historique en vigueur à date_ref (date d'effet <= date_ref et pas de fin, ou fin >= date_ref)."""
    date_ref = date_ref or AUJ.replace("-", "")
    ok = [l for l in lignes if l["DEBUTVALID"] <= date_ref and (not l["FINHISTO"] or l["FINHISTO"] >= date_ref)]
    return sorted(ok, key=lambda x: x["DEBUTVALID"])[-1] if ok else None


def categorie_optique(lib):
    L = lib.upper()
    cl = "A" if "CLASSE A" in L else ("B" if "CLASSE B" in L else None)
    for mot, nom in (("UNIFOCAL FREIN MYOPIE", "verre unifocal freinateur de myopie"), ("UNIFOCAL", "verre unifocal"),
                     ("MULTIFOCAL", "verre multifocal"), ("PROGRESSIF", "verre progressif"), ("NEUTRE", "verre neutre"),
                     ("MONTURE ADULTE", "monture adulte"), ("MONTURE ENFANT", "monture enfant"),
                     ("SUPPLEMENT POUR MONTURE", "supplément monture à coque (moins de 6 ans)"),
                     ("ADAPTATION", "prestation d'adaptation des verres"), ("APPAIRAGE", "prestation d'appairage"),
                     ("TEINTES", "supplément verres teintés"), ("PRISME", "prisme incorporé"), ("FILTRE", "filtre"),
                     ("ACCOMPAGNEMENT", "supplément d'accompagnement")):
        if mot in L:
            base = nom
            break
    else:
        base = "optique, autre"
    if "FREIN MYOPIE" in L:
        return base
    if cl and base.startswith(("verre", "monture")):
        return f"{base} classe {cl}"
    if cl:
        return f"{base} (classe {cl})"
    return base


def entrees_optique(fiches, h):
    out = []
    for f in fiches:
        code, lib = f["CODE_TIPS"], f["NOM_COURT"]
        arbo = [f["ARBO%d" % i] for i in range(1, 4)]
        if not (code.startswith("22") and arbo == ["2", "2", "5"]) or f["DATE_FIN"]:
            continue
        cur = ligne_en_vigueur(h.get(code, []))
        if not cur:
            continue
        br, pu = nombre(cur["TARIF"]), nombre(cur["PUREGLEMEN"])
        if br is None or br <= 0:
            continue
        L = lib.upper()
        panier = "100-sante" if "CLASSE A" in L else ("libre" if "CLASSE B" in L else None)
        rem, tm = montants(br, TAUX_LPP)
        age = int(nombre(f["AGE_MAX"]) or 0)
        cond = []
        if L.startswith("OPTIQUE, VERRE") or "MONTURE" in L:
            cond.append(RENOUV_OPTIQUE)
        if age:
            cond.append(f"Âge maximal inscrit dans la base LPP : {age} ans.")
        if "FREIN MYOPIE" in L:
            cond.append("Verre inscrit sous nom de marque ; conditions de prise en charge (âge, indication) non reprises ici : à lire dans l'arrêté d'inscription.")
        e = {
            "metier": "optique", "type_code": "LPP", "code": code,
            "slug": f"lpp-{code}-{slugifier(lib.replace('OPTIQUE,', ''))}",
            "libelle": lib, "categorie": categorie_optique(lib),
            "base_remboursement": br, "taux_secu": TAUX_LPP, "rembourse_secu": rem, "ticket_moderateur": tm,
            "prix_limite": pu if pu and pu > 0 else None,
            "panier_100_sante": panier,
            "part_complementaire_au_prix_limite": arrondi(pu - rem) if (panier == "100-sante" and pu and pu > 0) else None,
            "conditions": " ".join(cond) or None,
            "date_tarif": dbf_date(cur["DEBUTVALID"]),
            "arrete_tarif": {"date_arrete": dbf_date(cur["ARRETE"]), "date_jo": dbf_date(cur["JO"])},
            "change_au_2027_01_01": CHANGE_LPP + (CHANGE_LPP_100S if panier == "100-sante" else ""),
            "source_ids": ["lpp-cnam-v910", "ameli-taux"] + (["ameli-optique"] if cond and L.startswith(("OPTIQUE, VERRE", "OPTIQUE, MONTURE")) else [])
                          + (["css-r871-2"] if panier == "100-sante" else []) + ["decret-2026-810", "css-r160-5-2027"],
            "statut": "sur",
            "note_verification": ("Base de remboursement et prix limite lus dans la base LPP (champs TARIF et PUREGLEMEN, ligne d'historique en vigueur) ; "
                                  "taux lu sur ameli (60 %). Prix limite nul dans la base = prix libre." if not "FREIN MYOPIE" in L else
                                  "Montants lus dans la base LPP ; panier et conditions non qualifiés ici."),
        }
        if "FREIN MYOPIE" in L:
            e["panier_100_sante"] = None
            e["part_complementaire_au_prix_limite"] = None
        out.append(e)
    return out


def entrees_audio(fiches, h):
    out = []
    for f in fiches:
        code, lib = f["CODE_TIPS"], f["NOM_COURT"]
        arbo = [f["ARBO%d" % i] for i in range(1, 4)]
        if not (code.startswith("23") and arbo[:2] == ["2", "3"] and arbo[2] in ("7", "8")) or f["DATE_FIN"]:
            continue
        if not lib.upper().startswith("AIDE AUDITIVE, CLASSE"):
            continue
        cur = ligne_en_vigueur(h.get(code, []))
        if not cur:
            continue
        br, pu = nombre(cur["TARIF"]), nombre(cur["PUREGLEMEN"])
        L = lib.upper()
        classe = "II" if "CLASSE II" in L else "I"
        cote = "droite" if "DROITE" in L else "gauche"
        enfant = "<=" in L
        panier = "100-sante" if classe == "I" else "libre"
        rem, tm = montants(br, TAUX_LPP)
        cond = ["Renouvellement pris en charge après 4 ans ; durée calculée entre les dates de facturation de l'aide précédente et de la nouvelle (ameli).",
                "Essai d'au moins 30 jours avant l'achat ; la délivrance (et le tiers payant) intervient à la fin de l'essai (ameli)."]
        if enfant:
            cond.append("Code « ≤ 20 ans » de la LPP. Ameli applique les mêmes montants (base 1 400 €) aux personnes atteintes de cécité ou d'un handicap visuel, sans limite d'âge.")
        if classe == "II":
            cond.append("Contrat responsable : prise en charge plafonnée à 1 700 € par aide auditive, part Sécu et ticket modérateur compris (R871-2).")
        out.append({
            "metier": "audio", "type_code": "LPP", "code": code,
            "slug": f"lpp-{code}-aide-auditive-classe-{classe.lower()}-{cote}-{'20-ans-et-moins' if enfant else 'plus-de-20-ans'}",
            "libelle": lib,
            "categorie": f"aide auditive classe {classe} {'20 ans et moins' if enfant else 'plus de 20 ans'}",
            "base_remboursement": br, "taux_secu": TAUX_LPP, "rembourse_secu": rem, "ticket_moderateur": tm,
            "prix_limite": pu if pu and pu > 0 else None, "panier_100_sante": panier,
            "part_complementaire_au_prix_limite": arrondi(pu - rem) if (panier == "100-sante" and pu) else None,
            "conditions": " ".join(cond),
            "date_tarif": dbf_date(cur["DEBUTVALID"]),
            "arrete_tarif": {"date_arrete": dbf_date(cur["ARRETE"]), "date_jo": dbf_date(cur["JO"])},
            "change_au_2027_01_01": CHANGE_LPP + (CHANGE_LPP_100S if panier == "100-sante" else ""),
            "source_ids": ["lpp-cnam-v910", "ameli-taux", "ameli-audio", "css-r871-2", "decret-2026-810", "css-r160-5-2027"],
            "statut": "sur",
            "note_verification": "Base et prix limite lus dans la base LPP ; taux 60 % lu sur ameli (tableau des taux et page aides auditives, qui donne les mêmes bases 400 € / 1 400 € et prix limites 950 € / 1 400 €).",
        })
    return out


# ---------------------------------------------------------------- dentaire
def entrees_dentaire():
    d = json.load(open(f"{SAISIE}/dentaire_ameli_2026.json", encoding="utf-8"))
    hl = d["hlf"]
    p100, pmod = set(hl["panier_lu_dans_la_source"]["100-sante"]), set(hl["panier_lu_dans_la_source"]["modere"])
    out = []
    for code, lib, cat, br, hlf in hl["actes"]:
        panier = "100-sante" if code in p100 else ("modere" if code in pmod else None)
        rem, tm = montants(br, TAUX_DENTAIRE)
        note = ("Base de remboursement et honoraire limite lus dans le tableau ameli « au 1er janvier 2026 » ; taux 60 % lu sur ameli. "
                + ("Panier lu dans les listes de rappel de facturation de HBLD090 / HBLD745 (même page)." if panier else
                   "Panier non indiqué par la page lue : l'acte a un honoraire limite (donc panier 100 % Santé ou maîtrisé), à confirmer dans la convention dentaire avant d'afficher un panier."))
        out.append({
            "metier": "dentaire", "type_code": "CCAM", "code": code, "slug": f"ccam-{code.lower()}-{slugifier(lib)[:60]}",
            "libelle": lib, "categorie": cat + (" 100 % Santé" if panier == "100-sante" else (" à tarif maîtrisé" if panier == "modere" else "")),
            "base_remboursement": br, "taux_secu": TAUX_DENTAIRE, "rembourse_secu": rem, "ticket_moderateur": tm,
            "prix_limite": hlf, "panier_100_sante": panier,
            "part_complementaire_au_prix_limite": arrondi(hlf - rem) if panier == "100-sante" else None,
            "conditions": ("Honoraire limite de facturation : le chirurgien-dentiste ne peut pas facturer au-delà. "
                           + ("Panier 100 % Santé : reste à charge nul en contrat responsable (R871-2, 5°)." if panier == "100-sante" else
                              "Panier maîtrisé : honoraire plafonné, reste à charge selon le contrat." if panier == "modere" else "")).strip(),
            "date_tarif": hl["date_tarif"],
            "change_au_2027_01_01": CHANGE_DENT + (" Panier 100 % Santé : reste à charge nul maintenu en contrat responsable, la part complémentaire augmente." if panier == "100-sante" else ""),
            "source_ids": [hl["source_id"], "ameli-taux"] + (["css-r871-2"] if panier == "100-sante" else []) + ["decret-2026-809", "css-r160-5-2027"],
            "statut": "sur", "note_verification": note,
        })
    so = d["soins"]
    for cle, lib, cat, br in so["actes"]:
        rem, tm = montants(br, TAUX_DENTAIRE)
        out.append({
            "metier": "dentaire", "type_code": "CCAM", "code": None, "slug": f"soin-dentaire-{cle}",
            "libelle": lib, "categorie": cat, "base_remboursement": br, "taux_secu": TAUX_DENTAIRE,
            "rembourse_secu": rem, "ticket_moderateur": tm, "prix_limite": None, "panier_100_sante": None,
            "part_complementaire_au_prix_limite": None,
            "conditions": "Tarif hors soins sur dents permanentes des moins de 13 ans et hors majoration des 1-26 ans (tarifs différents sur la même page ameli).",
            "date_tarif": so["date_tarif"], "change_au_2027_01_01": CHANGE_DENT,
            "source_ids": [so["source_id"], "decret-2026-809", "css-r160-5-2027"], "statut": "a_verifier",
            "note_verification": ("Tarif et taux lus sur ameli, mais la page ne donne pas le code CCAM et le site CCAM d'ameli était inaccessible "
                                  "(403) : code à renseigner depuis la fiche CCAM officielle avant publication. Tarif daté du 25/10/2024 : vérifier qu'il n'a pas été revalorisé depuis."),
        })
    return out


# ---------------------------------------------------------------- pharmacie
def texte_fiche(chemin):
    t = open(chemin, encoding="latin-1", errors="replace").read()
    try:
        t = t.encode("latin-1").decode("utf-8")
    except UnicodeError:
        pass
    t = re.sub(r"<script.*?</script>|<style.*?</style>", " ", t, flags=re.S)
    t = re.sub(r"<[^>]+>", " ", t)
    t = html.unescape(t).replace("\xa0", " ")
    return re.sub(r"\s+", " ", t)


def lire_fiche_bdmit(chemin, cip, date_ref=None):
    date_ref = date_ref or datetime.date.fromisoformat(AUJ)
    t = texte_fiche(chemin)
    res = {"lu": False}
    if f"Fiche CIP : {cip}" not in t:
        return res
    res["lu"] = True
    m = re.search(r"Historique Remboursement : .*? Date JO (.*?)(?: Appartenance| Historique pour les collectivit| Tarif de remboursement ajust| Précédemment| Médicament non agr|$)", t)
    lignes = []
    if m:
        for g in re.finditer(r"([\d.]+) € ([\d.]+) € (\d+) % (\d\d/\d\d/\d{4}) (\S+) (\S+)", m.group(1)):
            lignes.append({"pfht": float(g.group(1)), "ppttc": float(g.group(2)), "taux": float(g.group(3)),
                           "date_application": datetime.datetime.strptime(g.group(4), "%d/%m/%Y").date()})
    ok = [l for l in lignes if l["date_application"] <= date_ref]
    res["prix"] = max(ok, key=lambda l: l["date_application"]) if ok else None
    res["tra"] = None
    g = re.search(r"Tarif de remboursement ajusté : Prix TTC Euro Date d'application ((?:[\d.]+ € \d\d/\d\d/\d{4} ?)+)", t)
    if g:
        rows = [(float(a), datetime.datetime.strptime(b, "%d/%m/%Y").date()) for a, b in re.findall(r"([\d.]+) € (\d\d/\d\d/\d{4})", g.group(1))]
        ok = [r for r in rows if r[1] <= date_ref]
        if ok:
            m_, d_ = max(ok, key=lambda r: r[1])
            res["tra"] = {"montant": m_, "debut": d_.isoformat()}
    res["groupe_tfr"] = "Appartenance à un groupe TFR" in t
    res["tfr"] = None
    if res["groupe_tfr"]:
        i = t.find("CIP appartenant à un groupe à TFR")
        zone = t[i:] if i >= 0 else ""
        # ligne du tableau TFR propre à ce CIP : le CIP, son nom court (sans autre CIP), puis PFHT, PPTTC, TFR, reste à charge, dates
        motif = re.escape(cip) + r" (?:(?!\b34009\d{8}\b).)*? ([\d.]+) € ([\d.]+) € ([\d.]+) € ([\d.]+) € (\d\d/\d\d/\d{4}) (\d\d/\d\d/\d{4}|-)"
        for g in re.finditer(motif, zone):
            deb = datetime.datetime.strptime(g.group(5), "%d/%m/%Y").date()
            fin = None if g.group(6) == "-" else datetime.datetime.strptime(g.group(6), "%d/%m/%Y").date()
            if deb <= date_ref and (fin is None or fin >= date_ref):
                res["tfr"] = {"montant": float(g.group(3)), "debut": deb.isoformat()}
    return res


def entrees_pharmacie(dossier_bdmit):
    sel = json.load(open(f"{SAISIE}/pharmacie_retenus.json", encoding="utf-8"))["retenus"]
    out = []
    for r in sel:
        cip = r["cip13"]
        taux_txt = r["taux_bdpm"].replace(" ", "")
        mt = re.fullmatch(r"(\d+)%", taux_txt)
        prix_bdpm = nombre(r["prix_bdpm"])
        hd = nombre(r["honoraire_bdpm"])
        try:
            fi = lire_fiche_bdmit(f"{dossier_bdmit}/fiche_{cip}.html", cip)
        except FileNotFoundError:
            fi = {"lu": False}
        notes, statut = [], "sur"
        taux = float(mt.group(1)) if mt else None
        if not mt:
            statut = "a_verifier"
            notes.append(f"Taux BDPM non unique ou illisible : « {r['taux_bdpm']} ».")
        if r.get("indications_taux"):
            notes.append("La BDPM associe un texte d'indications au taux de remboursement : le taux peut dépendre de l'indication.")
            statut = "a_verifier"
        br, date_tarif = prix_bdpm, None
        if fi.get("lu") and fi.get("prix"):
            p = fi["prix"]
            date_tarif = p["date_application"].isoformat()
            if abs(p["ppttc"] - (prix_bdpm or -1)) > 0.005:
                statut = "a_verifier"
                notes.append(f"Prix BDPM ({prix_bdpm}) différent du PPTTC BdM_IT ({p['ppttc']}).")
            if taux is not None and abs(p["taux"] - taux) > 0.01:
                statut = "a_verifier"
                notes.append(f"Taux BDPM ({taux}) différent du taux BdM_IT ({p['taux']}).")
        else:
            statut = "a_verifier"
            notes.append("Fiche BdM_IT non lue : date d'effet du prix inconnue.")
        tra = fi.get("tra")
        if tra:
            statut = "a_verifier"
            notes.append(f"La fiche BdM_IT affiche un « tarif de remboursement ajusté » de {tra['montant']} € (date d'application {tra['debut']}). "
                         "Selon des sources secondaires (Vidal, 16/01/2020 ; LFSS 2019, art. 66, non relu sur Légifrance), c'est la base appliquée depuis le 01/01/2020 "
                         "quand le patient refuse le générique sans mention « non substituable » justifiée. Base affichée ici = prix public (cas avec "
                         "justification) ; la page devra présenter les deux cas, après lecture du texte officiel.")
        if fi.get("groupe_tfr"):
            if fi.get("tfr"):
                br = fi["tfr"]["montant"]
                date_tarif = fi["tfr"]["debut"]
                notes.append(f"Présentation soumise à un tarif forfaitaire de responsabilité (TFR) en vigueur depuis le {fi['tfr']['debut']} : base = TFR.")
            else:
                notes.append("Présentation rattachée à un groupe générique TFR dans BdM_IT, sans TFR en vigueur lu pour ce CIP : base = prix public, à confirmer.")
                statut = "a_verifier"
        rem = tm = None
        if br is not None and taux is not None:
            rem, tm = montants(br, taux)
        t_key = str(int(taux)) if taux is not None else ""
        out.append({
            "metier": "pharmacie", "type_code": "CIP13", "code": cip,
            "slug": f"cip-{cip}-{slugifier(r['denomination'])[:60]}",
            "libelle": f"{r['denomination']} — {r['presentation']}",
            "categorie": f"médicament remboursé à {t_key} %" if t_key else "médicament",
            "base_remboursement": br, "taux_secu": taux, "rembourse_secu": rem, "ticket_moderateur": tm,
            "prix_limite": None, "panier_100_sante": None, "part_complementaire_au_prix_limite": None,
            "prix_public_hors_honoraire": prix_bdpm, "honoraire_dispensation_boite": hd,
            "tarif_remboursement_ajuste_bdmit": tra,
            "conditions": ("Franchise médicale de 1 € par boîte déduite du remboursement Sécu (sauf exonérations, moins de 18 ans notamment) ; "
                           "non remboursable par la complémentaire. Honoraire de dispensation à la boîte affiché à part : sa prise en charge n'est pas calculée ici."),
            "date_tarif": date_tarif,
            "change_au_2027_01_01": CHANGE_MED.get(t_key),
            "source_ids": ["bdpm-cis-cip", "bdmit-cnam", "ameli-franchise"] + (["decret-2026-811", "css-r160-5-2027"] if t_key in ("30", "15") else []),
            "statut": statut,
            "note_verification": " ".join(["Prix et taux lus dans la BDPM (MAJ 03/11/2026) et recoupés avec la fiche BdM_IT de l'Assurance Maladie (date d'application du prix)."] + notes),
        })
    return out


def main():
    global AUJ
    a = argparse.ArgumentParser()
    a.add_argument("--lpp", required=True)
    a.add_argument("--lpp-version", required=True)
    a.add_argument("--bdmit", required=True)
    a.add_argument("--sortie", required=True)
    a.add_argument("--date", default=AUJ, help="date de la mise à jour, AAAA-MM-JJ (défaut : aujourd'hui)")
    o = a.parse_args()
    AUJ = o.date
    for s in SOURCES:
        s["consulte_le"] = AUJ
    fiches, h = charger_lpp(o.lpp, o.lpp_version)
    entrees = entrees_optique(fiches, h) + entrees_audio(fiches, h) + entrees_dentaire() + entrees_pharmacie(o.bdmit)
    slugs = [e["slug"] for e in entrees]
    assert len(slugs) == len(set(slugs)), "slugs en double"
    ids = {s["id"] for s in SOURCES}
    for e in entrees:
        assert e["source_ids"] and all(i in ids for i in e["source_ids"]), e["slug"]
    sortie = {"genere_le": AUJ, "outil": "B · Remboursement", "sources": SOURCES, "entrees": entrees}
    with open(o.sortie, "w", encoding="utf-8") as f:
        json.dump(sortie, f, ensure_ascii=False, indent=1)
    from collections import Counter
    c = Counter((e["metier"], e["statut"]) for e in entrees)
    print(json.dumps({f"{k[0]}/{k[1]}": v for k, v in sorted(c.items())}, ensure_ascii=False))


if __name__ == "__main__":
    main()
