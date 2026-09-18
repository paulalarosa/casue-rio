export function Dados({ children }: { children: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(children).replace(/</g, "<"),
      }}
    />
  );
}
