# Construit outils-nuit/C/donnees.json à partir des listes publiques SP santé / iSanté et des
# sources lues (pages publiques). sources.md se refait ensuite avec gen_sources_md.py.
#
# Mise à jour :
#   1. Télécharger les deux listes publiques dans un dossier hors du dépôt, une requête à la fois :
#        curl -sS -o <dossier>/spsante/list-amc.json https://www.spsante.fr/api/referentiel/list-amc
#        curl -sS -o <dossier>/isante/list-amc.json  https://www.tp-isante.fr/api/referentiel/list-amc
#      (pages publiques citées : fetch.sh urls*.txt <dossier>/pages, avec des pauses).
#   2. Changer REF (date du relevé) et les dates de consultation des sources relues.
#   3. python3 -I build.py <dossier>   → écrit ../donnees.json
#   4. python3 -I gen_sources_md.py    → écrit ../sources.md
#   5. Copier ../donnees.json dans src/lib/outils/mutuelle-portail/donnees.json, puis npm test.
import json, collections, datetime, os, sys

T = sys.argv[1] if len(sys.argv) > 1 else os.environ.get('TELECHARGEMENTS_C', 'telechargements')
OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF = '2026-11-18'
METIERS = ['optique', 'audio', 'dentaire', 'pharmacie', 'centre-de-sante', 'laboratoire', 'hospitalisation']

# ---------------------------------------------------------------- sources
S = {}
def src(id, titre, url, editeur, date_source, consulte_le=REF, acces='direct'):
    S[id] = dict(id=id, titre=titre, url=url, editeur=editeur, date_source=date_source,
                 consulte_le=consulte_le, acces=acces)

src('sp-liste-amc', "SP santé · Liste des complémentaires (AMC) par domaine de professionnels de santé",
    'https://www.spsante.fr/login#/amc/list', 'SP santé (marque de tiers payant gérée par le Cetip, groupe Cegedim)',
    'état de la liste au 2026-11-18 (dates de début et de fin par segment)', acces='direct (données servies par https://www.spsante.fr/api/referentiel/list-amc et /api/referentiel/domaines)')
src('sp-presentation', "SP santé · Présentation du tiers payant SP santé (pages du site)", 'https://www.spsante.fr/',
    'SP santé', 'non datée (page en ligne)', acces='direct (contenu servi par https://www.spsante.fr/api/cms/blocklists/Pages)')
src('isante-liste-amc', "iSanté · Liste des organismes complémentaires actifs par domaine",
    'https://www.tp-isante.fr/login#/amc/list', 'iSanté (Cetip, groupe Cegedim)',
    'état de la liste au 2026-11-18 (dates de début et de fin par segment)', acces='direct (données servies par https://www.tp-isante.fr/api/referentiel/list-amc et /api/referentiel/domaines)')
src('isante-faq', "iSanté · FAQ professionnels (liste des complémentaires actives, numéro de télétransmission)",
    'https://www.tp-isante.fr/login#/faq/', 'iSanté', 'entrées modifiées en 2019 et 2020', acces='direct (https://www.tp-isante.fr/api/faq)')
src('isante-site', "iSanté · Accueil (« iSanté - opérateur de tiers-payant »)", 'https://www.tp-isante.fr/', 'iSanté', 'non datée')
src('hm-contacts', "Harmonie Mutuelle · Professionnels de santé, contacts utiles", 'https://www.harmonie-mutuelle.fr/professionnels-de-sante/professionnels-sante-contacts-utiles',
    'Harmonie Mutuelle', 'mis à jour le 29 juin 2026')
src('aesio-ps', "Aésio mutuelle · Professionnels de santé", 'https://ensemble.aesio.fr/connectez-vous-vos-espaces-securises/professionnels-de-sante',
    'Aésio mutuelle', 'non datée (annonce Almerys depuis le 01/01/2023)')
src('aesio-specimen-2025', "Aésio mutuelle · Spécimen de carte de tiers payant 2025 (logos Aésio, Carte Blanche, Almerys)",
    'https://ensemble.aesio.fr/sites/default/files/2025-03/image2.png', 'Aésio mutuelle', 'carte valable du 01/01/2025 au 31/12/2025 (fichier de mars 2025)')
src('aesio-specimen-2024', "Aésio mutuelle · Spécimen de carte de tiers payant 2024 (logos Aésio, Kalixia, Almerys)",
    'https://ensemble.aesio.fr/sites/default/files/2024-01/visuel_specimen_cartetp-2024.jpg', 'Aésio mutuelle', 'fichier de janvier 2024')
src('acuite-aema', "Acuité · Le 5e acteur de l'assurance officialise son opérateur de tiers payant et renforce son offre avec Carte Blanche",
    'https://acuite.fr/actualite/ocam/251022/le-5e-acteur-de-lassurance-officialise-son-operateur-de-tiers-payant-et', 'Acuité', '2023-02-17')
src('acuite-oxantis', "Acuité · Fermeture de la plateforme de tiers payant Oxantis le 26 octobre 2026",
    'https://www.acuite.fr/actualites/profession/fermeture-de-la-plateforme-de-tiers-payant-oxantis-a335575', 'Acuité', '2026-09-16')
src('acuite-ratp', "Acuité · Mutuelle RATP : le groupe rejoint Kalixia et bascule le tiers payant sur Viamedis",
    'https://www.acuite.fr/actualites/profession/regime-obligatoire/mutuelle-ratp-le-groupe-rejoint-kalixia-et-327020', 'Acuité', '2026-01-09')
src('mnt-vyv', "MNT · Le Groupe VYV facilite la gestion du tiers payant optique, audio et dentaire",
    'https://www.mnt.fr/articles/groupe-vyv-facilite-gestion-tiers-payant', 'MNT', '2023-03-30')
src('ivoirnet-mgen', "iVoirNet (logiciel optique) · La MGEN complémentaire via VIAMEDIS à partir du 27 octobre 2026",
    'https://www.ivoirnet.com/actualites/nouvel-article-1792741020304', 'iVoirNet', '2026-10-23')
src('uspo-mgen-mai', "USPO · 1er mai 2026 : migration des bénéficiaires MGEN vers VIAMEDIS",
    'https://uspo.fr/1er-mai-2026-migration-des-beneficiaires-mgen-vers-viamedis/', "Union des Syndicats de Pharmaciens d'Officine", '2026-04-30 (selon la date de publication de la page)')
src('uspo-mgen-ligne', "USPO · MGEN Actus – professionnel de santé",
    'https://uspo.fr/mgen-actus-professionnel-de-sante/', "Union des Syndicats de Pharmaciens d'Officine", '2026 (extrait public tronqué)')
src('fspf-complementaires', "FSPF · Relations Complémentaires santé (fiche « Bascule complémentaire MGEN vers Viamedis – 1er juillet 2026 », annonce de l'opérateur Carte Blanche Partenaires)",
    'https://www.fspf.fr/relations-complementaires-sante/', 'Fédération des Syndicats Pharmaceutiques de France', 'liste d\'articles consultée le 2026-11-18 (article CBP publié le 7 octobre 2026)')
src('mgen-msp', "MGEN · MGEN Santé Prévoyance (réseau Kalixia)", 'https://www.mgen.fr/nos-solutions/mgen-sante-prevoyance/', 'MGEN', 'non datée')
src('lmf-faq', "La Mutuelle Familiale · FAQ (tiers payant Viamedis et iSanté)", 'https://www.mutuelle-familiale.fr/faq', 'La Mutuelle Familiale', 'non datée (annonce Viamedis depuis le 01/01/2019)')
src('pf-pro', "Prévifrance · Professionnels de santé (iSanté gestionnaire de tiers payant au 01/01/2026)", 'https://www.previfrance.fr/professionnels-de-sante.html',
    'Prévifrance', 'annonce d\'effet au 01/01/2026')
src('sl-tp', "Swiss Life · Comment faire du tiers payant chez Swiss Life ?", 'https://www.swisslife.fr/swiss-life-en-france/professionnels-de-sante/comment-faire-du-tiers-payant-chez-swiss-life.html',
    'Swiss Life', 'non datée (spécimen d\'attestation 2025 sur la page)', acces='linkup-fetch (le site répond 403 en accès direct)')
