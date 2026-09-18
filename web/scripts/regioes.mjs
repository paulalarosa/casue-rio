import { readFile } from "node:fs/promises";

export async function regioesAtendidas() {
  const fonte = await readFile("src/lib/imoveis.ts", "utf8");
  const lista = [...fonte.matchAll(/^\s{4}chave: "([^"]+)",/gm)].map((m) => m[1]);
  if (lista.length < 2) throw new Error("não achei as regiões em BAIRROS");
  return lista;
}
