/* Gera o cartão de compartilhamento da MARCA (`src/app/opengraph-image.png`
   e `twitter-image.png`), que é a arte que aparece quando alguém manda o
   endereço da home no WhatsApp, no LinkedIn ou no Facebook.

   🔴 Existe porque a arte anterior era um PNG desenhado à mão e guardado no
   repositório, sem fonte nenhuma: quando o Grajaú entrou nas regiões
   atendidas, o cartão continuou dizendo "Centro · Tijuca · Zona Sul" e
   ninguém tinha como notar, porque a única cópia da montagem estava num
   arquivo temporário. Agora a montagem mora aqui e TUDO que ela escreve é
   lido do código: as regiões saem de `BAIRROS`, o símbolo sai de
   `marca.tsx`, e a frase e o slogan saem de `site.ts`. Acrescentar uma
   região passa a bastar para o cartão acompanhar.

   Por que Chrome e não `next/og`: o cartão por imóvel usa Satori e sai bem
   com a sans do sistema, mas aqui entram o símbolo da marca e a Josefin
   Sans, e a fidelidade da marca vale o navegador de verdade.

   🔴 As fontes são EMBUTIDAS de `scripts/fontes/`, e não buscadas no
   Google: com o `<link>` para a web, o Chrome sem rede tira a foto assim
   mesmo, sem erro nenhum, e o cartão sai inteiro em Times New Roman. Nada
   na captura avisa — só quem abrir a imagem percebe.

   uso: node scripts/cartao-marca.mjs */
import { readFile, writeFile, copyFile, mkdtemp, rm, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { regioesAtendidas } from "./regioes.mjs";

const executar = promisify(execFile);

const CHROME =
  process.env.CHROME ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

/* Caminho ABSOLUTO: com caminho relativo o Chrome aceita a opção, sai com
   código zero e não escreve arquivo nenhum. */
const SAIDA = resolve("src/app/opengraph-image.png");
const GEMEO = resolve("src/app/twitter-image.png");
const CARIMBO = resolve("scripts/cartao-marca.carimbo");

/* --- O que a arte escreve, lido do código ------------------------------ */

async function ler(caminho) {
  return readFile(caminho, "utf8");
}

function pegar(texto, expressao, oque) {
  const m = texto.match(expressao);
  if (!m) throw new Error(`não achei ${oque}`);
  return m[1];
}

/* Fonte em `data:` dentro do próprio HTML: assim a captura não depende de
   rede nem de a fonte estar instalada na máquina de quem rodar. Josefin
   Sans vem em arquivo variável, um só para 600 e 700. */
async function fonte(arquivo) {
  const dados = await readFile(join("scripts/fontes", arquivo));
  return `url(data:font/woff2;base64,${dados.toString("base64")}) format("woff2")`;
}

const unbounded = await fonte("unbounded.woff2");
const archivo = await fonte("archivo.woff2");

const site = await ler("src/lib/site.ts");

const MARCA = pegar(site, /export const MARCA = "([^"]+)"/, "a MARCA");
const DESCRITIVO = pegar(site, /export const DESCRITIVO = "([^"]+)"/, "o DESCRITIVO");
const FRASE = pegar(site, /export const FRASE =\s*\n?\s*"([^"]+)"/, "a FRASE");
const SLOGAN = pegar(site, /export const SLOGAN =\s*\n?\s*"([^"]+)"/, "o SLOGAN");

const REGIOES = await regioesAtendidas();

/* A paleta, nos mesmos valores de `globals.css`. */
const TINTA = "#111110";
const PAPEL = "#F6F2E9";
const AREIA = "#DDCBAA";
const AREIA_CLARA = "#E5D6B9";
const CINZA_CLARO = "#C8C5BD";

/* "Rio" sai na areia: e o unico ponto de cor do lockup, e e o que separa o
   nome do lugar sem precisar de segunda linha. */
const [primeiro, ...resto] = MARCA.split(" ");
const lugar = resto.join(" ");

/* --- A montagem -------------------------------------------------------- */

const html = `<!doctype html><meta charset="utf-8">
<style>
  @font-face{font-family:"Unbounded";font-weight:200 900;src:${unbounded}}
  @font-face{font-family:"Archivo";font-weight:400 700;src:${archivo}}
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;
    background:
      radial-gradient(44% 62% at 86% 14%, rgba(221,203,170,.16), transparent 70%),
      radial-gradient(48% 68% at 6% 94%, rgba(221,203,170,.09), transparent 72%),
      ${TINTA};
    font-family:"Archivo",sans-serif;color:${PAPEL};
    display:flex;flex-direction:column;justify-content:space-between;padding:72px 80px}
  /* Mesmas proporcoes de assinatura.tsx: o descritivo e 0,3 do nome, com
     0,2em de entreletra. Mudou la, muda aqui. */
  .nome{font-family:"Unbounded";font-weight:700;font-size:62px;line-height:.94;
    letter-spacing:-.035em}
  .nome .lugar{color:${AREIA}}
  .cat{font-family:"Archivo";font-weight:600;font-size:18.6px;letter-spacing:.2em;
    text-transform:uppercase;color:${CINZA_CLARO};margin-top:20px}
  h1{font-family:"Unbounded";font-weight:600;font-size:60px;line-height:1.16;
    letter-spacing:-.035em;max-width:18ch}
  .pe{display:flex;justify-content:space-between;align-items:flex-end;gap:40px;
    border-top:1px solid rgba(246,242,233,.24);padding-top:28px}
  .pe span{font-weight:600;font-size:22px;letter-spacing:.14em;text-transform:uppercase;
    color:${CINZA_CLARO};white-space:nowrap}
  .pe span.slogan{font-family:"Unbounded";font-weight:400;font-size:26px;color:${AREIA_CLARA};
    text-transform:none;letter-spacing:-.02em}
</style>
<div>
  <div class="nome">${primeiro} <span class="lugar">${lugar}</span></div>
  <div class="cat">${DESCRITIVO}</div>
</div>
<h1>${FRASE}</h1>
<div class="pe">
  <span>${REGIOES.join(" · ")}</span>
  <span class="slogan">${SLOGAN}</span>
</div>
`;

const pasta = await mkdtemp(join(tmpdir(), "casue-cartao-"));
const pagina = join(pasta, "cartao.html");
await writeFile(pagina, html, "utf8");

/* 🔴 Sem `--disable-gpu` e sem SwiftShader: nesta máquina o renderizador de
   software devolve captura em branco, sem erro nenhum. E `--virtual-time-
   budget` é o que garante que a fonte da web já baixou quando a foto sai. */
await executar(CHROME, [
  "--headless=new",
  "--window-size=1200,630",
  "--hide-scrollbars",
  "--virtual-time-budget=12000",
  "--default-background-color=00000000",
  `--screenshot=${SAIDA}`,
  `file:///${pagina.replace(/\\/g, "/")}`,
]);

/* Confere que saiu mesmo: o Chrome tem mais de um jeito de terminar bem sem
   escrever nada, e cartao velho no repositorio foi exatamente o defeito que
   este script existe para não repetir. */
const { size } = await stat(SAIDA);
if (size < 20000) throw new Error(`captura suspeita: ${size} bytes`);

await copyFile(SAIDA, GEMEO);
await rm(pasta, { recursive: true, force: true });

/* O carimbo é o que o build confere. Sem ele, mexer nas regiões e esquecer
   de rodar este script volta a passar despercebido — que foi o defeito. */
await writeFile(CARIMBO, `${REGIOES.join(" · ")}
`, "utf8");

console.log(`cartão da marca: ${MARCA} · ${REGIOES.join(" · ")}`);
