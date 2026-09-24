export const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const MARCA = "Casuê Rio";
export const DESCRITIVO = "Negócios Imobiliários";
export const NOME = `${MARCA} ${DESCRITIVO}`;
export const DESCRICAO =
  "Imobiliária no Rio de Janeiro, com CRECI e CNAI. Compra, venda, aluguel e avaliação no Centro, na Tijuca, na Zona Sul, na Zona Norte e na Barra, com a documentação conferida antes da proposta.";

export const SLOGAN = "Transformando planos em patrimônio.";

export const QUEM_SOMOS_NO_AR = true;

export const TELEFONE: string = "+55 21 96835-2746";

export function soDigitos(telefone = TELEFONE) {
  return telefone.replace(/\D/g, "");
}

export const BAIRROS_DE_ATENDIMENTO = [
  "Centro",
  "Glória",
  "Catete",
  "Flamengo",
  "Laranjeiras",
  "Cosme Velho",
  "Botafogo",
  "Copacabana",
  "Ipanema",
  "Leblon",
  "São Conrado",
  "Tijuca",
  "Vila Isabel",
  "Grajaú",
  "Maracanã",
  "Irajá",
  "Jardim Oceânico",
] as const;

export function numerosDoCreci(separador = " · ") {
  return RESPONSAVEIS.map((r) => r.creci.replace("CRECI/RJ ", "")).join(separador);
}

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

export const RESPONSAVEIS = [
  { nome: "Débora de Almeida Carvalho", creci: "CRECI/RJ 92.984", cnai: "CNAI 53.073" },
  {
    nome: "Alessandra Soverchi de Seixas",
    creci: "CRECI/RJ 92.989",
    cnai: "CNAI 53.072",
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

export function mapaDoEndereco() {
  const destino = `${ENDERECO.rua}, ${ENDERECO.bairro}, ${ENDERECO.cidade} - ${ENDERECO.estado}, ${ENDERECO.cep}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destino)}`;
}
