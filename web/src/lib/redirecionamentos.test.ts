import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BAIRROS } from "@/lib/carteira";

const arquivo = readFileSync(path.join(process.cwd(), "public", "_redirects"), "utf8");

const regras = arquivo
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean)
  .map((l) => {
    const [de, para, codigo] = l.split(/\s+/);
    return { de, para, codigo };
  });

function destinoDe(caminho: string) {
  return regras.find((r) => r.de === caminho)?.para ?? null;
}

describe("_redirects do Pages", () => {
  it("não tenta tratar host aqui, que o Pages ignora", () => {
    expect(regras.filter((r) => r.de.startsWith("http"))).toEqual([]);
  });

  it("leva o índice de bairros para a carteira", () => {
    expect(destinoDe("/bairros")).toBe("/imoveis/");
    expect(destinoDe("/bairros/")).toBe("/imoveis/");
  });

  it.each(BAIRROS.map((b) => [b.nome, b.apelido]))(
    "leva %s para o apelido, com e sem barra",
    (nome, apelido) => {
      if (nome === apelido) return;
      const cru = nome.replace(/ /g, "%20");
      const hifen = nome.replace(/ /g, "-");
      for (const forma of new Set([cru, hifen])) {
        expect(destinoDe(`/bairros/${forma}`)).toBe(`/bairros/${apelido}/`);
        expect(destinoDe(`/bairros/${forma}/`)).toBe(`/bairros/${apelido}/`);
      }
    },
  );

  it("todas as regras são 301", () => {
    expect(regras.filter((r) => r.codigo !== "301")).toEqual([]);
  });
});
