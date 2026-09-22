import { describe, expect, it } from "vitest";
import {
  DESTINO,
  criarPorteiro,
  examinar,
  ler,
  limpar,
  FORMULARIOS,
  type Exame,
  type Recado,
  type Resposta,
} from "../../../infra/formulario/regras.mjs";

function resposta(exame: Exame): Resposta {
  if (!exame.resposta) throw new Error("esperava uma resposta pronta, veio recado");
  return exame.resposta;
}

function recado(exame: Exame): Recado {
  if (!exame.recado) throw new Error("esperava um recado, veio resposta pronta");
  return exame.recado;
}

const ORIGEM = "https://casuerio.com.br";

function pedir(corpo: unknown, extras: Record<string, unknown> = {}) {
  return {
    headers: { origin: ORIGEM },
    requestContext: { http: { method: "POST", sourceIp: "203.0.113.9" } },
    body: typeof corpo === "string" ? corpo : JSON.stringify(corpo),
    ...extras,
  };
}

const CONTATO = {
  formulario: "contato",
  demora: 9000,
  campos: {
    nome: "Débora",
    email: "cliente@exemplo.com",
    mensagem: "Quero visitar o 302.",
  },
};

function examinarCom(corpo: unknown, extras: Record<string, unknown> = {}) {
  return examinar(pedir(corpo, extras), criarPorteiro());
}

describe("destino", () => {
  it("é fixo no código, não vem do formulário", () => {
    expect(DESTINO).toBe("rio.casue@gmail.com");
    const exame = examinarCom({
      ...CONTATO,
      para: "ladrao@exemplo.com",
      campos: { ...CONTATO.campos, para: "ladrao@exemplo.com" },
    });
    expect(recado(exame).texto).not.toContain("ladrao@exemplo.com");
  });
});

describe("porta de entrada", () => {
  it("recusa origem de fora", () => {
    const exame = examinar(
      { ...pedir(CONTATO), headers: { origin: "https://site-falso.com" } },
      criarPorteiro(),
    );
    expect(resposta(exame).statusCode).toBe(403);
  });

  it("responde o preflight sem olhar o corpo", () => {
    const exame = examinar(
      { headers: { origin: ORIGEM }, requestContext: { http: { method: "OPTIONS" } } },
      criarPorteiro(),
    );
    expect(resposta(exame).statusCode).toBe(204);
    expect(resposta(exame).headers["access-control-allow-origin"]).toBe(ORIGEM);
  });

  it("recusa corpo gigante", () => {
    const enorme = {
      ...CONTATO,
      campos: { ...CONTATO.campos, mensagem: "a".repeat(20000) },
    };
    expect(resposta(examinarCom(enorme)).statusCode).toBe(413);
  });

  it("recusa formulário que não existe", () => {
    expect(resposta(examinarCom({ ...CONTATO, formulario: "outro" })).statusCode).toBe(
      400,
    );
  });
});

describe("armadilhas", () => {
  it("o campo-armadilha preenchido não manda nada, e o robô acha que deu certo", () => {
    const exame = examinarCom({ ...CONTATO, sobrenome: "Silva" });
    expect(resposta(exame).statusCode).toBe(200);
    expect(exame.recado).toBeUndefined();
  });

  it("preenchido rápido demais não manda nada", () => {
    const exame = examinarCom({ ...CONTATO, demora: 400 });
    expect(resposta(exame).statusCode).toBe(200);
    expect(exame.recado).toBeUndefined();
  });

  it("sem a marca de tempo não manda nada", () => {
    const { demora, ...semTempo } = CONTATO;
    expect(demora).toBe(9000);
    expect(examinarCom(semTempo).recado).toBeUndefined();
  });

  it("o quarto envio do mesmo endereço é barrado", () => {
    const porteiro = criarPorteiro();
    const agora = Date.now();
    for (let i = 0; i < 3; i += 1) {
      expect(examinar(pedir(CONTATO), porteiro, agora).recado).toBeDefined();
    }
    expect(resposta(examinar(pedir(CONTATO), porteiro, agora)).statusCode).toBe(429);
  });

  it("depois da janela o mesmo endereço volta a passar", () => {
    const porteiro = criarPorteiro();
    const agora = Date.now();
    for (let i = 0; i < 3; i += 1) examinar(pedir(CONTATO), porteiro, agora);
    const depois = examinar(pedir(CONTATO), porteiro, agora + 11 * 60 * 1000);
    expect(depois.recado).toBeDefined();
  });
});

describe("ficha do Turnstile", () => {
  it("chega até o envio para o Lambda conferir", () => {
    const exame = examinarCom({ ...CONTATO, ficha: "0.abc-token" });
    expect(exame.ficha).toBe("0.abc-token");
  });

  it("sem ficha, vem string vazia, e quem recusa é o Lambda", () => {
    expect(examinarCom(CONTATO).ficha).toBe("");
  });

  it("ficha que não é texto não vira ficha", () => {
    expect(examinarCom({ ...CONTATO, ficha: { falsa: true } }).ficha).toBe("");
  });

  it("o endereço de quem enviou sobe junto, para a Cloudflare conferir", () => {
    expect(examinarCom(CONTATO).ip).toBe("203.0.113.9");
  });
});

describe("limpeza", () => {
  it("tira quebra de linha e caractere de controle, que é o que injeta cabeçalho", () => {
    expect(limpar("Fulano\r\nBcc: alguem@exemplo.com", 200)).toBe(
      "Fulano\nBcc: alguem@exemplo.com",
    );
    expect(limpar("a\u0000b", 10)).toBe("ab");
  });

  it("corta no tamanho declarado", () => {
    expect(limpar("a".repeat(500), 10)).toHaveLength(10);
  });

  it("o e-mail com quebra de linha é recusado", () => {
    const lido = ler(FORMULARIOS.contato, {
      nome: "X",
      email: "ok@exemplo.com\nBcc: alguem@exemplo.com",
      mensagem: "oi",
    });
    expect(lido.erro).toBeTruthy();
  });
});

describe("campos", () => {
  it("cobra o que é obrigatório", () => {
    expect(ler(FORMULARIOS.contato, { mensagem: "oi" }).erro).toBe("Falta nome.");
    expect(ler(FORMULARIOS.avaliacao, { nome: "X" }).erro).toBe("Falta telefone.");
  });

  it("só aceita as opções que existem", () => {
    const base = { nome: "X", telefone: "21", quartos: "9" };
    expect(ler(FORMULARIOS.avaliacao, base).erro).toBeTruthy();
    expect(ler(FORMULARIOS.avaliacao, { ...base, quartos: "2" }).erro).toBeUndefined();
  });

  it("junta os bairros escolhidos numa linha só", () => {
    const lido = ler(FORMULARIOS.busca, {
      nome: "X",
      telefone: "21",
      bairros: ["Tijuca", "Centro"],
    });
    expect(lido.itens ?? []).toContainEqual({
      rotulo: "Bairros",
      valor: "Tijuca, Centro",
    });
  });

  it("guarda o e-mail de quem escreveu para a resposta", () => {
    expect(recado(examinarCom(CONTATO)).respostaDe).toBe("cliente@exemplo.com");
  });

  it("ignora campo que o formulário não declara", () => {
    const lido = ler(FORMULARIOS.contato, {
      nome: "X",
      mensagem: "oi",
      inventado: "xis",
    });
    const valores = (lido.itens ?? []).map((i) => i.valor).join("\n");
    expect(valores).not.toContain("xis");
  });
});
