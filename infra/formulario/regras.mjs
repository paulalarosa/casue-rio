export const DESTINO = "rio.casue@gmail.com";
export const REMETENTE = "Site Casuê Rio <site@casuerio.com.br>";

const ORIGENS = ["https://casuerio.com.br", "http://localhost:3000"];
const CORPO_MAXIMO = 12000;
const ESPERA_MINIMA = 3000;
const JANELA = 10 * 60 * 1000;
const TETO_POR_IP = 3;

const TEXTO = (max) => ({ tipo: "texto", max });
const LISTA = (opcoes) => ({ tipo: "lista", opcoes });
const VARIOS = (max) => ({ tipo: "varios", max });

export const FORMULARIOS = {
  contato: {
    assunto: "Contato pelo site",
    campos: [
      ["nome", "Nome", TEXTO(120), true],
      ["telefone", "Telefone", TEXTO(40), false],
      ["email", "E-mail", TEXTO(160), false],
      ["mensagem", "Mensagem", TEXTO(4000), true],
    ],
  },
  busca: {
    assunto: "Procura um imóvel",
    campos: [
      ["nome", "Nome", TEXTO(120), true],
      ["telefone", "Telefone", TEXTO(40), true],
      ["email", "E-mail", TEXTO(160), false],
      ["bairros", "Bairros", VARIOS(400), false],
      ["quartos", "Quartos", LISTA(["1", "2", "3"]), false],
      ["vaga", "Vagas", LISTA(["0", "1", "2"]), false],
      ["detalhes", "Detalhes que fazem diferença", TEXTO(4000), false],
    ],
  },
  avaliacao: {
    assunto: "Quer vender o imóvel",
    campos: [
      ["nome", "Nome", TEXTO(120), true],
      ["telefone", "Telefone", TEXTO(40), true],
      ["email", "E-mail", TEXTO(160), false],
      ["rua", "Rua", TEXTO(200), false],
      ["bairro", "Bairro", TEXTO(120), false],
      ["quartos", "Quartos", LISTA(["1", "2", "3"]), false],
      ["vaga", "Vagas", LISTA(["0", "1", "2"]), false],
    ],
  },
};

const EMAIL = /^[^\s@,;]+@[^\s@,;]+\.[a-z]{2,}$/i;

export function limpar(valor, max) {
  return String(valor)
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, max);
}

export function responder(status, corpo, origem) {
  return {
    statusCode: status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": origem,
      "access-control-allow-headers": "content-type",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-max-age": "86400",
      vary: "origin",
    },
    body: JSON.stringify(corpo),
  };
}

export function criarPorteiro() {
  const visitas = new Map();
  return function passou(ip, agora) {
    for (const [chave, marcas] of visitas) {
      const vivas = marcas.filter((m) => agora - m < JANELA);
      if (vivas.length) visitas.set(chave, vivas);
      else visitas.delete(chave);
    }
    const marcas = visitas.get(ip) ?? [];
    if (marcas.length >= TETO_POR_IP) return false;
    visitas.set(ip, [...marcas, agora]);
    return true;
  };
}

export function ler(formulario, entrada) {
  const linhas = [];
  let respostaDe = null;

  for (const [chave, rotulo, regra, obrigatorio] of formulario.campos) {
    const bruto = entrada[chave];
    const vazio =
      bruto === undefined || bruto === null || bruto === "" || (Array.isArray(bruto) && !bruto.length);

    if (vazio) {
      if (obrigatorio) return { erro: `Falta ${rotulo.toLowerCase()}.` };
      continue;
    }

    let valor;
    if (regra.tipo === "varios") {
      if (!Array.isArray(bruto)) return { erro: `${rotulo} veio errado.` };
      valor = bruto
        .map((b) => limpar(b, 80))
        .filter(Boolean)
        .join(", ")
        .slice(0, regra.max);
    } else if (regra.tipo === "lista") {
      valor = limpar(bruto, 8);
      if (!regra.opcoes.includes(valor)) return { erro: `${rotulo} veio errado.` };
    } else {
      if (typeof bruto !== "string" && typeof bruto !== "number") {
        return { erro: `${rotulo} veio errado.` };
      }
      valor = limpar(bruto, regra.max);
    }

    if (!valor) {
      if (obrigatorio) return { erro: `Falta ${rotulo.toLowerCase()}.` };
      continue;
    }

    if (chave === "email") {
      if (!EMAIL.test(valor)) return { erro: "O e-mail não parece um e-mail." };
      respostaDe = valor;
    }

    linhas.push(`${rotulo}: ${valor}`);
  }

  if (!linhas.length) return { erro: "Formulário vazio." };
  return { linhas, respostaDe };
}

export function examinar(evento, passou, agora = Date.now()) {
  const cabecalhos = evento.headers ?? {};
  const pedida = cabecalhos.origin ?? cabecalhos.Origin ?? "";
  const conhecida = ORIGENS.includes(pedida);
  const origem = conhecida ? pedida : ORIGENS[0];
  const metodo = evento.requestContext?.http?.method ?? "POST";

  if (metodo === "OPTIONS") return { resposta: responder(204, {}, origem) };
  if (metodo !== "POST") return { resposta: responder(405, { erro: "Método não aceito." }, origem) };
  if (!conhecida) return { resposta: responder(403, { erro: "Origem não aceita." }, origem) };

  const cru = evento.isBase64Encoded
    ? Buffer.from(evento.body ?? "", "base64").toString("utf8")
    : (evento.body ?? "");

  if (cru.length > CORPO_MAXIMO) {
    return { resposta: responder(413, { erro: "Recado longo demais." }, origem) };
  }

  let entrada;
  try {
    entrada = JSON.parse(cru);
  } catch {
    return { resposta: responder(400, { erro: "Não consegui ler o formulário." }, origem) };
  }

  const formulario = FORMULARIOS[entrada?.formulario];
  if (!formulario) {
    return { resposta: responder(400, { erro: "Formulário desconhecido." }, origem) };
  }

  if (entrada.sobrenome) return { resposta: responder(200, { ok: true }, origem) };
  if (!(Number(entrada.demora) >= ESPERA_MINIMA)) {
    return { resposta: responder(200, { ok: true }, origem) };
  }

  const ip = evento.requestContext?.http?.sourceIp ?? "sem-ip";
  if (!passou(ip, agora)) {
    const aviso = "Já recebemos o seu recado. Aguarde alguns minutos.";
    return { resposta: responder(429, { erro: aviso }, origem) };
  }

  const lido = ler(formulario, entrada.campos ?? {});
  if (lido.erro) return { resposta: responder(400, { erro: lido.erro }, origem) };

  const carimbo = new Date(agora).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const texto = [...lido.linhas, "", `Enviado pelo site em ${carimbo}.`].join("\n");

  return {
    origem,
    recado: { assunto: formulario.assunto, texto, respostaDe: lido.respostaDe },
  };
}
