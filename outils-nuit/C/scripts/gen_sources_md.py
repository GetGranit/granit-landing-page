# Génère outils-nuit/C/sources.md à partir de outils-nuit/C/donnees.json (lancer après build.py).
import json, os
C = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(C, 'donnees.json')))
METIERS = ['optique', 'audio', 'dentaire', 'pharmacie', 'centre-de-sante', 'laboratoire', 'hospitalisation']
AB = {'optique': 'Optique', 'audio': 'Audio', 'dentaire': 'Dentaire', 'pharmacie': 'Pharmacie', 'centre-de-sante': 'Centre de santé', 'laboratoire': 'Labo', 'hospitalisation': 'Clinique'}
L = []
w = L.append
E = D['entrees']
nsur = sum(1 for e in E if e['statut'] == 'sur')
w("# Outil C · Mutuelle → portail de tiers payant : sources et vérifications")
w("")
w(f"Généré le {D['genere_le']}. Données publiques seulement. Fichier de données : `donnees.json` ({len(E)} complémentaires, dont {nsur} avec au moins un métier « sûr », {len(E) - nsur} « à vérifier » ; {len(D['operateurs'])} opérateurs, réseaux ou portails ; {len(D['sources'])} sources).")
w("")
w("## Comment lire ces données")
w("")
w("- **Opérateur de tiers payant** : la plateforme chez qui le professionnel fait la demande de prise en charge et qui le paie (SP santé, iSanté, Viamedis, Almerys, Actil, Korelio, GIE Groupama TPG). **Réseau de soins** : un réseau de professionnels partenaires aux tarifs négociés (Kalixia, Itelis, Sévéane). Santéclair, Carte Blanche Partenaires et Actil font les deux. Dans `donnees.json`, `par_metier` porte l'opérateur ou le portail ; `reseau_soins` porte les réseaux.")
w("- Rôle `gestion-directe` (ajouté au format demandé) : la complémentaire traite elle-même la prise en charge (ex. Swiss Life pour l'hospitalisation).")
w("- Une entrée `\"sur\"` pour un métier = une source publique, datée, qui nomme l'opérateur **pour ce métier**. Sinon `\"a_verifier\"`, avec la raison dans `note_verification`. Quand une source ne précise pas le métier, `metier_precise` vaut `false` et le statut reste `a_verifier`.")
w("- Une complémentaire peut avoir plusieurs opérateurs pour un même métier (selon le contrat ou la date) : le premier est dans l'objet du métier, les autres dans `alternatives`. **La carte de tiers payant du patient tranche toujours** : c'est la phrase à garder sur chaque page.")
w("- Métier « hospitalisation » = établissement hospitalier privé (clinique, ESPIC).")
w("- Champ `restriction` (sur chaque métier et chaque alternative) : `null` quand la source ouvre tout le domaine ; sinon la limite lue dans la source, à afficher telle quelle. Valeurs : `\"stomatologue uniquement\"` (segment Dentiste réservé à la spécialité 18 : **ne vaut ni pour un chirurgien-dentiste ni pour un centre dentaire**, statut toujours `a_verifier`), `\"consultations externes uniquement\"` (ne vaut pas pour un séjour en clinique, `a_verifier`), `\"frais de séjour uniquement\"` (vaut pour l'hospitalisation, statut `sur`, restriction affichée).")
w("- Dans les listes SP santé et iSanté, beaucoup de complémentaires ont **deux lignes** « Dentiste » actives : une sans restriction (souvent ouverte en 2025) et une « UNIQUEMENT STOMATOLOGUE (18) » plus ancienne. La ligne sans restriction couvre tous les dentistes ; la ligne stomatologue s'y ajoute sans la limiter. Ces métiers restent `sur`, `restriction: null`, et la note cite les deux lignes avec leurs dates. Seuls les segments qui n'ont **que** la ligne stomatologue passent en `a_verifier`.")
w("")
w("## Les deux sources qui font l'essentiel")
w("")
w("1. **Liste publique SP santé** (https://www.spsante.fr/login#/amc/list, données https://www.spsante.fr/api/referentiel/list-amc) : pour chaque complémentaire (libellé + numéro AMC), les domaines de professionnels ouverts au tiers payant SP santé, avec date de début et date de fin. Domaines utilisés : Opticien (OP), Audioprothésiste (AU), Dentiste (DE), Pharmacien (PH), Centre de santé (CS), Laboratoire (LB), Établissement hospitalier privé (CP). Libellés des codes lus dans https://www.spsante.fr/api/referentiel/domaines.")
w("2. **Liste publique iSanté** (https://www.tp-isante.fr/login#/amc/list, données https://www.tp-isante.fr/api/referentiel/list-amc), même structure ; iSanté ajoute Centre dentaire (CD), Centre de soins médicaux (CM), ESPIC (ES).")
w("")
w("Ces deux listes sont publiques : la page « amc/list » fait partie de l'application ouverte avant connexion. La FAQ de chaque site (entrées de 2019) dit encore qu'il faut se connecter pour la voir : c'est daté, la liste s'affiche sans identifiant. Elle est « mise à jour à chaque ouverture ou fermeture d'un segment par l'organisme complémentaire » (FAQ). Un segment actif veut dire : une carte qui désigne cet opérateur, pour ce domaine, sera traitée par lui. Cela ne dit pas que tous les contrats de la complémentaire y passent.")
w("")
w("Les listes contiennent aussi beaucoup de gestionnaires et de courtiers (Henner, Gerep, Verspieren, WTW, Mercer, Aon, Collecteam, TG Assur…). Seuls Henner et Sigmage sont repris, avec `type: gestionnaire`.")
w("")
w("## Sources")
w("")
w("| id | Titre | Éditeur | Date de la source | Consultée le | Accès |")
w("|---|---|---|---|---|---|")
for s in D['sources']:
    w(f"| `{s['id']}` | [{s['titre']}]({s['url']}) | {s['editeur']} | {s['date_source']} | {s['consulte_le']} | {s['acces']} |")
