import { readFile, writeFile, copyFile, mkdtemp, rm, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { regioesAtendidas } from "./regioes.mjs";

const executar = promisify(execFile);

const CHROME =
  process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const SAIDA = resolve("src/app/opengraph-image.png");
const GEMEO = resolve("src/app/twitter-image.png");
const CARIMBO = resolve("scripts/cartao-marca.carimbo");

async function ler(caminho) {
  return readFile(caminho, "utf8");
}

function pegar(texto, expressao, oque) {
  const m = texto.match(expressao);
  if (!m) throw new Error(`não achei ${oque}`);
  return m[1];
}

async function fonte(arquivo) {
  const dados = await readFile(join("scripts/fontes", arquivo));
  return `url(data:font/woff2;base64,${dados.toString("base64")}) format("woff2")`;
}

const unbounded = await fonte("unbounded.woff2");
const archivo = await fonte("archivo.woff2");

const site = await ler("src/lib/site.ts");

const MARCA = pegar(site, /export const MARCA = "([^"]+)"/, "a MARCA");
const DESCRITIVO = pegar(site, /export const DESCRITIVO = "([^"]+)"/, "o DESCRITIVO");
const SLOGAN = pegar(site, /export const SLOGAN =\s*\n?\s*"([^"]+)"/, "o SLOGAN");

const REGIOES = await regioesAtendidas();

const TINTA = "#111110";
const PAPEL = "#F6F2E9";
const AREIA_CLARA = "#E5D6B9";
const CINZA_CLARO = "#C8C5BD";

const [primeiro, ...resto] = MARCA.split(" ");
const lugar = resto.join(" ");

const TERRACOTA = "#A8482A";
const E_CIRCUNFLEXO =
  "M50.97 63.46Q46.69 63.46 43.32 61.89Q39.96 60.32 38.01 57.49Q36.07 54.66 36.07 50.91Q36.07 47.20 37.94 44.42Q39.80 41.63 43.05 40.07Q46.29 38.51 50.39 38.51Q54.61 38.51 57.62 40.34Q60.62 42.17 62.24 45.51Q63.86 48.85 63.86 53.40H42.91V48.32H59.12L56.36 50.09Q56.21 48.30 55.46 47.04Q54.72 45.79 53.49 45.12Q52.27 44.46 50.59 44.46Q48.73 44.46 47.39 45.20Q46.06 45.94 45.33 47.24Q44.60 48.55 44.60 50.26Q44.60 52.49 45.60 54.05Q46.61 55.62 48.56 56.44Q50.52 57.27 53.37 57.27Q55.98 57.27 58.57 56.58Q61.15 55.90 63.25 54.64V60.01Q60.80 61.66 57.70 62.56Q54.60 63.46 50.97 63.46ZM46.01 29.09H54.67L60.57 36.89H53.91L48.39 31.16H52.29L46.79 36.89H40.10Z";
const PLACA = `<svg class="placa" viewBox="0 0 100 100" width="138" height="138">
  <rect x="0" y="0" width="100" height="100" rx="17.3" fill="${TERRACOTA}"/>
  <rect x="10.65" y="10.65" width="78.7" height="78.7" rx="10.7" fill="none"
        stroke="${PAPEL}" stroke-width="2"/>
  <path d="${E_CIRCUNFLEXO}" fill="${PAPEL}"/>
</svg>`;

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
  /* Montagem 01: a placa e 2,22 vezes o corpo do nome e a folga entre as
     duas e 0,689 desse corpo. Mudou em assinatura.tsx, muda aqui. */
  .marca{display:flex;align-items:center;gap:43px}
  .placa{display:block;flex:none}
  .nome{font-family:"Unbounded";font-weight:700;font-size:62px;line-height:.94;
    letter-spacing:-.035em;color:${AREIA_CLARA}}
  .nome .lugar{opacity:.8}
  .cat{font-family:"Archivo";font-weight:600;font-size:18.6px;letter-spacing:.2em;
    text-transform:uppercase;color:${CINZA_CLARO};margin-top:22px;margin-left:181px}
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
  <div class="marca">
    ${PLACA}
    <div class="nome">${primeiro} <span class="lugar">${lugar}</span></div>
  </div>
  <div class="cat">${DESCRITIVO}</div>
</div>
<h1>${SLOGAN}</h1>
<div class="pe">
  <span>${REGIOES.join(" · ")}</span>
  <span class="slogan">Documentação conferida.</span>
</div>
`;

const pasta = await mkdtemp(join(tmpdir(), "casue-cartao-"));
const pagina = join(pasta, "cartao.html");
await writeFile(pagina, html, "utf8");

await executar(CHROME, [
  "--headless=new",
  "--window-size=1200,630",
  "--hide-scrollbars",
  "--virtual-time-budget=12000",
  "--default-background-color=00000000",
  `--screenshot=${SAIDA}`,
  `file:///${pagina.replace(/\\/g, "/")}`,
]);

const { size } = await stat(SAIDA);
if (size < 20000) throw new Error(`captura suspeita: ${size} bytes`);

await copyFile(SAIDA, GEMEO);
await rm(pasta, { recursive: true, force: true });

await writeFile(
  CARIMBO,
  `${REGIOES.join(" · ")}
`,
  "utf8",
);

console.log(`cartão da marca: ${MARCA} · ${REGIOES.join(" · ")}`);
