import { useState } from "react";

import { Kicker, Muted, Reassure, Screen, TextLink, Title, bigBtn } from "./ui";

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const CALCOM = import.meta.env.VITE_PEC_CALCOM_URL || "/#demo";

/**
 * « En parler avec Paul » en pleine page : quand le portail n'est pas encore
 * simulable, que la mutuelle est inconnue, ou que l'opticien préfère être
 * accompagné. Rappel par défaut (on garde l'élan), créneau en second.
 */
export function StepContact({
  title,
  intro,
  email: initialEmail,
  onSubmit,
  onBack,
  busy,
}: {
  title: string;
  intro: string;
  email?: string;
  onSubmit: (v: { prenom: string; phone: string; email: string }) => void;
  onBack?: () => void;
  busy: boolean;
}) {
  const [prenom, setPrenom] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(initialEmail ?? "");
  const [err, setErr] = useState("");
  const field = "w-full rounded-xl border-[1.5px] bg-white px-4 py-3 text-[17px] outline-none focus:border-[var(--terra)]";
  const fieldStyle = { borderColor: "var(--border2)", color: "var(--text)" };

  return (
    <Screen id="contact">
      <div className="grid h-16 w-16 place-items-center rounded-full font-serif text-[26px] text-white" style={{ background: "var(--gradient-terra)" }} aria-hidden>
        P
      </div>
      <Kicker>Paul, chez Granit</Kicker>
      <Title>{title}</Title>
      <Muted>{intro}</Muted>
      <form
        noValidate
        className="grid w-full gap-3 text-left"
        onSubmit={(e) => {
          e.preventDefault();
          if (phone.replace(/\D/g, "").length < 9) return setErr("Indiquez un numéro où Paul peut vous joindre.");
          if (!emailRe.test(email.trim())) return setErr("Indiquez un e-mail valide.");
          setErr("");
          onSubmit({ prenom: prenom.trim(), phone: phone.trim(), email: email.trim() });
        }}
      >
        <input className={field} style={fieldStyle} placeholder="Prénom" autoComplete="given-name" value={prenom} onChange={(e) => setPrenom(e.target.value)} aria-label="Prénom" />
        <input className={field} style={fieldStyle} placeholder="06 12 34 56 78" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} aria-label="Téléphone" />
        <input className={field} style={fieldStyle} placeholder="contact@votre-magasin.fr" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="E-mail" />
        {err && <p role="alert" className="text-[14px]" style={{ color: "var(--terra-hover)" }}>{err}</p>}
        <button type="submit" disabled={busy} className={`${bigBtn} w-full disabled:opacity-60`}>
          {busy ? "Un instant…" : <>Paul me rappelle <span className="arrow">→</span></>}
        </button>
      </form>
      <a href={CALCOM} target="_blank" rel="noopener noreferrer" className="text-[15px] underline underline-offset-4" style={{ color: "var(--text-soft)" }}>
        Je préfère choisir un créneau de 15 min
      </a>
      <Reassure items={["Rappel le jour même (9h-19h)", "Pas de démarchage ensuite"]} />
      {onBack && <TextLink onClick={onBack}>← Retour</TextLink>}
    </Screen>
  );
}

export function StepThanks({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Screen id="thanks">
      <Kicker>C'est noté</Kicker>
      <Title>{title}</Title>
      {children}
      <a href={CALCOM} target="_blank" rel="noopener noreferrer" className={bigBtn}>
        Choisir un créneau maintenant <span className="arrow">→</span>
      </a>
    </Screen>
  );
}
