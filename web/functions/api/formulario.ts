import {
  DESTINO,
  REMETENTE,
  criarPorteiro,
  examinar,
  responder,
} from "../../../infra/formulario/regras.mjs";

type Ambiente = {
  TURNSTILE_SECRET?: string;
  RESEND_API_KEY?: string;
};

type Contexto = {
  request: Request;
  env: Ambiente;
};

const CONFERENTE = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const CORREIO = "https://api.resend.com/emails";

const passou = criarPorteiro();

type Pronta = { statusCode: number; headers: Record<string, string>; body: string };

function entregar(pronta: Pronta) {
  return new Response(pronta.statusCode === 204 ? null : pronta.body, {
    status: pronta.statusCode,
    headers: pronta.headers,
  });
}

async function fichaVale(segredo: string, ficha: string, ip: string) {
  if (!segredo) return true;
  if (!ficha) return false;

  const corpo = new URLSearchParams({ secret: segredo, response: ficha });
  if (ip && ip !== "sem-ip") corpo.set("remoteip", ip);

  const resposta = await fetch(CONFERENTE, {
    method: "POST",
    body: corpo,
    signal: AbortSignal.timeout(5000),
  });
  const veredito = (await resposta.json()) as {
    success?: boolean;
    "error-codes"?: string[];
  };

  if (!veredito.success) {
    console.warn("[formulario] Turnstile recusou:", veredito["error-codes"]);
  }
  return veredito.success === true;
}

async function despachar(chave: string, carta: Record<string, unknown>) {
  const resposta = await fetch(CORREIO, {
    method: "POST",
    headers: { authorization: `Bearer ${chave}`, "content-type": "application/json" },
    body: JSON.stringify(carta),
    signal: AbortSignal.timeout(10000),
  });

  if (!resposta.ok) {
    throw new Error(`Resend devolveu ${resposta.status}: ${await resposta.text()}`);
  }
}

async function tratar({ request, env }: Contexto) {
  const exame = examinar(
    {
      metodo: request.method,
      origem: request.headers.get("origin") ?? "",
      ip: request.headers.get("cf-connecting-ip") ?? "sem-ip",
      corpo: request.method === "POST" ? await request.text() : "",
    },
    passou,
  );

  if (exame.resposta) return entregar(exame.resposta);

  try {
    if (!(await fichaVale(env.TURNSTILE_SECRET ?? "", exame.ficha, exame.ip))) {
      const aviso = "Confirme que você não é um robô e tente de novo.";
      return entregar(responder(400, { erro: aviso }, exame.origem));
    }
  } catch (erro) {
    console.error("[formulario] Turnstile não respondeu:", erro);
    const aviso = "Não consegui confirmar o envio agora. Tente de novo em instantes.";
    return entregar(responder(503, { erro: aviso }, exame.origem));
  }

  const { assunto, texto, html, respostaDe } = exame.recado;

  try {
    await despachar(env.RESEND_API_KEY ?? "", {
      from: REMETENTE,
      to: [DESTINO],
      subject: assunto,
      text: texto,
      html,
      ...(respostaDe ? { reply_to: respostaDe } : {}),
    });
  } catch (erro) {
    console.error("[formulario] Resend recusou:", erro);
    const aviso = "Não consegui enviar agora. Tente de novo em instantes.";
    return entregar(responder(502, { erro: aviso }, exame.origem));
  }

  return entregar(responder(200, { ok: true }, exame.origem));
}

export const onRequestPost = tratar;
export const onRequestOptions = tratar;
