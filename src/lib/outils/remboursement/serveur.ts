// Les deux fonctions serveur de l'outil B · Remboursement (socle.md § 2.6). Seul fichier de l'app
// qui lit les données (via vues.mjs → entrees.mjs → donnees.json) : les handlers de createServerFn
// sont retirés du bundle client, avec leurs imports.
//
// La date du jour (Europe/Paris) est prise ici, sur le serveur, et renvoyée avec les données : la
// page la reçoit dans son loader, au rendu serveur comme à l'hydratation. Le HTML est donc le même
// des deux côtés, et la bascule du 01/01/2027 se fait sur la date du serveur.
import { createServerFn } from "@tanstack/react-start";
import { contexteSite } from "@/lib/outils/socle/site";
import { aujourdhuiParis, vueEntree, vueHub } from "./vues.mjs";

export const chargerHub = createServerFn({ method: "GET" }).handler(async () =>
  vueHub({ site: contexteSite(), jour: aujourdhuiParis() }),
);

export const chargerEntree = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => ({ slug: String(d?.slug ?? "") }))
  .handler(async ({ data }) =>
    vueEntree(data.slug, { site: contexteSite(), jour: aujourdhuiParis() }),
  );
