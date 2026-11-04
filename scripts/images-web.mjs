// Optimise les images de public/ et note leurs dimensions. À relancer après tout ajout ou
// remplacement de photo de thème, de photo métier ou de logo tiers : node scripts/images-web.mjs
// - photos de thème et de métier : un WebP à côté de chaque JPEG, mêmes largeurs. Le JPEG reste la
//   source et le repli de <picture>, et l'image de partage (og:image) : il n'est jamais modifié ;
// - logos tiers : ramenés au double de leur plus grand affichage, puis recompressés en PNG à la même
//   adresse. Jamais les logos Granit, qui sortent de marque/ dans le dépôt internal ;
// - photos rondes des métiers de l'accueil : ramenées à leur taille d'affichage ;
// - src/lib/tailles-logos.ts : les dimensions réelles des logos, pour leurs attributs width/height.
// Une reprise ne change rien ; un fichier n'est remplacé que s'il gagne au moins 15 %.
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const racine = fileURLToPath(new URL("..", import.meta.url));
const pub = join(racine, "public");

const QUALITE_WEBP = 82; // à 75, le grain des murs et des tissus se lisse sur écran 2x
const GAIN_MINIMUM = 0.15;
const PHOTOS = ["ressources/themes", "ressources/metiers"];
/** Boîte en px, au double de l'affichage CSS le plus grand (`null` : pas de redimensionnement). */
const LOGOS = [
  // Mur des plateformes : logotype 136 × 36, logo vertical 96 × 56, vedette 80 × 80.
  { dossier: "logos/annuaire", boite: [272, 160] },
  // Roue de l'accueil : carte de 212 px, logotype 168 × 47, logo carré 59 × 59.
  { dossier: "home/connecteurs", boite: [336, 118] },
  // Source aussi des images d'aperçu (scripts/ressources/og-plateformes.mjs) : on garde la taille.
  { dossier: "logos", boite: null },
];
/** Photos de public/home en rond de 44 px (metiers.css) : 3x sur mobile, 40 px × 3. */
const LARGEUR_ROND = 120;

const ko = (o) => `${(o / 1024).toFixed(0)} Ko`;

async function fichiers(dossier, ext) {
  const noms = await readdir(join(pub, dossier));
  return noms.filter((n) => ext.test(n)).map((n) => join(pub, dossier, n));
}

function bilan(titre, avant, apres) {
  const gain = avant ? Math.round((1 - apres / avant) * 100) : 0;
  console.log(`${titre} : ${ko(avant)} → ${ko(apres)} (-${gain} %)`);
}

/** Écrit `tampon` à la place de `chemin` s'il gagne assez ; renvoie le poids retenu. */
async function remplacer(chemin, tampon) {
  const avant = (await stat(chemin)).size;
  if (tampon.length > avant * (1 - GAIN_MINIMUM)) return avant;
  await writeFile(chemin, tampon);
  return tampon.length;
}

async function photos() {
  let avant = 0;
  let apres = 0;
  for (const dossier of PHOTOS) {
    for (const jpeg of await fichiers(dossier, /-(800|1600)\.jpg$/)) {
      const webp = jpeg.replace(/\.jpg$/, ".webp");
      await sharp(jpeg).webp({ quality: QUALITE_WEBP, effort: 6 }).toFile(webp);
      avant += (await stat(jpeg)).size;
      apres += (await stat(webp)).size;
    }
  }
  bilan("Photos, JPEG → WebP", avant, apres);
}

async function logos() {
  for (const { dossier, boite } of LOGOS) {
    let avant = 0;
    let apres = 0;
    for (const png of await fichiers(dossier, /\.png$/)) {
      const taille = (await stat(png)).size;
      avant += taille;
      let image = sharp(await readFile(png));
      const { width, height, isPalette } = await image.metadata();
      const tientDansLaBoite = !boite || (width <= boite[0] && height <= boite[1]);
      // Déjà passé par ici : recompresser une palette ne ferait que la dégrader.
      if (isPalette && tientDansLaBoite) {
        apres += taille;
        continue;
      }
      if (boite) {
        image = image.resize({
          width: boite[0],
          height: boite[1],
          fit: "inside",
          withoutEnlargement: true,
        });
      }
      const tampon = await image.png({ palette: true, quality: 90, effort: 10 }).toBuffer();
      apres += await remplacer(png, tampon);
    }
    bilan(`Logos ${dossier}`, avant, apres);
  }
}

async function rondsAccueil() {
  let avant = 0;
  let apres = 0;
  for (const jpeg of await fichiers("home", /\.jpg$/)) {
    const taille = (await stat(jpeg)).size;
    avant += taille;
    const image = sharp(await readFile(jpeg));
    if ((await image.metadata()).width <= LARGEUR_ROND) {
      apres += taille;
      continue;
    }
    const tampon = await image
      .resize({ width: LARGEUR_ROND })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();
    apres += await remplacer(jpeg, tampon);
  }
  bilan("Photos rondes de l'accueil", avant, apres);
}

async function tailles() {
  const lignes = [];
  for (const dossier of ["logos", "logos/annuaire", "home/connecteurs"]) {
    for (const f of await fichiers(dossier, /\.(png|webp|svg)$/)) {
      const { width, height } = await sharp(f).metadata();
      const url = f.slice(pub.length).replaceAll("\\", "/");
      lignes.push(`  "${url}": { width: ${width}, height: ${height} },`);
    }
  }
  await writeFile(
    join(racine, "src/lib/tailles-logos.ts"),
    `// Généré par scripts/images-web.mjs, ne pas modifier à la main.
type Taille = { width: number; height: number };

const TAILLES: Record<string, Taille> = {
${lignes.sort().join("\n")}
};

/** Attributs width/height d'un logo (dimensions du fichier, pour réserver sa place). */
export const tailleLogo = (url?: string): Taille | undefined => (url ? TAILLES[url] : undefined);
`,
  );
}

await photos();
await logos();
await rondsAccueil();
await tailles();
