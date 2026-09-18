#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const exigir = createRequire(path.join(process.cwd(), "web", "package.json"));
const ts = exigir("typescript");

const GRAVAR = process.argv.includes("--gravar");
const GUARDAR =
  /^(\/\/\/|\/\/\s*(eslint|@ts-|prettier|biome|sourceMappingURL)|\/\*\s*(eslint|@ts-|@license|@vite|webpack|!))/;

const alvos = execSync("git ls-files --cached --others --exclude-standard", {
  encoding: "utf8",
})
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean)
  .filter((f) => /\.(ts|tsx|mjs|js)$/.test(f))
  .filter((f) => !f.includes("node_modules"))
  .filter((f) => f !== "scripts/sem-comentarios.mjs");

function faixasDe(texto, caminho) {
  const fonte = ts.createSourceFile(
    caminho,
    texto,
    ts.ScriptTarget.Latest,
    true,
    /\.tsx$/.test(caminho) ? ts.ScriptKind.TSX : undefined,
  );

  const faixas = [];
  const vistas = new Set();
  const adicionar = (pos, end) => {
    const chave = `${pos}:${end}`;
    if (vistas.has(chave)) return;
    vistas.add(chave);
    faixas.push({ pos, end, texto: texto.slice(pos, end) });
  };

  const jsx = [];

  function varrer(no) {
    if (ts.isJsxExpression(no) && !no.expression) {
      const corpo = texto.slice(no.getStart(fonte), no.getEnd());
      if (corpo.includes("/*") || corpo.includes("//")) {
        jsx.push({ pos: no.getStart(fonte), end: no.getEnd() });
      }
    }
    for (const filho of no.getChildren(fonte)) {
      const inicio = filho.getFullStart();
      for (const c of ts.getLeadingCommentRanges(texto, inicio) ?? []) {
        adicionar(c.pos, c.end);
      }
      for (const c of ts.getTrailingCommentRanges(texto, filho.getEnd()) ?? []) {
        adicionar(c.pos, c.end);
      }
      varrer(filho);
    }
  }
  varrer(fonte);

  const dentroDeJsx = (f) => jsx.some((j) => f.pos >= j.pos && f.end <= j.end);
  const soltas = faixas.filter((f) => !dentroDeJsx(f));
  const todas = [...soltas, ...jsx.map((j) => ({ ...j, texto: texto.slice(j.pos, j.end) }))]
    .filter((f) => !GUARDAR.test(f.texto.trim()))
    .sort((a, b) => a.pos - b.pos);

  for (let i = 1; i < todas.length; i += 1) {
    if (todas[i].pos < todas[i - 1].end) {
      throw new Error(`faixas sobrepostas em ${caminho} (${todas[i - 1].pos}..${todas[i].end})`);
    }
  }
  return todas;
}

function limpar(texto, faixas) {
  let saida = texto;
  for (let i = faixas.length - 1; i >= 0; i -= 1) {
    const { pos, end } = faixas[i];
    const inicioDaLinha = saida.lastIndexOf("\n", pos - 1) + 1;
    const antes = saida.slice(inicioDaLinha, pos);
    let fim = end;
    const resto = saida.slice(end);
    const quebra = resto.indexOf("\n");
    const depois = quebra === -1 ? resto : resto.slice(0, quebra);

    if (antes.trim() === "" && depois.trim() === "") {
      fim = quebra === -1 ? saida.length : end + quebra + 1;
      saida = saida.slice(0, inicioDaLinha) + saida.slice(fim);
    } else {
      saida = saida.slice(0, pos) + (antes.trim() === "" ? "" : " ") + saida.slice(end);
    }
  }
  return saida.replace(/\n{3,}/g, "\n\n");
}

let totalFaixas = 0;
let totalArquivos = 0;

for (const alvo of alvos) {
  const texto = readFileSync(alvo, "utf8");
  const faixas = faixasDe(texto, alvo);
  if (faixas.length === 0) continue;

  const limpo = limpar(texto, faixas);
  faixasDe(limpo, alvo);

  totalFaixas += faixas.length;
  totalArquivos += 1;
  if (GRAVAR) writeFileSync(alvo, limpo);
  process.stdout.write(`${String(faixas.length).padStart(4)}  ${alvo}\n`);
}

process.stdout.write(
  `\n${totalFaixas} comentarios em ${totalArquivos} arquivos${GRAVAR ? " (gravado)" : " (ensaio, use --gravar)"}\n`,
);
