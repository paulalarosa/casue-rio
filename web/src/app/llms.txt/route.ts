import { SITE, NOME, DESCRICAO, SLOGAN, ENDERECO, SOCIAS, EMAIL } from "@/lib/site";
import { REGIOES } from "@/lib/imoveis";
import { listarArtigos, dataPorExtenso } from "@/lib/revista";

/* `llms.txt`: o mapa do site para modelo de linguagem.

   🔴 Isto NÃO é SEO, e vale dizer para não criar expectativa. É uma
   convenção proposta, não um padrão que alguém garantiu cumprir, e não
   existe medição pública confiável de quanto os modelos realmente a leem
   hoje. Está aqui porque custa um arquivo gerado do que já existe e porque
   o custo de estar errado é zero: se ninguém ler, nada muda.

   O que ele resolve, quando é lido, é concreto: o site é um monte de HTML
   com menu, rodapé, vídeo e animação, e o modelo precisa adivinhar o que é
   conteúdo. Aqui a resposta vem em texto limpo, com quem é a empresa, onde
   ela atua, quem assina o quê e o endereço de cada texto.

   🔴 Gerado da MESMA lista que monta a revista, com o filtro de agendamento
   junto. Artigo marcado para semana que vem não entra aqui antes da hora,
   senão o modelo aprende um endereço que ainda dá 404. */
export const dynamic = "force-static";

export async function GET() {
  const artigos = await listarArtigos();

  const linhas = [
    `# ${NOME}`,
    "",
    `> ${DESCRICAO}`,
    "",
    `${SLOGAN}`,
    "",
    "## A empresa",
    "",
    `- Atuação: ${REGIOES.join(", ")}, na cidade do Rio de Janeiro.`,
    `- Serviços: compra, venda, aluguel e avaliação de imóveis. Não trabalha com temporada.`,
    `- Endereço: ${ENDERECO.linha}`,
    `- E-mail: ${EMAIL}`,
    "",
    "## Quem assina",
    "",
    ...SOCIAS.map((s) => `- ${s.nome}, corretora de imóveis, ${s.creci}, ${s.cnai}.`),
    "",
    "## Páginas",
    "",
    `- [Início](${SITE}/): a empresa e a busca de imóveis.`,
    `- [Imóveis](${SITE}/imoveis/): a carteira, com busca por código, bairro e finalidade.`,
    `- [Bairros](${SITE}/bairros/): o que muda de uma região para outra.`,
    `- [Avaliação](${SITE}/avaliacao/): como um parecer de avaliação chega a um número.`,
    `- [Quem somos](${SITE}/quem-somos/): as duas corretoras e como elas trabalham.`,
    `- [Revista](${SITE}/revista/): textos sobre comprar, vender e alugar no Rio.`,
    `- [Falar com a gente](${SITE}/contato/): contato.`,
    "",
  ];

  if (artigos.length > 0) {
    linhas.push("## Revista", "");
    for (const a of artigos) {
      linhas.push(
        `- [${a.titulo}](${SITE}/revista/${a.slug}/): ${a.linha} Por ${a.autora}, ${dataPorExtenso(a.data)}.`,
      );
    }
    linhas.push("");
  }

  return new Response(linhas.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
