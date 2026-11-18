"""Outils communs aux scripts de l'outil B (remboursement).

Lecture DBF minimale (format dBase III, celui de la base LPP de l'Assurance Maladie),
sans dépendance externe. À lancer avec `python3 -I` ; les scripts ajoutent
leur propre dossier à sys.path pour importer ce module.
"""
import struct


def lire_dbf(chemin, encodage="cp850"):
    """Renvoie (champs, lignes) ; champs = [(nom, type, longueur, decimales)],
    lignes = liste de dict (valeurs str nettoyées, '' si vide). Les enregistrements
    marqués supprimés ('*') sont ignorés."""
    with open(chemin, "rb") as f:
        donnees = f.read()
    nb, lg_entete, lg_enreg = struct.unpack("<IHH", donnees[4:12])
    champs = []
    pos = 32
    while donnees[pos] != 0x0D:
        bloc = donnees[pos:pos + 32]
        nom = bloc[:11].split(b"\x00")[0].decode("ascii").strip()
        typ = chr(bloc[11])
        lg = bloc[16]
        dec = bloc[17]
        champs.append((nom, typ, lg, dec))
        pos += 32
    lignes = []
    for i in range(nb):
        debut = lg_entete + i * lg_enreg
        enr = donnees[debut:debut + lg_enreg]
        if not enr or enr[0:1] == b"*":
            continue
        p = 1
        ligne = {}
        for nom, typ, lg, dec in champs:
            brut = enr[p:p + lg]
            p += lg
            ligne[nom] = brut.decode(encodage, errors="replace").strip()
        lignes.append(ligne)
    return champs, lignes


def dbf_date(v):
    """'20250101' -> '2025-01-01' ; '' -> None."""
    v = (v or "").strip()
    if len(v) == 8 and v.isdigit():
        return f"{v[:4]}-{v[4:6]}-{v[6:]}"
    return None


def nombre(v):
    """'12,34' / '12.34' / '' -> float|None."""
    v = (v or "").strip().replace(" ", "").replace(" ", "")
    if not v:
        return None
    v = v.replace(",", ".")
    try:
        return float(v)
    except ValueError:
        return None


def arrondi(x):
    return None if x is None else round(x + 1e-9, 2)
