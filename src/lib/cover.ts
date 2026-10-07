// Couvertures génératives des Ressources Granit.
// Pur TypeScript, sans dépendance, déterministe : même slug => même image, au pixel près.
// Trame tramée (dither) dans la couleur de la catégorie + le trait du logo Granit.
// Carte : aucun texte dans le SVG (une image <img> n'a pas accès aux polices du site),
// l'étiquette et le logo de plateforme sont posés en HTML par-dessus.
// og : titre et étiquette inclus, à rasteriser au build avec resvg + les fichiers de police.

export type Category =
  | "guide-tiers-payant"
  | "plateformes"
  | "rejets"
  | "paiements"
  | "gerer-son-tiers-payant"
  | "conformite"
  | "glossaire";

export const CATEGORIES: Record<Category, { name: string; ink: string; tint: string }> = {
  "guide-tiers-payant": { name: "Les bases du tiers payant", ink: "#3f7a4d", tint: "#e9f2eb" },
  plateformes: { name: "Plateformes et portails", ink: "#b94a2f", tint: "#fbeae3" },
  rejets: { name: "Rejets et refus", ink: "#8a6416", tint: "#f6eedb" },
  paiements: { name: "Paiements et rapprochement", ink: "#3e5f84", tint: "#e6ecf4" },
  "gerer-son-tiers-payant": { name: "Organiser son tiers payant", ink: "#7a4a74", tint: "#f3e9f1" },
  conformite: { name: "Conformité", ink: "#2f6f75", tint: "#e2f0f1" },
  glossaire: { name: "Glossaire", ink: "#5e574b", tint: "#f1ede5" },
};

export interface CoverInput {
  slug: string;
  category: Category;
  title: string;
  variant?: "card" | "une" | "og"; // card = 800×600, une = 800×500 (grandes cartes), og = 1200×630
  platform?: boolean; // fiche plateforme : médaillon central
  // Échelle du trait du logo (1 par défaut). Les grandes cartes le réduisent pour qu'il ne domine pas.
  trait?: number;
  // og seulement : contenu du médaillon (data URI du logo, sinon initiale). En carte, le logo est posé en HTML.
  mark?: { logo?: string; initial?: string };
}

const DARK = "#1c1108";
const TERRA = "#d4583a";
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
// Trait du logo (viewBox 56×52), points de la ligne puis le point final.
const LOGO = [
  [4, 26],
  [16, 26],
  [20, 14],
  [26, 38],
  [32, 20],
  [36, 30],
  [44, 30],
];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const r1 = (n: number) => Math.round(n * 10) / 10;

// Trois familles de champ (0 = vide, 1 = plein), choisies par la graine.
type Field = (u: number, v: number) => number;
function makeField(rand: () => number): Field {
  const kind = Math.floor(rand() * 3);
  if (kind === 0) {
    // Strates : bandes ondulées, clin d'œil au granit.
    const bands = 3 + rand() * 3,
      amp = 0.08 + rand() * 0.12,
      freq = 1 + rand() * 2,
      ph = rand() * 6.28;
    return (u, v) => {
      const s = Math.sin((v + amp * Math.sin(u * freq * Math.PI + ph)) * bands * Math.PI);
      return 0.5 + 0.5 * s * Math.abs(s) * 0.9;
    };
  }
  if (kind === 1) {
    // Lentilles : deux ou trois masses rondes et douces.
    const blobs = Array.from({ length: 2 + Math.floor(rand() * 2) }, () => ({
      x: 0.15 + rand() * 0.7,
      y: 0.15 + rand() * 0.7,
      r: 0.18 + rand() * 0.22,
    }));
    return (u, v) =>
      Math.min(
        1,
        blobs.reduce((a, b) => a + Math.exp(-((u - b.x) ** 2 + (v - b.y) ** 2) / (b.r * b.r)), 0),
      );
  }
  // Onde : dégradé diagonal modulé.
  const th = rand() * Math.PI,
    wl = 0.12 + rand() * 0.14,
    ph = rand() * 6.28,
    dir = rand() < 0.5;
  return (u, v) => {
    const d = u * Math.cos(th) + v * Math.sin(th);
    const g = dir ? u : 1 - u;
    return (0.5 + 0.5 * Math.sin(d / wl + ph)) * (0.25 + 0.75 * g);
  };
}

