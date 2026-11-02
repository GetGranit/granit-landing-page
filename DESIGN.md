<!-- Copie de internal/marque, ne pas modifier ici (source : GetGranit/internal, marque/DESIGN.md @ 95521e8). -->
---
# Jetons de la marque Granit, lisibles par une machine (Claude Code, Stitch, Figma Tokens…).
# Le texte sous ce bloc dit comment s'en servir. En cas de doute, le texte l'emporte.
name: Granit
version: "1.0 · 30 octobre 2026"
marque: "Galets × Médicale douce × Source Serif 4"
colors:
  encre: "#1F3530"          # fonds sombres, texte, logo sur clair
  encre-2: "#182A26"        # sombre plus profond (pilules, cartes sur encre)
  encre-3: "#10211D"        # le plus sombre (survol d'un bouton encre)
  encre-halo: "#24413A"     # cœur des halos, filigrane sur encre, survol
  profond: "#2F7A64"        # liens, accents et succès lisibles sur clair
  menthe: "#A8DCCB"         # accent sur sombre ; sur clair, formes seulement
  ciel: "#CFE3F6"           # accent 2, formes seulement
  blush: "#FAEAEF"          # départ du dégradé, filigrane sur clair, formes seulement
  rose: "#FAF0F2"           # fond clair principal, texte et logo sur sombre
  papier: "#FFFDFD"         # cartes, feuilles, fenêtres
  lavis: "#F4EEF0"          # gris clair des fenêtres de logiciel dans les démos
  texte-secondaire: "rgba(31, 53, 48, .70)"   # 4,8:1 sur rosé
  texte-discret: "rgba(31, 53, 48, .50)"      # sur-titres seulement, jamais une phrase
  filet: "rgba(31, 53, 48, .12)"
  succes: "#2F7A64"
  succes-fond: "rgba(168, 220, 203, .60)"
  succes-texte: "#1D5646"
  alerte: "#C8504A"
  alerte-texte: "#A9433D"   # petit texte d'alerte (5,3:1 sur rosé)
gradients:
  marque: "linear-gradient(90deg, #FAEAEF 0%, #A8DCCB 52%, #CFE3F6 100%)"
typography:
  serif: '"Source Serif 4", Georgia, "Times New Roman", serif'
  serif-reglage: 'font-variation-settings: "opsz" 20'   # à toutes les tailles, voir Typographie
  sans: '"Geist", system-ui, -apple-system, "Segoe UI", sans-serif'
  mail-serif: "Georgia, 'Times New Roman', serif"
  mail-sans: "Helvetica, Arial, sans-serif"
  display:  { family: serif, weight: 300, size: "clamp(44px, 6.4vw, 80px)", lineHeight: 1.02, letterSpacing: "-0.035em" }
  titre:    { family: serif, weight: 300, size: "clamp(30px, 3.6vw, 44px)", lineHeight: 1.08, letterSpacing: "-0.025em" }
  sous-titre: { family: serif, weight: 400, size: "clamp(22px, 2.4vw, 30px)", lineHeight: 1.12, letterSpacing: "-0.02em" }
  texte:    { family: sans, weight: 400, size: "16px", lineHeight: 1.55 }
  texte-petit: { family: sans, weight: 400, size: "14px", lineHeight: 1.5 }
  sur-titre: { family: sans, weight: 500, size: "12px", lineHeight: 1.2, letterSpacing: "0.08em", transform: uppercase }
  bouton:   { family: sans, weight: 500, size: "15px", lineHeight: 1 }
rounded:
  pastille: "8px"
  carte: "14px"
  fenetre: "12px"
  bouton: "999px"
spacing:
  gouttiere: "max(16px, env(safe-area-inset-left))"
  section: "clamp(40px, 6vw, 72px)"
  pile: "12px"
  bloc: "28px"
  largeur-max: "1120px"
shadows:
  carte: "0 0 0 1px rgba(31, 53, 48, .12), 0 30px 60px -36px rgba(31, 53, 48, .45)"
