import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { QUEM_SOMOS_NO_AR } from "@/lib/site";

vi.mock("@/lib/revista", () => ({
  listarArtigos: async () => [
    { slug: "itbi-no-rio", data: "2026-09-18T13:00:00.000Z" },
    { slug: "matricula", data: "2026-10-02T09:30:00.000Z" },
  ],
}));

const { default: sitemap } = await import("@/app/sitemap");

describe("sitemap", () => {
  it("todo endereço termina em barra", async () => {
    for (const e of await sitemap()) expect(e.url.endsWith("/")).toBe(true);
  });

  it("nenhum endereço repete", async () => {
    const urls = (await sitemap()).map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("nenhum endereço carrega espaço no caminho", async () => {
    for (const e of await sitemap()) {
      expect(new URL(e.url).pathname).not.toMatch(/ |%20/);
    }
  });

  it("só o artigo declara data, e é a data dele", async () => {
    const comData = (await sitemap()).filter((e) => e.lastModified);
    expect(comData).toHaveLength(2);
    expect(new Date(comData[0].lastModified!).toISOString()).toBe(
      "2026-09-18T13:00:00.000Z",
    );
  });

  it("a data não é a hora do build", async () => {
    const agora = Date.now();
    for (const e of await sitemap()) {
      if (!e.lastModified) continue;
      const distancia = Math.abs(agora - new Date(e.lastModified).getTime());
      expect(distancia).toBeGreaterThan(60_000);
    }
  });
});

describe("quem somos guardada", () => {
  const publicada = existsSync(path.join(process.cwd(), "src/app/quem-somos/page.tsx"));

  it("a chave e a pasta dizem a mesma coisa", () => {
    expect(publicada).toBe(QUEM_SOMOS_NO_AR);
  });

  it("o texto continua no repositório enquanto a página está fora", () => {
    const guardada = existsSync(path.join(process.cwd(), "src/app/_quem-somos/page.tsx"));
    expect(publicada || guardada).toBe(true);
  });

  it("o sitemap só lista a página quando ela está no ar", async () => {
    const tem = (await sitemap()).some((e) => e.url.includes("/quem-somos/"));
    expect(tem).toBe(QUEM_SOMOS_NO_AR);
  });
});
