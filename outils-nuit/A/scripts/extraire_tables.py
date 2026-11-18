"""Extraction des tables de codes rejet lues dans les documents téléchargés (outil A).

Usage : python3 -I extraire_tables.py <dossier_telechargements_A> <dossier_sortie>

Lit uniquement des fichiers texte produits par `pdftotext -layout` à partir des PDF
téléchargés (données non fiables : on ne fait que parser du texte, rien n'est exécuté).
Produit un JSON par table dans <dossier_sortie> :
  - arl_annexe1b_2025.json        : codes ARL (CDC SESAM-Vitale 1.40 add. 8, annexe 1-B v8.60)
  - messages_service_2025.json    : codes des messages de service (annexe 4 v8.60, §11.1.2 / 11.2.2 / 11.3.2)
  - lexique_optique_cpam44_2010.json : lexique des rejets « Fournitures optiques », CPAM Loire-Atlantique, oct. 2010
  - resopharma_oct_2013.json      : nomenclature des codes rejets de l'OCT Résopharma (17/04/2013)
Chaque table est vérifiée contre la liste de codes attendue (lue à l'œil dans le PDF) :
le script s'arrête si un code manque ou si un code inattendu apparaît.
"""
import json
import os
import re
import sys


def lire(chemin):
    with open(chemin, encoding="utf-8", errors="replace") as f:
        return f.read()


def nettoie(s):
    s = s.replace("’", "'").replace(" ", " ")
    return re.sub(r"\s+", " ", s).strip()


# ---------------------------------------------------------------- ARL (annexe 1-B)
# La mise en page de la table (libellés sur deux lignes, code sur la ligne du milieu)
# rend un découpage automatique peu fiable. On transcrit donc la table telle que lue
# dans le texte de l'annexe 1-B, puis on VÉRIFIE chaque ligne contre le texte brut :
# le code doit être présent et tous les mots du libellé doivent apparaître, dans
# l'ordre, dans la portion de texte qui entoure ce code.
ARL_TRANSCRIPTION = [
    # (code, libellé tel qu'écrit dans l'annexe 1-B, niveau)
    ("1001", "Structure du lot non conforme", "lot"),
    ("2001", "Signature lot invérifiable", "lot"),
    ("2002", "Lot non intègre", "lot"),
    ("2003", "Enregistrement fin de lot non intègre", "lot"),
    ("2005", "Lot utilisant une clé interdite", "lot"),
    ("2502", "Sécurité lot erronée", "lot"),
    ("3001", "La carte CPS ou CPE ayant effectué le lot est en opposition", "lot"),
    ("4001", "Agrément logiciel absent", "lot"),
    ("4002", "Logiciel PS non agrée", "lot"),
    ("4003", "Date de validité du logiciel PS dépassée Ou Validité de la version de votre logiciel expirée", "lot"),
    ("4004", "Date de validité du logiciel PS non atteinte", "lot"),
    ("4005", "TLA non homologué", "lot"),
    ("4006", "Date de validité du TLA dépassée", "lot"),
    ("4007", "Date de validité du TLA non atteinte", "lot"),
    ("4008", "Logiciel PS non agréé pour produire des flux TLA", "lot"),
    ("4009", "Numéro de version de norme invalide pour l'homologation TLA", "lot"),
    ("4010", "Numéro de version de norme invalide pour l'agrément logiciel", "lot"),
    ("4011", "Version du cahier des charges invalide", "lot"),
    ("5001", "Lot créé depuis plus de 90 jours", "lot"),
    ("5002", "Lot postdaté de plus de 2 jours", "lot"),
    ("1002", "xxxxxxxx = n° FSE ou DRE dont la structure est non conforme", "facture"),
    ("2004", "xxxxxxxx = n° FSE ou DRE non intègre", "facture"),
    ("2004", "« xxxxx = n° FSE ou DRE certificat vitale incorrect »", "facture"),
    ("2007", "xxxxxxxx = n° de FSE ou DRE utilisant un mode de certification interdit", "facture"),
    ("2500", "xxxxxxxx = n° de FSE ou DRE avec déchiffrement impossible", "facture"),
    ("2501", "xxxxxxxx = n° de FSE ou DRE avec chiffrement erroné", "facture"),
    ("2503", "xxxxxxxx = n° de FSE ou DRE dont signature incontrôlable invérifiable", "facture"),
    ("2504", "xxxxxxxx = n° de FSE ou DRE avec sécurité facture erronée", "facture"),
    ("3002", "xxxxxxxx = n° FSE ou DRE effectuée par une carte CPS en opposition", "facture"),
    ("2006", "xxx = n° de FSE ou DRE utilisant une clé interdite", "facture"),
]


