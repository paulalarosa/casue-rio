export const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const MARCA = "Casuê Rio";
export const DESCRITIVO = "Negócios Imobiliários";
export const NOME = `${MARCA} ${DESCRITIVO}`;
export const DESCRICAO =
  "Imobiliária no Rio de Janeiro, com CRECI e CNAI. Compra, venda, aluguel e avaliação no Centro, na Tijuca e na Zona Sul, com a documentação conferida antes da proposta.";

export const SLOGAN = "Transformando planos em patrimônio.";

export const QUEM_SOMOS_NO_AR = false;

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
  "Botafogo",
  "Copacabana",
  "Ipanema",
  "Leblon",
  "Tijuca",
  "Vila Isabel",
  "Grajaú",
  "Maracanã",
] as const;

export function numerosDoCreci(separador = " · ") {
  return SOCIAS.map((s) => s.creci.replace("CRECI/RJ ", "")).join(separador);
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

export const SOCIAS = [
  {
    inicial: "C",
    sobrenome: "Carvalho",
    nome: "Débora de Almeida Carvalho",
    cargo: "Sócia-Diretora",
    creci: "CRECI/RJ 92.984",
    cnai: "CNAI 53.073",
    citacao:
      "Cada imóvel é uma oportunidade de construir valor. O nosso trabalho é conduzir a negociação com estratégia, segurança e atenção ao que importa para o cliente.",
    bio: [
      "Conduz as operações da Casuê Rio somando visão comercial, análise criteriosa e atenção ao lado técnico de cada negociação.",
      "Cuida da escolha dos imóveis, entende o objetivo de quem compra e de quem vende, e acompanha as etapas que fazem um negócio sair claro, eficiente e seguro.",
    ],
  },
  {
    inicial: "S",
    sobrenome: "Seixas",
    nome: "Alessandra Soverchi de Seixas",
    cargo: "Sócia-Diretora",
    creci: "CRECI/RJ 92.989",
    cnai: "CNAI 53.072",
    citacao:
      "Um bom negócio começa entendendo o que o cliente precisa, e se fecha com transparência, confiança e uma negociação bem conduzida.",
    bio: [
      "Cuida do relacionamento com o cliente e da condução das negociações, atrás de oportunidades que batem com o objetivo de quem compra, de quem vende e de quem investe.",
      "Soma sensibilidade comercial, conhecimento de mercado e atenção ao detalhe, para a negociação sair transparente e organizada.",
      "Acredita que relação de confiança se constrói com presença e responsabilidade em cada etapa do negócio.",
    ],
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