src('apicil-optique', "Apicil · Que dois-je savoir avant d'acheter des lunettes ?", 'https://mon.apicil.com/salon-client/optique-jachete-des-lunettes-que-dois-je-savoir/',
    'Groupe APICIL', 'non datée', acces='linkup-fetch (le site répond 403 en accès direct)')
src('actil-home', "Actil · Accueil (tiers payant, réseau de soins, clients)", 'https://www.actil.com/', 'Actil', 'non datée',
    acces='linkup-fetch (le site répond 403 en accès direct)')
src('korelio-index', "Korelio · Partenaires, concentrateurs, conventions (extraits)", 'https://www.korelio.com/partenaires.html', 'Korelio (PRO BTP)',
    'inconnue : extraits de l\'index de recherche Linkup', acces='index Linkup uniquement (korelio.com en maintenance le 2026-11-18)')
src('tpg-groupama-index', "GIE Groupama Tiers Payant Généralisé · Espace privé (extrait)", 'https://www.tpg.groupama.com/tpg/public/login',
    'GIE Groupama TPG', 'inconnue : extrait de l\'index de recherche Linkup', acces='index Linkup uniquement')
src('groupama-attestation', "Groupama · Carte de mutuelle ou attestation de tiers payant", 'https://www.groupama.fr/mutuelle-sante/conseils/attestation-tiers-payant/',
    'Groupama', 'mis à jour le 24/03/2026')
src('sc-ps', "Santéclair · Professionnel de la santé (conventions, connexion)", 'https://www.santeclair.fr/fr/professionnel-sante', 'Santéclair', 'non datée')
src('sc-partenaires', "Santéclair · Les complémentaires santé partenaires (liste déroulante)", 'https://www.santeclair.fr/fr/complementaires-sante-partenaires', 'Santéclair', 'état au 2026-11-18')
src('sc-allianz', "Santéclair · Mutuelle Allianz : vos services santé Santéclair", 'https://www.santeclair.fr/fr/beneficiaire/services-sante-allianz-contrats-individuels', 'Santéclair', 'non datée')
src('maaf-faq-optique', "MAAF · FAQ santé, optique (opticiens partenaires Santéclair)", 'https://www.faq-maaf.fr/categorie/sante/optique', 'MAAF', 'non datée')
src('gen-faq-tp', "Generali · Aide, complémentaire santé, tiers payant", 'https://www.generali.fr/aide/categories/complementaire-sante/tiers-payant', 'Generali', 'non datée')
src('mh-faq', "Malakoff Humanis · Dois-je avancer les frais en magasin ?", 'https://faq.malakoffhumanis.com/contents/dois-je-avancer-les-frais-en-magasin', 'Malakoff Humanis', 'non datée')
src('kalixia-ps', "Kalixia · Professionnels de santé (principales complémentaires utilisatrices)", 'https://www.kalixia.fr/professionnels-de-sante/', 'Kalixia', 'non datée')
src('itelis-acceder', "Itelis · Accéder à vos services (liste des complémentaires partenaires)", 'https://www.itelis.fr/acceder-vos-services', 'Itelis (Isea)', 'état au 2026-11-18',
    acces='linkup-fetch (le site répond 403 en accès direct)')
src('matmut-carte', "Matmut · Carte mutuelle (légende des codes de facturation)", 'https://www.matmut.fr/mutuelle/services/carte-mutuelle', 'Matmut', 'non datée')
src('klesia-opticien', "Klesia · Opticien(ne) : comment effectuer vos demandes de prise en charge", 'https://www.klesia.fr/opticienne-comment-effectuer-vos-demandes-de-prise-en-charge-et-remboursement-optique', 'Klesia', 'non datée')
src('klesiamut-faq', "KLESIA Mut' · Ancienne foire aux questions (PlanSanté, iSanté)", 'https://www.klesiamut.fr/fr/old-foire-aux-questions', "KLESIA Mut'", 'non datée (ancienne page encore en ligne)')
src('viasante-equivia', "Viasanté · Offre EQUIVIA (tiers payant Almerys, réseau Itelis)", 'https://www.viasante.fr/particuliers/complementaire-sante-economique-equivia/', 'Viasanté Mutuelle', 'non datée')
src('interiale-santeclair', "Intériale · Réseau de soins Santéclair (collectivités)", 'https://www.interiale.fr/collectivites/interiale-a-vos-cotes/reseau-de-soins-santeclair/', 'Intériale', 'non datée')
src('interiale-itelis', "Intériale · Réseau de soins Itelis", 'https://www.interiale.fr/justice/interiale-a-vos-cotes/reseau-de-soins-itelis/', 'Intériale', 'non datée')
src('april-optique', "April · Assurance optique (réseau Kalixia)", 'https://www.april.fr/complementaire-sante/assurance-optique', 'April', 'page consultée le 2026-11-18 (réponses datées de novembre 2026)')
src('mutuelle-sg', "Mutuelle SG · Démarches tiers payant (opérateur iSanté, réseau Carte Blanche)", 'https://mutuelle-sg.com/demarches-tiers-payant', 'Mutuelle SG', 'non datée')
src('lmg-tp', "La Mutuelle Générale · Un service de tiers payant simple, pratique, efficace", 'https://www.lamutuellegenerale.fr/a-propos/newsroom/un-service-de-tiers-payant-simple-pratique-efficace', 'La Mutuelle Générale', 'non datée')
src('solimut-contact', "Solimut · Nous contacter (espace professionnel de santé)", 'https://www.solimut-mutuelle.fr/nous-contacter/', 'Solimut Mutuelle de France', 'non datée')
src('alan-reseau', "Alan · Rejoindre le Réseau Alan (opticiens)", 'https://alan.com/fr-fr/l/rejoindre-reseau-alan', 'Alan', 'appel à candidatures jusqu\'au 30/11/2026, réseau lancé le 01/01/2027')
src('axa-tp-index', "AXA · Tiers payant : fonctionnement et modalités de remboursement (réseau Itelis)", 'https://www.axa.fr/particuliers/conseils/sante/remboursements-sante/tout-savoir-tiers-payant-modalites-remboursements.html',
    'AXA France', 'inconnue : extrait de l\'index de recherche Linkup', acces='index Linkup uniquement')
src('viamedis-index', "Viamedis · Réseaux de soins ; communiqués (filiale du groupe Malakoff Humanis, homologation ROC)", 'https://www.viamedis.fr/solutions/reseaux-de-soins/',
    'Viamedis', 'inconnue (communiqués de 2022 et 2023) : extraits de l\'index de recherche Linkup', acces='index Linkup uniquement (viamedis.fr répond 403 en accès direct)')
src('cbp-qsn', "Carte Blanche Partenaires · Qui sommes-nous / espace complémentaire santé", 'https://carteblanchepartenaires.fr/sante/qui-sommes-nous', 'Carte Blanche Partenaires', 'non datée')

