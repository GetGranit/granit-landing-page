# Corrections de dev-A sur outils-nuit/A/donnees.json (18/11/2026), avant la copie dans le dépôt.
#
# 1. noemie-2600650 et noemie-0710060 : la seule source (mémo « établissements publics » de 2018)
#    vise les établissements publics de santé, aucun des 5 métiers du site. Le métier
#    « clinique-laboratoire » était déduit : la pastille « Cliniques et labos » affirmait plus que
#    la source. Les deux entrées passent « à vérifier » (ni page, ni ligne du hub).
# 2. Le cahier des charges NOEMIE PS de mai 2004, déjà cité dans sources.md comme source de
#    contexte, entre dans la liste des sources : la méthode du hub s'appuie dessus.
#
# Usage : python3 -I corriger_dev_a.py <chemin de donnees.json>   (réécrit le fichier en place)
import json
import sys

chemin = sys.argv[1]
with open(chemin, encoding="utf-8") as f:
    d = json.load(f)

PHRASE_COMMUNE = (
    "Libellés publiés par des CPAM du régime général ; le libellé reçu dans votre propre retour "
    "fait foi et un autre régime peut employer un autre texte."
)

NOTES = {
    "noemie-2600650": (
        "Seule source : le mémo de 2018 rédigé pour les établissements publics de santé, qui ne "
        "font pas partie des 5 métiers de l’outil. Le rattachement aux cliniques et laboratoires "
        "était déduit : à confirmer par un mémo qui vise les cliniques privées, un centre de santé "
        "ou un cabinet dentaire avant toute publication. "
    ),
    "noemie-0710060": (
        "Seule source : le mémo de 2018 rédigé pour les établissements publics de santé (T2A "
        "publique), qui ne font pas partie des 5 métiers de l’outil ; il ne vise pas les cliniques "
        "privées. Les taux de base cités par le mémo ne sont pas repris. "
    ),
}

changes = 0
for e in d["entrees"]:
    if e["slug"] in NOTES and e["statut"] == "sur":
        e["statut"] = "a_verifier"
        e["note_verification"] = NOTES[e["slug"]] + PHRASE_COMMUNE
        e["page_conseillee"] = False
        changes += 1

if not any(s["id"] == "cdc-noemie-ps-2004" for s in d["sources"]):
    d["sources"].append(
        {
            "id": "cdc-noemie-ps-2004",
            "titre": "Cahier des charges NOEMIE PS (mai 2004)",
            "url": "https://www.sesam-vitale.fr/documents/20182/55864/cdc_noemie-ps-052004.pdf",
            "editeur": "Document publié sur sesam-vitale.fr",
            "date_source": "2004-05",
            "consulte_le": "2026-11-18",
        }
    )
    changes += 1

with open(chemin, "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=1)

print(f"{changes} changement(s)")
