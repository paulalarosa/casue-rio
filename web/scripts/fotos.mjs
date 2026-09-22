#!/usr/bin/env node
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const LARGURA_GRANDE = 1600;
const LARGURA_MINIATURA = 480;
const QUALIDADE = 82;

const [origem, destino] = process.argv.slice(2);

if (!origem || !destino) {
  process.stdout.write("uso: node scripts/fotos.mjs <pasta-origem> <pasta-destino>\n");
  process.exit(1);
}

const saida = path.join("public", destino);
await mkdir(saida, { recursive: true });

const arquivos = (await readdir(origem))
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort();

const feitos = [];

for (const arquivo of arquivos) {
  const nome = path.parse(arquivo).name;
  const fonte = sharp(path.join(origem, arquivo)).rotate();
  const { width, height } = await fonte.metadata();

  const grande = await fonte
    .clone()
    .resize({ width: Math.min(width, LARGURA_GRANDE), withoutEnlargement: true })
    .webp({ quality: QUALIDADE })
    .toBuffer();

  const miniatura = await fonte
    .clone()
    .resize({ width: LARGURA_MINIATURA, withoutEnlargement: true })
    .webp({ quality: QUALIDADE })
    .toBuffer();

  await writeFile(path.join(saida, `${nome}.webp`), grande);
  await writeFile(path.join(saida, `${nome}-min.webp`), miniatura);

  feitos.push({
    nome,
    width,
    height,
    grande: grande.length,
    miniatura: miniatura.length,
  });
}

const soma = feitos.reduce((t, f) => t + f.grande + f.miniatura, 0);

for (const f of feitos) {
  process.stdout.write(
    `${f.nome.padEnd(6)} ${String(f.width).padStart(5)}x${String(f.height).padEnd(5)} ` +
      `${String(Math.round(f.grande / 1024)).padStart(5)} KB + ` +
      `${String(Math.round(f.miniatura / 1024)).padStart(3)} KB\n`,
  );
}

process.stdout.write(
  `\n${feitos.length} fotos em /${destino}, ${Math.round(soma / 1024)} KB no total\n`,
);