# ---------------------------------------------------------------- opérateurs / portails
OPS = {
 'sp-sante': dict(nom='SP santé', role='operateur-tp', espace_pro_url='https://www.spsante.fr/',
     metiers=METIERS, source_ids=['sp-presentation', 'sp-liste-amc'], statut='sur',
     note="Marque de tiers payant de l'association Santé Pharma, mise en œuvre par Cegedim via le Cetip. Seules les dépenses portant la mention « SP » sur l'attestation sont prises en charge par SP santé. La liste publique donne, par complémentaire, les domaines ouverts (opticien, audioprothésiste, dentiste, pharmacien, centre de santé, laboratoire, établissement hospitalier privé…)."),
 'isante': dict(nom='iSanté', role='operateur-tp', espace_pro_url='https://www.tp-isante.fr/',
     metiers=METIERS, source_ids=['isante-site', 'isante-faq', 'isante-liste-amc', 'pf-pro'], statut='sur',
     note="Se présente comme « opérateur de tiers-payant ». Numéro de télétransmission unique 00733931 (FAQ iSanté). Pour l'hospitalisation, Prévifrance renvoie aussi vers hospipartner.com (même code d'accès que tp-isante.fr)."),
 'viamedis': dict(nom='Viamedis', role='operateur-tp', espace_pro_url='https://www.viamedis.net/',
     metiers=['optique', 'audio', 'dentaire', 'pharmacie', 'hospitalisation'], source_ids=['hm-contacts', 'acuite-oxantis', 'viamedis-index', 'uspo-mgen-ligne'], statut='sur',
     note="Factures et prises en charge sur viamedis.net, conventionnement sur viamedispro.com (page pro Harmonie Mutuelle). Reprend depuis le 26/10/2026 l'optique et l'audioprothèse d'Oxantis (Acuité). Se présente comme opérateur de tiers payant, filiale du groupe Malakoff Humanis, et gère le tiers payant pour des réseaux de soins (Carte Blanche Partenaires, Itelis, Kalixia, Santéclair) : extraits de viamedis.fr lus via l'index Linkup, le site répondant 403."),
 'almerys': dict(nom='Almerys', role='operateur-tp', espace_pro_url='https://www.almerys.com/',
     metiers=['optique', 'audio', 'dentaire', 'hospitalisation'], source_ids=['aesio-ps', 'aesio-specimen-2025', 'acuite-aema'], statut='sur',
     note="Opérateur de tiers payant choisi par Aéma Groupe (Acuité, 2023). Le spécimen de carte Aésio 2025 indique « PEC optique, audio, dentaire et hospitalisation : almerys.com ». almerys.com répond 401 en accès direct : l'adresse exacte de l'espace pro n'a pas été relue."),
 'actil': dict(nom='Actil', role='les-deux', espace_pro_url='https://www.actil.com/',
     metiers=['optique', 'audio', 'dentaire'], source_ids=['actil-home', 'apicil-optique'], statut='sur',
     note="Services de tiers payant et réseau de soins (offres négociées en optique, audiologie et dentaire intégrées au tiers payant). Clients affichés : Alptis, ASSIA, Cigna, Gentto, Integrance, Mutuelle de la Corse, Mutami, Rempart, M comme Mutuelle (logos, sans détail par métier)."),
 'korelio': dict(nom='Korelio', role='operateur-tp', espace_pro_url='https://www.korelio.com/',
     metiers=['optique', 'audio', 'pharmacie', 'laboratoire', 'hospitalisation', 'centre-de-sante'], source_ids=['korelio-index'], statut='a_verifier',
     note="Réseau de services créé par PRO BTP, incluant le tiers payant. Selon ses pages (extraits de l'index Linkup, site en maintenance le 18/11/2026) : flux des pharmaciens, laboratoires, radiologues, opticiens et hôpitaux ; conventions opticiens, audioprothésistes, centres dentaires, établissements hospitaliers ; prise en charge sur seveane.com pour les partenaires Sévéane."),
 'groupama-tpg': dict(nom='GIE Groupama Tiers Payant Généralisé', role='operateur-tp', espace_pro_url='https://www.tpg.groupama.com/tpg/public/login',
     metiers=['optique', 'audio', 'dentaire', 'centre-de-sante'], source_ids=['tpg-groupama-index'], statut='a_verifier',
     note="Site destiné aux audioprothésistes, centres dentaires, chirurgiens-dentistes, opticiens et transporteurs sanitaires qui pratiquent le tiers payant avec le GIE (extrait de l'index Linkup)."),
 'santeclair': dict(nom='Santéclair', role='les-deux', espace_pro_url='https://services.santeclair.fr/professionnel-sante/connexion',
     metiers=['optique', 'audio', 'dentaire'], source_ids=['sc-ps', 'sc-partenaires'], statut='sur',
     note="Réseau de soins qui propose aussi des conventions de tiers payant : « Partenariat et Tiers-payant SC », « Tiers-payant TP+ », « Partenariat simple SC ». Plus de 60 complémentaires partenaires selon sa page."),
 'carte-blanche': dict(nom='Carte Blanche Partenaires', role='les-deux', espace_pro_url='https://pec.carteblanchepartenaires.fr/',
     metiers=['optique', 'audio', 'dentaire'], source_ids=['cbp-qsn', 'fspf-complementaires', 'sl-tp'], statut='sur',
     note="Gère des réseaux de professionnels de santé ; la FSPF le qualifie d'« opérateur de tiers payant » (article du 7 octobre 2026). Prises en charge sur pec.carteblanchepartenaires.fr (CBPEC), selon Swiss Life."),
 'kalixia': dict(nom='Kalixia', role='reseau', espace_pro_url='https://www.kalixia.fr/',
     metiers=['optique', 'audio', 'dentaire'], source_ids=['kalixia-ps', 'acuite-ratp'], statut='sur',
     note="Réseau ouvert (pratique systématique du tiers payant selon une procédure dématérialisée, sauf ostéopathie). Ce n'est pas un portail de prise en charge : pour la Mutuelle RATP, la PEC passe par Viamedis, partenaire Kalixia ou non (Acuité, 09/01/2026)."),
 'itelis': dict(nom='Itelis', role='reseau', espace_pro_url='https://www.itelis.fr/',
     metiers=['optique', 'audio', 'dentaire'], source_ids=['itelis-acceder', 'matmut-carte'], statut='sur',
     note="Réseau de soins (marque d'Isea). L'accès aux services dépend du contrat. La carte Matmut porte un code « KA - Facturation Itelis » : le rôle d'Itelis dans la facturation reste à préciser pour les autres complémentaires."),
 'seveane': dict(nom='Sévéane', role='reseau', espace_pro_url='https://www.seveane.com/',
     metiers=['optique', 'audio'], source_ids=['groupama-attestation', 'korelio-index'], statut='sur',
     note="Réseau de professionnels de santé (code « SE » sur la carte Groupama). Les partenaires Sévéane font leur prise en charge Korelio sur seveane.com (extrait Korelio, index Linkup)."),
 'oxantis': dict(nom='Oxantis (fermé)', role='operateur-tp', espace_pro_url=None,
     metiers=['optique', 'audio', 'dentaire'], source_ids=['acuite-oxantis', 'mnt-vyv'], statut='sur',
     note="Plateforme du Groupe VYV fermée le 26/10/2026 ; optique et audioprothèse reprises par Viamedis (viamedis.net). Ne plus l'utiliser."),
}

PORTAIL = {k: v['espace_pro_url'] for k, v in OPS.items()}
NOMOP = {k: v['nom'] for k, v in OPS.items()}

# ---------------------------------------------------------------- listes publiques SP santé / iSanté
SP_DOM = {'OP': ['optique'], 'AU': ['audio'], 'DE': ['dentaire'], 'PH': ['pharmacie'], 'CS': ['centre-de-sante'], 'LB': ['laboratoire'], 'CP': ['hospitalisation']}
IS_DOM = {'OP': ['optique'], 'AU': ['audio'], 'DE': ['dentaire'], 'PH': ['pharmacie'], 'CS': ['centre-de-sante'], 'CD': ['centre-de-sante'], 'CM': ['centre-de-sante'], 'LB': ['laboratoire'], 'CP': ['hospitalisation'], 'ES': ['hospitalisation']}
DOM_LIB = {'OP': 'Opticien', 'AU': 'Audioprothésiste', 'DE': 'Dentiste', 'PH': 'Pharmacien', 'CS': 'Centre de santé', 'CD': 'Centre dentaire', 'CM': 'Centre de soins médicaux',
           'LB': 'Laboratoire', 'CP': 'Établissement hospitalier privé', 'ES': 'ESPIC'}

def load_list(path):
    d = json.load(open(path))
    seg = collections.defaultdict(lambda: {'actif': [], 'ferme': []})
    for x in d:
        lib = x['libelle'].strip()
        deb = (x['dateDebut'] or '')[:10]; fin = (x['dateFin'] or '')[:10]
        for dom in x['domainesPs']:
            k = (lib, dom)
            if fin and fin < REF:
                seg[k]['ferme'].append((deb, fin, x['sousDomaine'], x['numero']))
            elif deb and deb > REF:
                pass
            else:
                seg[k]['actif'].append((deb, fin, x['sousDomaine'], x['numero']))
    return seg

SP = load_list(f'{T}/spsante/list-amc.json')
IS = load_list(f'{T}/isante/list-amc.json')

def fr(d):
    return f'{d[8:10]}/{d[5:7]}/{d[0:4]}'

