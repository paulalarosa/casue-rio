import { readdir, mkdir, rename, rm, stat } from "node:fs/promises";
import { join } from "node:path";

const SAIDA = "cards";
const REVISTA = join("out", "revista");

const PECAS = { cartao: "feed-1080x1350", citacao: "citacao-1080x1080" };

async function existe(caminho) {
  try {
    await stat(caminho);
    return true;
  } catch {
    return false;
  }
}

if (!(await existe(REVISTA))) {
  console.log("[cards] a revista não foi gerada. Nada a fazer.");
  process.exit(0);
}

await mkdir(SAIDA, { recursive: true });

let movidas = 0;
for (const entrada of await readdir(REVISTA, { withFileTypes: true })) {
  if (!entrada.isDirectory()) continue;
  const slug = entrada.name;

  for (const [rota, sufixo] of Object.entries(PECAS)) {
    const origem = join(REVISTA, slug, rota);
    if (!(await existe(origem))) continue;

    const info = await stat(origem);
    let arquivo = origem;
    if (info.isDirectory()) {
      const dentro = await readdir(origem);
      if (dentro.length !== 1) {
        throw new Error(
          `[cards] esperava um arquivo em ${origem}, achei ${dentro.length}: ${dentro.join(", ")}`,
        );
      }
      arquivo = join(origem, dentro[0]);
    }

    await rename(arquivo, join(SAIDA, `${slug}-${sufixo}.png`));
    await rm(origem, { recursive: true, force: true });
    movidas += 1;
  }
}

for (const entrada of await readdir(REVISTA, { withFileTypes: true })) {
  if (!entrada.isDirectory()) continue;
  for (const rota of Object.keys(PECAS)) {
    if (await existe(join(REVISTA, entrada.name, rota))) {
      throw new Error(`[cards] ${entrada.name}/${rota} continua em out/. Não subo assim.`);
    }
  }
}

console.log(
  movidas > 0
    ? `[cards] ${movidas} peça(s) em ${SAIDA}/, e nenhuma em out/.`
    : "[cards] nenhum artigo publicado: nenhuma peça.",
);