components:
  bouton-principal: { background: "{colors.encre}", color: "{colors.menthe}", radius: "{rounded.bouton}", height: "52px", hover: "{colors.encre-halo}" }
  bouton-clair: { background: "{colors.rose}", color: "{colors.encre}", radius: "{rounded.bouton}" }
  bouton-secondaire: { background: "{colors.papier}", color: "{colors.encre}", border: "1px solid {colors.filet}", radius: "{rounded.bouton}" }
  carte: { background: "{colors.papier}", border: "1px solid {colors.filet}", radius: "{rounded.carte}" }
  section-sombre: { background: "{colors.encre}", color: "{colors.rose}", accent: "{colors.menthe}" }
  pastille-succes: { background: "{colors.succes-fond}", color: "{colors.succes-texte}", radius: "{rounded.bouton}" }
logo:
  symbole: "logo/granit-symbole.svg"
  horizontal: "logo/granit-logo.svg"
  vertical: "logo/granit-logo-vertical.svg"
  tuile: "logo/granit-tuile.svg"
  regle-horizontal: "symbole = 1,16 × hauteur de capitale du nom, centré sur elle ; écart 0,32 capitale"
  regle-vertical: "symbole = 2,2 capitales, centré au-dessus du nom ; écart 0,55 capitale"
  protection: "la moitié de la hauteur du symbole, de chaque côté"
  taille-min: { horizontal: "96px de large", symbole: "16px" }
---

# Granit · DESIGN.md

La référence de la marque Granit : ce qu'on montre, comment, et avec quels fichiers. Tranchée le
29 octobre 2026 : **logo Galets, palette Médicale douce, polices Source Serif 4 et Geist** (depuis le 2 novembre ;
le logo garde son nom dessiné en STK Bureau). Tout ce qui porte la marque
(site, LinkedIn, mails, slides, démo, vidéo) part d'ici.

Ce fichier vit dans `internal/marque/`, à côté des fichiers qu'il décrit. Pour un autre repo (le site, la
plateforme), on le copie à sa racine ; la source reste celle-ci. Il remplace la partie « Direction visuelle »
de la Plateforme de marque sur Notion (écrite avant le choix du logo, de la palette et de la police) ; la
stratégie et le ton restent dans la Plateforme, et leur version de travail dans [`TON.md`](TON.md).

## L'idée

Granit est un nouveau type de back-office pour les professionnels de santé : des agents font l'administratif
de leurs équipes, dans les outils qu'elles utilisent déjà. La marque doit rassurer un praticien et la personne
qui tient son administratif, pas impressionner un développeur. D'où :

- **une ambiance de cabinet bien tenu** : fonds rosés, encre verte, beaucoup d'air, une serif calme pour les titres ;
- **un logo de pierres assemblées** : six pierres pour les six tâches du dossier, posées dans l'ordre où l'agent
  les fait ; la pierre centrale, l'encaissement, verrouille la forme ;
- **peu d'effets** : pas de néon, pas de 3D, pas d'illustration « IA ». Le seul effet de la marque est son
  dégradé, réservé aux grands fonds.

La tagline, la seule phrase de la marque, sur tous les supports (site, LinkedIn, image de partage, slides,
vidéo) :

> **Vos équipes soignent. Granit gère le reste.**

Typographiquement, la seconde moitié de la phrase prend l'accent : menthe sur encre, vert profond sur clair.

## Logo

### Les formes

| Forme | Fichier | Usage |
|---|---|---|
| Horizontal | `logo/granit-logo.svg` (encre), `logo/granit-logo-rose.svg` | Le logo par défaut : en-tête du site, documents, signature de slide |
| Vertical | `logo/granit-logo-vertical.svg`, `-rose.svg` | Fin de vidéo, slide de titre, plaquette, kakémono |
| Symbole seul | `logo/granit-symbole.svg`, `-rose.svg` | Quand le nom est déjà écrit à côté, ou sous 96 px de large |
| Tuile | `logo/granit-tuile.svg` | Favicon, icône d'app, avatar d'outil (symbole rosé sur carré encre) |

