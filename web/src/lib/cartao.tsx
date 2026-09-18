import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { PortableTextBlock } from "@portabletext/react";

/* As peças de Instagram, na tipografia da marca.

   🔴 ESTAS IMAGENS NÃO VÃO PARA O SITE. Elas nascem dentro de `out/` porque
   é o Next que as desenha, e `scripts/cards-instagram.mjs` as MOVE para
   `cards/` antes de qualquer coisa subir para o balde. O script quebra o
   build se não conseguir mover, de propósito: card no ar não é um desastre,
   mas é uma promessa quebrada, e a promessa aqui é que só quem tem acesso ao
   repositório baixa essas peças. */

export const TINTA = "#171310";
export const PAPEL = "#F6F2E9";
export const AREIA = "#DDCBAA";
export const TERRACOTA = "#A8482A";
export const BRONZE = "#C0AC87";

/* 🔴 Lidas do disco, e não de `fonts.gstatic.com`. O desenhista de SVG por
   trás do `ImageResponse` não tem navegador nem `font-display`: sem o
   arquivo em memória ele cai numa fonte qualquer, e o card sai com outra
   letra sem avisar ninguém. */
export async function fontes() {
  const p = (n: string) => join(process.cwd(), "scripts", "fontes", n);
  const [display, corpo, corpoForte] = await Promise.all([
    readFile(p("unbounded-700.ttf")),
    readFile(p("archivo-400.ttf")),
    readFile(p("archivo-600.ttf")),
  ]);
  return [
    { name: "Unbounded", data: display, weight: 700 as const, style: "normal" as const },
    { name: "Archivo", data: corpo, weight: 400 as const, style: "normal" as const },
    { name: "Archivo", data: corpoForte, weight: 600 as const, style: "normal" as const },
  ];
}

/* A placa, desenhada com caixas e a letra em Unbounded de verdade.

   No site ela é curva vetorial, porque lá a fonte carrega com `swap` e o ê
   piscaria em Century Gothic antes de a Unbounded chegar. Aqui não existe
   esse instante: a fonte já está em memória quando o desenho acontece. */
export function Placa({ lado }: { lado: number }) {
  return (
    <div
      style={{
        display: "flex",
        width: lado,
        height: lado,
        borderRadius: lado * 0.173,
        background: TERRACOTA,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: lado * 0.787,
          height: lado * 0.787,
          borderRadius: lado * 0.107,
          border: `${Math.max(2, lado * 0.02)}px solid ${PAPEL}`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Unbounded",
            fontWeight: 700,
            fontSize: lado * 0.44,
            color: PAPEL,
            lineHeight: 1,
            /* Correção óptica da folha de marca: o ê sobe 2,7% do lado. */
            marginTop: -lado * 0.027,
          }}
        >
          ê
        </div>
      </div>
    </div>
  );
}

/* A primeira citação do texto, se houver. Sem citação, a chamada serve: ela
   já é uma frase fechada e escrita para ser lida sozinha.

   🔴 A alternativa era não gerar a peça quando não houvesse citação, e ela
   é pior por um motivo já conhecido neste projeto: rota que às vezes não
   existe é rota que um dia devolve lista vazia, e lista vazia com
   `output: export` derruba a publicação inteira. Uma peça sempre. */
export function frasePara(corpo: PortableTextBlock[] | undefined, reserva: string) {
  const citacao = (corpo ?? []).find(
    (b) => b._type === "block" && (b as { style?: string }).style === "blockquote",
  );
  if (!citacao) return reserva;
  const filhos = (citacao as { children?: { text?: string }[] }).children ?? [];
  const texto = filhos.map((c) => c.text ?? "").join("").trim();
  return texto || reserva;
}