RESTR = {'UNIQUEMENT STOMATOLOGUE (18)': 'stomatologue uniquement',
         'POUR ACTES DE CONSULTATION EXTERNE': 'consultations externes uniquement',
         'POUR FRAIS DE SEJOUR': 'frais de séjour uniquement'}
TECH = ('VISIODROIT V1', 'VISIODROIT V2')   # variantes techniques (Visiodroits), pas une restriction de public
RESTR_EFFET = {'stomatologue uniquement': "Segment réservé aux stomatologues (spécialité 18) : il ne vaut ni pour un chirurgien-dentiste ni pour un centre dentaire.",
               'consultations externes uniquement': "Segment limité aux actes de consultation externe : il ne vaut pas pour un séjour en clinique.",
               'frais de séjour uniquement': "Segment limité aux frais de séjour : les consultations externes ne sont pas couvertes par ce segment."}

def from_list(op, seg, dommap, libelle, sid):
    """renvoie {metier: objet} pour les segments actifs d'un libellé.
    Une ligne sans sous-domaine (ou variante technique Visiodroits) ouvre tout le domaine.
    Une ligne à sous-domaine restreint n'ouvre que ce sous-domaine : champ `restriction`."""
    res = {}
    for (lib, dom), v in seg.items():
        if lib != libelle or dom not in dommap or not v['actif']:
            continue
        rows = v['actif']
        numero = rows[0][3]
        libres = [r for r in rows if r[2] == '' or r[2] in TECH]
        restreints = [r for r in rows if r[2] in RESTR]
        if libres:
            restriction = None
        elif restreints:
            # frais de séjour seul : vaut pour l'hospitalisation, avec la restriction affichée
            kinds = {RESTR[r[2]] for r in restreints}
            if kinds >= {'frais de séjour uniquement', 'consultations externes uniquement'}:
                restriction = None   # les deux sous-domaines hospitaliers sont ouverts : tout le domaine
            elif 'frais de séjour uniquement' in kinds:
                restriction = 'frais de séjour uniquement'
            else:
                restriction = sorted(kinds)[0]
        else:
            restriction = 'sous-domaine non reconnu : ' + rows[0][2]
        hosp_ok = restriction == 'frais de séjour uniquement' and dom in ('CP', 'ES')
        statut = 'sur' if (restriction is None or hosp_ok) else 'a_verifier'
        if restriction is None and not libres and restreints:
            pass  # frais de séjour + consultations externes : domaine hospitalier complet
        parts = []
        if libres:
            parts.append(f"ligne sans restriction active depuis le {fr(min(r[0] for r in libres))}")
        for sd in sorted({r[2] for r in restreints}):
            parts.append(f"ligne « {sd} » active depuis le {fr(min(r[0] for r in restreints if r[2] == sd))}")
        for m in dommap[dom]:
            note = (f"Libellé « {libelle} » (n° AMC {numero}), segment « {DOM_LIB[dom]} » de la liste publique {NOMOP[op]} (état au 18/11/2026) : "
                    + ' ; '.join(parts) + '.')
            if restriction and not hosp_ok:
                note += ' ' + RESTR_EFFET.get(restriction, 'Restriction non interprétée : à vérifier.')
            elif hosp_ok:
                note += ' ' + RESTR_EFFET['frais de séjour uniquement']
            elif restreints and dom == 'DE':
                note += " La ligne sans restriction couvre tous les dentistes ; la ligne stomatologue s'y ajoute sans la limiter."
            note += f" Ne vaut que pour une carte qui désigne {NOMOP[op]}."
            o = dict(operateur=NOMOP[op], operateur_id=op, role='operateur-tp', portail_url=PORTAIL[op], metier_precise=True,
                     source_ids=[sid], statut=statut, restriction=restriction,
                     note_verification=note)
            if m in res:
                prev = res[m]
                better = (o['statut'] == 'sur' and prev['statut'] != 'sur') or (o['statut'] == prev['statut'] and o['restriction'] is None and prev['restriction'] is not None)
                if better:
                    o['note_verification'] += " Autre segment : " + prev['note_verification']
                    res[m] = o
                else:
                    prev['note_verification'] += " Autre segment : " + note
            else:
                res[m] = o
    return res

def closed_from_list(op, seg, libelle):
    out = []
    for (lib, dom), v in seg.items():
        if lib == libelle and v['ferme'] and not v['actif'] and dom in DOM_LIB:
            fin = max(r[1] for r in v['ferme'])
            out.append(f"{DOM_LIB.get(dom, dom)} (fermé le {fr(fin)})")
    return sorted(set(out))

# ---------------------------------------------------------------- aides
def M(op, metier_precise, sids, statut, note, role=None, portail=None, operateur=None):
    return dict(operateur=operateur or NOMOP.get(op, op), operateur_id=op, role=role or OPS.get(op, {}).get('role', 'operateur-tp'),
                portail_url=portail if portail is not None else PORTAIL.get(op), metier_precise=metier_precise,
                source_ids=sids, statut=statut, restriction=None, note_verification=note)

def R(nom, metiers, sids, statut, note):
    return dict(nom=nom, metiers=metiers, source_ids=sids, statut=statut, note_verification=note)

E = []
def entree(nom, slug, autres_noms=None, groupe=None, groupe_sids=None, type_='complementaire', manual=None, listes=None, reseaux=None, notes=None):
    """manual: {metier: [objets...]} (le premier est l'opérateur principal) ; listes: [(op, seg, dommap, libelle, sid)]"""
    par = {}
    for m, objs in (manual or {}).items():
        par[m] = list(objs)
    fermes = []
    for (op, seg, dommap, lib, sid) in (listes or []):
        for m, o in from_list(op, seg, dommap, lib, sid).items():
            par.setdefault(m, []).append(o)
        for c in closed_from_list(op, seg, lib):
            fermes.append(f"{NOMOP[op]} « {lib} » : {c}")
    pm = {}
    for m in METIERS:
        objs = par.get(m)
        if not objs:
            continue
        # principal : premier objet "sur" sinon premier
        objs_sorted = sorted(objs, key=lambda o: (0 if o['statut'] == 'sur' else 1, 0 if o.get('restriction') is None else 1))
        prin = dict(objs_sorted[0])
        alts = objs_sorted[1:]
        if alts:
            prin['alternatives'] = alts
        pm[m] = prin
    st = 'sur' if any(o['statut'] == 'sur' for o in pm.values()) else 'a_verifier'
    sids = sorted({s for o in pm.values() for s in o['source_ids']} | {s for o in pm.values() for a in o.get('alternatives', []) for s in a['source_ids']} |
                  {s for r in (reseaux or []) for s in r['source_ids']} | set(groupe_sids or []))
    e = dict(mutuelle=nom, slug=slug, type=type_, autres_noms=autres_noms or [], groupe=groupe, groupe_source_ids=groupe_sids or [],
             par_metier=pm, reseau_soins=reseaux or [], segments_fermes=fermes, notes=notes or [], source_ids=sids, statut=st)
    if st == 'a_verifier':
        e['note_verification'] = "Aucun métier n'a de source publique précise et datée : entrée gardée pour la recherche, sans page publiée."
    E.append(e)

def SPL(lib): return ('sp-sante', SP, SP_DOM, lib, 'sp-liste-amc')
def ISL(lib): return ('isante', IS, IS_DOM, lib, 'isante-liste-amc')

KAL_NOTE = "La page pro de Kalixia la cite parmi ses principales complémentaires utilisatrices, sans détail par métier ni par contrat."
ITE_NOTE = "Présente dans la liste des complémentaires de la page « Accéder à vos services » d'Itelis ; l'accès dépend du contrat, métiers non précisés."
SC_NOTE = "Présente dans la liste des complémentaires partenaires de Santéclair ; services variables selon les contrats, métiers non précisés."

