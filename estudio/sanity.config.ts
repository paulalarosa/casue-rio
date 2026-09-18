import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { tipos } from "./schemaTypes";
import { tema } from "./marca/tema";
import { Placa } from "./marca/placa";
import { Tipografia } from "./marca/tipografia";
import { ComoPublicar } from "./marca/como-publicar";

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
  icon: Placa,
  projectId,
  dataset,
  schema: { types: tipos },
  theme: tema,
  studio: { components: { layout: Tipografia } },
  plugins: [
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
