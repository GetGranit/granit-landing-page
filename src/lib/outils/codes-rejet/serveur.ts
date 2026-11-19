// Outil A, codes rejet : les deux fonctions serveur des routes. Seul fichier de l'app qui lit les
// données (par pages.mjs) ; les handlers de createServerFn sont retirés du bundle client, avec
// leurs imports. On ne renvoie au navigateur que ce que la page affiche : jamais une entrée
// « à vérifier », jamais une famille fermée.
import { createServerFn } from "@tanstack/react-start";
import { contexteSite } from "@/lib/outils/socle/site";
import {
  groupesHub,
  infosHub,
  lignesHub,
  modeleEntree,
  pages,
  resoudre,
  sourcesHub,
} from "./pages.mjs";
import type { DonneesHub, ModeleEntree } from "./types";
import type { PageOutil } from "../socle/types";

export const chargerHub = createServerFn({ method: "GET" }).handler(
  async (): Promise<DonneesHub> => {
    const site = contexteSite();
    const hub = pages({ site })[0];
    return {
      hub: { titre: hub.titre, description: hub.description, lastmod: hub.lastmod },
      lignes: lignesHub({ site }),
      groupes: groupesHub({ site }),
      sources: sourcesHub({ site }),
      infos: infosHub({ site }),
    };
  },
);

export type ReponseEntree =
  | { type: "page"; page: PageOutil; modele: ModeleEntree }
  | { type: "redirection"; vers: string }
  | { type: "recherche"; vers: string }
  | { type: "introuvable" };

export const chargerEntree = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => d)
  .handler(async ({ data }): Promise<ReponseEntree> => {
    const site = contexteSite();
    const r = resoudre(data.slug, { site });
    if (r.type !== "page") return r;
    const page = pages({ site }).find((p) => p.slug === r.slug);
    const modele = modeleEntree(r.slug, { site });
    if (!page || !modele) return { type: "introuvable" };
    return { type: "page", page, modele };
  });
