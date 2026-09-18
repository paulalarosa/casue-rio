import { SITE, NOME, DESCRICAO, SLOGAN, ENDERECO, SOCIAS } from "@/lib/site";
import { REGIOES } from "@/lib/imoveis";
import type { Artigo } from "@/lib/revista";

/* Dados estruturados, todos deste arquivo.

   🔴 O QUE FAZ ISTO FUNCIONAR PARA IA NÃO É TER SCHEMA, É TER `@id`.

   Um site que declara "RealEstateAgent" numa página e "Person" em outra dá
   ao buscador dois cartões soltos. Com `@id`, o artigo aponta para a pessoa,
   a pessoa aponta para a empresa, e a empresa carrega os CRECIs: deixa de
   ser texto sobre imóveis e vira uma empresa identificável com duas
   profissionais registradas que assinam o que escrevem. É essa cadeia que
   um modelo de linguagem consegue seguir para citar a Casuê pelo nome em
   vez de parafrasear uma página anônima.

   🔴 O que NÃO entra aqui é tão importante quanto o que entra. Nada de
   `FAQPage` sem pergunta e resposta visíveis na tela, nada de `aggregateRating`
   sem avaliação real, nada de telefone antes de existir telefone. Dado
   estruturado que não corresponde ao que está na página é violação das
   diretrizes do Google e derruba o resultado inteiro, não só o campo. Dado
   errado é pior que ausente, porque a busca mostra o errado com confiança. */

export const ID_EMPRESA = `${SITE}/#empresa`;

const semAcento = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const idDaPessoa = (nome: string) =>
  `${SITE}/quem-somos/#${semAcento(nome)}`;

/* Cada sócia como pessoa, com o registro que dá para conferir no conselho.
   É o campo que separa "alguém escreveu sobre ITBI na internet" de "uma
   corretora com CRECI escreveu sobre ITBI". */
export function pessoas() {
  return SOCIAS.map((s) => ({
    "@type": "Person" as const,
    "@id": idDaPessoa(s.nome),
    name: s.nome,
    jobTitle: "Corretora de imóveis",
    identifier: [s.creci, s.cnai],
    url: `${SITE}/quem-somos/`,
    worksFor: { "@id": ID_EMPRESA },
  }));
}

export function empresa() {
  return {
    "@type": "RealEstateAgent" as const,
    "@id": ID_EMPRESA,
    name: NOME,
    description: DESCRICAO,
    url: `${SITE}/`,
    slogan: SLOGAN,
    knowsLanguage: "pt-BR",
    /* 🔴 DERIVADO das regiões, e não escrito à mão. A lista manual que
       estava aqui continuou anunciando o Grajaú à busca depois de o bairro
       sair do site. */
    areaServed: REGIOES.map((r) => ({
      "@type": "Place",
      name: `${r}, Rio de Janeiro`,
    })),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${ENDERECO.rua}, ${ENDERECO.complemento}`,
      addressLocality: ENDERECO.cidade,
      addressRegion: ENDERECO.estado,
      postalCode: ENDERECO.cep,
      addressCountry: "BR",
    },
    employee: pessoas().map((p) => ({ "@id": p["@id"] })),
  };
}

/* A trilha. Ela aparece na busca como caminho embaixo do título e, para um
   modelo, diz de que seção do site aquele texto veio. */
export function trilha(itens: { nome: string; caminho: string }[]) {
  return {
    "@type": "BreadcrumbList" as const,
    itemListElement: itens.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.nome,
      item: `${SITE}${it.caminho}`,
    })),
  };
}

/* 🔴 `datePublished` E `dateModified`, sempre os dois, e sem inventar
   nenhum dos dois. O painel guarda um instante só, que é a hora de
   publicar; usar esse mesmo valor nos dois campos é a verdade. Preencher
   `dateModified` com a data do build seria dizer que todo artigo foi
   revisado toda vez que o site subiu, o que é falso e é justamente o sinal
   que se tenta forjar para parecer conteúdo fresco. */
export function artigo(a: Artigo, imagem?: string | null) {
  return {
    "@type": "BlogPosting" as const,
    "@id": `${SITE}/revista/${a.slug}/#artigo`,
    headline: a.titulo,
    description: a.linha,
    url: `${SITE}/revista/${a.slug}/`,
    datePublished: a.data,
    dateModified: a.data,
    inLanguage: "pt-BR",
    author: { "@id": idDaPessoa(a.autora) },
    publisher: { "@id": ID_EMPRESA },
    isPartOf: { "@id": `${SITE}/revista/#revista` },
    mainEntityOfPage: `${SITE}/revista/${a.slug}/`,
    ...(imagem ? { image: imagem } : {}),
  };
}

export function revista(artigos: Artigo[]) {
  return {
    "@type": "Blog" as const,
    "@id": `${SITE}/revista/#revista`,
    name: `Revista · ${NOME}`,
    url: `${SITE}/revista/`,
    inLanguage: "pt-BR",
    publisher: { "@id": ID_EMPRESA },
    blogPost: artigos.map((a) => ({
      "@type": "BlogPosting",
      "@id": `${SITE}/revista/${a.slug}/#artigo`,
      headline: a.titulo,
      url: `${SITE}/revista/${a.slug}/`,
      datePublished: a.data,
      author: { "@id": idDaPessoa(a.autora) },
    })),
  };
}

/* 🔴 UM grafo por página, não cinco etiquetas soltas.

   `@graph` é o que permite os `@id` se resolverem entre si sem repetir o
   conteúdo de cada nó. Sem ele, a página do artigo teria de repetir a
   empresa inteira e as duas pessoas inteiras dentro do artigo, e a primeira
   vez que o CRECI mudasse ficariam três cópias, duas delas erradas. */
export function grafo(...nos: object[]) {
  return { "@context": "https://schema.org", "@graph": nos };
}
