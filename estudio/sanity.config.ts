import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { tipos } from "./schemaTypes";

/* O painel da Casuê Rio.

   🔴 Isto NÃO é um servidor. É a diferença que decidiu a escolha: o Strapi e
   o Directus são programas de licença gratuita que precisam de uma máquina
   ligada 24 horas por dia para o painel existir, e essa máquina é custo fixo
   mensal na AWS. Aqui o painel é uma página estática que a Sanity hospeda, e
   o banco é deles. O site na AWS continua sendo só arquivos.

   As duas entram por um endereço próprio, com o e-mail delas. Ninguém precisa
   de conta no GitHub, na AWS nem em lugar nenhum de infraestrutura.

   🔴 O `projectId` vem do ambiente e NÃO tem valor de reserva de propósito.
   Um identificador inventado aqui faria o painel abrir, pedir login e falhar
   com "projeto não encontrado", que é o erro mais difícil de diagnosticar
   que existe nesta configuração. Sem a variável, ele para agora e diz o que
   falta. */
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

if (!projectId) {
  throw new Error(
    "Falta SANITY_STUDIO_PROJECT_ID. Copie o `.env.example` para `.env` e " +
      "preencha com o identificador do projeto, que aparece em sanity.io/manage.",
  );
}

export default defineConfig({
  name: "casue-rio",
  title: "Casuê Rio",
  projectId,
  dataset,
  schema: { types: tipos },
  plugins: [
    /* A ordem da barra lateral é a ordem do trabalho delas: imóvel entra
       toda semana, artigo de vez em quando, bairro quase nunca. */
    structureTool({
      structure: (S) =>
        S.list()
          .title("Casuê Rio")
          .items([
            S.documentTypeListItem("imovel").title("Imóveis"),
            S.documentTypeListItem("artigo").title("Revista"),
            S.divider(),
            S.documentTypeListItem("bairro").title("Bairros"),
          ]),
    }),
    /* A janela de consulta fica só para mim: é onde eu confiro o que o site
       vai receber antes de trocar a fonte de dados. */
    visionTool({ defaultApiVersion: "2026-09-01" }),
  ],
});