# ================================================================ entrées
VYV = 'Groupe VYV'
entree('Harmonie Mutuelle', 'harmonie-mutuelle', groupe=VYV, groupe_sids=['mnt-vyv'],
    manual={m: [M('viamedis', True, ['hm-contacts'], 'sur',
        "Rubrique « Service Viamedis » de la page pro d'Harmonie Mutuelle pour les opticiens, audioprothésistes et dentistes : conventionnement via viamedispro.com, factures et prises en charge via viamedis.net (page mise à jour le 29/06/2026).")]
        for m in ['optique', 'audio', 'dentaire']},
    reseaux=[R('Kalixia', ['optique', 'audio', 'dentaire'], ['kalixia-ps', 'hm-contacts'], 'a_verifier', "La page pro d'Harmonie cite le « Réseau Kalixia ». " + KAL_NOTE)],
    notes=["Oxantis, ancien portail du Groupe VYV, a fermé le 26/10/2026 ; Viamedis reprend l'optique et l'audioprothèse (Acuité)."])

mgen_alt = from_list('isante', IS, IS_DOM, 'MA MUTUELLE MGEN', 'isante-liste-amc')
for o in mgen_alt.values():
    o['statut'] = 'a_verifier'
    o['note_verification'] += " Libellé distinct de « MGEN » : à rapprocher de la carte, la MGEN annonçant la bascule de tout son tiers payant vers Viamedis au 30/11/2026."
mgen_manual = {
  'optique': [M('viamedis', True, ['ivoirnet-mgen'], 'sur', "Selon iVoirNet (logiciel optique, 23/10/2026), pour l'optique et l'audiologie l'opérateur MGEN change dès le 27/10/2026 : Viamedis. Réclamer la carte en cours (logo Viamedis).")],
  'audio': [M('viamedis', True, ['ivoirnet-mgen'], 'sur', "Selon iVoirNet (23/10/2026), l'audiologie passe chez Viamedis dès le 27/10/2026.")],
  'pharmacie': [M('viamedis', True, ['uspo-mgen-ligne', 'fspf-complementaires', 'uspo-mgen-mai', 'ivoirnet-mgen'], 'a_verifier',
      "Syndicats de pharmaciens : « Depuis le 1er juillet 2026, Viamedis est l'opérateur de tiers payant des […] » (USPO, extrait public tronqué : on ne sait pas de quels bénéficiaires) ; FSPF : « MGEN : dernière bascule complémentaire vers Viamedis au 1er juillet 2026 ». Mais iVoirNet (23/10/2026) annonce la gestion « intégralement confiée » à Viamedis seulement à partir du 30/11/2026 : avant cette date, une partie des cartes MGEN peut encore relever de la MGEN. À passer en « sûr » après le 30/11/2026, carte à l'appui.")],
}
for m in ['dentaire', 'laboratoire', 'centre-de-sante', 'hospitalisation']:
    mgen_manual[m] = [M('viamedis', False, ['ivoirnet-mgen'], 'a_verifier',
        "iVoirNet (23/10/2026) : « A partir du 30 novembre 2026, la gestion du tiers payant complémentaire MGEN sera intégralement confiée à l'opérateur VIAMEDIS » ; l'espace pro MGEN ferme le 30/11/2026. Métier non précisé et date d'effet postérieure au 18/11/2026 : à confirmer après le 30/11/2026.")]
for m, o in mgen_alt.items():
    mgen_manual.setdefault(m, []).append(o)
entree('MGEN', 'mgen', autres_noms=['Ma Mutuelle MGEN'], groupe=VYV, groupe_sids=['mnt-vyv'], manual=mgen_manual,
    reseaux=[R('Kalixia', ['optique', 'audio'], ['mgen-msp', 'kalixia-ps'], 'sur', "MGEN présente le « réseau Kalixia optique et audio » sur sa page Santé Prévoyance.")],
    notes=["Pour les soins antérieurs à la bascule, l'opérateur dépend de la date des soins (MGEN ou Viamedis), selon iVoirNet."])

entree('MNT', 'mnt', autres_noms=['Mutuelle Nationale Territoriale'], groupe=VYV, groupe_sids=['mnt-vyv'],
    manual={m: [M('viamedis', True, ['mnt-vyv', 'acuite-oxantis'], 'a_verifier',
        "Déduit : en mars 2023, la MNT indiquait que son tiers payant optique, audio et dentaire était géré par Oxantis ; Oxantis a fermé le 26/10/2026 et Viamedis reprend l'optique et l'audioprothèse (Acuité). Aucune page MNT ne nomme encore Viamedis.")] for m in ['optique', 'audio']},
    reseaux=[R('Kalixia', ['optique', 'audio', 'dentaire'], ['kalixia-ps'], 'a_verifier', KAL_NOTE)])

AEMA = 'Aéma Groupe'
aesio_m = {m: [M('almerys', True, ['aesio-ps', 'aesio-specimen-2025'], 'sur',
    "Aésio indique avoir externalisé son tiers payant chez Almerys depuis le 01/01/2023 ; le spécimen de carte 2025 précise « PEC optique, audio, dentaire et hospitalisation : almerys.com ».")]
    for m in ['optique', 'audio', 'dentaire', 'hospitalisation']}
for m in ['optique', 'audio']:
    aesio_m[m].append(M('tp-adrea', True, ['aesio-specimen-2024'], 'a_verifier',
        "Spécimen de carte 2024 (ex-Adrea, logo Kalixia) : « PEC Optique, Audioprothèse : www.tp-adrea.net ». Carte ancienne : ne suivre que si la carte du client l'indique.",
        role='operateur-tp', portail='https://www.tp-adrea.net/', operateur='Service de tiers payant Aésio ex-Adrea (tp-adrea.net)'))
for m in ['pharmacie', 'laboratoire', 'centre-de-sante']:
    aesio_m[m] = [M('almerys', False, ['aesio-ps'], 'a_verifier',
        "Aésio : « AÉSIO mutuelle externalise son tiers payant chez Almerys depuis le 1er janvier 2023 » et le code de télétransmission est celui d'Almerys présent sur la carte. Le métier n'est pas précisé.")]
entree('Aésio mutuelle', 'aesio', autres_noms=['Aésio', 'AESIO'], groupe=AEMA, groupe_sids=['acuite-aema'], manual=aesio_m,
    reseaux=[R('Carte Blanche Partenaires', ['optique', 'audio', 'dentaire'], ['aesio-specimen-2025'], 'sur', "Spécimen 2025 : « Réseau Carte Blanche PEC optique, audio, dentaire via CBPEC » (pec.carteblanchepartenaires.fr)."),
             R('Kalixia', ['optique', 'audio'], ['aesio-specimen-2024', 'kalixia-ps'], 'a_verifier', "Logo Kalixia sur le spécimen 2024 (ex-Adrea). " + KAL_NOTE)])

entree('Apivia Macif Mutuelle', 'apivia-macif-mutuelle', autres_noms=['Macif', 'Macif Mutuelle Santé'], groupe=AEMA, groupe_sids=['acuite-aema'],
    manual={m: [M('almerys', False, ['acuite-aema'], 'a_verifier',
        "Acuité (17/02/2023) : Aéma Groupe a choisi Almerys comme opérateur de tiers payant pour l'ensemble de ses mutuelles, dont Apivia Macif Mutuelle. Le métier n'est pas précisé et l'article date de 2023.")] for m in ['optique', 'audio', 'dentaire', 'hospitalisation']},
    reseaux=[R('Carte Blanche Partenaires', ['optique', 'audio', 'dentaire'], ['acuite-aema'], 'a_verifier', "Acuité (2023) : déploiement du réseau Carte Blanche à toutes les mutuelles d'Aéma Groupe ; métiers non précisés.")])

entree('Malakoff Humanis', 'malakoff-humanis',
    manual={'optique': [M('viamedis', True, ['mh-faq'], 'sur', "FAQ Malakoff Humanis : si l'opticien est conventionné avec Viamédis, la part mutuelle lui est réglée directement (tiers payant). FAQ non datée.")]},
    listes=[ISL('MALAKOFF HUMANIS NATIONALE'), ISL('MALAKOFF HUMANIS PREVOYANCE')],
    reseaux=[R('Kalixia', ['optique', 'audio', 'dentaire'], ['kalixia-ps'], 'a_verifier', KAL_NOTE),
             R('Santéclair', ['optique', 'audio', 'dentaire'], ['sc-partenaires'], 'a_verifier', SC_NOTE)],
    notes=["Viamedis se présente comme filiale du groupe Malakoff Humanis (communiqué lu via l'index Linkup)."])

