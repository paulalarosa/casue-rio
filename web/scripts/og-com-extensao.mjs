import { readdir, copyFile, stat, readFile } from "node:fs/promises";
import { join } from "node:path";
import { regioesAtendidas } from "./regioes.mjs";

async function conferirCartao() {
  const esperado = (await regioesAtendidas()).join(" · ");
  const carimbo = await readFile("scripts/cartao-marca.carimbo", "utf8").catch(
    () => "",
  );
  if (carimbo.trim() !== esperado) {
    throw new Error(
      `O cartão da marca está desatualizado.\n` +
        `  desenhado: ${carimbo.trim() || "(sem carimbo)"}\n` +
        `  atual:     ${esperado}\n` +
        `  conserto:  node scripts/cartao-marca.mjs`,
    );
  }
}

const RAIZ = "out";
let feitos = 0;

async function varrer(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const caminho = join(dir, item.name);
    if (item.isDirectory()) {
      await varrer(caminho);
    } else if (item.name === "opengraph-image" || item.name === "twitter-image") {
      const info = await stat(caminho);
      if (info.size > 0) {
        await copyFile(caminho, `${caminho}.png`);
        feitos++;
      }
    }
  }
}

await conferirCartao();
await varrer(RAIZ);
console.log(`imagens de compartilhamento com extensão: ${feitos}`);
