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
  fechado?: boolean;
  porMes?: boolean;
  foto?: string;
  fotos?: string[];
  alt?: string;
};

export const IMOVEIS: Imovel[] = [
  {
    codigo: "CR-0142",
    cena: "predio",
    titulo: "Apartamento na Conde de Bonfim",
    bairro: "Tijuca",
    regiao: "Tijuca",
    finalidade: "comprar",
    preco: 780000,
    condominio: 890,
    iptu: 210,
    quartos: 2,
    suites: 1,
    banheiros: 2,
    vagas: 1,
    area: 78,
    andar: "7º",
    ano: null,
    selos: ["Exclusivo"],
    destaque: true,
    resumo:
      "Sala com dois ambientes, cozinha reformada e varanda voltada para o Maracanã. Prédio com portaria 24 horas, a 400 metros do metrô Uruguai.",
  },
  {
    codigo: "CR-0207",
    cena: "predio",
    titulo: "Studio a duas quadras do metrô",
    bairro: "Botafogo",
    regiao: "Zona Sul",
    finalidade: "alugar",
    preco: 2800,
    porMes: true,
    condominio: 640,
    iptu: null,
    quartos: 1,
    suites: 0,
    banheiros: 1,
    vagas: 0,
    area: 32,
    andar: "11º",
    ano: 2019,
    selos: ["Novo", "Aluguel"],
    destaque: true,
    resumo:
      "Planta inteligente, mobiliado, com academia e lavanderia no prédio. Contrato de trinta meses, com condomínio e IPTU por fora.",
  },
  {
    codigo: "CR-0088",
    cena: "comercial",
    titulo: "Sala comercial reformada",
    bairro: "Centro",
    regiao: "Centro",
    finalidade: "comprar",
    preco: 320000,
    condominio: 1100,
    iptu: 380,
    quartos: 0,
    suites: 0,
    banheiros: 1,
    vagas: 0,
    area: 41,
    andar: "14º",
    ano: 1978,
    selos: ["Vendido"],
    destaque: false,
    fechado: true,
    resumo:
      "Andar alto na Avenida Rio Branco, com vista para a baía. Documentação conferida e condomínio em dia.",
  },
  {
    codigo: "CR-0311",
    cena: "casa",
    titulo: "Casa de vila na Muda",
    bairro: "Tijuca",
    regiao: "Tijuca",
    finalidade: "comprar",
    preco: 1150000,
    condominio: 0,
    iptu: 340,
    quartos: 3,
    suites: 1,
    banheiros: 3,
    vagas: 2,
    area: 164,
    andar: null,
    ano: 1962,
    selos: ["Exclusivo"],
    destaque: true,
    resumo:
      "Três quartos, quintal com árvore frutífera e garagem para dois carros. Vila fechada com oito casas e portão eletrônico.",
  },
  {
    codigo: "CR-0356",
    cena: "vista",
    titulo: "Cobertura duplex no Flamengo",
    bairro: "Flamengo",
    regiao: "Zona Sul",
    finalidade: "comprar",
    preco: 2380000,
    condominio: 2100,
    iptu: 920,
    quartos: 3,
    suites: 2,
    banheiros: 4,
    vagas: 2,
    area: 212,
    andar: "12º",
    ano: 1994,
    selos: [],
    destaque: true,
    resumo:
      "Terraço com churrasqueira e vista para o aterro. Reformada em 2024, com esquadrias novas e ar-condicionado em todos os quartos.",
  },
  {
    codigo: "CR-0402",
    cena: "interior",
    titulo: "Conjugado no Largo do Machado",
    bairro: "Catete",
    regiao: "Zona Sul",
    finalidade: "comprar",
    preco: 295000,
    condominio: 520,
    iptu: 95,
    quartos: 1,
    suites: 0,
    banheiros: 1,
    vagas: 0,
    area: 28,
    andar: "5º",
    ano: 1968,
    selos: [],
    destaque: false,
    resumo:
      "Reformado, com armários planejados. Prédio em frente à praça, com metrô e feira na esquina.",
  },
  {
    codigo: "CR-0455",
    cena: "comercial",
    titulo: "Loja de rua na Haddock Lobo",
    bairro: "Tijuca",
    regiao: "Tijuca",
    finalidade: "comprar",
    preco: 1180000,
    condominio: 0,
    iptu: 610,
    quartos: 0,
    suites: 0,
    banheiros: 2,
    vagas: 0,
    area: 120,
    andar: null,
    ano: null,
    selos: [],
    destaque: false,
    resumo:
      "Ponto com fluxo alto, vitrine de seis metros e mezanino. Escritura e matrícula conferidas, sem pendência de IPTU.",
  },
  {
    codigo: "CR-0490",
    cena: "interior",
    titulo: "Apartamento de época na Glória",
    bairro: "Glória",
    regiao: "Centro",
    finalidade: "comprar",
    preco: 640000,
    condominio: 780,
    iptu: 280,
    quartos: 2,
    suites: 0,
    banheiros: 1,
    vagas: 0,
    area: 92,
    andar: "3º",
    ano: 1938,
    selos: ["Novo"],
    destaque: false,
    resumo:
      "Pé-direito alto, tacos originais e janelas de guilhotina. Prédio tombado, com obra de fachada já quitada.",
  },
  {
    codigo: "CR-0533",
    cena: "vista",
    titulo: "Frente para a praia em Copacabana",
    bairro: "Copacabana",
    regiao: "Zona Sul",
    finalidade: "alugar",
    preco: 6400,
    condominio: 1480,
    iptu: 390,
    quartos: 2,
    suites: 1,
    banheiros: 2,
    vagas: 0,
    area: 86,
    andar: "9º",
    ano: 1971,
    selos: ["Aluguel"],
    destaque: true,
    porMes: true,
    resumo:
      "Vista frontal para o mar e dois quartos, sendo um com suíte. Aceita fiador ou seguro-fiança, e o prédio tem portaria 24 horas.",
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
