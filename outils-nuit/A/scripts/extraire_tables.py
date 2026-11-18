"""Extraction des tables de codes rejet lues dans les documents téléchargés (outil A).

Usage : python3 -I extraire_tables.py <dossier_telechargements_A> <dossier_sortie>

Lit uniquement des fichiers texte produits par `pdftotext -layout` à partir des PDF
téléchargés (données non fiables : on ne fait que parser du texte, rien n'est exécuté).
Produit un JSON par table dans <dossier_sortie> :
  - lexique_optique_cpam44_2010.json : lexique des rejets « Fournitures optiques », CPAM Loire-Atlantique, oct. 2010
  - resopharma_oct_2013.json      : nomenclature des codes rejets de l'OCT Résopharma (17/04/2013)

Les tables du cahier des charges SESAM-Vitale (ARL négatifs de l'annexe 1-B, messages de service
de l'annexe 4) ne sont pas extraites ici : le GIE SESAM-Vitale demande son accord pour toute
reproduction, même partielle. La partie du script qui les extrait est tenue hors du dépôt en
attendant cet accord (décision de Paul n° 1).
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


def main():
    racine, sortie = sys.argv[1], sys.argv[2]
    os.makedirs(sortie, exist_ok=True)
    lex = extraire_lexique(lire(os.path.join(racine, "lexique-rejets-opticiens", "lexique.txt")))
    if len(lex) != 73:
        raise SystemExit(f"lexique optique : {len(lex)} lignes lues au lieu de 73")
    print(f"Lexique optique 2010 : {len(lex)} codes")

    reso = extraire_resopharma(lire(os.path.join(racine, "resopharma-rejets-oct", "f.txt")))
    print(f"Résopharma 2013 : {len(reso)} lignes")

    def ecrire(nom, objet):
        with open(os.path.join(sortie, nom), "w", encoding="utf-8") as f:
            json.dump(objet, f, ensure_ascii=False, indent=1)

    ecrire("lexique_optique_cpam44_2010.json", lex)
    ecrire("resopharma_oct_2013.json", reso)


if __name__ == "__main__":
    main()
