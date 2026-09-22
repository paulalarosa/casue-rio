import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { DESTINO, REMETENTE, criarPorteiro, examinar, responder } from "./regras.mjs";

const SEGREDO = process.env.TURNSTILE_SECRET ?? "";
const CONFERENTE = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const ses = new SESv2Client({ region: "us-east-1" });
const passou = criarPorteiro();

async function fichaVale(ficha, ip) {
  if (!SEGREDO) return true;
  if (!ficha) return false;

  const corpo = new URLSearchParams({ secret: SEGREDO, response: ficha });
  if (ip && ip !== "sem-ip") corpo.set("remoteip", ip);

  const sinal = AbortSignal.timeout(5000);
  const resposta = await fetch(CONFERENTE, { method: "POST", body: corpo, signal: sinal });
  const veredito = await resposta.json();

  if (!veredito.success) {
    console.warn("[formulario] Turnstile recusou:", veredito["error-codes"]);
  }
  return veredito.success === true;
}

export async function handler(evento) {
  const exame = examinar(evento, passou);
  if (exame.resposta) return exame.resposta;

  try {
    if (!(await fichaVale(exame.ficha, exame.ip))) {
      const aviso = "Confirme que você não é um robô e tente de novo.";
      return responder(400, { erro: aviso }, exame.origem);
    }
  } catch (erro) {
    console.error("[formulario] Turnstile não respondeu:", erro);
    const aviso = "Não consegui confirmar o envio agora. Tente de novo em instantes.";
    return responder(503, { erro: aviso }, exame.origem);
  }

  const { assunto, texto, html, respostaDe } = exame.recado;

  try {
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: REMETENTE,
        Destination: { ToAddresses: [DESTINO] },
        ReplyToAddresses: respostaDe ? [respostaDe] : undefined,
        Content: {
          Simple: {
            Subject: { Data: assunto, Charset: "UTF-8" },
            Body: {
              Text: { Data: texto, Charset: "UTF-8" },
              Html: { Data: html, Charset: "UTF-8" },
            },
          },
        },
      }),
    );
  } catch (erro) {
    console.error("[formulario] SES recusou:", erro);
    const aviso = "Não consegui enviar agora. Tente de novo em instantes.";
    return responder(502, { erro: aviso }, exame.origem);
  }

  return responder(200, { ok: true }, exame.origem);
}
