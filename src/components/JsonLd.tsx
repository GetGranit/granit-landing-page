/** Blocs JSON-LD d'une page (le <script> est valide n'importe où dans le document). */
export function JsonLd({ data }: { data: object[] }) {
  return (
    <>
      {data.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
    </>
  );
}
