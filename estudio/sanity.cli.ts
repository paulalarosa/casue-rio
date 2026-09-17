import { defineCliConfig } from "sanity/cli";

/* 🔴 `npm run deploy` publica o PAINEL, não o site. Ele sobe em
   `<nome>.sanity.studio`, hospedado pela Sanity, e é esse endereço que as
   duas abrem para escrever. Nada disto encosta na AWS.

   O nome do endereço é escolhido uma vez, no primeiro `deploy`, e a linha de
   comando pergunta. Depois ele fica guardado no projeto. */
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  },
});
