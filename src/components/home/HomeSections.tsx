/* L'accueil de getgranit.ai : la nouvelle home du 4 novembre 2026, portée de la maquette « Last mile »
   (internal/landing-pages/cta-homepage). Une section par fichier dans ./nouvelle ; textes en fr et en en.
   La levée (bandeau et section) ne se montre qu'à partir de l'annonce du 5 novembre (useLeveeAnnoncee). */
import { useEffect, useRef } from "react";

import "./nouvelle/socle.css";
import { BandeauLevee, HeroNouvelle } from "./nouvelle/Hero";
import { ProduitNouvelle } from "./nouvelle/Produit";
import { ConnecteursNouvelle } from "./nouvelle/Connecteurs";
import { MetiersNouvelle } from "./nouvelle/Metiers";
import { SecuriteNouvelle } from "./nouvelle/Securite";
import { LeveeNouvelle } from "./nouvelle/Levee";
import { CtaFinNouvelle } from "./nouvelle/CtaFin";
import { DemandeDemo } from "./DemandeDemo";

export function HomeSections() {
  const root = useRef<HTMLDivElement>(null);
  /* les états « avant animation » ne valent qu'une fois le JS monté : le rendu serveur reste lisible */
  useEffect(() => {
    root.current?.classList.add("nh-js");
  }, []);
  return (
    <>
      <div className="nh" ref={root}>
        <BandeauLevee />
        <HeroNouvelle />
        <ProduitNouvelle />
        <ConnecteursNouvelle />
        <MetiersNouvelle />
        <SecuriteNouvelle />
        <LeveeNouvelle />
        <CtaFinNouvelle />
      </div>
      <DemandeDemo />
    </>
  );
}
