import { describe, expect, it } from "vitest";
import {
  digitosDoTelefone,
  escapar,
  montarCarta,
} from "../../../infra/formulario/carta.mjs";

const carimbo = "22/09/2026 15:00:00";

function carta(itens: { rotulo: string; valor: string }[]) {
  return montarCarta({ assunto: "Contato pelo site", itens, carimbo });
}

describe("escapar", () => {
  it("fecha os cinco caracteres que abrem tag e atributo", () => {
    expect(escapar(`<a href="x" data='y'>&`)).toBe(
      "&lt;a href=&quot;x&quot; data=&#39;y&#39;&gt;&amp;",
    );
  });
});

describe("montarCarta", () => {
  it("não deixa marcação do visitante virar marcação do e-mail", () => {
    const html = carta([
      { rotulo: "Nome", valor: "<script>alerta()</script>" },
      { rotulo: "Mensagem", valor: '"><img src=x onerror=roubar()>' },
    ]);
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;");
  });

  it("põe o nome no topo e não repete na lista", () => {
    const html = carta([
      { rotulo: "Nome", valor: "Débora Carvalho" },
      { rotulo: "Mensagem", valor: "Quero visitar" },
    ]);
    expect(html).toContain("Débora Carvalho");
    expect(html).not.toContain("NOME</div>");
    expect(html.toUpperCase()).toContain("MENSAGEM</DIV>");
  });

  it("dá botão de ligar e de WhatsApp quando tem telefone", () => {
    const html = carta([
      { rotulo: "Nome", valor: "Ana" },
      { rotulo: "Telefone", valor: "(21) 98888-7777" },
    ]);
    expect(html).toContain("tel:+5521988887777");
    expect(html).toContain("https://wa.me/5521988887777");
  });

  it("dá botão de responder quando tem e-mail", () => {
    const html = carta([
      { rotulo: "Nome", valor: "Ana" },
      { rotulo: "E-mail", valor: "ana@exemplo.com" },
    ]);
    expect(html).toContain("mailto:ana@exemplo.com");
    expect(html).not.toContain("wa.me");
  });

  it("não inventa botão quando só veio recado", () => {
    const html = carta([
      { rotulo: "Nome", valor: "Ana" },
      { rotulo: "Mensagem", valor: "oi" },
    ]);
    expect(html).not.toContain("tel:");
    expect(html).not.toContain("mailto:");
  });
});

describe("digitosDoTelefone", () => {
  it.each([
    ["(21) 98888-7777", "5521988887777"],
    ["2198887777", "552198887777"],
    ["+55 21 98888-7777", "5521988887777"],
    ["5521988887777", "5521988887777"],
  ])("entende %s", (entrada, esperado) => {
    expect(digitosDoTelefone(entrada)).toBe(esperado);
  });

  it.each(["21", "", "liga pra mim", "1234567890123456"])("recusa %s", (entrada) => {
    expect(digitosDoTelefone(entrada)).toBeNull();
  });
});
