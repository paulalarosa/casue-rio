import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { BAIRROS, IMOVEIS } from "@/lib/imoveis";
import { listarArtigos } from "@/lib/revista";

/* Sitemap derivado dos MESMOS dados que geram as páginas: entrou imóvel no
   arquivo, entrou no sitemap. Lista escrita à mão é lista que envelhece. */
/* Com `output: export` não existe servidor para decidir nada em tempo de
   requisição: a rota tem de ser declarada estática, senão o build para. */
export const dynamic = "force-static";

/* 🔴 COM BARRA NO FIM, e isso não é detalhe de estilo.

   O site é exportado com `trailingSlash: true`, o site inteiro linka com
   barra, e a função do CloudFront devolve 301 de `/imoveis` para
   `/imoveis/`. O sitemap estava entregando ao buscador exatamente a versão
   que redireciona: cada endereço da lista custava dois pedidos e apontava
   para um endereço que não é o canônico das próprias páginas. Sitemap
   existe para dizer onde a página mora, não onde ela morava. */
const comBarra = (rota: string) => `${SITE}${rota}/`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const agora = new Date();

  const fixas = [
    "",
    "/imoveis",
    "/bairros",
    "/avaliacao",
    "/quem-somos",
    "/revista",
    "/contato",
  ].map((r) => ({
    url: comBarra(r),
    lastModified: agora,
    changeFrequency: "monthly" as const,
    priority: r === "" ? 1 : 0.8,
  }));

  const imoveis = IMOVEIS.map((im) => ({
    url: comBarra(`/imoveis/${im.codigo}`),
    lastModified: agora,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const bairros = BAIRROS.map((b) => ({
    url: comBarra(`/bairros/${encodeURIComponent(b.chave)}`),
    lastModified: agora,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  /* 🔴 Os artigos FALTAVAM aqui, e a falta só apareceu quando existiu o
     primeiro. Um texto publicado e fora do sitemap é um texto que o
     buscador só acha se tropeçar no link da lista. Para um site de
     imobiliária que aposta em conteúdo, é a página mais cara de todas
     ficando invisível.

     🔴 E esta lista é a MESMA que o site usa para montar as páginas, com o
     filtro de agendamento embutido: artigo marcado para a semana que vem
     não entra no sitemap antes da hora. Se entrasse, o buscador visitaria
     um endereço que ainda dá 404. */
  const artigos = (await listarArtigos()).map((a) => ({
    url: comBarra(`/revista/${a.slug}`),
    lastModified: new Date(a.data),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...fixas, ...imoveis, ...bairros, ...artigos];
}
