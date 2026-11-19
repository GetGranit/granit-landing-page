"""Mise à jour de l'outil B · Remboursement : retélécharge les bases et régénère donnees.json.

Usage (depuis n'importe quel dossier, avec l'interpréteur isolé) :
  python3 -I outils-nuit/B/scripts/maj.py --racine <dossier de téléchargements, hors du dépôt> \
      [--sortie outils-nuit/B/donnees.json] [--date AAAA-MM-JJ] [--sans-telechargement]
Puis copier la sortie dans src/lib/outils/remboursement/donnees.json (voir outils-nuit/B/sources.md).

Ce que fait le script, dans l'ordre, un téléchargement à la fois avec une pause de 7 s :
  1. page de téléchargement LPP (codage.ext.cnamts.fr) → numéro de version → LPP<version>.zip → extraction contrôlée ;
  2. BDPM : CIS_bdpm.txt et CIS_CIP_bdpm.txt (base-donnees-publique.medicaments.gouv.fr) ;
  3. sélection pharmacie (selection_pharmacie.py) puis fiches BdM_IT de chaque CIP retenu ;
  4. construire.py → donnees.json.
Chaque téléchargement va dans un dossier neuf daté (<racine>/maj-AAAAMMJJ/<nom>/).

Ce qui N'EST PAS automatisé (voir sources.md, « Procédure de mise à jour ») :
  - les montants dentaires (saisie/dentaire_ameli_2026.json) : recopiés de pages ameli.fr qui refusent curl ;
  - les taux Sécu (constantes TAUX_LPP, TAUX_DENTAIRE de construire.py) et les textes « change au 01/01/2027 » ;
  - la liste des sources (SOURCES dans construire.py) : dates à mettre à jour à la main.
Le script s'arrête si la version LPP ou la date BDPM n'a pas pu être lue.
"""
import argparse
import datetime
import os
import re
import subprocess
import sys
import time
import zipfile

ICI = os.path.dirname(os.path.abspath(__file__))
PAUSE = 7


def curl(url, dest):
    """Télécharge url vers dest ; essaie https puis http (codage.ext.cnamts.fr coupe le TLS via le proxy)."""
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    for u in ([url] + ([url.replace("https://", "http://", 1)] if url.startswith("https://www.codage.ext.cnamts.fr") else [])):
        r = subprocess.run(["curl", "-sS", "-m", "300", "-o", dest, "-w", "%{http_code}", u], capture_output=True, text=True)
        if r.returncode == 0 and r.stdout.strip() == "200" and os.path.getsize(dest) > 0:
            print("  ok", u, os.path.getsize(dest), "octets")
            time.sleep(PAUSE)
            return u
        print("  échec", u, r.stdout.strip(), r.stderr.strip()[:120])
        time.sleep(PAUSE)
    raise SystemExit(f"téléchargement impossible : {url}")


def extraire_zip(zip_path, dossier):
    os.makedirs(dossier, exist_ok=True)
    with zipfile.ZipFile(zip_path) as z:
        for info in z.infolist():
            nom = info.filename
            if "/" in nom or "\\" in nom or ".." in nom or not re.fullmatch(r"[A-Za-z0-9_.\-]+", nom):
                raise SystemExit(f"nom de fichier suspect dans l'archive : {nom!r}")
            with open(os.path.join(dossier, nom.lower() if nom.lower().endswith(".dbf") else nom), "wb") as f:
                f.write(z.read(info))


def main():
    a = argparse.ArgumentParser()
    a.add_argument("--racine", required=True, help="dossier des téléchargements (un sous-dossier neuf par mise à jour), hors du dépôt")
    a.add_argument("--sortie", default=os.path.join(ICI, "..", "donnees.json"))
    a.add_argument("--date", default=datetime.date.today().isoformat(),
                   help="date de la mise à jour (AAAA-MM-JJ) : consulte_le, genere_le, ligne de tarif en vigueur")
    a.add_argument("--sans-telechargement", action="store_true",
                   help="réutilise les dossiers de la nuit du 18/11/2026 (lpp910_extrait, bdpm_cis, bdpm_cis_cip, bdmit_fiches)")
    o = a.parse_args()

    if o.sans_telechargement:
        lpp_dir, version = f"{o.racine}/lpp910_extrait", "910"
        cis, cip = f"{o.racine}/bdpm_cis/CIS_bdpm.txt", f"{o.racine}/bdpm_cis_cip/CIS_CIP_bdpm.txt"
        bdmit = f"{o.racine}/bdmit_fiches"
    else:
        base = f"{o.racine}/maj-{datetime.date.today():%Y%m%d}"
        if os.path.exists(base):
            raise SystemExit(f"{base} existe déjà : supprimer ou attendre demain (un dossier neuf par mise à jour)")
        print("1. LPP")
        page = f"{base}/lpp_page/index_tele.html"
        curl("https://www.codage.ext.cnamts.fr/codif/tips//telecharge/index_tele.php?p_site=AMELI", page)
        t = open(page, encoding="latin-1").read()
        m = re.search(r"download_file\.php\?filename=tips/LPP(\d+)\.zip", t)
        if not m:
            raise SystemExit("version LPP introuvable sur la page")
        version = m.group(1)
        print("   version LPP", version)
        z = f"{base}/lpp_zip/LPP{version}.zip"
        curl(f"https://www.codage.ext.cnamts.fr/codif/tips/download_file.php?filename=tips/LPP{version}.zip", z)
        lpp_dir = f"{base}/lpp_extrait"
        extraire_zip(z, lpp_dir)
        print("2. BDPM")
        cis = f"{base}/bdpm_cis/CIS_bdpm.txt"
        cip = f"{base}/bdpm_cis_cip/CIS_CIP_bdpm.txt"
        curl("https://base-donnees-publique.medicaments.gouv.fr/download/file/CIS_bdpm.txt", cis)
        curl("https://base-donnees-publique.medicaments.gouv.fr/download/file/CIS_CIP_bdpm.txt", cip)
        print("3. sélection pharmacie + fiches BdM_IT")
        sel = subprocess.run([sys.executable, "-I", f"{ICI}/selection_pharmacie.py", cis, cip, f"{ICI}/saisie/selection_pharmacie.json"],
                             capture_output=True, text=True, check=True)
        open(f"{ICI}/saisie/pharmacie_retenus.json", "w", encoding="utf-8").write(sel.stdout)
        bdmit = f"{base}/bdmit_fiches"
        subprocess.run(["bash", f"{ICI}/telecharger_bdmit.sh", f"{ICI}/saisie/pharmacie_retenus.json", bdmit], check=True)
    print("4. construction")
    subprocess.run([sys.executable, "-I", f"{ICI}/construire.py", "--lpp", lpp_dir, "--lpp-version", version,
                    "--bdmit", bdmit, "--sortie", o.sortie, "--date", o.date], check=True)
    print("Penser à : mettre à jour les dates des sources dans construire.py (SOURCES), relire sources.md, "
          "et vérifier les entrées « a_verifier ».")


if __name__ == "__main__":
    main()
