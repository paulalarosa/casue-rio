import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { DESTINO, REMETENTE, criarPorteiro, examinar, responder } from "./regras.mjs";

const ses = new SESv2Client({ region: "us-east-1" });
const passou = criarPorteiro();

export async function handler(evento) {
  const exame = examinar(evento, passou);
  if (exame.resposta) return exame.resposta;

  const { assunto, texto, respostaDe } = exame.recado;

  try {
    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: REMETENTE,
        Destination: { ToAddresses: [DESTINO] },
        ReplyToAddresses: respostaDe ? [respostaDe] : undefined,
        Content: {
          Simple: {
            Subject: { Data: assunto, Charset: "UTF-8" },
            Body: { Text: { Data: texto, Charset: "UTF-8" } },
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
