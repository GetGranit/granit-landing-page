/* Pied de page : le logo en très grand, en filigrane. Au survol, les pierres oscillent doucement,
   puis la clé de voûte s'allume et verrouille les autres. Tracés lus dans logo-light.svg : on ne redessine jamais le logo. */
import { useRef, useState } from "react";
import brut from "@/assets/logo-light.svg?raw";
import { useReducedMotion } from "@/components/home/nouvelle/socle";
import "./grand-logo.css";

const viewBox = /viewBox="([^"]+)"/.exec(brut)?.[1];
const [groupePierres, groupeNom] = [...brut.matchAll(/<g transform="([^"]+)"[^>]*>([\s\S]*?)<\/g>/g)];
const pierres = [...groupePierres[2].matchAll(/<path transform="([^"]+)" d="([^"]+)"/g)].map((m) => ({
  transform: m[1],
  d: m[2],
}));
const lettres = [...groupeNom[2].matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);
const trait = /stroke-width="([^"]+)"/.exec(brut)?.[1];
/* la pierre carrée, au centre */
const CLE_DE_VOUTE = 2;

export function GrandLogo() {
  const rm = useReducedMotion();
  const [etat, setEtat] = useState<"" | "quake" | "lock">("");
  const tm = useRef(0);
  const on = useRef(false);
  const enter = () => {
    if (on.current) return;
    on.current = true;
    window.clearTimeout(tm.current);
    if (rm) {
      setEtat("lock");
      return;
    }
    setEtat("quake");
    tm.current = window.setTimeout(() => setEtat("lock"), 1050);
  };
  const leave = () => {
    on.current = false;
    window.clearTimeout(tm.current);
    tm.current = window.setTimeout(() => setEtat(""), 900);
  };
  return (
    <div className="grand-logo" aria-hidden="true">
      <svg
        viewBox={viewBox}
        className={etat || undefined}
        onPointerEnter={enter}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") leave();
        }}
        onPointerDown={(e) => {
          /* au toucher : la même séquence, puis le logo se rendort */
          if (e.pointerType !== "mouse") {
            enter();
            window.setTimeout(leave, 1800);
          }
        }}
      >
        <g transform={groupePierres[1]}>
          {pierres.map((p, k) => {
            /* chaque pierre a sa propre oscillation, en unités du logo : discrète, elle s'amortit */
            const qx = (k % 2 ? 1 : -1) * (0.9 + (k % 3) * 0.3);
            const qy = 0.7 + ((k + 1) % 3) * 0.25;
            const qr = (k % 2 ? -1 : 1) * (0.9 + k * 0.2);
            return (
              <g key={k} transform={p.transform}>
                <path
                  d={p.d}
                  strokeWidth={trait}
                  className={"pierre" + (k === CLE_DE_VOUTE ? " key" : "")}
                  style={{
                    ["--k" as string]: k,
                    ["--qx" as string]: qx.toFixed(1) + "px",
                    ["--qy" as string]: qy.toFixed(1) + "px",
                    ["--qr" as string]: qr.toFixed(1) + "deg",
                  }}
                />
              </g>
            );
          })}
        </g>
        <g transform={groupeNom[1]}>
          {lettres.map((d, i) => (
            <path key={i} className="nom" d={d} />
          ))}
        </g>
      </svg>
    </div>
  );
}
