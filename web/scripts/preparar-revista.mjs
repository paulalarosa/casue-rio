import { cp, rm, stat, readFile } from "node:fs/promises";

async function lerEnvLocal() {
  for (const arquivo of [".env.local", ".env"]) {
    let texto;
    try {
      texto = await readFile(arquivo, "utf8");
    } catch {
      continue;
    }
    for (const linha of texto.split(/\r?\n/)) {
      const m = linha.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}
await lerEnvLocal();

const FONTE = "src/app/revista/_artigo";
const ROTA = "src/app/revista/[slug]";

async function existe(caminho) {
  try {
    await stat(caminho);
    return true;
  } catch {
    return false;
  }
}

const projeto = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const conjunto = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

if (!projeto) {
  console.warn("[revista] sem NEXT_PUBLIC_SANITY_PROJECT_ID: rota desligada.");
}

async function quantosArtigos() {
  if (!projeto) return 0;
  const consulta =
    `count(*[_type == "artigo" && defined(slug.current)` +
    ` && data <= "${new Date().toISOString()}"])`;
  const url =
    `https://${projeto}.api.sanity.io/v2026-09-01/data/query/${conjunto}` +
    `?query=${encodeURIComponent(consulta)}`;
  try {
    const resposta = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const { result } = await resposta.json();
    return typeof result === "number" ? result : 0;
  } catch (erro) {
    console.warn(`[revista] não consegui perguntar ao painel (${erro.message}).`);
    console.warn("[revista] seguindo com a rota desligada.");
    return 0;
  }
}

const n = await quantosArtigos();

if (n > 0) {
  if (!(await existe(FONTE))) {
    throw new Error(`[revista] há ${n} artigo(s) publicado(s) mas ${FONTE} sumiu.`);
  }
  await rm(ROTA, { recursive: true, force: true });
  await cp(FONTE, ROTA, { recursive: true });
  console.log(`[revista] ${n} artigo(s) publicado(s): rota ligada.`);
} else {
  await rm(ROTA, { recursive: true, force: true });
  console.log("[revista] nenhum artigo publicado: rota desligada.");
}