w("")
w("Accès « texte intégral » : page lue en entier le 18/11/2026, le site refusant les requêtes directes (403). Accès « extraits de la page seulement » : seuls des extraits de la page ont pu être lus ; la date de l'extrait est inconnue, donc tout ce qui en dépend reste `a_verifier`.")
w("")
w("## Opérateurs, réseaux et portails")
w("")
w("| Nom | Rôle | Espace pro | Métiers | Statut | Sources |")
w("|---|---|---|---|---|---|")
for o in D['operateurs']:
    w(f"| {o['nom']} | {o['role']} | {o['espace_pro_url'] or '—'} | {', '.join(AB[m] for m in o['metiers'])} | {o['statut']} | {', '.join('`'+x+'`' for x in o['source_ids'])} |")
w("")
for o in D['operateurs']:
    w(f"- **{o['nom']}** : {o['note']}")
w("")
w("## Tableau des entrées")
w("")
w("— = pas de source publique trouvée. Après le premier opérateur, les autres opérateurs cités pour le même métier.")
w("")
w("| Complémentaire | Statut | " + ' | '.join(AB[m] for m in METIERS) + " | Réseaux |")
w("|---|---|" + '---|' * len(METIERS) + "---|")
for e in E:
    cells = []
    for m in METIERS:
        o = e['par_metier'].get(m)
        if not o:
            cells.append('—'); continue
        c = f"{o['operateur']} {'(sûr)' if o['statut'] == 'sur' else '(à vérifier)'}" + (f" [{o['restriction']}]" if o.get('restriction') else '')
        if o.get('alternatives'):
            c += ' ; puis ' + ', '.join(f"{a['operateur']} {'(sûr)' if a['statut'] == 'sur' else '(à vérifier)'}" + (f" [{a['restriction']}]" if a.get('restriction') else '') for a in o['alternatives'])
        cells.append(c)
    res = ', '.join(f"{r['nom']} {'(sûr)' if r['statut'] == 'sur' else '(à vérifier)'}" for r in e['reseau_soins']) or '—'
    w(f"| {e['mutuelle']} | {e['statut']} | " + ' | '.join(cells) + f" | {res} |")
w("")
w("## Entrées entièrement « à vérifier » et pourquoi")
w("")
for e in E:
    if e['statut'] != 'a_verifier':
        continue
    raisons = sorted({o['note_verification'] for o in e['par_metier'].values()})
    extra = ' '.join(e['notes'])
    w(f"- **{e['mutuelle']}** : " + (' / '.join(raisons) if raisons else "aucun opérateur nommé dans une source publique consultée.") + (f" {extra}" if extra else ''))
w("")
w("## Métiers « à vérifier » dans des entrées par ailleurs sûres")
w("")
for e in E:
    if e['statut'] != 'sur':
        continue
    av = [(m, o) for m, o in e['par_metier'].items() if o['statut'] != 'sur']
    if av:
        w(f"- **{e['mutuelle']}** : " + ' ; '.join(f"{AB[m]} ({o['operateur']}) : {o['note_verification']}" for m, o in av))
w("")
w("## Segments fermés (utile pour les pages « cette complémentaire a changé d'opérateur »)")
w("")
for e in E:
    if e['segments_fermes']:
        w(f"- **{e['mutuelle']}** : " + ' ; '.join(e['segments_fermes']))
w("")
# --- restrictions : liste explicite
w("## Segments restreints (à ne jamais afficher comme valables pour tout le métier)")
w("")
for e in E:
    for m, o in e['par_metier'].items():
        for x in [o] + o.get('alternatives', []):
            if x.get('restriction'):
                w(f"- **{e['mutuelle']}**, {AB[m]}, {x['operateur']} : {x['restriction']} ({x['statut']}).")
