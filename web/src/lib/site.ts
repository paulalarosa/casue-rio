export const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const MARCA = "Casuê Rio";
export const DESCRITIVO = "Negócios Imobiliários";
export const NOME = `${MARCA} ${DESCRITIVO}`;
export const DESCRICAO =
  "Imobiliária de duas sócias no Rio, corretoras com CRECI e avaliadoras com CNAI. Compra, venda, aluguel e avaliação no Centro, na Tijuca e na Zona Sul, com a documentação conferida antes da proposta.";

export const SLOGAN = "Aqui seu sonho vira patrimônio.";

export const TELEFONE: string = "";

const EMAIL_PARTES = ["rio.casue", "gmail.com"] as const;
export const TEM_EMAIL = true;
export function enderecoEmail() {
  return EMAIL_PARTES.join("@");
}
export const INSTAGRAM: string = "casuerio";
export const INSTAGRAM_URL = INSTAGRAM ? `https://instagram.com/${INSTAGRAM}` : "";
export const HORARIO = "Das 9h às 19h, de segunda a sexta.";

export function metaDaPagina({
  titulo,
  descricao,
  caminho,
}: {
  titulo: string;
  descricao: string;
  caminho: string;
}) {
  const url = caminho.endsWith("/") ? caminho : `${caminho}/`;
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: url },
    openGraph: { title: `${titulo} · ${MARCA}`, description: descricao, url },
  };
}

export const SOCIAS = [
  {
    inicial: "C",
    sobrenome: "Carvalho",
    nome: "Débora de Almeida Carvalho",
    creci: "CRECI/RJ 92.984",
    cnai: "CNAI 53.073",
    linha: "Compra, venda, aluguel e avaliação nas três regiões.",
  },
  {
    inicial: "S",
    sobrenome: "Seixas",
    nome: "Alessandra Soverchi de Seixas",
    creci: "CRECI/RJ 92.989",
    cnai: "CNAI 53.072",
    linha: "Compra, venda, aluguel e avaliação nas três regiões.",
  },
] as const;

export const ENDERECO = {
  rua: "Av. Franklin Roosevelt, 39",
  complemento: "sala 1402",
  bairro: "Centro",
  cidade: "Rio de Janeiro",
  estado: "RJ",
  cep: "20021-120",
  linha:
    "Av. Franklin Roosevelt, 39 · sala 1402 · Centro · Rio de Janeiro/RJ · 20021-120",
};
