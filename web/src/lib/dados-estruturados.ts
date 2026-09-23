import {
  SITE,
  NOME,
  DESCRICAO,
  SLOGAN,
  ENDERECO,
  SOCIAS,
  TELEFONE,
  soDigitos,
} from "@/lib/site";
import { REGIOES } from "@/lib/imoveis";
import type { Artigo } from "@/lib/revista";

const ID_EMPRESA = `${SITE}/#empresa`;

const semAcento = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const idDaPessoa = (nome: string) => `${SITE}/quem-somos/#${semAcento(nome)}`;

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
    ...(TELEFONE ? { telephone: `+${soDigitos()}` } : {}),
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

export function grafo(...nos: object[]) {
  return { "@context": "https://schema.org", "@graph": nos };
}
