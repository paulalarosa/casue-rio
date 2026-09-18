/* A placa esmaltada com o ê, a mesma do site.

   🔴 Os números SÃO a construção do LEIA-ME do pacote de vetores, com o lado
   da placa valendo 1 e multiplicado por cem: raio externo 0,173, filete com
   recuo 0,1065 e espessura 0,02, ê de corpo 0,413 centrado. Não foi
   desenhado por cima de PNG, e mexer em qualquer número é mexer na marca.

   🔴 Esta é uma CÓPIA da que vive em `web/src/components/placa.tsx`, e a
   duplicação é deliberada: o painel e o site são dois aplicativos separados,
   sem código em comum, e um pacote compartilhado para 40 linhas de SVG
   custaria mais manutenção do que resolve. Se a marca mudar, muda nos dois.
   Está anotado nos dois lados. */
const E_CIRCUNFLEXO =
  "M50.97 63.46Q46.69 63.46 43.32 61.89Q39.96 60.32 38.01 57.49Q36.07 54.66 36.07 50.91Q36.07 47.20 37.94 44.42Q39.80 41.63 43.05 40.07Q46.29 38.51 50.39 38.51Q54.61 38.51 57.62 40.34Q60.62 42.17 62.24 45.51Q63.86 48.85 63.86 53.40H42.91V48.32H59.12L56.36 50.09Q56.21 48.30 55.46 47.04Q54.72 45.79 53.49 45.12Q52.27 44.46 50.59 44.46Q48.73 44.46 47.39 45.20Q46.06 45.94 45.33 47.24Q44.60 48.55 44.60 50.26Q44.60 52.49 45.60 54.05Q46.61 55.62 48.56 56.44Q50.52 57.27 53.37 57.27Q55.98 57.27 58.57 56.58Q61.15 55.90 63.25 54.64V60.01Q60.80 61.66 57.70 62.56Q54.60 63.46 50.97 63.46ZM46.01 29.09H54.67L60.57 36.89H53.91L48.39 31.16H52.29L46.79 36.89H40.10Z";

export function Placa({ tamanho = 28 }: { tamanho?: number }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Casuê Rio"
      style={{ display: "block", flex: "none" }}
    >
      <rect width="100" height="100" rx="17.3" fill="#a8482a" />
      <rect
        x="10.65"
        y="10.65"
        width="78.7"
        height="78.7"
        rx="10.7"
        fill="none"
        stroke="#f6f2e9"
        strokeWidth="2"
      />
      <path d={E_CIRCUNFLEXO} fill="#f6f2e9" />
    </svg>
  );
}