entree('AG2R La Mondiale', 'ag2r-la-mondiale',
    reseaux=[R('Itelis', ['optique', 'audio', 'dentaire'], ['itelis-acceder'], 'a_verifier', ITE_NOTE)],
    notes=["Aucune page publique consultée ne nomme l'opérateur de tiers payant d'AG2R La Mondiale. La liste SP santé contient un libellé « LA MONDIALE » (pharmacie, dentaire, laboratoire…) dont le rattachement n'a pas été vérifié."])

entree('Viasanté Mutuelle', 'viasante', autres_noms=['Viasanté'],
    manual={m: [M('almerys', False, ['viasante-equivia'], 'a_verifier', "Page de l'offre EQUIVIA : « Grâce au tiers-payant Almerys, vous n'avancez plus vos frais médicaux ». Ne vaut que pour cette offre ; métier non précisé.")] for m in ['optique', 'audio', 'dentaire', 'pharmacie', 'hospitalisation']},
    reseaux=[R('Itelis', ['optique', 'dentaire', 'audio'], ['viasante-equivia'], 'sur', "Offre EQUIVIA : « réseau de soins Itelis pour des tarifs négociés en optique, dentaire et audiologie ».")])

entree('Klesia', 'klesia', autres_noms=["KLESIA Mut'", 'Klesia Prévoyance', 'Klesia by LMF Tech'],
    listes=[ISL('KLESIA BY LMF TECH'), SPL('KLESIA MUT')],
    reseaux=[R('Itelis', ['optique', 'audio', 'dentaire'], ['itelis-acceder'], 'a_verifier', ITE_NOTE + " (libellés KLESIA et KLESIA PRO)"),
             R('Kalixia', ['optique', 'audio', 'dentaire'], ['kalixia-ps'], 'a_verifier', KAL_NOTE),
             R('Santéclair', ['optique', 'audio', 'dentaire'], ['sc-partenaires'], 'a_verifier', SC_NOTE + " (libellé « PLANSANTE KLESIA »)")],
    notes=["Klesia (page opticiens) : les demandes de prise en charge optique ne passent plus par son formulaire web depuis le 01/01/2020 ; les points de contact (plateforme, adresse, téléphone) sont au dos de la carte.",
           "KLESIA Mut' (ancienne FAQ) : le logo PlanSanté sur la carte désigne son nouvel opérateur de gestion ; pour le secteur de la Défense, la carte porte le logo iSanté."])

entree('Apicil', 'apicil', autres_noms=['APICIL Mutuelle', 'Groupe APICIL'], groupe='Groupe APICIL', groupe_sids=['apicil-optique'],
    manual={'optique': [M('actil', True, ['apicil-optique'], 'sur', "Apicil : si l'opticien pratique le tiers payant, il fait la demande de prise en charge auprès d'ACTIL, reçoit la réponse et est réglé de la part complémentaire. Le patient présente son attestation de droits au tiers payant APICIL.")]},
    reseaux=[R('Actil', ['optique', 'audio', 'dentaire'], ['actil-home', 'apicil-optique'], 'a_verifier', "Actil intègre un réseau de soins (optique, audiologie, dentaire) à son tiers payant ; Apicil renvoie vers la géolocalisation des opticiens pratiquant le tiers payant Actil.")])

entree('PRO BTP', 'pro-btp', autres_noms=['BTP-Prévoyance', 'BTP Prévoyance'],
    manual={m: [M('korelio', True, ['korelio-index'], 'a_verifier',
        "Korelio liste BTP Prévoyance parmi les organismes qui lui ont confié leur tiers payant et indique gérer les flux des pharmaciens, laboratoires, opticiens et hôpitaux ; des conventions existent pour les audioprothésistes et les centres dentaires. Lu uniquement dans l'index Linkup (korelio.com en maintenance le 18/11/2026) : à relire sur le site.")]
        for m in ['optique', 'audio', 'pharmacie', 'laboratoire', 'hospitalisation', 'centre-de-sante']},
    reseaux=[R('Sévéane', ['optique', 'audio'], ['korelio-index'], 'a_verifier', "Korelio : prise en charge sur seveane.com pour les partenaires Sévéane.")])

grp = {m: [M('groupama-tpg', True, ['tpg-groupama-index'], 'a_verifier',
    "Le site du GIE Groupama TPG s'adresse aux audioprothésistes, centres dentaires, chirurgiens-dentistes et opticiens qui pratiquent le tiers payant avec le GIE (extrait de l'index Linkup, non relu en direct).")]
    for m in ['optique', 'audio', 'dentaire', 'centre-de-sante']}
entree('Groupama', 'groupama', autres_noms=['Groupama TPG', 'GIE Groupama Tiers Payant Généralisé'], manual=grp,
    listes=[SPL('GROUPAMA TPG')],
    reseaux=[R('Sévéane', ['optique'], ['groupama-attestation'], 'sur', "Groupama : tiers payant systématique chez ses opticiens partenaires du réseau Sévéane ; code « SE » sur la carte pour une prise en charge par le réseau (page mise à jour le 24/03/2026).")],
    notes=["Sur la carte Groupama, chaque catégorie (OPTI, PHAR, HOSP…) porte un code de mode de gestion : un système de tiers payant comme SP Santé, l'organisme complémentaire (OC) ou le réseau Sévéane (SE) (page du 24/03/2026)."])

entree('Gan Assurances', 'gan', autres_noms=['Gan'], listes=[SPL('GAN')])

entree('AXA', 'axa', autres_noms=['AXA France'], listes=[SPL('AXA'), ISL('AXA SE ISANTE')],
    reseaux=[R('Itelis', ['optique', 'audio', 'dentaire'], ['itelis-acceder', 'axa-tp-index'], 'a_verifier', "AXA présente le réseau Itelis (opticiens, dentistes, audioprothésistes) ; extrait de la page AXA lu via l'index Linkup. " + ITE_NOTE)])

entree('Allianz', 'allianz', listes=[SPL('ALLIANZ'), SPL('ALLIANZ IGESTION'), SPL('ALLIANZ OUTRE MER')],
    reseaux=[R('Santéclair', ['optique', 'audio', 'dentaire'], ['sc-allianz', 'sc-partenaires'], 'a_verifier', "Santéclair : tous les contrats santé Allianz, individuels ou d'entreprise, intègrent ses services ; métiers et tiers payant selon le contrat.")])

entree('Generali', 'generali',
    manual={m: [M('carte-blanche', True, ['gen-faq-tp'], 'sur',
        "FAQ Generali : son réseau de partenaires de santé, qui pratiquent le tiers payant, comprend « notamment partenaires Carte Blanche pour les opticiens et audioprothésistes ». Vaut chez les partenaires Carte Blanche ; hors réseau, à vérifier.")] for m in ['optique', 'audio']},
    reseaux=[R('Carte Blanche Partenaires', ['optique', 'audio'], ['gen-faq-tp'], 'sur', "FAQ tiers payant Generali.")])

sl = {m: [M('carte-blanche', True, ['sl-tp'], 'sur',
    "Swiss Life : pour un partenaire du réseau Carte Blanche, prise en charge automatisée sur https://pec.carteblanchepartenaires.fr ; hors réseau, prise en charge au ticket modérateur avec une convention de tiers payant simple Carte Blanche. Conventions « CB » (Carte Blanche) et « TB » (CBTP) reprises dans le logiciel CBPEC.")]
    for m in ['optique', 'audio', 'dentaire']}
sl['hospitalisation'] = [M('swiss-life', True, ['sl-tp'], 'sur', "Swiss Life : demande de prise en charge hospitalière directement auprès de Swiss Life (téléphone ou fax indiqués sur la page).",
    role='gestion-directe', portail=None, operateur='Swiss Life (gestion directe)')]
entree('Swiss Life', 'swiss-life', manual=sl,
    reseaux=[R('Carte Blanche Partenaires', ['optique', 'audio', 'dentaire'], ['sl-tp'], 'sur', "Page pro Swiss Life.")])

entree('MMA', 'mma', autres_noms=['MMA Entreprise', 'SMI MMA Gestion collective'], listes=[SPL('MMA'), SPL('SMI MMA GESTION COLLECTIVE'), ISL('MMA ENTREPRISE'), ISL('SMI MMA GESTION COLLECTIVE')],
    reseaux=[R('Santéclair', ['optique', 'audio', 'dentaire'], ['sc-partenaires'], 'a_verifier', SC_NOTE + " (libellés MMA, MMA ENTREPRISE, MMA ENTREPRISE - SMI)")])

