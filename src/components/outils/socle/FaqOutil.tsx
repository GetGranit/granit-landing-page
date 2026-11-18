import { JsonLd } from "@/components/JsonLd";
import { faqPageLd } from "@/lib/seo";
import { TitreSection } from "./Mise";

export type QuestionOutil = { question: string; reponse: string };

/**
 * « Questions fréquentes » : un <details> par question. `jsonLd` ajoute le FAQPage : sur les hubs
 * seulement (pas de FAQ gabarit répétée sur les entrées).
 */
export function FaqOutil({
  items,
  jsonLd = false,
  id = "questions",
}: {
  items: QuestionOutil[];
  jsonLd?: boolean;
  id?: string;
}) {
  if (!items.length) return null;
  return (
    <section aria-labelledby={id} className="mt-12">
      {jsonLd && (
        <JsonLd
          data={[faqPageLd(items.map((i) => ({ question: i.question, answer: i.reponse })))]}
        />
      )}
      <TitreSection id={id}>Questions fréquentes</TitreSection>
      <div className="mt-4">
        {items.map((i) => (
          <details
            key={i.question}
            className="group border-b"
            style={{ borderColor: "var(--filet)" }}
          >
            <summary
              className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 py-3 text-[16px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--profond)] [&::-webkit-details-marker]:hidden"
              style={{ fontWeight: 500 }}
            >
              <span className="min-w-0 break-words">{i.question}</span>
              <span
                aria-hidden
                className="shrink-0 transition-transform group-open:rotate-90"
                style={{ color: "var(--profond)" }}
              >
                ›
              </span>
            </summary>
            <p
              className="pb-4 text-[15px]"
              style={{ lineHeight: 1.55, color: "var(--texte-secondaire)" }}
            >
              {i.reponse}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
