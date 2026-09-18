import { describe, expect, it } from "vitest";
import type { Artigo } from "@/lib/revista";
import { artigo, empresa, grafo, pessoas, revista, trilha } from "@/lib/dados-estruturados";
import { SOCIAS } from "@/lib/site";

const exemplo: Artigo = {
  slug: "um-texto",
  titulo: "Um título",
  linha: "Uma chamada que diz o que o texto entrega.",
  data: "2026-09-18T13:00:00.000Z",
  autora: SOCIAS[0].nome,
};

describe("grafo", () => {
  it("embrulha os nós num @graph com contexto", () => {
    const g = grafo(empresa()) as { "@context": string; "@graph": unknown[] };
    expect(g["@context"]).toBe("https://schema.org");
    expect(g["@graph"]).toHaveLength(1);
  });
});

describe("empresa e pessoas", () => {
  it("a empresa aponta para as duas pessoas pelo mesmo @id que elas declaram", () => {
    const ids = pessoas().map((p) => p["@id"]);
    const apontados = empresa().employee.map((e) => e["@id"]);
    expect(apontados).toEqual(ids);
  });

  it("cada pessoa carrega CRECI e CNAI", () => {
    for (const p of pessoas()) expect(p.identifier).toHaveLength(2);
  });

  it("o @id da pessoa não tem acento nem espaço", () => {
    for (const p of pessoas()) expect(p["@id"]).toMatch(/^https?:\/\/[^#]+#[a-z0-9-]+$/);
  });

  it("não existem duas pessoas com o mesmo @id", () => {
    const ids = pessoas().map((p) => p["@id"]);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("artigo", () => {
  it("a autora aponta para uma pessoa declarada", () => {
    const ids = pessoas().map((p) => p["@id"]);
    expect(ids).toContain(artigo(exemplo).author["@id"]);
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
