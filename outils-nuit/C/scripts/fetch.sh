#!/bin/bash
# usage: fetch.sh urls.txt outdir
while read id url; do
  [ -z "$id" ] && continue
  out="$2/$id.html"
  if [ -s "$out" ]; then continue; fi
  code=$(curl -sS -L -m 40 -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36" -o "$out" -w "%{http_code}" "$url" 2>/dev/null)
  echo "$id $code $(stat -c %s "$out" 2>/dev/null) $url"
  sleep 4
done < "$1"