Les PNG transparents sont dans `logo/png/`. Tous sont fabriqués par `sources/fabriquer.cjs` à partir de
`sources/logo.cjs` : **on ne retouche jamais un fichier de logo à la main**, on modifie la source et on
relance.

### La géométrie

- **Symbole** : six polygones à contour arrondi (trait de 15,67 sur une hauteur de 190, jointures rondes).
  Ce sont les vecteurs exacts de la page « Motion du logo » de la planche ; la 3e pierre est la clé de voûte.
- **Nom** : « Granit » en STK Bureau Serif Light, **vectorisé** (nœud 172:58 du Figma
  « Granit — Rebranding · 3 pistes créatives »). Le logo ne dépend donc d'aucune police installée. On ne
  recompose jamais le nom au clavier, même en Bureau.
- **Horizontal** : symbole haut de **1,16 × la hauteur de capitale** du nom, centré verticalement sur cette
  capitale, écart de **0,32 capitale**. C'est la règle déjà appliquée par `marque.css` sur la landing.
- **Vertical** : symbole haut de **2,2 capitales**, centré au-dessus du nom, écart de **0,55 capitale**.

### Les règles

- **Une seule couleur** : encre `#1F3530` sur fond clair, rosé `#FAF0F2` sur fond sombre ou sur photo.
  Jamais de dégradé, d'ombre, de contour ou de pierre d'une autre couleur dans le logo.
- **Zone de protection** : la moitié de la hauteur du symbole, de chaque côté. Rien n'y entre, pas même un filet.
- **Tailles minimales** : 96 px de large pour l'horizontal (20 mm imprimé), 16 px pour le symbole.
- **Interdits** : étirer, pivoter, recadrer, réordonner les pierres, mettre le logo sur le dégradé à l'endroit
  où il est le plus clair (le gris du milieu blush-menthe) sans vérifier le contraste.
- **Le symbole peut s'animer** pierre par pierre, dans l'ordre des tâches (voir `Marque.LOGOS` dans le
  `marque.js` de la planche) : seulement en ouverture de vidéo ou de page, jamais en boucle.

## Couleurs

La palette est faite de **trois rôles** : un sombre (encre), un clair (rosé), un accent (menthe), plus deux
couleurs d'appoint pour le dégradé.

| Couleur | Hex | Rôle | Contraste |
|---|---|---|---|
| Encre verte | `#1F3530` | Fonds sombres, texte courant, logo sur clair | 11,7:1 sur rosé |
| Vert profond | `#2F7A64` | Liens, accents et succès **sur clair** | 4,6:1 sur rosé, 5,1:1 sur blanc |
| Menthe | `#A8DCCB` | Accent **sur sombre** (texte, boutons, pastilles) | 8,6:1 sur encre |
| Ciel | `#CFE3F6` | Accent 2, fin du dégradé | formes seulement |
| Blush | `#FAEAEF` | Départ du dégradé, filigrane sur clair | formes seulement |
| Rosé | `#FAF0F2` | Fond clair principal, texte et logo sur sombre | 11,7:1 sous l'encre |
| Papier | `#FFFDFD` | Cartes, feuilles, fenêtres posées sur le rosé | |

Règles :

- **Le texte est encre, rosé, menthe (sur encre) ou vert profond (sur clair). Rien d'autre.** Menthe, ciel
  et blush sur fond clair ne portent jamais de texte (1,2 à 1,4:1).
- **Texte secondaire** : encre à 70 % (4,8:1 sur rosé). L'encre à 50 % ne sert qu'aux sur-titres en
  capitales, jamais à une phrase qu'il faut lire.
