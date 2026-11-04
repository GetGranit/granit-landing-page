/* Nouvelle home : la section Produit (#produit), portage de lm/produit.js, présentation 1 « Démo en calques ».
   Quatre logiciels empilés (AmeliPro, logiciel métier, tiers payant, banque), trois agents qui y travaillent l'un après
   l'autre, puis la pile se referme sous la carte « Payé ». Lue comme une mini-vidéo de 21 s en boucle ; les chapitres se
   cliquent pour y sauter. Rien ne dépend du défilement, tout s'arrête hors écran et quand l'onglet est caché.
   Rendu serveur : la démo posée à sa fin (les quatre fenêtres refermées, « Payé » affiché), avec tous ses textes. */
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useLanguage } from "./socle";
import {
  CH,
  DUR,
  END,
  HOLD,
  POSE,
  SPEC,
  copy,
  etatsA,
  poseCalque,
  smooth,
  type CopieProduit,
  type EtatEl,
} from "./produitDonnees";
import "./produit.css";

const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const LAYER_COLORS = ["var(--sky)", "var(--mint)", "var(--blush)", "var(--deep)"];

/* ---------- le moteur de la démo (client seulement) : reprend draw() de la maquette ---------- */
function lancerDemo(sec: HTMLElement, stage: HTMLElement, c: CopieProduit) {
  const q = (k: string) => stage.querySelector<HTMLElement>(`[data-k="${k}"]`)!;
  const inner = stage.querySelector<HTMLElement>(".lm-pr1-inner")!;
  const layers = Array.from(stage.querySelectorAll<HTMLElement>(".lm-layer"));
  const labels = Array.from(stage.querySelectorAll<HTMLElement>(".lm-lyr"));
  const segs = Array.from(sec.querySelectorAll<HTMLButtonElement>(".lm-segs button"));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = () => window.innerWidth < 861;
  const timers = new Set<number>();
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  };

  /* les éléments dont l'état change, et les curseurs d'agent */
  const keys = Object.keys(etatsA(0, c));
  const els: Record<string, HTMLElement> = {};
  keys.forEach((k) => {
    els[k] = q(k);
  });
  const agents = SPEC.map((sp, i) => {
    const el = stage.querySelector<HTMLElement>(`.lm-agent[data-ag="${i}"]`)!;
    return {
      sp,
      el,
      act: el.querySelector<HTMLElement>(".act")!,
      tag: el.querySelector<HTMLElement>(".tag")!,
      homeEl: q(sp.home),
      wp: sp.wp.map((w) => ({ ...w, el: w.t === "sum" ? q(sp.sum) : q(w.t), m: w.m ?? 0.018 })),
      t: null as string | null,
      s: null as string | null,
      wt: null as string | null,
      tw: 0,
      fl: false,
      mw: "",
    };
  });
  type Ag = (typeof agents)[number];
  const say = (a: Ag, text: string, state: string) => {
    if (a.t !== text) {
      a.t = text;
      a.act.textContent = text;
    }
    if (a.s !== state) {
      a.s = state;
      a.el.classList.toggle("idle", state === "idle");
      a.el.classList.toggle("fin", state === "fin");
    }
  };
  const click = (a: Ag) => {
    a.el.classList.remove("click");
    void a.el.offsetWidth;
    a.el.classList.add("click");
    later(() => a.el.classList.remove("click"), 600);
  };
  /* la bulle passe à gauche du curseur quand elle déborderait à droite */
  const fit = (a: Ag, x: number, limL: number, limR: number) => {
    if (a.wt !== a.t) {
      a.wt = a.t;
      a.el.style.removeProperty("--mw");
      a.mw = "";
      a.tw = a.tag.offsetWidth;
    }
    const roomR = limR - (x + 20),
      roomL = x - 6 - limL;
    let on: boolean,
      mw = "";
    if (a.tw <= roomR) on = false;
    else if (a.tw <= roomL) on = true;
    else {
      on = roomL > roomR;
      mw = Math.max(110, Math.floor(on ? roomL : roomR)) + "px";
    }
    if (on !== a.fl) {
      a.fl = on;
      a.el.classList.toggle("flip", on);
    }
    if (mw !== a.mw) {
      a.mw = mw;
      if (mw) a.el.style.setProperty("--mw", mw);
      else a.el.style.removeProperty("--mw");
    }
  };
  const press = (el: HTMLElement) => {
    el.classList.add("press");
    later(() => el.classList.remove("press"), 240);
  };
  const center = (el: Element, ref: DOMRect) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2 - ref.left, y: r.top + r.height / 2 - ref.top };
  };

  const S = {
    p: reduce ? END : 0,
    ps: reduce ? END : 0,
    prev: 0,
    playing: !reduce,
    hold: 0,
    drawn: -1,
  };
  let now = performance.now();

  const applyStates = (p: number) => {
    const st = etatsA(p, c);
    for (const k of keys) {
      const e: EtatEl = st[k],
        el = els[k];
      if (e.t != null && el.textContent !== e.t) el.textContent = e.t;
      for (const n in e.cls) el.classList.toggle(n, e.cls[n]);
    }
  };

  function draw(dt: number, force = false) {
    /* à l'arrêt, rien à redessiner tant que rien ne bouge */
    if (!force && !S.playing && S.ps === S.p && S.drawn === S.p) return;
    S.drawn = S.p;
    /* le temps fait avancer la démo : 21 s du début à « Payé », une pause, puis on recommence */
    if (S.playing) {
      if (S.p < END) S.p = Math.min(END, S.p + dt / DUR);
      else {
        S.hold += dt;
        if (S.hold > HOLD) {
          S.hold = 0;
          S.p = 0;
          S.ps = 0;
          S.prev = 0;
        }
      }
    }
    S.ps = Math.abs(S.p - S.ps) > 0.02 ? lerp(S.ps, S.p, Math.min(1, dt * 0.008)) : S.p;
    const p = S.ps,
      P = mobile() ? POSE.m : POSE.d;
    const k = Math.min(stage.clientWidth / P.W, stage.clientHeight / P.H);
    inner.style.width = P.W + "px";
    inner.style.height = P.H + "px";
    inner.style.transform = `translate(-50%,-50%) scale(${k.toFixed(4)})`;
    const lop: number[] = [];
    layers.forEach((L, i) => {
      const ps = poseCalque(i, p, P);
      L.style.transform = ps.transform;
      L.style.opacity = ps.op.toFixed(3);
      lop[i] = ps.op;
      L.style.zIndex = String(ps.z);
      L.style.setProperty("--dim", ps.dim.toFixed(3));
    });
    const ref = stage.getBoundingClientRect();
    labels.forEach((lb, i) => {
      const r = layers[i].getBoundingClientRect(),
        vis = clamp((p - 0.02 - i * 0.011) / 0.03) * (1 - smooth(0.062, 0.082, p));
      lb.style.transform = `translate(${(r.right - ref.left - r.width * 0.16).toFixed(1)}px,${(r.top - ref.top + r.height * 0.5 - 6).toFixed(1)}px)`;
      lb.style.opacity = vis.toFixed(3);
    });
    applyStates(p);
    agents.forEach((a, ai) => {
      const wp = a.wp;
      let last: (typeof wp)[number] | null = null,
        next: (typeof wp)[number] | null = null;
      for (const w of wp) {
        if (w.p <= p) last = w;
        else {
          next = w;
          break;
        }
      }
      const home = center(a.homeEl, ref),
        at = (w: (typeof wp)[number]) => center(w.el, ref);
      let pos = home,
        state = "idle",
        text = "";
      const moving = !!next && p > next.p - next.m;
      const f = next ? (p - (next.p - next.m)) / next.m : 0;
      if (!last) {
        if (next && moving) {
          const b0 = at(next);
          pos = {
            x: lerp(home.x, b0.x, ease(f)),
            y: lerp(home.y, b0.y, ease(f)) - Math.sin(f * Math.PI) * 26,
          };
          text = next.act ? c.actions[next.act] : "";
          state = "run";
        }
      } else {
        const P0 = at(last);
        pos = P0;
        text = last.act ? c.actions[last.act] : "";
        state = last.fin ? "fin" : "run";
        if (next && moving) {
          const B = at(next);
          pos = {
            x: lerp(P0.x, B.x, ease(f)),
            y: lerp(P0.y, B.y, ease(f)) - Math.sin(f * Math.PI) * 26,
          };
          text = next.act ? c.actions[next.act] : "";
          state = next.fin && f > 0.9 ? "fin" : "run";
        }
      }
      let vis = 0;
      a.sp.vis.forEach((v) => {
        vis = Math.max(
          vis,
          smooth(v[0], v[0] + 0.015, p) * (v[1] > 1 ? 1 : 1 - smooth(v[1] - 0.012, v[1], p)),
        );
      });
      const onL = (w: (typeof wp)[number]) => {
        const L = w.el.closest<HTMLElement>(".lm-layer");
        return L ? lop[+(L.dataset.l ?? 0)] : 1;
      };
      if (last) vis *= next && moving ? lerp(onL(last), onL(next), clamp(f)) : onL(last);
      const resting = state !== "run",
        bob = reduce ? 0 : 1;
      pos = {
        x: pos.x + Math.sin(now / 700 + ai * 2) * (resting ? 4 : 1.2) * bob,
        y: pos.y + Math.cos(now / 830 + ai) * (resting ? 3 : 1) * bob + (1 - vis) * 14,
      };
      a.el.style.transform = `translate3d(${pos.x.toFixed(1)}px,${pos.y.toFixed(1)}px,0)`;
      a.el.style.opacity = vis.toFixed(3);
      a.el.style.visibility = vis < 0.01 ? "hidden" : "";
      say(a, state === "idle" ? "" : text, state);
      fit(
        a,
        pos.x,
        mobile() ? 8 - ref.left : 0,
        ref.width + Math.max(0, window.innerWidth - ref.right - 14),
      );
      wp.forEach((w) => {
        if (w.click && S.prev < w.p && p >= w.p) {
          click(a);
          if (w.el.tagName === "BUTTON") press(w.el);
        }
      });
    });
    segs.forEach((sg, i) =>
      sg.style.setProperty("--f", clamp((p - CH[i][0]) / (CH[i][1] - CH[i][0])).toFixed(3)),
    );
    S.prev = p;
  }

  /* la boucle : seulement quand la section est à l'écran et l'onglet visible */
  let raf = 0,
    lastT = performance.now(),
    vis = false;
  const loop = (t: number) => {
    raf = 0;
    const dt = Math.min(100, t - lastT);
    lastT = t;
    now = t;
    if (!vis || document.hidden) return;
    draw(dt);
    raf = requestAnimationFrame(loop);
  };
  const kick = () => {
    if (!raf && vis && !document.hidden) {
      lastT = performance.now();
      raf = requestAnimationFrame(loop);
    }
  };
  const io = new IntersectionObserver(
    (es) => {
      vis = es[es.length - 1].isIntersecting;
      kick();
    },
    { threshold: 0.08 },
  );
  io.observe(sec);
  const onResize = () => draw(0, true);
  document.addEventListener("visibilitychange", kick);
  window.addEventListener("resize", onResize);
  /* un chapitre se clique pour y sauter, et la démo repart */
  const onSeg = segs.map((b, i) => {
    const fn = () => {
      S.p = CH[i][0] + 0.002;
      S.hold = 0;
      if (S.p < S.ps) S.prev = S.p;
      S.playing = true;
      kick();
    };
    b.addEventListener("click", fn);
    return fn;
  });
  draw(0, true);

  return () => {
    if (raf) cancelAnimationFrame(raf);
    io.disconnect();
    document.removeEventListener("visibilitychange", kick);
    window.removeEventListener("resize", onResize);
    segs.forEach((b, i) => b.removeEventListener("click", onSeg[i]));
    timers.forEach((id) => window.clearTimeout(id));
  };
}

