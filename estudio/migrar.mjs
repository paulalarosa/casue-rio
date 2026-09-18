/* Leva a carteira que já existe no código para dentro do painel.

   Roda UMA vez, quando o projeto da Sanity for criado, e evita recadastrar
   nove imóveis e três bairros à mão.

   uso:
     cd estudio
     cp .env.example .env        # preencha o projectId
     # e acrescente no .env, numa linha:
     #   SANITY_TOKEN=<chave de escrita>
     node migrar.mjs             # mostra o que vai fazer, sem gravar
     node migrar.mjs --gravar    # grava de verdade

   🔴 A CHAVE VEM DO `.env`, e nunca de argumento de linha de comando nem de
   mensagem colada. Argumento fica no histórico do terminal e em `ps`; chave
   colada numa conversa fica no histórico da conversa. O `.env` está no
   `.gitignore` deste diretório.

   🔴 Chave de escrita é descartável por natureza: use, e depois revogue em
   sanity.io/manage > API > Tokens. O site NÃO precisa dela para funcionar —
   ele só lê, com a chave pública. Esta aqui existe para este script e para
   mais nada. */

import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@sanity/client";

const GRAVAR = process.argv.includes("--gravar");

/* --- Ambiente --------------------------------------------------------- */

function lerEnv() {
  if (!existsSync(".env")) return;
  for (const linha of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = linha.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
lerEnv();

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";
const token = process.env.SANITY_TOKEN;

if (!projectId) {
  console.error("Falta SANITY_STUDIO_PROJECT_ID no .env.");
  process.exit(1);
}
if (GRAVAR && !token) {
  console.error(
    "Falta SANITY_TOKEN no .env. Crie uma chave de ESCRITA em\n" +
      "sanity.io/manage > API > Tokens, use, e revogue depois.",
  );
  process.exit(1);
}

/* --- Os dados que já existem ------------------------------------------ */

/* 🔴 O arquivo da carteira é TypeScript e importa de `@/...`, então não dá
   para simplesmente `import` dele aqui: o apelido de caminho é do Next, não
   do Node. Mas o conteúdo é literal puro, sem expressão nenhuma, então
   recortar o trecho e avaliar resolve sem dependência nova.

   Se um dia alguém puser uma chamada de função dentro do arquivo, isto para
   de valer — e é por isso que o recorte é por marcador exato e falha alto em
   vez de adivinhar. */
function extrairLiteral(texto, declaracao) {
  const inicio = texto.indexOf(declaracao);
  if (inicio < 0) throw new Error(`não achei "${declaracao}" na carteira`);
  /* 🔴 O colchete que interessa é o de DEPOIS do sinal de igual. O primeiro
     colchete depois do nome é o do TIPO — em `IMOVEIS: Imovel[] = [`, o
     `[]` de `Imovel[]` vem antes. Pegando ele, o script lia um vetor vazio,
     imprimia "0 imóveis" com toda a calma do mundo e não avisava nada. */
  const igual = texto.indexOf("=", inicio);
  if (igual < 0) throw new Error(`"${declaracao}" não tem atribuição`);
  const abre = texto.indexOf("[", igual);
  let nivel = 0;
  let dentroDeTexto = null;
  for (let i = abre; i < texto.length; i++) {
    const c = texto[i];
    if (dentroDeTexto) {
      if (c === "\\") i++;
      else if (c === dentroDeTexto) dentroDeTexto = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") dentroDeTexto = c;
    else if (c === "[") nivel++;
    else if (c === "]") {
      nivel--;
      if (nivel === 0) {
        const trecho = texto.slice(abre, i + 1);
        const lista = new Function(`return ${trecho};`)();
        /* Lista vazia aqui é sempre defeito de recorte, nunca dado: a
           carteira tem imóveis e o site mostra os bairros. Falhar alto é o
           que impede uma migração de "sucesso" que não gravou nada. */
        if (!Array.isArray(lista) || lista.length === 0) {
          throw new Error(`"${declaracao}" saiu vazio — o recorte errou`);
        }
        return lista;
      }
    }
  }
  throw new Error(`colchete não fechou em "${declaracao}"`);
}

const carteira = readFileSync("../web/src/lib/imoveis.ts", "utf8");
const IMOVEIS = extrairLiteral(carteira, "export const IMOVEIS");
const BAIRROS = extrairLiteral(carteira, "export const BAIRROS: Bairro[]");

/* --- Tradução para o painel ------------------------------------------- */

/* O `_id` é fixo e derivado do dado, e não sorteado: rodar o script duas
   vezes atualiza os mesmos documentos em vez de criar tudo de novo. Sem
   isso, um segundo `node migrar.mjs` dobraria a carteira. */
const idDoBairro = (chave) => `bairro-${chave.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]+/g, "-")}`;
const idDoImovel = (codigo) => `imovel-${codigo.toLowerCase()}`;

const docsBairro = BAIRROS.map((b, i) => ({
  _id: idDoBairro(b.chave),
  _type: "bairro",
  nome: b.nome,
  chave: { _type: "slug", current: b.chave },
  linha: b.linha,
  texto: b.texto,
  cena: b.cena,
  ordem: (i + 1) * 10,
}));

const docsImovel = IMOVEIS.map((im) => ({
  _id: idDoImovel(im.codigo),
  _type: "imovel",
  codigo: im.codigo,
  titulo: im.titulo,
  resumo: im.resumo,
  bairro: im.bairro,
  regiao: { _type: "reference", _ref: idDoBairro(im.regiao) },
  finalidade: im.finalidade,
  preco: im.preco,
  porMes: im.porMes ?? false,
  condominio: im.condominio,
  iptu: im.iptu,
  quartos: im.quartos,
  suites: im.suites,
  banheiros: im.banheiros,
  vagas: im.vagas,
  area: im.area,
  andar: im.andar,
  ano: im.ano,
  selos: im.selos,
  destaque: im.destaque,
  fechado: im.fechado ?? false,
  cena: im.cena,
  /* 🔴 FOTO NÃO VEM. Não existe foto real de imóvel neste projeto: o que
     existe é ilustração da marca, desenhada, que não finge ser foto. Subir
     ilustração como se fosse fotografia de um apartamento à venda é
     exatamente o que este site decidiu não fazer. O campo fica vazio e elas
     preenchem com as fotos de verdade. */
}));

/* --- Execução ---------------------------------------------------------- */

console.log(`projeto ${projectId} · conjunto ${dataset}`);
console.log(`${docsBairro.length} bairros: ${docsBairro.map((b) => b.nome).join(", ")}`);
console.log(`${docsImovel.length} imóveis:`);
for (const d of docsImovel) {
  console.log(
    `  ${d.codigo}  ${d.titulo.padEnd(38)} ${d.bairro.padEnd(12)} ${
      d.finalidade
    }${d.fechado ? " (fora da carteira)" : ""}`,
  );
}

if (!GRAVAR) {
  console.log("\nEnsaio. Nada foi gravado. Para valer: node migrar.mjs --gravar");
  process.exit(0);
}

const cliente = createClient({ projectId, dataset, apiVersion: "2026-09-01", token, useCdn: false });

/* Os bairros primeiro: o imóvel aponta para eles, e referência para
   documento que ainda não existe é recusada. */
const lote = cliente.transaction();
for (const d of [...docsBairro, ...docsImovel]) lote.createOrReplace(d);
await lote.commit();

console.log(`\ngravado: ${docsBairro.length} bairros e ${docsImovel.length} imóveis.`);
console.log("🔴 Agora revogue a chave em sanity.io/manage > API > Tokens.");
