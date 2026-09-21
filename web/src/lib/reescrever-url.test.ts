import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

type Resposta = {
  statusCode?: number;
  headers?: { location?: { value: string } };
  uri?: string;
};

const fonte = readFileSync(
  path.join(process.cwd(), "..", "infra", "reescrever-url.js"),
  "utf8",
);
const handler = new Function(`${fonte}; return handler;`)() as (e: {
  request: {
    uri: string;
    headers: Record<string, { value: string }>;
    querystring?: unknown;
  };
}) => Resposta;

function pedir(uri: string, host = "casuerio.com.br"): Resposta {
  return handler({
    request: { uri, headers: { host: { value: host } }, querystring: null },
  });
}

describe("reescrever-url", () => {
  it("manda o www para o domínio sem www", () => {
    const r = pedir("/imoveis/", "www.casuerio.com.br");
    expect(r.statusCode).toBe(301);
    expect(r.headers?.location?.value).toBe("https://casuerio.com.br/imoveis/");
  });

  it("acrescenta a barra final", () => {
    const r = pedir("/imoveis");
    expect(r.statusCode).toBe(301);
    expect(r.headers?.location?.value).toBe("/imoveis/");
  });

  it("serve o índice da pasta", () => {
    expect(pedir("/imoveis/").uri).toBe("/imoveis/index.html");
  });

  it("leva o bairro com maiúscula para o apelido", () => {
    expect(pedir("/bairros/Tijuca/").headers?.location?.value).toBe("/bairros/tijuca/");
  });

  it("leva o bairro com espaço codificado para o apelido", () => {
    expect(pedir("/bairros/Zona%20Sul/").headers?.location?.value).toBe(
      "/bairros/zona-sul/",
    );
  });

  it("não redireciona o apelido que já está certo", () => {
    expect(pedir("/bairros/zona-sul/").uri).toBe("/bairros/zona-sul/index.html");
  });

  it("leva o índice de bairros para a carteira", () => {
    expect(pedir("/bairros/").headers?.location?.value).toBe("/imoveis/");
    expect(pedir("/bairros").headers?.location?.value).toBe("/imoveis/");
  });

  it("não mexe em arquivo com extensão", () => {
    expect(pedir("/sitemap.xml").uri).toBe("/sitemap.xml");
  });
});
