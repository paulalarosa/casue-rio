import type { NomeCena } from "@/components/cenas";

export type Finalidade = "comprar" | "alugar";
export type Regiao = "Centro" | "Tijuca" | "Zona Sul";

export type Imovel = {
  codigo: string;
  cena: NomeCena;
  titulo: string;
  bairro: string;
  regiao: Regiao;
  finalidade: Finalidade;
  preco: number;
  aluguel?: number | null;
  condominio: number | null;
  iptu: number | null;
  quartos: number;
  suites: number;
  banheiros: number;
  vagas: number;
  area: number;
  mobiliado?: boolean;
  andar: string | null;
  ano: number | null;
  selos: string[];
  destaque: boolean;
  resumo: string;
  descricao?: string[];
  fechado?: boolean;
  porMes?: boolean;
  foto?: string;
  fotos?: string[];
  alt?: string;
};

export const IMOVEIS: Imovel[] = [
  {
    codigo: "CSE-1001",
    cena: "comercial",
    titulo: "Sala comercial na Treze de Maio",
    bairro: "Centro",
    regiao: "Centro",
    finalidade: "comprar",
    preco: 110000,
    aluguel: 700,
    condominio: 800,
    iptu: 224,
    quartos: 0,
    suites: 0,
    banheiros: 1,
    vagas: 1,
    area: 29,
    andar: null,
    ano: null,
    selos: [],
    destaque: true,
    resumo:
      "Sala reformada de 29 m² em andar alto na Av. Treze de Maio, com copa e banheiro privativo, a poucos passos da estação Carioca. Para comprar ou alugar.",
    descricao: [
      "Excelente sala comercial na Av. Treze de Maio, em localização privilegiada no coração do Centro do Rio de Janeiro. Com 29 m², a sala encontra-se totalmente reformada, pronta para uso, em andar alto, proporcionando um ambiente claro, silencioso e agradável para o exercício de atividades profissionais.",
      "O imóvel dispõe de copa e banheiro privativo, com layout funcional e versátil, ideal para escritórios, consultórios, profissionais liberais e empresas de diversos segmentos.",
      "Localizada em prédio estritamente comercial, bem administrado e com excelente apresentação, a poucos passos da estação de metrô Carioca, do Theatro Municipal e cercada por ampla infraestrutura de comércio, bancos, restaurantes e serviços.",
      "Uma excelente oportunidade para quem busca praticidade, mobilidade e um endereço estratégico para seu negócio em uma das regiões mais tradicionais e valorizadas do Centro do Rio.",
    ],
    alt: "Sala comercial reformada na Av. Treze de Maio, no Centro do Rio",
    fotos: [
      "/fotos/cse-1001/01.webp",
      "/fotos/cse-1001/02.webp",
      "/fotos/cse-1001/03.webp",
      "/fotos/cse-1001/04.webp",
      "/fotos/cse-1001/05.webp",
      "/fotos/cse-1001/06.webp",
      "/fotos/cse-1001/07.webp",
      "/fotos/cse-1001/08.webp",
      "/fotos/cse-1001/09.webp",
      "/fotos/cse-1001/10.webp",
      "/fotos/cse-1001/11.webp",
      "/fotos/cse-1001/12.webp",
      "/fotos/cse-1001/13.webp",
      "/fotos/cse-1001/14.webp",
      "/fotos/cse-1001/15.webp",
    ],
  },
];

export type Bairro = {
  nome: string;
  chave: Regiao;
  apelido: string;
  cena: NomeCena;
  linha: string;
  texto: string;
};

export const BAIRROS: Bairro[] = [
  {
    nome: "Centro",
    chave: "Centro",
    apelido: "centro",
    cena: "predio",
    linha: "O escritório fica aqui, e é daqui que sai a papelada.",
    texto:
      "Aqui ficam os cartórios e a Prefeitura. Metro quadrado com história, e condomínio que costuma surpreender: a gente abre a planilha antes da proposta.",
  },
  {
    nome: "Tijuca",
    chave: "Tijuca",
    apelido: "tijuca",
    cena: "casa",
    linha: "Bairro de família, com metrô e a floresta ali em cima.",
    texto:
      "Casa de vila, prédio dos anos 60 e lançamento na mesma rua. Entre a Conde de Bonfim e a Muda o preço muda muito, e essa diferença é metade da negociação.",
  },
  {
    nome: "Zona Sul",
    chave: "Zona Sul",
    apelido: "zona-sul",
    cena: "vista",
    linha: "Do Flamengo a Copacabana, venda e aluguel.",
    texto:
      "O investidor entra pelo aluguel, o morador entra pelo metrô. São duas contas, e a gente faz as duas antes de indicar.",
  },
];