- **Le dégradé** blush → menthe → ciel (0 %, 52 %, 100 %) est le seul effet de la marque. Il va aux
  **grands fonds** (bannière LinkedIn, hero, image de partage) et aux **filets** (bas d'une bannière, bas
  d'une slide). Jamais sur un bouton, un texte ou le logo. Son passage blush-menthe tire vers le gris : ne
  rien y poser d'important.
- **Les états produit** : succès en vert profond (pastille fond menthe à 60 %, texte `#1D5646`), alerte
  `#C8504A` (petit texte : `#A9433D`). Pas de rouge vif, pas d'orange : une alerte reste une information.
- **Les ombres sont teintées d'encre**, jamais noires.

## Typographie

Deux familles, pas une de plus : **Source Serif 4** pour les titres, **Geist** pour le texte. Toutes deux
libres (SIL Open Font License), servies par Google Fonts et livrées dans `sources/polices/`.

| Rôle | Police | Graisse | Taille / interligne | Approche |
|---|---|---|---|---|
| Display (hero, couverture) | Source Serif 4 | Light 300 | 44 à 80 px / 1,02 | −0,035 em |
| Titre de section | Source Serif 4 | Light 300 | 30 à 44 px / 1,08 | −0,025 em |
| Sous-titre, titre de carte | Source Serif 4 | Regular 400 | 22 à 30 px / 1,12 | −0,02 em |
| Texte courant | Geist | Regular 400 | 16 px / 1,55 | 0 |
| Texte petit, légendes | Geist | Regular 400 | 14 px / 1,5 | 0 |
| Sur-titre | Geist | Medium 500 | 12 px, capitales | +0,08 em |
| Bouton | Geist | Medium 500 | 15 à 16 px | 0 |
| Chiffres en colonne | Geist | Regular 400 | `font-variant-numeric: tabular-nums` | |

- **Pourquoi pas STK Bureau.** La marque a été dessinée en Bureau, mais on n'en a plus les fichiers ni la
  licence web. Source Serif 4 a été choisie le 2 novembre 2026, contre Roboto Serif, IBM Plex Serif,
  Newsreader, Literata, Spectral et Gelasio : c'est la plus proche de Bureau Serif. Seul le nom du logo
  reste en Bureau, parce qu'il est vectorisé.
- **Source Serif 4 se règle à l'œil 20, à toutes les tailles** : `font-variation-settings: "opsz" 20`.
  Laissée en automatique, elle prend en grand sa coupe « display », très contrastée et fine, loin du nom du
  logo. À l'œil 20, elle est peu contrastée et plus large, comme Bureau.
- **Dans un mail**, aucune police web : Georgia pour le nom, Helvetica/Arial pour le reste (voir la signature).
- **Pas de faux italique, pas de gras de synthèse.** L'emphase d'un titre passe par la couleur d'accent,
  pas par l'italique.
- Titres en `text-wrap: balance`, texte courant à 65 caractères de large au plus.

## Ton et écriture

Les mots ont leur fichier : [`TON.md`](TON.md) (promesse, personnalité, mots à dire et à éviter, ce qu'on a
le droit d'affirmer, règles par canal). Les trois qui touchent aussi au visuel :

- **La seconde moitié de la phrase prend l'accent** : « Granit gère le reste. » en menthe sur encre, en vert profond sur clair.
- **Les chiffres des démos et des maquettes sont des exemples**, et on le dit à l'écran.
- **Typographie française** dans tous les supports : espace insécable avant `: ; ? !` et dans les guillemets
  « », apostrophe ’, pas de tiret long, pas d'emoji.

## Mise en page et composants

- **Fond** : rosé. **Cartes et fenêtres** : papier, filet encre à 12 %, rayon 12 à 14 px. **Sections fortes** :
  encre, texte rosé, accent menthe.
- **Boutons** : pilules (rayon 999 px). Principal : fond encre, texte menthe. Sur fond sombre : fond rosé,
  texte encre. Secondaire : papier et filet. Focus clavier visible, contour vert profond.
- **Le motif** : le symbole agrandi, rogné par un bord, en filigrane (blush sur rosé, papier à 60 % sur le
  dégradé, `#24413A` sur encre). Un seul par support, jamais derrière un texte à lire.
- **Grille** : 1120 px de large au plus, gouttière de 16 px minimum, sections espacées de 40 à 72 px.
- **Mouvement** : sobre. Apparitions courtes (0,85 s, ease-out), rien qui boucle hors de la démo produit.
  `prefers-reduced-motion` coupe tout.

## Les supports

Tous sont dans ce dossier, rendus par `node marque/sources/fabriquer.cjs`, et téléchargeables depuis la page
du kit (`marque/index.html`, publiée pour l'équipe).

| Support | Fichier | Taille | À savoir |
|---|---|---|---|
| Logo page LinkedIn | `linkedin/linkedin-logo-entreprise-400.png` | 400 × 400 | Carré plein ; sert aussi d'avatar Slack, Notion, Cal.com, lemlist, Attio |
| Couverture page LinkedIn | `linkedin/linkedin-couverture-entreprise.png` | 1128 × 191 (en 2×) | Rien dans les 230 px de gauche : le logo de la page mord dessus |
| Bannière profil LinkedIn | `linkedin/linkedin-banniere-profil.png`, `-sombre.png` | 1584 × 396 | Texte dans la moitié droite : la photo couvre la gauche |
| Signature mail | `index.html` (générateur), `signatures/images/` | tuile 48 px (en 3×) | Image servie par `getgranit.ai/marque/signature/` |
| Fonds de visio | `visio/granit-fond-visio-clair.png`, `-sombre.png` | 1920 × 1080 | Centre libre, marque dans les coins |
| Image de partage | `partage/granit-partage-1200x630.png` | 1200 × 630 | Balise `og:image` du site |
| Favicon et icônes | `icones/` | 16 à 512 | `favicon.svg` + `favicon.ico`, `apple-touch-icon.png`, `icon-192/512.png` (zone sûre 80 %) |

### La signature mail

- **Complète** (tous les jours) : la tuile 48 px à gauche, un filet menthe, le nom en Georgia 17 px, la
  fonction, puis téléphone · getgranit.ai · LinkedIn · Réserver une démo. La tuile plutôt que le logo
  horizontal : son fond encre reste lisible quand Gmail ou Apple Mail passent le mail en mode sombre.
- **Légère** (réponses, campagnes lemlist) : les mêmes lignes, sans image. Sans image, un mail froid passe
  mieux les filtres.
- **Tous les liens portent des UTM** : `utm_source=signature&utm_medium=email&utm_campaign=<prénom>`.
- L'image est hébergée sur le site (`granit-landing-page/public/marque/signature/`) : un mail ne peut pas
  embarquer de SVG ni d'image locale.

## Fabriquer et modifier

```bash
node marque/sources/fabriquer.cjs            # refait tous les SVG et PNG
node marque/sources/fabriquer.cjs linkedin   # seulement ceux dont le chemin contient « linkedin »
```

- `sources/logo.cjs` : la géométrie du logo et les couleurs. La seule source du logo.
- `sources/fabriquer.cjs` : les gabarits de chaque support, rendus par Chromium (Playwright) à la taille exacte.
- `sources/polices/` : Source Serif 4 et Geist (libres, OFL), utilisées par les gabarits.
- `sources/rendu.json` : pour chaque visuel, la police réellement utilisée au dernier rendu.

## Pour un agent

Quand tu produis un écran, une page ou un visuel Granit :

1. Prends les jetons du bloc en tête de ce fichier ; n'invente aucune couleur.
2. Fond rosé ou encre, jamais blanc pur ni noir. Texte encre, rosé, menthe sur encre, vert profond sur clair.
3. Titres en Source Serif 4 Light, réglée à l'œil 20 (`"opsz" 20`), texte en Geist. Deux familles, aucune autre (ni Bureau, ni Roboto Serif).
4. Le logo vient de `logo/` (SVG), jamais recomposé avec du texte.
5. Le dégradé seulement en grand fond ou en filet. Pas d'ombre noire, pas d'emoji, pas de violet.
6. Pour les textes (titres, boutons, accroches), suis [`TON.md`](TON.md) : français, vouvoiement, mots du métier, rien d'affirmé qui ne soit validé.
