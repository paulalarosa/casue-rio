import { defineCliConfig } from "sanity/cli";

/* 🔴 `npm run deploy` publica o PAINEL, não o site. Ele sobe em
   `<nome>.sanity.studio`, hospedado pela Sanity, e é esse endereço que as
   duas abrem para escrever. Nada disto encosta na AWS.

   O nome do endereço é escolhido uma vez, no primeiro `deploy`, e a linha de
   comando pergunta. Depois ele fica guardado no projeto. */
export default defineCliConfig({
  /* O endereco publicado e o identificador da aplicacao, gravados aqui para
     o proximo `deploy` nao perguntar nada. Sem eles, quem publicar da
     proxima vez responde no escuro e pode criar um SEGUNDO painel, com outro
     endereco, enquanto as duas continuam abrindo o primeiro. */
  studioHost: "casue-rio",
  deployment: { appId: "cezvg71xhpzafsefindbq3b5" },
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  },
});
