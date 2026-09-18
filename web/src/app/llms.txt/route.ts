import { SITE, NOME, DESCRICAO, SLOGAN, ENDERECO, SOCIAS } from "@/lib/site";
import { REGIOES } from "@/lib/imoveis";
import { listarArtigos, dataPorExtenso } from "@/lib/revista";

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
    `- Contato: pela página ${SITE}/contato/`,
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
    `- [Privacidade](${SITE}/privacidade/): o que a empresa faz com dado pessoal. O site não coleta nada de quem visita.`,
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
