import { describe, expect, it } from "vitest";
import type { Artigo } from "@/lib/revista";
import { RESPONSAVEIS, soDigitos } from "@/lib/site";
import {
  ID_EMPRESA,
  artigo,
  empresa,
  grafo,
  revista,
  trilha,
} from "@/lib/dados-estruturados";

const exemplo: Artigo = {
  slug: "um-texto",
  titulo: "Um título",
  linha: "Uma chamada que diz o que o texto entrega.",
  data: "2026-09-18T13:00:00.000Z",
};

describe("grafo", () => {
  it("embrulha os nós num @graph com contexto", () => {
    const g = grafo(empresa()) as { "@context": string; "@graph": unknown[] };
    expect(g["@context"]).toBe("https://schema.org");
    expect(g["@graph"]).toHaveLength(1);
  });
});

describe("a empresa fala por ela mesma", () => {
  it("a ficha do Google não declara pessoa nenhuma", () => {
    const texto = JSON.stringify(grafo(empresa(), artigo(exemplo), revista([exemplo])));
    expect(texto).not.toContain('"Person"');
    expect(texto).not.toContain("employee");
    for (const r of RESPONSAVEIS) expect(texto).not.toContain(r.nome);
  });
});

describe("artigo", () => {
  it("quem assina é a empresa", () => {
    expect(artigo(exemplo).author["@id"]).toBe(ID_EMPRESA);
    expect(revista([exemplo]).blogPost[0].author["@id"]).toBe(ID_EMPRESA);
  });

  it("publicação e modificação saem do mesmo instante, sem inventar revisão", () => {
    const a = artigo(exemplo);
    expect(a.datePublished).toBe(exemplo.data);
    expect(a.dateModified).toBe(exemplo.data);
  });

  it("sem capa, não declara imagem", () => {
    expect(artigo(exemplo)).not.toHaveProperty("image");
  });

  it("com capa, declara a imagem recebida", () => {
    const a = artigo(exemplo, "https://cdn/x.jpg") as { image?: string };
    expect(a.image).toBe("https://cdn/x.jpg");
  });

  it("o artigo pertence à revista pelo @id dela", () => {
    expect(artigo(exemplo).isPartOf["@id"]).toBe(revista([])["@id"]);
  });
});

describe("trilha", () => {
  it("numera a partir de um e monta endereço absoluto", () => {
    const t = trilha([
      { nome: "Início", caminho: "/" },
      { nome: "Revista", caminho: "/revista/" },
    ]);
    expect(t.itemListElement.map((i) => i.position)).toEqual([1, 2]);
    expect(t.itemListElement[1].item).toMatch(/\/revista\/$/);
  });
});

describe("telefone da casa", () => {
  it("tem código do país, DDD e nove dígitos", () => {
    expect(soDigitos()).toMatch(/^55\d{2}9\d{8}$/);
  });

  it("entra na ficha da empresa em formato internacional", () => {
    expect(empresa().telephone).toBe(`+${soDigitos()}`);
  });

  it("é o mesmo número que vai para o wa.me", () => {
    expect(empresa().telephone?.slice(1)).toBe(soDigitos());
  });
});
