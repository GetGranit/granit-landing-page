"""Choisit un CIP13 par ligne de saisie/selection_pharmacie.json dans la BDPM (présentation active,
commercialisée, taux renseigné). Écrit la liste retenue en JSON sur la sortie standard.
Usage : python3 -I selection_pharmacie.py <CIS_bdpm.txt> <CIS_CIP_bdpm.txt> <selection.json>"""
import json
import sys
cis_f, cip_f, sel_f = sys.argv[1:4]
cis = {}
for l in open(cis_f, encoding="latin-1"):
    p = l.rstrip("\n").split("\t")
    if len(p) > 6:
        cis[p[0]] = p
pres = []
for l in open(cip_f, encoding="utf-8"):
    p = l.rstrip("\n").split("\t")
    if len(p) >= 12 and p[0] in cis:
        pres.append(p)
retenus, manquants = [], []
for prefixe, pack in json.load(open(sel_f, encoding="utf-8")):
    cands = [p for p in pres if cis[p[0]][1].startswith(prefixe) and p[3] == "Présentation active"
             and "commercialisation" in p[4].lower() and "arrêt" not in p[4].lower() and p[8].strip()
             and (pack in p[2])]
    if not cands:
        manquants.append(prefixe)
        continue
    p = sorted(cands, key=lambda x: x[6])[0]
    retenus.append({"cis": p[0], "cip13": p[6], "denomination": cis[p[0]][1], "presentation": p[2],
                    "titulaire": cis[p[0]][10].strip(), "taux_bdpm": p[8], "prix_bdpm": p[9],
                    "prix_public_bdpm": p[10], "honoraire_bdpm": p[11],
                    "indications_taux": p[12] if len(p) > 12 else ""})
json.dump({"retenus": retenus, "manquants": manquants}, sys.stdout, ensure_ascii=False, indent=1)
