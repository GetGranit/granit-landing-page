// Dessin des schémas types (champ figures) dans la charte Granit.
// Référence pour la page du site : même rendu attendu côté React.
// Règles reprises de /illustre : une idée, labels courts, accent sur le seul élément en focus,
// flèches orthogonales, pas d'ombre, légende toujours présente.

const C = {
  encre: "#1f1b16",
  sourd: "#6b6358",
  trait: "#d9d0c1",
  fond: "#ffffff",
  creme: "#faf6ee",
  accent: "#d4583a",
  accentTeinte: "#fbeae3",
};
const SERIF = "'Libre Caslon Text', Georgia, serif";
const SANS = "'Inter Tight', system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Coupe un texte en lignes de maxCar caractères environ, sans couper les mots. */
function lignes(t, maxCar) {
  const out = [];
  let l = "";
  for (const m of String(t).split(/\s+/).filter(Boolean)) {
    if (l && (l + " " + m).length > maxCar) {
      out.push(l);
      l = m;
    } else l = l ? `${l} ${m}` : m;
  }
  if (l) out.push(l);
  return out;
}

function texte(x, y, contenu, { taille = 13, poids = 400, famille = SANS, couleur = C.encre, ancre = "middle", maxCar = 18, interligne = 1.3 } = {}) {
  const ls = lignes(contenu, maxCar);
  const y0 = y - ((ls.length - 1) * taille * interligne) / 2;
  return ls
    .map((l, i) => `<text x="${x}" y="${(y0 + i * taille * interligne).toFixed(1)}" text-anchor="${ancre}" dominant-baseline="middle" font-family="${famille}" font-size="${taille}" font-weight="${poids}" fill="${couleur}">${esc(l)}</text>`)
    .join("");
}

const fleche = (id, couleur) =>
  `<marker id="${id}" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="${couleur}"/></marker>`;

function boite(x, y, w, h, label, focus) {
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${focus ? C.accentTeinte : C.fond}" stroke="${focus ? C.accent : C.encre}" stroke-width="${focus ? 1.6 : 1}"/>` +
    texte(x + w / 2, y + h / 2, label, { taille: 14, poids: 600, maxCar: 16 })
  );
}

// Flux : boîtes en ligne (4 au plus, écran large) ou en colonne (téléphone, ou plus de 4), le detail sur la flèche.
function flux(f, uid, { colonne = false } = {}) {
  const n = f.elements.length;
  const defs = `<defs>${fleche(`${uid}-f`, C.sourd)}</defs>`;
  if (n <= 4 && !colonne) {
    const w = 140, h = 60, gap = 112, pad = 10;
    const W = n * w + (n - 1) * gap + 2 * pad, H = h + 2 * pad + 20;
    let s = "";
    f.elements.forEach((e, i) => {
      const x = pad + i * (w + gap), y = pad + 20;
      if (i < n - 1) {
        const x1 = x + w + 6, x2 = x + w + gap - 6, ym = y + h / 2;
        s += `<line x1="${x1}" y1="${ym}" x2="${x2}" y2="${ym}" stroke="${C.sourd}" stroke-width="1.2" marker-end="url(#${uid}-f)"/>`;
        if (e.detail) s += texte((x1 + x2) / 2, ym - 22, e.detail, { taille: 11.5, famille: MONO, couleur: C.sourd, maxCar: 16, interligne: 1.25 });
      }
      s += boite(x, y, w, h, e.label, e.focus);
    });
    return { svg: s, defs, W, H };
  }
  const w = 200, h = 52, gap = 60, pad = 10, Wd = 200;
  const W = w + Wd + 2 * pad, H = n * h + (n - 1) * gap + 2 * pad;
  let s = "";
  f.elements.forEach((e, i) => {
    const x = pad, y = pad + i * (h + gap);
    if (i < n - 1) {
      const xm = x + w / 2, y1 = y + h + 4, y2 = y + h + gap - 4;
      s += `<line x1="${xm}" y1="${y1}" x2="${xm}" y2="${y2}" stroke="${C.sourd}" stroke-width="1.2" marker-end="url(#${uid}-f)"/>`;
      if (e.detail) s += texte(xm + 16, (y1 + y2) / 2, e.detail, { taille: 12, famille: MONO, couleur: C.sourd, ancre: "start", maxCar: 24 });
    }
    s += boite(x, y, w, h, e.label, e.focus);
  });
  return { svg: s, defs, W, H };
}

