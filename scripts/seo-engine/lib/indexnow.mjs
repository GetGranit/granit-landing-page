// IndexNow : prévient Bing (et Yandex, Seznam…) qu'une page a changé, sans attendre le passage du robot.
// La clé n'est pas un secret : elle est servie publiquement dans public/{CLE}.txt pour prouver qu'on possède le site.
export const CLE = "2b0e1669fd8047d0d7ebb2ee20a87ed5";

/** Slugs touchés par un changement de fichiers : les articles modifiés et les anciens qu'ils remplacent (301). */
export function slugsTouches(fichiers, lireFiche) {
  const slugs = new Set();
  for (const f of fichiers) {
    const m = f.match(/^content\/ressources\/([^/]+)\.json$/);
    if (!m) continue;
    slugs.add(m[1]);
    for (const ancien of lireFiche(m[1])?.remplace ?? []) slugs.add(ancien);
  }
  return [...slugs];
}

/** Corps de la requête IndexNow (10 000 URL au plus par envoi). */
export function corps(site, urls) {
  const host = new URL(site).host;
  return { host, key: CLE, keyLocation: `${site}/${CLE}.txt`, urlList: [...new Set(urls)].slice(0, 10000) };
}
