#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const exigir = createRequire(path.join(process.cwd(), "web", "package.json"));
const ts = exigir("typescript");
const postcss = exigir("postcss");
const yaml = exigir("yaml");

const GRAVAR = process.argv.includes("--gravar");
const EXIGIR = process.argv.includes("--exigir");
const GUARDAR =
  /^(\/\/\/|\/\/\s*(eslint|@ts-|prettier|biome|sourceMappingURL)|\/\*\s*(eslint|@ts-|@license|@vite|webpack|!))/;

const alvos = execSync("git ls-files --cached --others --exclude-standard", {
  encoding: "utf8",
})
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean)
  .filter((f) => /\.(ts|tsx|mjs|mts|js|css|ya?ml|sh)$/.test(f))
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

function emJs(texto, caminho) {
  const faixas = faixasDe(texto, caminho);
  if (faixas.length === 0) return null;
  const limpo = limpar(texto, faixas);
  faixasDe(limpo, caminho);
  return { quantos: faixas.length, limpo };
}

function emCss(texto, caminho) {
  const raiz = postcss.parse(texto, { from: caminho });
  let quantos = 0;
  raiz.walkComments((no) => {
    if (GUARDAR.test(`/*${no.text}`)) return;
    quantos += 1;
    no.remove();
  });
  if (quantos === 0) return null;

  const limpo = raiz.toString().replace(/\n{3,}/g, "\n\n");
  const sobrou = [];
  postcss.parse(limpo, { from: caminho }).walkComments((no) => sobrou.push(no));
  if (sobrou.length) throw new Error(`${caminho}: sobrou comentario depois de limpar`);
  return { quantos, limpo };
}

const HASH = /^\s*#(?!!)/;

function semLinhasDeCerquilha(texto) {
  return texto
    .split("\n")
    .filter((linha) => !HASH.test(linha))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

function scripts(doc) {
  const achados = [];
  yaml.visit(doc, {
    Pair(_chave, par) {
      if (par.key?.value === "run" && typeof par.value?.value === "string") {
        achados.push(par.value.value);
      }
    },
  });
  return achados;
}

function conferirShell(trecho, caminho) {
  try {
    execSync("bash -n", { input: trecho, stdio: ["pipe", "ignore", "pipe"] });
  } catch (erro) {
    throw new Error(`${caminho}: shell quebrado depois de limpar\n${erro.stderr}`);
  }
}

function emYaml(texto, caminho) {
  const limpo = semLinhasDeCerquilha(texto);
  const quantos = texto.split("\n").filter((l) => HASH.test(l)).length;
  if (quantos === 0) return null;

  const antes = yaml.parseDocument(texto);
  const depois = yaml.parseDocument(limpo);
  if (depois.errors.length) {
    throw new Error(`${caminho}: YAML quebrado depois de limpar`);
  }

  const chaveDe = (doc) =>
    JSON.stringify(doc.toJS(), (chave, valor) =>
      chave === "run" && typeof valor === "string" ? semLinhasDeCerquilha(valor) : valor,
    );
  if (chaveDe(antes) !== chaveDe(depois)) {
    throw new Error(`${caminho}: a limpeza mudou o significado do YAML`);
  }
  for (const trecho of scripts(depois)) conferirShell(trecho, caminho);

  return { quantos, limpo };
}

function emShell(texto, caminho) {
  const quantos = texto.split("\n").filter((l) => HASH.test(l)).length;
  if (quantos === 0) return null;
  const limpo = semLinhasDeCerquilha(texto);
  conferirShell(limpo, caminho);
  return { quantos, limpo };
}

function varredorDe(caminho) {
  if (/\.css$/.test(caminho)) return emCss;
  if (/\.ya?ml$/.test(caminho)) return emYaml;
  if (/\.sh$/.test(caminho)) return emShell;
  return emJs;
}

let totalFaixas = 0;
let totalArquivos = 0;

for (const alvo of alvos) {
  const texto = readFileSync(alvo, "utf8");
  const achado = varredorDe(alvo)(texto, alvo);
  if (!achado) continue;

  totalFaixas += achado.quantos;
  totalArquivos += 1;
  if (GRAVAR) writeFileSync(alvo, achado.limpo);
  process.stdout.write(`${String(achado.quantos).padStart(4)}  ${alvo}\n`);
}

const modo = GRAVAR ? " (gravado)" : EXIGIR ? "" : " (ensaio, use --gravar)";
process.stdout.write(`\n${totalFaixas} comentarios em ${totalArquivos} arquivos${modo}\n`);

if (EXIGIR && totalFaixas > 0) {
  process.stdout.write("\nO repositorio e sem comentario. Rode: node scripts/sem-comentarios.mjs --gravar\n");
  process.exit(1);
}