entree('MAAF', 'maaf', autres_noms=['MAAF Santé'], listes=[SPL('MAAF SANTE')],
    reseaux=[R('Santéclair', ['optique'], ['maaf-faq-optique', 'sc-partenaires'], 'sur', "FAQ MAAF : opticiens partenaires Santéclair, services réservés aux contrats Vivazen, Biorythm, Vitamine, Medika, Santé Profil salariés ou TNS, selon les garanties.")])

entree('GMF', 'gmf', autres_noms=['GMF Assurances'], listes=[SPL('GMF ASSURANCES')],
    reseaux=[R('Santéclair', ['optique', 'audio', 'dentaire'], ['sc-partenaires'], 'a_verifier', SC_NOTE)])

entree('Mutuelle Ociane Matmut', 'matmut', autres_noms=['Matmut', 'Matmut Santé Prévoyance'], listes=[ISL('MUTUELLE OCIANE MATMUT')],
    reseaux=[R('Itelis', ['optique'], ['itelis-acceder', 'matmut-carte'], 'a_verifier', "La carte Matmut prévoit les codes « IS - Facturation iSanté », « OC - Facturation à l'organisme complémentaire » et « KA - Facturation Itelis », sans dire lequel vaut pour quel acte. " + ITE_NOTE)],
    notes=["Dans la liste iSanté, les segments opticien et audioprothésiste ne figurent pas pour ce libellé : l'optique passe ailleurs (voir la carte)."])

entree('April', 'april', reseaux=[R('Kalixia', ['optique', 'audio', 'dentaire'], ['april-optique', 'kalixia-ps'], 'sur',
    "April : tous ses assurés profitent des réductions tarifaires et du tiers payant des professionnels de son réseau Kalixia : opticiens, audioprothésistes, chirurgiens-dentistes et ostéopathes.")],
    notes=["La page April ne nomme pas d'opérateur de tiers payant. La liste SP santé contient « APRIL ENTREPRISE CARAIBES » (actif) et « APRIL ENTRE/ALP PREV » (fermé), propres à certains contrats."])

entree('Alan', 'alan', manual={'optique': [M('almerys', True, ['alan-reseau'], 'a_verifier',
    "Page de candidature au Réseau Alan : « Facturez via Almérys et OptoAMC » ; éligibilité : magasin « conventionné Almérys ». Vaut pour le Réseau Alan Optique, lancé le 01/01/2027 ; pour un opticien hors réseau aujourd'hui, à confirmer.")]})

entree('Abeille Assurances', 'abeille-assurances', autres_noms=['Abeille IARD & Santé'], listes=[SPL('ABEILLE IARD & SANTE'), ISL('ABEILLE IARD & SANTE')])

entree('ACM', 'acm', autres_noms=[], listes=[SPL('ACM')], notes=["Libellé « ACM » tel qu'il figure dans la liste SP santé."])

entree('La Mutuelle Générale', 'la-mutuelle-generale', autres_noms=['Mutuelle Générale'],
    manual={m: [M('la-mutuelle-generale', True, ['lmg-tp'], 'a_verifier',
        "La Mutuelle Générale : les professionnels et établissements réalisent eux-mêmes, en temps réel, les prises en charge en optique, dentaire, audioprothèse et hospitalisation. La page ne nomme pas l'outil ni l'opérateur, et n'est pas datée.",
        role='gestion-directe', portail=None, operateur='La Mutuelle Générale (outil non nommé)')] for m in ['optique', 'dentaire', 'audio', 'hospitalisation']})

lmf = {m: [M('viamedis', True, ['lmf-faq'], 'sur', "FAQ de La Mutuelle Familiale : depuis le 01/01/2019, Viamédis est le prestataire de tiers payant pour l'optique et l'audioprothèse ; ses coordonnées figurent sur la carte.")] for m in ['optique', 'audio']}
lmf['hospitalisation'] = [M('isante', True, ['lmf-faq'], 'sur', "FAQ : à l'hôpital, l'établissement se met en relation avec iSanté, tiers payeur de La Mutuelle Familiale, pour établir la prise en charge.")]
entree('La Mutuelle Familiale', 'la-mutuelle-familiale', autres_noms=['Mutuelle Familiale', 'LMF'], manual=lmf, listes=[ISL('LA MUTUELLE FAMILIALE')],
    reseaux=[R('Kalixia', ['optique', 'audio'], ['kalixia-ps'], 'a_verifier', KAL_NOTE)],
    notes=["FAQ : La Mutuelle Familiale a confié la gestion du tiers payant à deux organismes, Viamedis et iSanté."])

pf = {m: [M('isante', True, ['pf-pro'], 'sur', "Prévifrance : à partir du 01/01/2026, iSanté gère son tiers payant pour l'ensemble des domaines (simple et complexe) ; demandes de prise en charge en optique, audio, dentaire ou hospitalisation par e-mail, fax ou espace sécurisé tp-isante.fr / hospipartner.com ; télétransmission 00733931.")] for m in ['optique', 'audio', 'dentaire', 'hospitalisation']}
entree('Prévifrance', 'previfrance', manual=pf, listes=[ISL('PREVIFRANCE')])

entree('Solimut Mutuelle de France', 'solimut', autres_noms=['Solimut'],
    manual={m: [M('solimut', False, ['solimut-contact'], 'a_verifier',
        "Solimut renvoie les professionnels de santé vers son « espace professionnel de santé » pour calculer les devis, réaliser les demandes de prise en charge et suivre les remboursements ; métiers non précisés.",
        role='gestion-directe', portail=None, operateur='Solimut (espace professionnel de santé)')] for m in ['optique', 'dentaire', 'hospitalisation']})

entree('Intériale', 'interiale', autres_noms=['Interiale', 'Intériale Sigmage'], listes=[SPL('INTERIALE'), ISL('INTERIALE')],
    reseaux=[R('Santéclair', ['optique', 'audio', 'dentaire'], ['interiale-santeclair', 'sc-partenaires'], 'a_verifier', "Intériale (collectivités) : accès au réseau Santéclair inclus dans les formules Evo, Alto et Excelio ; métiers non précisés sur la page lue."),
             R('Itelis', ['optique', 'audio', 'dentaire'], ['interiale-itelis'], 'a_verifier', "Page « Réseau de soins ITELIS » d'Intériale ; métiers non précisés sur la page lue.")])

for nom, slug, lib, autres, extra in [
    ('Unéo', 'uneo', 'UNEO', ['UNEO'], [R('Santéclair', ['optique', 'audio', 'dentaire'], ['sc-partenaires'], 'a_verifier', SC_NOTE)]),
    ('MNH', 'mnh', 'MNH', [], []),
    ('MCDef', 'mcdef', 'MCDEF', ['MCDEF'], []),
    ('La Banque Postale Prévoyance', 'la-banque-postale-prevoyance', 'LA BANQUE POSTALE PREVOYANCE', [], []),
    ('IRCEM', 'ircem', 'IRCEM', [], [R('Itelis', ['optique', 'audio', 'dentaire'], ['itelis-acceder'], 'a_verifier', ITE_NOTE)]),
    ('Mutuelles du Soleil', 'mutuelles-du-soleil', 'MUTUELLES DU SOLEIL', ['Mutuelle du Soleil'], [R('Itelis', ['optique', 'audio', 'dentaire'], ['itelis-acceder'], 'a_verifier', ITE_NOTE), R('Santéclair', ['optique', 'audio', 'dentaire'], ['sc-partenaires'], 'a_verifier', SC_NOTE)]),
    ('Mutuelle des Sapeurs-Pompiers de France', 'mutuelle-sapeurs-pompiers', 'MUTUELLE DES SAPEURS POMPIERS DE FRANCE', [], []),
    ('Territoria Mutuelle', 'territoria-mutuelle', 'MHV/TERRITORIA MUTUELLE', ['MHV'], []),
    ('Entis Mutuelles', 'entis', 'ENTIS', ['ENTIS'], []),
    ('Harmonie Fonction Publique', 'harmonie-fonction-publique', 'HARMONIE FONCTION PUBLIQUE', [], []),
]:
    entree(nom, slug, autres_noms=autres, listes=[ISL(lib)], reseaux=extra)

