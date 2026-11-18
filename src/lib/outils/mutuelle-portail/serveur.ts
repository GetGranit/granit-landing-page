// Outil C · mutuelle → portail : les deux fonctions serveur du hub et des entrées.
// Seul fichier de l'app qui touche aux données (via modele.mjs → pages.mjs → donnees.json) : les
// handlers de createServerFn sont retirés du bundle client, avec leurs imports. La décision de
// publication est celle du sitemap (pages.mjs).
import { createServerFn } from "@tanstack/react-start";
import { contexteSite } from "@/lib/outils/socle/site";
import { modeleEntree, modeleHub } from "./modele.mjs";
import type { DonneesHub, ReponseEntree } from "./types";

/** Les 54 lignes du hub, ses groupes, ses sources et ses filtres. */
export const chargerHub = createServerFn({ method: "GET" }).handler(async (): Promise<DonneesHub> =>
  modeleHub(contexteSite()),
);

/** Une page d'entrée publiée, une redirection 301 (fiche, autre nom, ligne du hub), ou rien (404). */
export const chargerEntree = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => ({ slug: String(d?.slug ?? "") }))
  .handler(async ({ data }): Promise<ReponseEntree> => modeleEntree(data.slug, contexteSite()));
