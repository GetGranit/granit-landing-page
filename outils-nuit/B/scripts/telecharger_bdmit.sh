#!/bin/bash
# Télécharge, une par une avec une pause, la fiche BdM_IT (Assurance Maladie) de chaque CIP13 retenu.
# Usage : telecharger_bdmit.sh <pharmacie_retenus.json> <dossier_sortie_vide>
# Note : www.codage.ext.cnamts.fr refuse la poignée de main TLS via le proxy (connexion réinitialisée) :
# on essaie https, puis http si https échoue.
set -u
liste="$1"; sortie="$2"; mkdir -p "$sortie"
for cip in $(python3 -I -c "import json,sys; print(' '.join(r['cip13'] for r in json.load(open(sys.argv[1]))['retenus']))" "$liste"); do
  f="$sortie/fiche_$cip.html"
  [ -s "$f" ] && continue
  u="www.codage.ext.cnamts.fr/codif/bdm_it//fiche/index_fic_medisoc.php?p_code_cip=$cip&p_site=AMELI"
  curl -sS -m 60 -o "$f" "https://$u" 2>/dev/null || curl -sS -m 60 -o "$f" "http://$u"
  echo "$cip $(stat -c %s "$f" 2>/dev/null)"
  sleep 6
done
