import { BAIRROS, IMOVEIS, type Finalidade, type Regiao } from "@/lib/carteira";

export const REGIOES: Regiao[] = BAIRROS.map((b) => b.chave);

export const DISPONIVEIS = IMOVEIS.filter((im) => !im.fechado);
export const VENDIDOS = IMOVEIS.filter((im) => im.fechado);

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function moeda(v: number | null | undefined) {
  return v === null || v === undefined ? "—" : BRL.format(v);
}

export function taxa(v: number | null | undefined) {
  return v === 0 ? "Isento" : moeda(v);
}

export function apelidoDaRegiao(regiao: Regiao) {
  return BAIRROS.find((b) => b.chave === regiao)?.apelido ?? "";
}

export function bairroPorApelido(apelido: string) {
  return BAIRROS.find((b) => b.apelido === apelido) ?? null;
}

export function retratoDaRegiao(regiao: Regiao) {
  const lista = DISPONIVEIS.filter((im) => im.regiao === regiao && !im.porMes);
  if (!lista.length) return null;
  const precos = lista.map((im) => im.preco).sort((a, b) => a - b);
  const areas = lista.map((im) => im.area).sort((a, b) => a - b);
  return {
    quantos: lista.length,
    menor: precos[0],
    maior: precos[precos.length - 1],
    areaMediana: areas[Math.floor(areas.length / 2)],
  };
}

function cru(t: string) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]/g, "");
}

export function acharPorCodigo(termo: string) {
  const alvo = cru(termo);
  if (!alvo) return null;
  return (
    IMOVEIS.find((im) => cru(im.codigo) === alvo) ??
    (/^\d{3,}$/.test(alvo)
      ? (IMOVEIS.find((im) => cru(im.codigo).endsWith(alvo)) ?? null)
      : null)
  );
}

export function buscar(termo: string) {
  const alvo = cru(termo);
  if (!alvo) return DISPONIVEIS;
  const porCodigo = acharPorCodigo(termo);
  if (porCodigo) return [porCodigo];
  return DISPONIVEIS.filter((im) =>
    cru(`${im.codigo} ${im.titulo} ${im.bairro} ${im.regiao} ${im.resumo}`).includes(
      alvo,
    ),
  );
}

export function contar(regiao?: Regiao | null, finalidade?: Finalidade | null) {
  return DISPONIVEIS.filter(
    (im) =>
      (!regiao || im.regiao === regiao) && (!finalidade || im.finalidade === finalidade),
  ).length;
}
