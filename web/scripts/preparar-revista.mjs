/* Liga e desliga a página do artigo conforme existam artigos publicados.

   🔴 ISTO EXISTE POR CAUSA DE UMA REGRA DO NEXT, não por gosto. Com
   `output: "export"`, uma rota dinâmica cujo `generateStaticParams()` devolve
   lista vazia é ERRO DURO:

     Error: Page "/revista/[slug]" returned an empty array from
     "generateStaticParams()". With "output: export", at least one route
     must be generated.

   Eu tinha suposto que ela simplesmente não geraria página nenhuma. Não é
   isso: derruba a publicação inteira do site. Ou seja, o arquivo da página do
   artigo não pode ficar em `[slug]/` enquanto não houver nenhum texto.

   A primeira versão disto era um `mv` na mão, escrito no README. Estava
   errado: significa que no dia em que a primeira corretora publicar um texto,
   o site republica e o texto NÃO aparece, porque alguém esqueceu de rodar um
   comando que ninguém leu. Automação que depende de memória humana é a mesma
   coisa que não ter automação.

   Como funciona:
   · a fonte de verdade é `_artigo/`, com underscore, que o Next ignora como
     rota e que É versionado;
   · este script pergunta ao painel quantos artigos estão publicados;
   · se houver, COPIA para `[slug]/`; se não houver, apaga `[slug]/`.

   Copia em vez de renomear de propósito: assim a árvore versionada nunca
   muda, e `[slug]/` é descartável e está no `.gitignore`. Renomear deixaria
   o repositório sujo a cada build local.

   Roda antes do `next build`, sempre, inclusive na publicação. */

import { cp, rm, stat, readFile } from "node:fs/promises";

/* 🔴 Este script roda FORA do Next, e quem lê `.env.local` é o Next. Sem
   isto, `NEXT_PUBLIC_SANITY_PROJECT_ID` chega indefinido numa máquina de
   desenvolvimento, a consulta nem sai, e a rota do artigo é desligada em
   silêncio mesmo havendo texto publicado.

   Foi exatamente o que aconteceu no primeiro teste: o painel dizia 1 artigo
   e o build dizia "nenhum artigo publicado". Na publicação funcionava, porque
   lá a variável é de ambiente de verdade — ou seja, era um defeito que só
   apareceria para quem trabalhasse no site, e nunca no ar. */
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

/* 🔴 A MESMA condição de `web/src/lib/revista.ts`, e a duplicação é o risco
   deste arquivo. Se as duas divergirem, o pior caso é concreto: um texto
   agendado para amanhã contaria aqui como publicado, a rota do artigo
   ligaria, e o `generateStaticParams` da rota, que usa a consulta filtrada,
   devolveria lista vazia. Lista vazia com `output: export` é ERRO DURO, e
   a publicação inteira do site cai por causa de um texto que nem era para
   estar no ar ainda. Mudou lá, muda aqui, na mesma hora. */
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
    /* 🔴 Painel fora do ar NÃO derruba a publicação. O pior caso aqui é o
       site subir sem a página de um artigo novo, e o melhor caso de um
       `throw` seria o site inteiro não subir. Entre publicar um site com um
       texto a menos e não publicar nada, a escolha não é difícil. */
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
