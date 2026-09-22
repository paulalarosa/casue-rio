const TERRACOTA = "#a8482a";
const TINTA = "#171310";
const BRONZE = "#8a5a33";
const PAPEL = "#f6f2e9";
const AREIA = "#c0ac87";
const LINHA = "#e7e2d9";

const FUGA = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapar(valor) {
  return String(valor).replace(/[&<>"']/g, (c) => FUGA[c]);
}

export function digitosDoTelefone(valor) {
  const so = String(valor).replace(/\D/g, "");
  if (so.length === 10 || so.length === 11) return `55${so}`;
  if ((so.length === 12 || so.length === 13) && so.startsWith("55")) return so;
  return null;
}

function botao(endereco, rotulo, fundo, cor, borda) {
  return (
    `<a href="${escapar(endereco)}" style="display:inline-block;margin:0 8px 8px 0;` +
    `padding:11px 18px;border-radius:6px;background:${fundo};color:${cor};` +
    `border:1px solid ${borda};font:600 15px/1 Helvetica,Arial,sans-serif;` +
    `text-decoration:none">${escapar(rotulo)}</a>`
  );
}

function acoes(itens) {
  const achar = (rotulo) => itens.find((i) => i.rotulo === rotulo)?.valor ?? "";
  const telefone = achar("Telefone");
  const email = achar("E-mail");
  const zap = telefone ? digitosDoTelefone(telefone) : null;

  const pecas = [];
  if (zap)
    pecas.push(botao(`tel:+${zap}`, "Ligar", TERRACOTA, PAPEL, TERRACOTA));
  if (zap)
    pecas.push(
      botao(`https://wa.me/${zap}`, "WhatsApp", "#ffffff", TERRACOTA, AREIA),
    );
  if (email)
    pecas.push(
      botao(`mailto:${email}`, "Responder", "#ffffff", TERRACOTA, AREIA),
    );
  if (!pecas.length) return "";

  return `<tr><td style="padding:2px 28px 20px">${pecas.join("")}</td></tr>`;
}

function linhas(itens) {
  return itens
    .filter((i) => i.rotulo !== "Nome")
    .map(
      (i) =>
        `<tr><td style="padding:12px 28px;border-top:1px solid ${LINHA}">` +
        `<div style="font:600 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:.09em;` +
        `text-transform:uppercase;color:${BRONZE}">${escapar(i.rotulo)}</div>` +
        `<div style="margin-top:4px;font:400 16px/1.5 Georgia,serif;color:${TINTA};` +
        `white-space:pre-wrap">${escapar(i.valor)}</div></td></tr>`,
    )
    .join("");
}

export function montarCarta({ assunto, itens, carimbo }) {
  const nome = itens.find((i) => i.rotulo === "Nome")?.valor ?? "Sem nome";

  return (
    `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width"><title>${escapar(assunto)}</title></head>` +
    `<body style="margin:0;padding:24px 12px;background:${PAPEL}">` +
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" ` +
    `style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;` +
    `border:1px solid ${LINHA};border-collapse:separate">` +
    `<tr><td style="padding:20px 28px;background:${TERRACOTA};border-radius:9px 9px 0 0">` +
    `<div style="font:600 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:.14em;` +
    `text-transform:uppercase;color:${PAPEL};opacity:.82">Casuê Rio · site</div>` +
    `<div style="margin-top:6px;font:400 22px/1.3 Georgia,serif;color:${PAPEL}">` +
    `${escapar(assunto)}</div></td></tr>` +
    `<tr><td style="padding:26px 28px 12px">` +
    `<div style="font:400 28px/1.25 Georgia,serif;color:${TINTA}">${escapar(nome)}</div>` +
    `</td></tr>` +
    acoes(itens) +
    linhas(itens) +
    `<tr><td style="padding:16px 28px 22px;border-top:1px solid ${LINHA}">` +
    `<div style="font:400 13px/1.5 Helvetica,Arial,sans-serif;color:${BRONZE}">` +
    `Enviado pelo site em ${escapar(carimbo)}. Responder este e-mail fala direto com quem escreveu.` +
    `</div></td></tr></table></body></html>`
  );
}
