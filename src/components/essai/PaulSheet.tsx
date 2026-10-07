import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import {
  markPaulSheetShown,
  paulSheetAlreadyShown,
  type ContactRequest,
} from "@/lib/pec/essaiState";
import { inputClass } from "./ui";

/**
 * Bandeau « en parler avec Paul » : bottom sheet NON bloquante (pas de fond
 * opaque, la page reste utilisable), réutilisable sur /pec.
 *
 * - mode "rappel"  → champ téléphone (1 tap si le numéro est déjà connu)
 * - mode "creneau" → bouton « Choisir un créneau »
 * Les deux appellent `onContact({ type, phone? })` : c'est l'appelant qui
 * envoie le lead (ou ouvre l'agenda).
 */

export type PaulSheetMode = ContactRequest["type"];

export type PaulSheetProps = {
  open: boolean;
  mode: PaulSheetMode;
  onClose: () => void;
  onContact: (req: ContactRequest) => void | Promise<void>;
  /** Numéro déjà connu : le rappel se fait en un tap. */
  knownPhone?: string | null;
  /** Phrase de contexte, selon le moment du parcours. */
  message?: string;
};

const PHONE_RE = /^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/;

export function PaulSheet({ open, mode, onClose, onContact, knownPhone, message }: PaulSheetProps) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          role="dialog"
          aria-modal="false"
          aria-label="En parler avec Paul"
          initial={reduce ? { opacity: 0 } : { y: "110%" }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: "110%" }}
          transition={{ type: "spring", stiffness: 320, damping: 34 }}
          className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[520px] px-3 pb-3"
        >
          <div
            className="rounded-[22px] border bg-white p-5"
            style={{
              borderColor: "var(--border)",
              boxShadow: "0 -10px 40px -12px rgba(28,17,8,0.25)",
            }}
          >
            {/* key : remet le formulaire à zéro à chaque ouverture */}
            <SheetBody
              key={`${mode}-${message ?? ""}`}
              mode={mode}
              onClose={onClose}
              onContact={onContact}
              knownPhone={knownPhone}
              message={message}
            />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function SheetBody({
  mode,
  onClose,
  onContact,
  knownPhone,
  message,
}: Omit<PaulSheetProps, "open">) {
  const [phone, setPhone] = useState("");
  const [editPhone, setEditPhone] = useState(!knownPhone);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [invalid, setInvalid] = useState(false);

  async function send(req: ContactRequest) {
    setStatus("sending");
    try {
      await onContact(req);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  function submitRappel() {
    const value = editPhone ? phone.trim() : (knownPhone ?? "");
    if (!PHONE_RE.test(value)) {
      setInvalid(true);
      return;
    }
    void send({ type: "rappel", phone: value });
  }

  return (
    <>
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-serif text-[20px] text-white"
          style={{ background: "var(--gradient-terra)" }}
        >
          P
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px]" style={{ fontWeight: 600 }}>
            Paul, de l'équipe Granit
          </p>
          <p className="mt-0.5 text-[14px] leading-[1.45]" style={{ color: "var(--text-soft)" }}>
            {status === "done"
              ? mode === "rappel"
                ? "C'est noté. Paul vous rappelle dans la journée."
                : "C'est noté. Paul revient vers vous avec ses créneaux."
              : (message ?? "Une question ? On peut le faire ensemble, au téléphone.")}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="-mr-1 -mt-1 rounded-full p-2 text-[18px] leading-none"
          style={{ color: "var(--text-muted)" }}
        >
          ×
        </button>
      </div>

      {status !== "done" && mode === "rappel" && (
        <div className="mt-4">
          {editPhone ? (
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="06 12 34 56 78"
              aria-label="Votre numéro de téléphone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setInvalid(false);
              }}
              className={inputClass}
              style={{ borderColor: invalid ? "var(--terra)" : "var(--border)" }}
            />
          ) : (
            <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
              Au {knownPhone} ·{" "}
              <button type="button" className="underline" onClick={() => setEditPhone(true)}>
                autre numéro
              </button>
            </p>
          )}
          {invalid && (
            <p className="mt-1.5 text-[12px]" style={{ color: "var(--terra-hover)" }}>
              Ce numéro ne semble pas complet.
            </p>
          )}
          <button
            type="button"
            onClick={submitRappel}
            disabled={status === "sending"}
            className="btn-primary mt-3 w-full justify-center py-3 text-[15px]"
          >
            {status === "sending" ? "Envoi…" : "Rappelez-moi"}
          </button>
        </div>
      )}

      {status !== "done" && mode === "creneau" && (
        <button
          type="button"
          onClick={() => void send({ type: "creneau", phone: knownPhone ?? undefined })}
          disabled={status === "sending"}
          className="btn-primary mt-4 w-full justify-center py-3 text-[15px]"
        >
          {status === "sending" ? "Envoi…" : "Choisir un créneau"}
        </button>
      )}

      {status === "error" && (
        <p className="mt-2 text-center text-[12px]" style={{ color: "var(--terra-hover)" }}>
          Ça n'est pas parti. Réessayez dans un instant.
        </p>
      )}
    </>
  );
}

/**
 * Pilotage du bandeau. `show()` sans `force` (déclencheur automatique) ne
 * l'ouvre qu'une fois par session ; `force: true` pour un clic explicite.
 */
export function usePaulSheet() {
  const [state, setState] = useState<{ open: boolean; mode: PaulSheetMode; message?: string }>({
    open: false,
    mode: "creneau",
  });

  const show = useCallback((mode: PaulSheetMode, message?: string, opts?: { force?: boolean }) => {
    if (!opts?.force && paulSheetAlreadyShown()) return;
    markPaulSheetShown();
    setState({ open: true, mode, message });
  }, []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  return { ...state, show, close };
}
