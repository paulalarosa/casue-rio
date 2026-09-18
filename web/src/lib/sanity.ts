import { createClient } from "next-sanity";
import criarUrl from "@sanity/image-url";
import type { Image } from "sanity";

const PROJETO = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const CONJUNTO = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const VERSAO = "2026-09-01";

export const cliente = PROJETO
  ? createClient({
      projectId: PROJETO,
      dataset: CONJUNTO,
      apiVersion: VERSAO,
      useCdn: false,
    })
  : null;

export async function consultar<T>(
  query: string,
  params: Record<string, unknown> = {},
  padrao: T,
): Promise<T> {
  if (!cliente) return padrao;
  try {
    return (await cliente.fetch<T>(query, params)) ?? padrao;
  } catch (erro) {
    console.warn("[sanity] consulta falhou, seguindo com o padrão:", erro);
    return padrao;
  }
}

const construtor = PROJETO ? criarUrl({ projectId: PROJETO, dataset: CONJUNTO }) : null;

export function imagem(fonte: Image, largura: number, altura?: number) {
  if (!construtor) return null;
  let u = construtor.image(fonte).width(largura).auto("format").fit("crop");
  if (altura) u = u.height(altura);
  return u.url();
}