// Étapes : pastilles numérotées reliées par un trait vertical.
function etapes(f) {
  const pas = 66, pad = 14, r = 15, W = 640;
  const H = f.elements.length * pas + 2 * pad - 20;
  let s = `<line x1="${pad + r}" y1="${pad + r}" x2="${pad + r}" y2="${pad + r + (f.elements.length - 1) * pas}" stroke="${C.trait}" stroke-width="2"/>`;
  f.elements.forEach((e, i) => {
    const cy = pad + r + i * pas, cx = pad + r;
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${e.focus ? C.accent : C.fond}" stroke="${e.focus ? C.accent : C.encre}" stroke-width="1.2"/>`;
    s += texte(cx, cy + 0.5, String(i + 1), { taille: 13, poids: 600, famille: MONO, couleur: e.focus ? C.fond : C.encre });
    s += texte(cx + r + 16, cy - (e.detail ? 9 : 0), e.label, { taille: 15, poids: 600, ancre: "start", maxCar: 60, couleur: e.focus ? C.accent : C.encre });
    if (e.detail) s += texte(cx + r + 16, cy + 12, e.detail, { taille: 12, famille: MONO, couleur: C.sourd, ancre: "start", maxCar: 80 });
  });
  return { svg: s, defs: "", W, H };
}

// Comparaison : une colonne de critères, 2 ou 3 colonnes d'options.
function comparaison(f) {
  const nc = f.colonnes.length, wl = 190, wc = nc === 2 ? 220 : 170, pad = 6, ht = 44, hl = 54;
  const W = wl + nc * wc + 2 * pad, H = ht + f.elements.length * hl + 2 * pad;
  let s = "";
  f.colonnes.forEach((c, j) => {
    s += texte(pad + wl + j * wc + wc / 2, pad + ht / 2, c, { taille: 11, poids: 600, famille: MONO, couleur: C.sourd, maxCar: 22 });
  });
  s += `<line x1="${pad}" y1="${pad + ht}" x2="${W - pad}" y2="${pad + ht}" stroke="${C.encre}" stroke-width="1"/>`;
  f.elements.forEach((e, i) => {
    const y = pad + ht + i * hl;
    if (e.focus) s += `<rect x="${pad}" y="${y}" width="${W - 2 * pad}" height="${hl}" fill="${C.accentTeinte}"/>`;
    s += texte(pad + 10, y + hl / 2, e.label, { taille: 13.5, poids: 600, ancre: "start", maxCar: 22, couleur: e.focus ? C.accent : C.encre });
    e.valeurs.forEach((v, j) => {
      s += texte(pad + wl + j * wc + wc / 2, y + hl / 2, v, { taille: 13, maxCar: nc === 2 ? 26 : 20 });
    });
    s += `<line x1="${pad}" y1="${y + hl}" x2="${W - pad}" y2="${y + hl}" stroke="${C.trait}" stroke-width="1"/>`;
  });
  return { svg: s, defs: "", W, H };
}

const DESSINS = { flux, etapes, comparaison };

function svgHtml({ svg, defs, W, H }, titre, classe = "") {
  return `<svg${classe ? ` class="${classe}"` : ""} viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${esc(titre)}" xmlns="http://www.w3.org/2000/svg">${defs}${svg}</svg>`;
}

/** <figure> complète : étiquette, titre, schéma, légende. */
export function figureHtml(f) {
  const uid = `fig-${f.id}`;
  // flux court : version en ligne pour écran large, en colonne pour téléphone
  const dessin =
    f.type === "flux" && f.elements.length <= 4
      ? svgHtml(flux(f, `${uid}-l`), f.titre, "granit-figure--large") + svgHtml(flux(f, `${uid}-c`, { colonne: true }), f.titre, "granit-figure--etroit")
      : svgHtml(DESSINS[f.type](f, uid), f.titre);
  return (
    `<figure class="granit-figure" id="${esc(uid)}">` +
    `<div class="granit-figure__eyebrow">Schéma</div>` +
    `<div class="granit-figure__titre">${esc(f.titre)}</div>` +
    `<div class="granit-figure__dessin">${dessin}</div>` +
    `<figcaption>${esc(f.legende)}</figcaption>` +
    `</figure>`
  );
}

/** Styles de la figure, à reprendre dans la feuille du site. */
export const FIGURE_CSS = `
.granit-figure{margin:2em 0;padding:20px 22px 16px;background:${C.creme};border:1px solid ${C.trait};border-radius:8px}
.granit-figure__eyebrow{font:500 10px/1 ${MONO};letter-spacing:.12em;text-transform:uppercase;color:${C.accent}}
.granit-figure__titre{font:400 20px/1.3 ${SERIF};color:${C.encre};margin:8px 0 14px;text-wrap:balance}
.granit-figure__dessin{overflow-x:auto}
.granit-figure__dessin svg{display:block;max-width:100%;height:auto}
.granit-figure--etroit{display:none!important}
@media (max-width:640px){.granit-figure--large{display:none!important}.granit-figure--etroit{display:block!important}}
.granit-figure figcaption{font:400 13px/1.5 ${SANS};color:${C.sourd};margin-top:12px;padding-top:10px;border-top:1px solid ${C.trait}}
`;

/** Remplace chaque <div data-figure="id"></div> par sa figure dessinée. */
export function insererFigures(html, figures) {
  return html.replace(/<div data-figure="([^"]*)"><\/div>/g, (m, id) => {
    const f = figures.find((x) => x.id === id);
    return f ? figureHtml(f) : "";
  });
}
