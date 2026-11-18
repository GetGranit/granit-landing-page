"""Liste les lignes d'historique LPP dont la date d'effet est postérieure à une date donnée
(changements déjà programmés dans la base). Usage : futurs_lpp.py <dossier> <version> <AAAAMMJJ> [prefixe_arbo]"""
import sys
sys.path.insert(0, __import__("os").path.dirname(__import__("os").path.abspath(__file__)))
from lib_b import lire_dbf

dossier, version, seuil = sys.argv[1], sys.argv[2], sys.argv[3]
prefixe = sys.argv[4] if len(sys.argv) > 4 else ""
_, fiches = lire_dbf(f"{dossier}/lpp_fiche_tot{version}.dbf")
_, histo = lire_dbf(f"{dossier}/lpp_histo_tot{version}.dbf")
fi = {f["CODE_TIPS"]: f for f in fiches}
n = 0
for l in histo:
    if l["DEBUTVALID"] > seuil:
        f = fi.get(l["CODE_TIPS"], {})
        arbo = ".".join(f.get("ARBO" + str(i), "") for i in range(1, 8))
        if prefixe and not arbo.startswith(prefixe):
            continue
        n += 1
        print(l["CODE_TIPS"], l["DEBUTVALID"], l["TARIF"], l["PUREGLEMEN"], arbo, f.get("NOM_COURT", "")[:70])
print("total", n)
# fins de validité futures des fiches
m = 0
for f in fiches:
    if f["DATE_FIN"] and f["DATE_FIN"] > seuil:
        arbo = ".".join(f.get("ARBO" + str(i), "") for i in range(1, 8))
        if prefixe and not arbo.startswith(prefixe):
            continue
        m += 1
        if m <= 30:
            print("FIN", f["CODE_TIPS"], f["DATE_FIN"], arbo, f["NOM_COURT"][:70])
print("fins futures", m)