def _mots(s):
    return re.findall(r"[\w«»=°']+", nettoie(s).lower())


def extraire_arl(txt):
    debut = txt.index("Libellé code Traitement ARL")
    fin = txt.index("5.7.6", debut)
    bloc = nettoie(re.sub(r"\(\*\)", " ", txt[debut:fin]).replace("’", "'"))
    mots_bloc = _mots(bloc)
    entrees = []
    for code, libelle, niveau in ARL_TRANSCRIPTION:
        positions = [i for i, m in enumerate(mots_bloc) if m == code]
        if not positions:
            raise SystemExit(f"ARL {code} absent du texte de l'annexe 1-B")
        attendus = [m for m in _mots(libelle) if m != code]
        ok = False
        for p in positions:
            fenetre = mots_bloc[max(0, p - 40): p + 60]
            j = 0
            for m in fenetre:
                if j < len(attendus) and m == attendus[j]:
                    j += 1
            if j == len(attendus):
                ok = True
                break
        if not ok:
            raise SystemExit(f"ARL {code} : libellé transcrit non retrouvé dans le texte : {libelle}")
        entrees.append({"code": code, "libelle": libelle, "niveau": niveau})
    return entrees


ARL_ATTENDUS = ["1001", "2001", "2002", "2003", "2005", "2502", "3001", "4001", "4002", "4003", "4004",
                "4005", "4006", "4007", "4008", "4009", "4010", "4011", "5001", "5002", "1002", "2004",
                "2004", "2007", "2500", "2501", "2503", "2504", "3002", "2006"]


# ------------------------------------------------------- messages de service (annexe 4)
def extraire_table_service(txt, titre, fin_marque):
    debut = txt.index(titre)
    fin = txt.index(fin_marque, debut)
    bloc = txt[debut:fin]
    entrees = []
    courant = None
    for brut in bloc.splitlines():
        if "PDT-CDC-001" in brut or "Cahier des charges SESAM-Vitale" in brut or "Version 1.40-Addendum" in brut:
            continue
        if re.match(r"^\s*\d{2} La liste des erreurs", brut) or re.match(r"^\s*\d{2}\s*$", brut):
            continue
        m = re.match(r"^\s{10,40}(\d{4})\s{3,}(\S.*)$", brut)
        if m:
            courant = {"code": m.group(1), "libelle": nettoie(m.group(2))}
            entrees.append(courant)
            continue
        suite = re.match(r"^\s{30,60}(\S.*)$", brut)
        if courant and suite and not re.match(r"^\s*(Code|Rejet|Libellés)\b", suite.group(1)):
            if suite.group(1).startswith("Remarques"):
                courant = None
                continue
            courant["libelle"] = nettoie(courant["libelle"] + " " + suite.group(1))
    return entrees


SMTP_ATTENDUS = ["1010", "1020", "1030", "1031", "1032", "1040", "1050", "1060", "1061", "1062", "1063",
                 "1064", "1065", "1066", "1070", "9999"]
FICHIER_ATTENDUS = ["2010", "2011", "2012", "2020", "2030", "2040"] + [str(c) for c in range(2110, 2125)] + \
                   [str(c) for c in range(2210, 2220)] + ["2300", "3004", "9999"]
CHIFFR_ATTENDUS = ["4005", "4015", "4025"]


