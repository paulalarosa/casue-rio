import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { tipos } from "./schemaTypes";
import { tema } from "./marca/tema";
import { Placa } from "./marca/placa";
import { Tipografia } from "./marca/tipografia";
import { ComoPublicar } from "./marca/como-publicar";

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
  /* A placa no lugar do quadradinho da Sanity. É o que diz, em meio segundo
     e antes de qualquer texto carregar, que este painel é o da casa. */
  icon: Placa,
  projectId,
  dataset,
  schema: { types: tipos },
  theme: tema,
  studio: { components: { layout: Tipografia } },
  plugins: [
    /* 🔴 DUAS portas na barra lateral, e nenhuma a mais.

       O painel já teve Imóveis e Bairros. Saíram: o painel é das duas, e o
       que as duas fazem aqui é escrever. Tudo o mais que muda no site muda
       em código, com quem faz a manutenção, e é por isso que o erro de um
       artigo nunca passa de um artigo.

       A segunda porta é a ajuda, e ela está aqui dentro em vez de num PDF
       por um motivo medido em todo projeto: manual que mora fora do painel
       responde a dúvida do primeiro dia e some no segundo. A dúvida volta às
       nove da noite de um domingo, com o painel aberto e ninguém para
       perguntar.

       A janela de consulta (Vision) também saiu. Ela roda GROQ à mão e é
       ferramenta de quem monta, não de quem escreve. */
    structureTool({
      structure: (S) =>
        S.list()
          .title("Casuê Rio")
          .items([
            S.documentTypeListItem("artigo").title("Revista"),
            S.divider(),
            S.listItem()
              .title("Como publicar")
              .id("como-publicar")
              .icon(HelpCircleIcon)
              .child(S.component(ComoPublicar).id("como-publicar").title("Como publicar")),
          ]),
    }),
  ],
});
