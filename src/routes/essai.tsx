import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";

import { Acces } from "@/components/essai/Acces";
import { DemandePec, type Demande } from "@/components/essai/DemandePec";
import { MesDemandes, PaulButton } from "@/components/essai/Espace";
import { Logiciel } from "@/components/essai/Logiciel";
import { PaulSheet, usePaulSheet } from "@/components/essai/PaulSheet";
import { PremierePec } from "@/components/essai/PremierePec";
import { EtapePec } from "@/components/essai/Quota";
import { QUOTA, readQuota, writeQuota } from "@/components/essai/quotaStore";
import { Shell } from "@/components/essai/Shell";
import { Kicker } from "@/components/essai/ui";
import {
  EXAMPLE_CASE,
  EXAMPLE_SIMULATION,
  contactPaul,
  readCase,
  readPhone,
  type ContactRequest,
  type DossierFictif,
  type PecCase,
} from "@/lib/pec/essaiState";

/**
 * Espace freemium Granit (aperçu, tout est simulé côté front).
 * On y arrive depuis /pec (`/essai?etape=acces`) juste après la simulation et
 * la création du compte, avec le cas dans sessionStorage. Parcours : 1) brancher
 * ses autres portails, 2) faire ses 20 PEC offertes, 3) continuer avec Paul.
 * Hors navigation, hors sitemap, noindex.
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
const OFFRE = "Paul vous propose l'offre adaptée à votre magasin.";

function EssaiPage() {
  const reduce = useReducedMotion();
  const [pecCase, setPecCase] = useState<PecCase | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [view, setView] = useState<"espace" | "demande">("espace");
  const [selection, setSelection] = useState<ReadonlySet<string>>(new Set());
  const [connectes, setConnectes] = useState<ReadonlySet<string>>(new Set());
  const [choixFait, setChoixFait] = useState(false);
  const [celebrer, setCelebrer] = useState(false);
  const [logiciel, setLogiciel] = useState<string | null>(null);
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [courante, setCourante] = useState<number | null>(null);
  const [faites, setFaites] = useState(0);
  const timers = useRef<number[]>([]);
  const sheet = usePaulSheet();

  // sessionStorage et l'URL n'existent que côté navigateur : lecture après le montage.
  useEffect(() => {
    setPecCase(readCase() ?? EXAMPLE_CASE);
    setPhone(readPhone());
    const n = readQuota();
    setFaites(n);
    // Des PEC déjà faites : les accès l'ont forcément été.
    if (n > 0) setChoixFait(true);
    if (new URLSearchParams(window.location.search).get("etape") === "acces") {
      window.setTimeout(() => document.getElementById("acces")?.scrollIntoView(), 80);
    }
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const premierRendu = useRef(true);
  useEffect(() => {
    // Au montage, on laisse `?etape=acces` placer la page.
    if (premierRendu.current) {
      premierRendu.current = false;
      return;
    }
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
  const cochés = [...selection].filter((id) => id !== carte?.id);
  const restants = cochés.filter((id) => !connectes.has(id)).length;
  const toutBranche = choixFait && restants === 0;
  const nom = pecCase.prenom ?? pecCase.magasin;
  const portail = carte?.label ?? null;

  async function onContact(req: ContactRequest) {
    if (!pecCase) return;
    await contactPaul(req, pecCase);
    if (req.phone) setPhone(req.phone);
  }

  function toggle(id: string) {
    setSelection((s) => {
      const next = new Set(s);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  }

  function connect(id: string) {
    const next = new Set(connectes).add(id);
    setConnectes(next);
    if (cochés.every((c) => next.has(c))) setCelebrer(true);
  }

  function launch(dossier: DossierFictif) {
    if (faites >= QUOTA) return;
    const index = demandes.length;
    const rang = faites + 1;
    setFaites(rang);
    writeQuota(rang);
    setDemandes((ds) => [...ds, { dossier, statut: "en-cours", rang }]);
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

  function openDemande(index: number | null) {
    setCelebrer(false);
    setCourante(index);
    setView("demande");
  }

  function backToEspace(anchor?: string) {
    setView("espace");
    setCourante(null);
    if (anchor) {
      window.setTimeout(() => document.getElementById(anchor)?.scrollIntoView(), 50);
    }
  }

  return (
    <Shell exemple={pecCase.source === "exemple"} mutuelle={pecCase.mutuelle} faites={faites}>
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
            onChooseLogiciel={() => backToEspace("logiciel-titre")}
            onBack={() => backToEspace("pec")}
          />
        </motion.div>
      ) : (
        <div className="mx-auto max-w-[640px]">
          <Kicker>Votre espace Granit</Kicker>
          <h1
            className="font-serif text-text"
            style={{
              fontSize: "clamp(30px, 5vw, 44px)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}
          >
            Bienvenue{nom ? `, ${nom}` : ""}.{" "}
            <span className="accent-italic">Votre compte est prêt.</span>
          </h1>
          <p className="mb-6 mt-3 text-[15px] leading-[1.5]" style={{ color: "var(--text-soft)" }}>
            {toutBranche
              ? "Vos portails sont branchés : vos PEC partent d'ici."
              : "Branchez vos autres portails, puis faites vos PEC d'ici."}
            {pecCase.compte && (
              <span className="mt-1 block text-[12px]" style={{ color: "var(--text-muted)" }}>
                Compte gratuit · {pecCase.compte.email}
              </span>
            )}
          </p>
          <PremierePec
            simulation={simulation}
            portail={portail}
            mutuelle={pecCase.mutuelle}
            minutesManuelles={pecCase.minutesManuelles}
          />

          <div className="mt-10">
            <Acces
              carte={carte}
              selection={selection}
              onToggle={toggle}
              choixFait={choixFait}
              onValider={() => {
                setChoixFait(true);
                if (restants === 0) setCelebrer(true);
              }}
              onModifier={() => {
                setChoixFait(false);
                setCelebrer(false);
              }}
              connectes={connectes}
              onConnect={connect}
              onIdle={onIdle}
              celebrer={celebrer}
            />
          </div>

          <EtapePec
            faites={faites}
            toutBranche={toutBranche}
            choixFait={choixFait}
            restants={restants}
            minutesManuelles={pecCase.minutesManuelles}
            dureeSec={simulation.dureeSec}
            onDemande={() => openDemande(null)}
            onPaul={(mode) => show(mode, OFFRE, { force: true })}
          >
            <MesDemandes demandes={demandes} onOpen={openDemande} />
          </EtapePec>

          <Logiciel logiciel={logiciel} onLogiciel={setLogiciel} onIdle={onIdle} />
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