# ------------------------------------------------------------- lexique optique 2010
def extraire_lexique(txt):
    entrees = []
    courant = None
    for brut in txt.splitlines():
        m = re.match(r"^\s*(\d{6,7})\s+(.+?)\s{2,}(\d+,\d) %\s+(.*)$", brut)
        if m:
            code_lu = m.group(1)
            courant = {
                "code_lu": code_lu,
                "code": code_lu.zfill(7),
                "libelle": nettoie(m.group(2)),
                "part_des_rejets": m.group(3) + " %",
                "explication_source": nettoie(m.group(4).strip('"')),
            }
            entrees.append(courant)
        elif courant and re.match(r"^\s{40,}\S", brut):
            courant["explication_source"] = nettoie(courant["explication_source"] + " " + brut.strip().strip('"'))
    for e in entrees:
        e["explication_source"] = e["explication_source"].strip('" ')
    return entrees


# ------------------------------------------------------------------ Résopharma 2013
def extraire_resopharma(txt):
    i = txt.index("5. Liste exhaustives des rejets OCT")
    entrees = []
    for brut in txt[i:].splitlines():
        m = re.match(r"^\s*(R\d{4})\s+(ERR\s?\S+(?:\s/\s\S+(?:\s\S+)?)?)\s{2,}(\S.*)$", brut)
        if m:
            entrees.append({"code": m.group(1), "type": nettoie(m.group(2)), "libelle": nettoie(m.group(3))})
    return entrees


def verifier(nom, entrees, attendus):
    lus = [e["code"] for e in entrees]
    if sorted(lus) != sorted(attendus):
        manquants = sorted(set(attendus) - set(lus))
        en_trop = sorted(set(lus) - set(attendus))
        raise SystemExit(f"{nom} : écart avec la liste attendue. manquants={manquants} en_trop={en_trop} lus={lus}")
    print(f"{nom} : {len(entrees)} codes, conformes à la liste attendue")


def main():
    racine, sortie = sys.argv[1], sys.argv[2]
    os.makedirs(sortie, exist_ok=True)
    corpus = os.path.join(racine, "sv-corpus-cdc-2025", "x", "Corpus CDC_V8.50 2025 T1 - documents individuels", "3-Annexes")

    t1b = lire(os.path.join(corpus, "Annexe 1-B_v8.60 CDC1.40-Add8.txt"))
    arl = extraire_arl(t1b)
    verifier("ARL annexe 1-B", arl, ARL_ATTENDUS)

    t4 = lire(os.path.join(corpus, "Annexe 4_v8.60 CDC1.40-Add8.txt"))
    corps4 = t4[t4.index("11.1.2                  Liste des codes rejets"):]
    smtp = extraire_table_service(corps4, "11.1.2", "11.1.3")
    fichier = extraire_table_service(corps4, "11.2.2", "11.2.3")
    chiffr = extraire_table_service(corps4, "11.3.2", "Remarques importantes")
    verifier("Service REJET_SMTP", smtp, SMTP_ATTENDUS)
    verifier("Service REJET_FICHIER", fichier, FICHIER_ATTENDUS)
    verifier("Service chiffrement", chiffr, CHIFFR_ATTENDUS)

    lex = extraire_lexique(lire(os.path.join(racine, "lexique-rejets-opticiens", "lexique.txt")))
    if len(lex) != 73:
        raise SystemExit(f"lexique optique : {len(lex)} lignes lues au lieu de 73")
    print(f"Lexique optique 2010 : {len(lex)} codes")

    reso = extraire_resopharma(lire(os.path.join(racine, "resopharma-rejets-oct", "f.txt")))
    print(f"Résopharma 2013 : {len(reso)} lignes")

    def ecrire(nom, objet):
        with open(os.path.join(sortie, nom), "w", encoding="utf-8") as f:
            json.dump(objet, f, ensure_ascii=False, indent=1)

    ecrire("arl_annexe1b_2025.json", arl)
    ecrire("messages_service_2025.json", {"REJET_SMTP": smtp, "REJET_FICHIER": fichier, "CHIFFREMENT": chiffr})
    ecrire("lexique_optique_cpam44_2010.json", lex)
    ecrire("resopharma_oct_2013.json", reso)


if __name__ == "__main__":
    main()
