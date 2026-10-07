import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";

import logo from "@/assets/logo.svg";
import { Connexions } from "@/components/essai/Connexions";
import { DemandePec, type Demande } from "@/components/essai/DemandePec";
import { MesDemandes, Offre, PaulButton } from "@/components/essai/Espace";
import { PaulSheet, usePaulSheet } from "@/components/essai/PaulSheet";
import { PremierePec } from "@/components/essai/PremierePec";
import { Kicker } from "@/components/essai/ui";
import {
  EXAMPLE_CASE,
  EXAMPLE_SIMULATION,
  contactPaul,
  readCase,
  readPhone,
  readiness,
  type ContactRequest,
  type DossierFictif,
  type PecCase,
} from "@/lib/pec/essaiState";

/**
 * Espace freemium Granit (aperçu, tout est simulé côté front).
 * On y arrive depuis /pec juste après la vraie simulation, avec le cas dans
 * sessionStorage. Hors navigation, hors sitemap, noindex.
 */
export const Route = createFileRoute("/essai")({
  head: () => ({
    meta: [
      { title: "Votre espace Granit - Granit AI" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content: "Faites vos demandes de prise en charge gratuitement avec Granit.",
      },
    ],
  }),
  component: EssaiPage,
});

const ACCORD_MS = 3500;

function EssaiPage() {
  const reduce = useReducedMotion();
  const [pecCase, setPecCase] = useState<PecCase | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [view, setView] = useState<"espace" | "demande">("espace");
  const [added, setAdded] = useState<ReadonlySet<string>>(new Set());
  const [logiciel, setLogiciel] = useState<string | null>(null);
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [courante, setCourante] = useState<number | null>(null);
  const timers = useRef<number[]>([]);
  const sheet = usePaulSheet();

  // sessionStorage n'existe que côté navigateur : lecture après le montage.
  useEffect(() => {
    setPecCase(readCase() ?? EXAMPLE_CASE);
    setPhone(readPhone());
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [view, courante, reduce]);

  const { show } = sheet;
  const onIdle = useCallback(
    () => show("rappel", "Besoin d'un coup de main pour brancher vos accès ? Paul vous rappelle."),
    [show],
  );

  if (!pecCase) return <Shell exemple={false} />;

  const carte = pecCase.platform;
  const simulation = pecCase.simulation ?? EXAMPLE_SIMULATION;
  const portailConnecte = Boolean(pecCase.portailConnecte);
  const portailCarte = portailConnecte || (carte ? added.has(carte.id) : added.size > 0);
  const autres = [...added].filter((id) => id !== carte?.id).length - (carte ? 0 : 1);
  const ready = readiness({
    simulation: Boolean(pecCase.simulation),
    portailCarte,
    carteLabel: carte?.label ?? null,
    logiciel: logiciel !== null,
    autresPortails: Math.max(0, autres),
  });
  const nom = pecCase.prenom ?? pecCase.magasin;
  const portail = carte?.label ?? null;

  async function onContact(req: ContactRequest) {
    if (!pecCase) return;
    await contactPaul(req, pecCase);
    if (req.phone) setPhone(req.phone);
  }

  function launch(dossier: DossierFictif) {
    const index = demandes.length;
    setDemandes((ds) => [...ds, { dossier, statut: "en-cours" }]);
    setCourante(index);
    // Maquette : la mutuelle « répond » au bout de quelques secondes.
    timers.current.push(
      window.setTimeout(
        () =>
          setDemandes((ds) => ds.map((d, i) => (i === index ? { ...d, statut: "accordee" } : d))),
        ACCORD_MS,
      ),
    );
  }

  function backToEspace(anchor?: string) {
    setView("espace");
    setCourante(null);
    if (anchor) {
      window.setTimeout(() => document.getElementById(anchor)?.scrollIntoView(), 50);
    }
  }

  return (
    <Shell exemple={pecCase.source === "exemple"} mutuelle={pecCase.mutuelle}>
      {view === "demande" ? (
        <motion.div
          key={`demande-${courante ?? "new"}`}
          className="mx-auto max-w-[520px]"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DemandePec
            logiciel={logiciel}
            portail={portail}
            demande={courante === null ? null : (demandes[courante] ?? null)}
            onLaunch={launch}
            onChooseLogiciel={() => backToEspace("connexions-titre")}
            onBack={() => backToEspace()}
          />
        </motion.div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
          <div>
            <Kicker>Vos demandes de PEC, gratuitement</Kicker>
            <h1
              className="font-serif text-text"
              style={{
                fontSize: "clamp(30px, 5vw, 46px)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              Bienvenue{nom ? `, ${nom}` : ""}{" "}
              <span className="accent-italic">dans votre espace Granit.</span>
            </h1>
            <p
              className="mb-6 mt-3 text-[15px] leading-[1.5]"
              style={{ color: "var(--text-soft)" }}
            >
              Votre première prise en charge est déjà là. Les suivantes partent d'ici.
            </p>
            <PremierePec
              simulation={simulation}
              portail={portail}
              mutuelle={pecCase.mutuelle}
              minutesManuelles={pecCase.minutesManuelles}
            />
            <button
              type="button"
              onClick={() => {
                setCourante(null);
                setView("demande");
              }}
              className="btn-primary mt-6 w-full justify-center py-3.5 text-[16px]"
            >
              Faire une demande de PEC <span className="arrow">→</span>
            </button>
            <MesDemandes
              demandes={demandes}
              onOpen={(i) => {
                setCourante(i);
                setView("demande");
              }}
            />
            <Offre className="mt-8 hidden lg:block" />
          </div>
          <div>
            <Connexions
              carte={carte}
              portailConnecte={portailConnecte}
              added={added}
              onAddPortal={(id) => setAdded((s) => new Set(s).add(id))}
              logiciel={logiciel}
              onLogiciel={setLogiciel}
              readiness={ready}
              onIdle={onIdle}
            />
            <Offre className="mt-8 lg:hidden" />
          </div>
        </div>
      )}

      {!sheet.open && (
        <PaulButton
          onClick={() => show("rappel", "Une question ? Paul vous répond.", { force: true })}
        />
      )}
      <PaulSheet
        open={sheet.open}
        mode={sheet.mode}
        message={sheet.message}
        knownPhone={phone}
        onClose={sheet.close}
        onContact={onContact}
      />
    </Shell>
  );
}

function Shell({
  exemple,
  mutuelle,
  children,
}: {
  exemple: boolean;
  mutuelle?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div
        className="px-4 py-2 text-center text-[11px] leading-[1.4]"
        style={{
          background: "var(--bg3)",
          color: "var(--text-soft)",
          fontFamily: "var(--font-mono)",
        }}
      >
        Aperçu de l'espace Granit · rien n'est encore connecté à votre portail ni à votre logiciel
      </div>
      <header className="mx-auto flex max-w-[1080px] items-center justify-between px-4 py-4 sm:px-6">
        <a href="/" aria-label="Granit, accueil">
          <img src={logo} alt="Granit" className="h-[24px] w-auto" />
        </a>
        {exemple && (
          <span
            className="rounded-full px-3 py-1 text-[11px]"
            style={{
              background: "var(--tag-bg)",
              color: "var(--text-soft)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Cas d'exemple · {mutuelle ?? "Mutuelle Exemple"}
          </span>
        )}
      </header>
      <main className="mx-auto max-w-[1080px] px-4 pb-40 pt-2 sm:px-6 lg:pt-8">{children}</main>
    </div>
  );
}