function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const w of text.split(/\s+/)) {
    if (line && (line + " " + w).length > max) {
      lines.push(line);
      line = w;
    } else line = line ? line + " " + w : w;
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Géométrie du trait d'une couverture (même graine que coverSvg) : sert aussi au calque
 * animé posé par-dessus l'image sur le site. Pas de trait sur une fiche plateforme.
 */
export function traceCouverture({
  slug,
  variant = "card",
  trait = 1,
}: Pick<CoverInput, "slug" | "variant" | "trait">) {
  const og = variant === "og";
  const W = og ? 1200 : 800,
    H = og ? 630 : variant === "une" ? 500 : 600;
  const x0 = og ? 672 : 0;
  const rand = rng(hash(slug));
  makeField(rand); // consomme la graine comme coverSvg
  const k = ((og ? 5 : 6) + rand() * 3) * trait;
  const tirage = rand();
  // Trait réduit : ligne de base dans le tiers inférieur, comme un horizon.
  const brut =
    trait < 1 ? H * (0.58 + tirage * 0.08) - 26 * k : H * (0.38 + tirage * 0.34) - 26 * k;
  // Le trait (halo et point compris) reste entièrement dans l'image.
  const ly = Math.min(Math.max(brut, 16 - 11.9 * k), H - 16 - 42.4 * k);
  const lx = x0 + (W - x0) * (0.12 + rand() * 0.3) - 4 * k;
  const pts = LOGO.map(([px, py]) => [r1(lx + px * k), r1(ly + py * k)]);
  const d = `M${r1(x0 + (og ? k * 2.1 : 0))} ${r1(ly + 26 * k)}L${pts.map((p) => p.join(" ")).join("L")}`;
  const [cx, cy] = pts[pts.length - 1];
  return {
    W,
    H,
    d,
    cx,
    cy,
    largeur: r1(k * 1.1),
    r: r1(k * 1.9),
    halo: r1(k * (trait < 1 ? 2.6 : 4.2)),
    rHalo: r1(k * (trait < 1 ? 3 : 4.4)),
  };
}

export function coverSvg({
  slug,
  category,
  title,
  variant = "card",
  platform = false,
  mark,
  trait = 1,
}: CoverInput): string {
  const cat = CATEGORIES[category] ?? CATEGORIES.glossaire;
  const og = variant === "og";
  const W = og ? 1200 : 800,
    H = og ? 630 : variant === "une" ? 500 : 600;
  const rand = rng(hash(slug));
  const field = makeField(rand);
  const cell = og ? 16 : 14;
  // og : la trame occupe la moitié droite, le texte la gauche.
  const x0 = og ? 672 : 0; // multiple de la cellule : la matrice de Bayer tombe juste
  // Médaillon plateforme : disque central, la trame s'efface autour.
  const mx = og ? (W + x0) / 2 : W / 2,
    my = H / 2,
    mr = H * 0.22;

  let d = "";
  for (let y = 0; y < H; y += cell) {
    for (let x = x0; x < W; x += cell) {
      const u = (x - x0) / (W - x0),
        v = y / H;
      let t = 0.08 + 0.92 * field(u, v);
      if (platform) {
        const dist = Math.hypot(x + cell / 2 - mx, y + cell / 2 - my) / mr;
        t *= Math.min(1, Math.max(0, (dist - 1.15) / 0.9));
      }
      const b = BAYER[((y / cell) % 4) * 4 + (((x - x0) / cell) % 4)] / 16;
      const level = Math.floor(Math.min(0.999, Math.max(0, t + (b - 0.5) * 0.45)) * 4) / 4;
      if (level <= 0) continue;
      const s = r1(cell * (0.25 + level * 0.65));
      const o = r1((cell - s) / 2);
      d += `M${r1(x + o)} ${r1(y + o)}h${s}v${s}h-${s}z`;
    }
  }

  // Trait du logo : entre par le bord gauche de la zone, position et échelle tirées de la graine.
  let line = "";
  const g = platform ? null : traceCouverture({ slug, variant, trait });
  if (g) {
    line =
      `<path d="${g.d}" fill="none" stroke="${cat.tint}" stroke-width="${g.halo}" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="${g.d}" fill="none" stroke="${DARK}" stroke-width="${g.largeur}" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle cx="${g.cx}" cy="${g.cy}" r="${g.rHalo}" fill="${cat.tint}"/>` +
      `<circle cx="${g.cx}" cy="${g.cy}" r="${g.r}" fill="${TERRA}"/>`;
  }

  let medal = "";
  if (platform) {
    medal = `<circle cx="${mx}" cy="${my}" r="${r1(mr)}" fill="#fff" stroke="${cat.ink}" stroke-opacity=".25" stroke-width="2"/>`;
    const side = r1(mr * 1.2);
    if (og && mark?.logo)
      medal += `<image href="${esc(mark.logo)}" x="${r1(mx - side / 2)}" y="${r1(my - side / 2)}" width="${side}" height="${side}" preserveAspectRatio="xMidYMid meet"/>`;
    else if (og && mark?.initial)
      medal += `<text x="${mx}" y="${r1(my + mr * 0.36)}" text-anchor="middle" font-family="Libre Caslon Text" font-size="${r1(mr)}" fill="${cat.ink}">${esc(mark.initial.slice(0, 1).toUpperCase())}</text>`;
  }

  let text = "";
  if (og) {
    // Titre façon Function : partie avant « : » en romain, la suite en italique couleur catégorie.
    // Coupure après « : » ou après un « ? » suivi d'une suite.
    const m = title.match(/^(.+?)(?: : |(?<=\?) )(.+)$/);
    const head = m ? m[1] : title,
      tail = m?.[2];
    // Largeur moyenne d'un caractère Libre Caslon ≈ 0,5 em ; zone de texte = 64 → x0 - 48.
    const build = (fs: number) => {
      const max = Math.floor((x0 - 112) / (fs * 0.5));
      return wrap(head, max)
        .map((l) => ({ l, em: false }))
        .concat(tail ? wrap(tail, max).map((l) => ({ l, em: true })) : []);
    };
    let fs = 56,
      lines = build(fs);
    while (lines.length > 5 && fs > 40) lines = build((fs -= 4));
    lines = lines.slice(0, 6);
    const lh = fs * 1.14;
    const top = (H - lines.length * lh) / 2 + fs * 0.8;
    text =
      `<text x="64" y="72" font-family="JetBrains Mono" font-size="17" letter-spacing="2.4" fill="${cat.ink}">${esc(cat.name.toUpperCase())}</text>` +
      lines
        .map(
          ({ l, em }, i) =>
            `<text x="64" y="${r1(top + i * lh)}" font-family="Libre Caslon Text" font-size="${fs}"${em ? ` font-style="italic" fill="${cat.ink}"` : ` fill="${DARK}"`}>${esc(l)}</text>`,
        )
        .join("") +
      `<text x="64" y="${H - 56}" font-family="Inter Tight" font-size="20" font-weight="600" fill="${DARK}">Granit · Le guide du tiers payant</text>`;
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(title)}">` +
    `<rect width="${W}" height="${H}" fill="${og ? "#faf6ee" : cat.tint}"/>` +
    (og ? `<rect x="${x0}" width="${W - x0}" height="${H}" fill="${cat.tint}"/>` : "") +
    `<path d="${d}" fill="${cat.ink}" fill-opacity=".82"/>${line}${medal}${text}</svg>`
  );
}
