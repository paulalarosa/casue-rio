import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { BAIRROS, IMOVEIS } from "@/lib/carteira";
import { listarArtigos } from "@/lib/revista";

export const dynamic = "force-static";

const comBarra = (rota: string) => `${SITE}${rota}/`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const agora = new Date();

  const fixas = [
    "",
    "/imoveis",
    "/bairros",
    "/avaliacao",
    "/quem-somos",
    "/revista",
    "/contato",
    "/privacidade",
  ].map((r) => ({
    url: comBarra(r),
    lastModified: agora,
    changeFrequency: "monthly" as const,
    priority: r === "" ? 1 : r === "/privacidade" ? 0.3 : 0.8,
  }));

  const imoveis = IMOVEIS.map((im) => ({
    url: comBarra(`/imoveis/${im.codigo}`),
    lastModified: agora,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const bairros = BAIRROS.map((b) => ({
    url: comBarra(`/bairros/${b.apelido}`),
    lastModified: agora,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const artigos = (await listarArtigos()).map((a) => ({
    url: comBarra(`/revista/${a.slug}`),
    lastModified: new Date(a.data),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...fixas, ...imoveis, ...bairros, ...artigos];
}