w("")
w("## MGEN : écart avec la fiche existante du site")
w("")
w("La fiche `content/ressources/portail-mgen.json` (vérifiée le 06/11/2026) et `content/plateformes/mgen.json` présentent le passage de MGEN chez Viamedis par étapes : 1er mai 2026 (contrat collectif de l'Éducation nationale, USPO), **1er juillet 2026 « dernière bascule complémentaire vers Viamedis »** (FSPF, que `plateformes/mgen.json` résume en « bascule finalisée le 1er juillet 2026 »), 1er septembre 2026 (ligne pro MGEN remplacée par Viamedis, USPO). Elle renvoie l'opticien vers viamedis.net, ce qui concorde avec nos données.")
w("")
w("Ce que la fiche ne dit pas, d'après iVoirNet (logiciel optique, 23/10/2026, https://www.ivoirnet.com/actualites/nouvel-article-1792741020304) : pour l'optique et l'audiologie, l'opérateur change **dès le 27 octobre 2026** ; la gestion du tiers payant complémentaire MGEN sera **intégralement** confiée à Viamedis **à partir du 30 novembre 2026**, date de fermeture de l'espace professionnel MGEN (factures de soins tardifs à télétransmettre au plus tard le 29/11/2026). Cela nuance « finalisée le 1er juillet 2026 » : au 18/11/2026, la bascule n'est pas complète pour tous les métiers.")
w("")
w("Conséquence dans `donnees.json` : MGEN optique et audio = Viamedis `sur` (depuis le 27/10/2026) ; pharmacie, dentaire, laboratoire, centre de santé et clinique = Viamedis `a_verifier` jusqu'au 30/11/2026. La pharmacie était `sur` dans la première version : elle repasse `a_verifier`, l'extrait public de l'USPO étant tronqué et iVoirNet datant la bascule complète au 30/11. La fiche du site n'a pas été modifiée.")
w("")
w("## Ce qui a bloqué, ce qui manque")
w("")
w("- **Inter-AMC** (tpcomplementaire.fr) : « Site en maintenance » le 18/11/2026 (HTTP 500), aussi par une autre voie de lecture. C'est pourtant la meilleure source pour les centres de santé, laboratoires et cliniques : listes « AMC Ville », « OTP Ville » et « AMC Hôpital » (document ROC daté du 24/09/2026 selon l'index de recherche). À télécharger dès que le site revient : `https://www.tpcomplementaire.fr/iamcps/telechargerDocument?filename=liste_amc_hopital.pdf`.")
w("- **korelio.com** en maintenance (HTTP 500) : PRO BTP, Audiens, SMABTP, Mutuelle Mieux-Être restent `a_verifier` côté Korelio.")
w("- **viamedis.fr, almerys.com, actil.com, itelis.fr, swisslife.fr, mon.apicil.com, allianz.fr, mma.fr, probtp.com** répondent 403/401/503 en requête directe. Swiss Life, Apicil, Actil et Itelis ont été lus en entier par une autre voie de lecture ; Viamedis, Almerys, Allianz, MMA et PRO BTP n'ont pas pu être relus en entier. Aucun opérateur ne publie de liste de clients par métier en dehors de SP santé et iSanté.")
w("- Pas trouvé de source publique nommant l'opérateur de : AG2R La Mondiale (réseau Itelis seulement), Allianz en optique (Santéclair cité comme réseau), MMA et MAAF en optique (Santéclair), La Mutuelle Générale (outil non nommé), Solimut (espace propre), Macif (Almerys d'après un article de 2023, sans métier).")
w("- Pharmacie : les syndicats (FSPF, USPO) publient les changements d'opérateur, mais l'essentiel est réservé aux adhérents ; seuls les titres et extraits publics sont utilisés.")
w("- Les spécimens de cartes publiés par les complémentaires (Aésio) sont la meilleure preuve « par métier » : à chercher pour les autres grandes complémentaires.")
w("")
w("## Pour l'agent qui fera les pages")
w("")
w("- Page publiable seulement si l'entrée a `statut: \"sur\"`, et n'afficher comme acquis que les métiers `sur`. Les métiers `a_verifier` peuvent apparaître dans la recherche avec la mention « à confirmer sur la carte ».")
w("- Chaque page doit dire que la carte de tiers payant du patient décide, et dater l'information (« liste SP santé consultée le 18/11/2026 »).")
w("- Ne pas contredire les fiches existantes `content/plateformes/*.json` et `content/ressources/portail-*.json` : elles concordent avec ces données (Harmonie → Viamedis, Aésio → Almerys, Prévifrance → iSanté, Swiss Life → Carte Blanche, Apicil → Actil, Oxantis fermé). Nouveauté par rapport à elles : MGEN optique et audio chez Viamedis depuis le 27/10/2026 et tout le tiers payant au 30/11/2026 (iVoirNet).")
w("- La liste SP santé expose aussi `/api/referentiel/codes-rejets` (liste de codes de rejet SP santé, sans libellé dans cette réponse ; `/api/referentiel/rejets-factures` et `/api/referentiel/rejet-facture` existent aussi, non testés) : piste pour l'outil A.")
open(os.path.join(C, 'sources.md'), 'w').write('\n'.join(L) + '\n')
print(len(L), 'lignes')
