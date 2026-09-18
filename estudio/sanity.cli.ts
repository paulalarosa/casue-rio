import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  studioHost: "casue-rio",
  deployment: { appId: "cezvg71xhpzafsefindbq3b5" },
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  },
});