/* ---------- la scène : quatre fenêtres, la carte « Payé », les curseurs d'agent ---------- */
const SPIN_LINES = [0, 1, 2, 3, 4, 5, 6, 7];

function Scene({ c }: { c: CopieProduit }) {
  /* rendu à la fin de la démo : c'est l'état lisible sans JavaScript */
  const fin = etatsA(END, c);
  const cl = (k: string, base: string) =>
    [
      base,
      ...Object.entries(fin[k]?.cls ?? {})
        .filter(([, on]) => on)
        .map(([n]) => n),
    ]
      .filter(Boolean)
      .join(" ");
  const tx = (k: string) => fin[k]?.t ?? "";
  const L = (i: number, children: ReactNode, home?: string) => {
    const ps = poseCalque(i, END, POSE.d);
    const style = {
      "--lc": LAYER_COLORS[i],
      transform: ps.transform,
      opacity: ps.op,
      zIndex: ps.z,
      "--dim": ps.dim.toFixed(3),
    } as CSSProperties;
    return (
      <div className="lm-layer" data-l={i} style={style}>
        <div className="lm-win">{children}</div>
        {home && (
          <span
            className="lm-home"
            data-k={`home${Math.min(i + 1, 3)}`}
            style={{ left: home, top: "-34px" }}
          />
        )}
      </div>
    );
  };
  const bar = (nom: string, cr: string) => (
    <div className="lm-wbar">
      <span className="ic" />
      <b>{nom}</b>
      <span className="cr">{cr}</span>
    </div>
  );
  return (
    <div className="lm-pr1-inner">
      {L(
        0,
        <>
          {bar(c.calques[0], c.ameli.cr)}
          <div className="lm-wbody">
            <div className="lm-tabs">
              {c.ameli.onglets.map((o, i) => (
                <span key={o} className={i === 0 ? "on" : undefined}>
                  {o}
                </span>
              ))}
            </div>
            <div className="lm-frm">
              <label>{c.ameli.label}</label>
              <div className="fr">
                <div className={cl("nir", "lm-field")} data-k="nir">
                  <span className="lm-typed" data-k="nir-typed">
                    {tx("nir-typed")}
                  </span>
                </div>
                <button className="lm-b" data-k="b-droits" type="button" tabIndex={-1}>
                  {c.ameli.consulter}
                </button>
              </div>
            </div>
            <div className={cl("res-amo", "lm-res")} data-k="res-amo">
              <span>{c.ameli.amo}</span>
              <span className="lm-st ok">{c.ameli.amoOk}</span>
            </div>
            <div className={cl("res-amc", "lm-res")} data-k="res-amc">
              <span data-k="res-amc-l">{c.ameli.amc}</span>
              <span className="lm-st ok">{c.ameli.amcOk}</span>
            </div>
          </div>
        </>,
        "30%",
      )}
      {L(
        1,
        <>
          {bar(c.metier.nom, c.metier.cr)}
          <div className="lm-wbody">
            <div className={cl("notes", "lm-notes")} data-k="notes">
              <span>{c.metier.notes}</span>
              <i />
              <i />
              <i className="s" />
            </div>
            <div className="lm-line">
              <span className="lbl">{c.metier.cotation}</span>
              <span className={cl("codes", "lm-codes")} data-k="codes">
                <em>{c.metier.actes[0]}</em>
                <em>{c.metier.actes[1]}</em>
              </span>
              <button className="lm-b" data-k="b-coter" type="button" tabIndex={-1}>
                {tx("b-coter")}
              </button>
            </div>
            <div className="lm-line">
              <span className="lbl" data-k="l-fse">
                {c.metier.fse}
              </span>
              <span className={cl("st-fse", "lm-st")} data-k="st-fse">
                {tx("st-fse")}
              </span>
              <button className="lm-b" data-k="b-tele" type="button" tabIndex={-1}>
                {tx("b-tele")}
              </button>
            </div>
          </div>
        </>,
        "56%",
      )}
      {L(
        2,
        <>
          {bar(c.tp.nom, c.tp.cr)}
          <div className="lm-wbody">
            <div className="ph">{c.tp.demande}</div>
            <div className="lm-line">
              <span className="lbl">{c.tp.pieces}</span>
              <span className="lm-att" data-k="att">
                <em className={cl("att1", "")} data-k="att1">
                  {c.tp.fichiers[0]}
                </em>
                <em className={cl("att2", "")} data-k="att2">
                  {c.tp.fichiers[1]}
                </em>
              </span>
            </div>
            <div className="lm-line">
              <span className="lbl">{c.tp.montant}</span>
              <div className={cl("mt", "lm-field sm")} data-k="mt">
                <span className="lm-typed" data-k="mt-typed">
                  {tx("mt-typed")}
                </span>
              </div>
              <button className="lm-b" data-k="b-env" type="button" tabIndex={-1}>
                {tx("b-env")}
              </button>
            </div>
            <div className={cl("res-acc", "lm-res")} data-k="res-acc">
              <span data-k="res-acc-l">{c.tp.reponse}</span>
              <span className="lm-st ok">{c.tp.accord}</span>
            </div>
          </div>
        </>,
      )}
      {L(
        3,
        <>
          {bar(c.banque.nom, c.banque.cr)}
          <div className="lm-wbody">
            <div className="lm-tbl">
              <div className="tr th">
                <span>{c.banque.libelle}</span>
                <span>{c.banque.montantCol}</span>
                <span />
              </div>
              {c.banque.lignes.map(([lib, mt], i) => {
                const k = `tr${i + 1}`;
                return (
                  <div key={k} className={cl(k, "tr")} data-k={k}>
                    <span data-k={i === 2 ? "tr3-l" : undefined}>{lib}</span>
                    <span>{mt}</span>
                    <span className={cl(`${k}-st`, "lm-st")} data-k={`${k}-st`}>
                      {tx(`${k}-st`)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>,
        "62%",
      )}
      <div className={cl("sum", "lm-sum")} data-k="sum">
        <div className="sk">{c.bilan.dossier}</div>
        <div className="sbig">
          {c.bilan.paye}
          <span>.</span>
        </div>
        <div className="ssub">{c.bilan.sous}</div>
        <ol>
          {c.bilan.etapes.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ol>
        <span className="sa" data-k="sum1" style={{ left: "-20px", bottom: "-30px" }} />
        <span className="sa" data-k="sum2" style={{ left: "118px", bottom: "-30px" }} />
        <span className="sa" data-k="sum3" style={{ left: "272px", bottom: "-30px" }} />
      </div>
    </div>
  );
}

export function ProduitNouvelle() {
  const { lang } = useLanguage();
  const c = copy[lang];
  const secRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = secRef.current,
      stage = stageRef.current;
    if (!sec || !stage) return;
    return lancerDemo(sec, stage, c);
  }, [c]);

  return (
    <section className="lm-sec lm-light lm-pr" id="produit" aria-labelledby="lm-pr-t" ref={secRef}>
      <div className="lm-wrap">
        {/* key={lang} : la démo écrit dans le DOM, on la remonte quand la langue change */}
        <div className="lm-pr1" key={lang}>
          <div className="lm-pr1-side">
            <div className="lm-pr-head">
              <span className="lm-eb">{c.eb}</span>
              <h2 className="lm-h2" id="lm-pr-t">
                {c.titre[0]}
                <br /> {c.titre[1]}
              </h2>
              <p className="lm-lead">{c.texte}</p>
            </div>
            {/* les légendes de chapitre sont retirées (revue du 30 oct.) : la barre de progression suffit */}
            <div className="lm-player">
              <div className="lm-segs" role="group" aria-label={c.chapitres.groupe}>
                {c.chapitres.titres.map((t, i) => (
                  <button
                    key={t}
                    type="button"
                    aria-label={c.chapitres.nom(i, t)}
                    style={{ "--f": 1 } as CSSProperties}
                  >
                    <i />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="lm-pr1-stage" ref={stageRef} role="img" aria-label={c.scene}>
            <Scene c={c} />
            <div className="lm-pr1-over">
              {c.calques.map((n, i) => (
                <span key={n} className="lm-lyr">
                  {String(i + 1).padStart(2, "0")} <b>{n}</b>
                </span>
              ))}
              {SPEC.map((sp, i) => (
                <div
                  key={i}
                  className="lm-agent idle"
                  data-ag={i}
                  aria-hidden="true"
                  style={{ "--ac": sp.color, visibility: "hidden", opacity: 0 } as CSSProperties}
                >
                  <span className="ring" />
                  <svg className="ptr" viewBox="0 0 22 24">
                    <path d="M1 1l17 9.6-7.4 1.7L6.6 19.6z" />
                  </svg>
                  <span className="tag">
                    <span className="spin">
                      <svg viewBox="0 0 16 16">
                        {SPIN_LINES.map((j) => (
                          <line
                            key={j}
                            x1="8"
                            y1="1.8"
                            x2="8"
                            y2="4.6"
                            transform={`rotate(${j * 45} 8 8)`}
                            opacity={(0.25 + j * 0.107).toFixed(2)}
                          />
                        ))}
                      </svg>
                    </span>
                    <span className="okk">✓</span>
                    <span className="who">{c.agents[i]}</span>
                    <span className="act" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
