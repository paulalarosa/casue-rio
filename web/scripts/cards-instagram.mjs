/* Tira as peças de Instagram de dentro de `out/` e põe em `cards/`.

   🔴 O MOTIVO DE ELE EXISTIR: quem desenha as peças é o Next, e o Next só
   sabe escrever dentro da pasta que ele exporta. Se ficassem lá, a sincronia
   com o S3 as levaria junto e elas teriam endereço público. A promessa
   combinada é outra: card é material de quem cuida da conta, baixado como
   artefato do GitHub por quem tem acesso ao repositório, e repassado a quem
   vai postar.

   🔴 E ele QUEBRA O BUILD se não conseguir mover. Um `catch` silencioso aqui
   seria o pior desenho possível: o dia em que o Next mudasse o nome do
   arquivo exportado, as peças subiriam para o balde e ninguém saberia. Entre
   uma publicação vermelha e uma promessa quebrada em silêncio, a vermelha. */
import { readdir, mkdir, rename, rm, stat } from "node:fs/promises";
import { join } from "node:path";

const SAIDA = "cards";
const REVISTA = join("out", "revista");

/* Nome do arquivo exportado pela rota → sufixo da peça. */
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

    /* A rota exporta uma PASTA com o arquivo dentro, ou o arquivo direto,
       conforme a versão do Next. Aceitar os dois é mais barato que descobrir
       qual é a de hoje toda vez que o Next sobe de versão. */
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

/* Conferência final: nenhuma peça pode ter sobrado em `out/`. */
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