entree('Mutualia', 'mutualia', autres_noms=['Mutualia Alsace Grand Est', 'Mutualia Grand Ouest', 'Mutualia Nord de France', 'Mutualia Santé Atlantique', 'Mutualia Sud Ouest', 'Mutualia Santé Prévoyance', 'Mutualia Santé Sud Est'],
    listes=[ISL(l) for l in ['MUTUALIA ALSACE GRAND EST', 'MUTUALIA GRAND OUEST', 'MUTUALIA NORD DE FRANCE', 'MUTUALIA SANTE ATLANTIQUE', 'MUTUALIA SUD OUEST', 'MUTUALIA-SANTE PREVOYANCE', 'MUTUALIA-SANTE SUD EST']],
    notes=["Sept libellés Mutualia figurent dans la liste iSanté, chacun avec son numéro AMC et le seul segment opticien."])

entree('CPCEA - Agrica', 'cpcea-agrica', autres_noms=['CPCEA', 'Agrica'], listes=[ISL('CPCEA-AGRICA')])

entree('SMABTP', 'smabtp', autres_noms=['SMABTP Vie'], listes=[ISL('SMABTP VIE')],
    reseaux=[R('Santéclair', ['optique', 'audio', 'dentaire'], ['sc-partenaires'], 'a_verifier', SC_NOTE)],
    notes=["Korelio cite SMABTP parmi les organismes qui lui ont confié leur tiers payant (extrait de l'index Linkup, à relire)."])

entree('Audiens', 'audiens', notes=["Korelio cite Audiens parmi les organismes qui lui ont confié leur tiers payant (extrait de l'index Linkup, à relire) ; métiers non précisés."],
    manual={m: [M('korelio', False, ['korelio-index'], 'a_verifier', "Korelio cite Audiens parmi ses partenaires de tiers payant (extrait de l'index Linkup, korelio.com en maintenance) ; métier non précisé.")] for m in ['optique', 'pharmacie']})

entree('Mutuelle Mieux-Être', 'mutuelle-mieux-etre', autres_noms=['MME'], listes=[ISL('MUTUELLE MIEUX ETRE')],
    manual={'optique': [M('korelio', False, ['korelio-index'], 'a_verifier', "Korelio cite « MME » parmi ses partenaires de tiers payant (extrait de l'index Linkup) ; métier non précisé.")]},
    reseaux=[R('Kalixia', ['optique', 'audio', 'dentaire'], ['kalixia-ps'], 'a_verifier', KAL_NOTE), R('Itelis', ['optique', 'audio', 'dentaire'], ['itelis-acceder'], 'a_verifier', ITE_NOTE)])

entree('Ipeca Prévoyance', 'ipeca', autres_noms=['IPECA'], listes=[SPL('IPECA')],
    reseaux=[R('Kalixia', ['optique', 'audio', 'dentaire'], ['kalixia-ps'], 'a_verifier', KAL_NOTE)])

for nom, slug, lib, autres in [('APGIS', 'apgis', 'APGIS', []), ('Areas Assurances', 'areas', 'AREAS ASSURANCES', ['Areas']), ('MAPA', 'mapa', 'MAPA', ['MAPA Mutuelle d\'assurance'])]:
    entree(nom, slug, autres_noms=autres, listes=[SPL(lib)], reseaux=[R('Santéclair', ['optique', 'audio', 'dentaire'], ['sc-partenaires'], 'a_verifier', SC_NOTE)])

entree('Mutuelle de Poitiers Assurances', 'mutuelle-de-poitiers', listes=[SPL('MUTUELLE DE POITIERS ASS'), ISL('MUTUELLE DE POITIERS ASSURANCES')],
    reseaux=[R('Itelis', ['optique', 'audio', 'dentaire'], ['itelis-acceder'], 'a_verifier', ITE_NOTE)])

sg = {m: [M('isante', True, ['mutuelle-sg'], 'sur', "Mutuelle SG : son opérateur de tiers payant est iSanté pour le tiers payant simple (laboratoire, radiologie, consultations, pharmacie, auxiliaires), hospitalier et complexe (optique, dentaire, audio). Page non datée.")]
      for m in ['optique', 'audio', 'dentaire', 'pharmacie', 'laboratoire', 'hospitalisation']}
entree('Mutuelle SG', 'mutuelle-sg', autres_noms=['Mutuelle Société Générale'], manual=sg,
    reseaux=[R('Carte Blanche Partenaires', ['optique', 'audio', 'dentaire'], ['mutuelle-sg'], 'sur', "Mutuelle SG : adhésion au réseau Carte Blanche pour l'optique, l'audio et les soins dentaires.")])

entree('Mutuelle RATP', 'mutuelle-ratp', autres_noms=['Groupe mutualiste RATP'],
    manual={m: [M('viamedis', True, ['acuite-ratp'], 'sur', "Acuité (09/01/2026) : depuis le 01/01/2026, les demandes de PEC des adhérents de la mutuelle RATP passent obligatoirement par Viamedis, opticien partenaire Kalixia ou non.")] for m in ['optique', 'audio']},
    reseaux=[R('Kalixia', ['optique', 'audio'], ['acuite-ratp'], 'sur', "Le groupe mutualiste RATP a rejoint Kalixia pour l'optique et l'audioprothèse le 01/01/2026.")])

entree('Henner', 'henner', type_='gestionnaire', autres_noms=['Henner GMC'], listes=[SPL('HENNER GMC')],
    reseaux=[R('Itelis', ['optique', 'audio', 'dentaire'], ['itelis-acceder'], 'a_verifier', ITE_NOTE), R('Santéclair', ['optique', 'audio', 'dentaire'], ['sc-partenaires'], 'a_verifier', SC_NOTE)],
    notes=["Henner est un gestionnaire de contrats, pas une mutuelle : la carte peut porter son nom pour le compte de l'assureur du contrat."])

entree('Sigmage', 'sigmage', type_='gestionnaire', listes=[SPL('SIGMAGE'), ISL('SIGMAGE')],
    reseaux=[R('Itelis', ['optique', 'audio', 'dentaire'], ['itelis-acceder'], 'a_verifier', ITE_NOTE)],
    notes=["SP santé distingue deux cartes : INTERIALE SIGMAGE (fonction publique, code 29993227) et SIGMAGE (secteur privé, code 00403220)."])

# ---------------------------------------------------------------- vérifs et sortie
slugs = [e['slug'] for e in E]
assert len(slugs) == len(set(slugs)), 'slug en double'
used = set()
for e in E:
    used |= set(e['source_ids']) | set(e['groupe_source_ids'])
for o in OPS.values():
    used |= set(o['source_ids'])
for u in used:
    assert u in S, u
ops_list = [dict(id=k, **v) for k, v in OPS.items()]
doc = dict(genere_le=REF, perimetre="Complémentaires santé → opérateur ou portail de tiers payant, métier par métier (optique, audio, dentaire, pharmacie, centre de santé, laboratoire, hospitalisation en clinique). Sources publiques uniquement.",
           lecture="Un opérateur cité pour une complémentaire et un métier ne veut pas dire que tous ses contrats y passent : la carte de tiers payant du patient décide. Les entrées « sur » ont une source publique, datée, qui précise le métier.",
           sources=[S[k] for k in sorted(used)], operateurs=ops_list, entrees=E)
json.dump(doc, open(f'{OUT}/donnees.json', 'w'), ensure_ascii=False, indent=1)

# stats
nsur = sum(1 for e in E if e['statut'] == 'sur')
nmet = collections.Counter(); nmet_av = collections.Counter()
for e in E:
    for m, o in e['par_metier'].items():
        (nmet if o['statut'] == 'sur' else nmet_av)[m] += 1
print('entrees', len(E), 'sur', nsur, 'a_verifier', len(E) - nsur)
print('metiers sur', dict(nmet)); print('metiers a_verifier', dict(nmet_av))
print('sources', len(used))
json.dump(dict(n=len(E), sur=nsur, metiers_sur=nmet, metiers_av=nmet_av), open(os.path.join(T, 'stats.json'), 'w'))
