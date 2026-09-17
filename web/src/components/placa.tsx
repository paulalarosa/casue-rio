import { cn } from "@/lib/utils";

/* A placa esmaltada com o ê: o símbolo oficial da Casuê Rio.

   🔴 Isto NÃO foi desenhado por cima da imagem da folha de marca. Redesenhar
   logo por cima de PNG é o erro que já está anotado neste projeto, porque
   peso de traço, raio de canto e recorte do filete não sobrevivem ao olho.
   Os números abaixo vieram do LEIA-ME do pacote de vetores, que dá a
   construção com o lado da placa valendo 1:

     raio externo  0,173
     filete        recuo 0,1065 · espessura 0,02 · raio interno 0,107
     ê             corpo 0,413, centrado, com 0,027 de correção óptica
                   para cima

   Por isso a caixa é 100×100 e os números aparecem como estão: eles SÃO a
   construção, multiplicada por cem. Mexer em qualquer um é mexer na marca.

   As três roupas são as da folha, e não invenção:
   · `esmalte` (padrão) — terracota com filete e ê em off-white;
   · `clara` — sobre fundo terracota, a placa inverte: areia clara com filete
     e ê em terracota (montagem 17);
   · `mono` — areia clara com filete e ê em tinta, para relevo seco, bordado
     e laser (montagem 13).

   🔴 Sobre faixa escura a placa NÃO inverte. A montagem 16 mantém o esmalte
   terracota e muda só o nome ao lado, porque a placa é um BLOCO cheio: ela
   pede 3:1 e não 4,5:1, e mede 3,19:1 sobre a tinta. O que precisa de
   contraste ali é a palavra. */

const ROUPAS = {
  esmalte: { fundo: "#a8482a", filete: "#f6f2e9", letra: "#f6f2e9" },
  clara: { fundo: "#ede2cb", filete: "#a8482a", letra: "#a8482a" },
  mono: { fundo: "#ede2cb", filete: "#171310", letra: "#171310" },
} as const;

/* O ê em CURVA, tirado da Unbounded 700 com o `fontTools`, no mesmo lugar em
   que o SVG do pacote o desenha.

   🔴 Não é o centro da mancha da letra, e essa distinção vale um comentário
   porque errei nela primeiro. O arquivo de marca usa `text-anchor="middle"`
   e `dominant-baseline="central"`, e as duas medem outra coisa: `middle`
   centra pela LARGURA DE AVANÇO, não pela tinta, e `central` põe a linha de
   base a (ascendente + descendente)/2 acima do ponto dado, que nesta fonte
   dá 375/1000. Centrar a mancha punha a letra um por cento mais baixa.

   🔴 E é curva, não `<text>`, por um motivo que só aparece na primeira
   visita: a fonte da marca carrega com `display: swap`, então um `<text>`
   aqui mostraria o ê em Century Gothic dentro da placa até a Unbounded
   chegar. Logo que pisca de fonte não é logo. Como bônus, o favicon, que
   não carrega fonte nenhuma, usa exatamente esta mesma curva. */
const E_CIRCUNFLEXO =
  "M50.97 63.46Q46.69 63.46 43.32 61.89Q39.96 60.32 38.01 57.49Q36.07 54.66 36.07 50.91Q36.07 47.20 37.94 44.42Q39.80 41.63 43.05 40.07Q46.29 38.51 50.39 38.51Q54.61 38.51 57.62 40.34Q60.62 42.17 62.24 45.51Q63.86 48.85 63.86 53.40H42.91V48.32H59.12L56.36 50.09Q56.21 48.30 55.46 47.04Q54.72 45.79 53.49 45.12Q52.27 44.46 50.59 44.46Q48.73 44.46 47.39 45.20Q46.06 45.94 45.33 47.24Q44.60 48.55 44.60 50.26Q44.60 52.49 45.60 54.05Q46.61 55.62 48.56 56.44Q50.52 57.27 53.37 57.27Q55.98 57.27 58.57 56.58Q61.15 55.90 63.25 54.64V60.01Q60.80 61.66 57.70 62.56Q54.60 63.46 50.97 63.46ZM46.01 29.09H54.67L60.57 36.89H53.91L48.39 31.16H52.29L46.79 36.89H40.10Z";

export type RoupaDaPlaca = keyof typeof ROUPAS;

export function Placa({
  className,
  roupa = "esmalte",
  /* Abaixo de 30 px o filete some por antialiasing e vira uma borda suja.
     A folha resolve isso com a montagem 12, que é a mesma placa SEM o
     filete, e manda usá-la até 16 px. Quem chama decide, porque só quem
     chama sabe o tamanho em que vai desenhar. */
  reduzida = false,
}: {
  className?: string;
  roupa?: RoupaDaPlaca;
  reduzida?: boolean;
}) {
  const c = ROUPAS[roupa];
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("block size-[1em] shrink-0", className)}
      aria-hidden
      focusable="false"
    >
      <rect x="0" y="0" width="100" height="100" rx="17.3" fill={c.fundo} />
      {!reduzida && (
        <rect
          x="10.65"
          y="10.65"
          width="78.7"
          height="78.7"
          rx="10.7"
          fill="none"
          stroke={c.filete}
          strokeWidth="2"
        />
      )}
      <path d={E_CIRCUNFLEXO} fill={c.letra} />
    </svg>
  );
}
