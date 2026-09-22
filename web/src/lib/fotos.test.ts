import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { IMOVEIS } from "@/lib/carteira";

const PUBLICO = path.join(process.cwd(), "public");

const caminhos = IMOVEIS.flatMap(
  (im) => [...(im.fotos ?? []), im.foto].filter(Boolean) as string[],
);

describe("as fotos dos imóveis", () => {
  it("existem em public", () => {
    const sumidas = caminhos.filter((c) => !existsSync(path.join(PUBLICO, c)));
    expect(sumidas).toEqual([]);
  });

  it("moram fora de /imoveis, que é rota", () => {
    const rotas = IMOVEIS.map((im) => `/imoveis/${im.codigo}/`.toLowerCase());
    const invasoras = caminhos.filter((c) =>
      rotas.some((r) => c.toLowerCase().startsWith(r)),
    );
    expect(invasoras).toEqual([]);
  });

  it("têm a miniatura ao lado", () => {
    const sem = caminhos
      .map((c) => c.replace(/\.webp$/, "-min.webp"))
      .filter((c) => !existsSync(path.join(PUBLICO, c)));
    expect(sem).toEqual([]);
  });
});
