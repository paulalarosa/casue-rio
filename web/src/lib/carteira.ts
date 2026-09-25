import type { NomeCena } from "@/components/cenas";

export type Finalidade = "comprar" | "alugar";
export type Regiao = "Centro" | "Tijuca" | "Zona Sul" | "Zona Norte" | "Barra";

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
  video?: string;
  alt?: string;
};

function galeriaDe(codigo: string, quantas: number) {
  const pasta = codigo.toLowerCase();
  return Array.from(
    { length: quantas },
    (_, i) => `/fotos/${pasta}/${String(i + 1).padStart(2, "0")}.webp`,
  );
}

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
    destaque: false,
    resumo:
      "Sala reformada de 29 m² em andar alto na Av. Treze de Maio, com copa e banheiro privativo, a poucos passos da estação Carioca. Para comprar ou alugar.",
    descricao: [
      "Excelente sala comercial na Av. Treze de Maio, em localização privilegiada no coração do Centro do Rio de Janeiro. Com 29 m², a sala encontra-se totalmente reformada, pronta para uso, em andar alto, proporcionando um ambiente claro, silencioso e agradável para o exercício de atividades profissionais.",
      "O imóvel dispõe de copa e banheiro privativo, com layout funcional e versátil, ideal para escritórios, consultórios, profissionais liberais e empresas de diversos segmentos.",
      "Localizada em prédio estritamente comercial, bem administrado e com excelente apresentação, a poucos passos da estação de metrô Carioca, do Theatro Municipal e cercada por ampla infraestrutura de comércio, bancos, restaurantes e serviços.",
      "Uma excelente oportunidade para quem busca praticidade, mobilidade e um endereço estratégico para seu negócio em uma das regiões mais tradicionais e valorizadas do Centro do Rio.",
    ],
    alt: "Sala comercial reformada na Av. Treze de Maio, no Centro do Rio",
    foto: "/fotos/cse-1001/05.webp",
    fotos: galeriaDe("CSE-1001", 15),
    video: "/video/tour/cse-1001.mp4",
  },
  {
    codigo: "CSE-1002",
    cena: "casa",
    titulo: "Casa histórica na Ribeiro de Almeida",
    bairro: "Laranjeiras",
    regiao: "Zona Sul",
    finalidade: "comprar",
    preco: 2400000,
    condominio: 0,
    iptu: 1390.7,
    quartos: 5,
    suites: 1,
    banheiros: 4,
    vagas: 0,
    area: 322,
    andar: null,
    ano: 1886,
    selos: ["Tombada", "Vista para o Cristo"],
    destaque: true,
    resumo:
      "Casa de 1886, tombada, com 322 m² em três andares, jardim interno e sótão com vista para o Cristo, numa rua sem saída com guarita em Laranjeiras.",
    descricao: [
      "Construída em 1886 e tombada pelo patrimônio histórico, esta residência é uma oportunidade singular para quem valoriza arquitetura, história e o privilégio de viver em uma casa com características que atravessaram gerações. Localizada em uma rua tranquila, sem saída e com guarita de segurança, oferece a atmosfera acolhedora de um refúgio residencial sem abrir mão da praticidade de estar próximo a tudo.",
      "Com 322 m² de área construída em terreno de 270 m², a casa se distribui por três andares e preserva ambientes amplos e bem conectados.",
      "No primeiro andar, a área frontal conta com espaço para estacionamento e conduz a uma ampla sala de estar de 35 m², integrada a um charmoso jardim interno, além de sala de jantar, lavabo, louceiro, cozinha com despensa e um espaço multiuso com banheiro, atualmente ideal para academia, mas que pode assumir diferentes funções.",
      "A área de serviço possui lavanderia, quarto de dependência e uma agradável área externa com churrasqueira, criando um espaço perfeito para encontros e momentos de convivência.",
      "No segundo andar, a área íntima reúne uma confortável sala de convivência, três quartos, incluindo uma suíte com closet, e banheiro social. Os ambientes mantêm a sensação de amplitude e privacidade que caracteriza a residência.",
      "O terceiro andar reserva uma das surpresas mais especiais do imóvel: o sótão com vista para o Cristo Redentor, transformado em um estúdio versátil com mais dois quartos. Um espaço que pode ser utilizado como escritório, ateliê, sala de hobbies ou acomodação para hóspedes, conforme as necessidades dos novos moradores.",
      "A localização é outro grande diferencial. A poucos passos da Rua das Laranjeiras, do Parque Guinle, do Supermercado Zona Sul e da estação de metrô do Largo do Machado, a casa combina tranquilidade e segurança com fácil acesso ao comércio, serviços, transporte e às principais conveniências do bairro.",
      "Uma propriedade para quem procura mais do que metragem: procura história, identidade, privacidade e o privilégio de morar em uma casa verdadeiramente única em Laranjeiras.",
    ],
    alt: "Sala de estar da casa histórica na Rua Ribeiro de Almeida, em Laranjeiras",
    foto: "/fotos/cse-1002/01.webp",
    fotos: galeriaDe("CSE-1002", 20),
    video: "/video/tour/cse-1002.mp4",
  },
  {
    codigo: "CSE-1003",
    cena: "comercial",
    titulo: "Casa comercial na Rua das Laranjeiras",
    bairro: "Laranjeiras",
    regiao: "Zona Sul",
    finalidade: "comprar",
    preco: 1880000,
    condominio: 0,
    iptu: 156,
    quartos: 0,
    suites: 0,
    banheiros: 3,
    vagas: 1,
    area: 278,
    andar: null,
    ano: null,
    selos: ["Uso comercial", "10 salas"],
    destaque: false,
    resumo:
      "Casa comercial de 278 m² em dois pavimentos, com 10 salas, cozinha, refeitório, 3 banheiros e anexo com varandão coberto, na Rua das Laranjeiras.",
    descricao: [
      "Excelente oportunidade para empresas e investidores que buscam espaço, flexibilidade e uma localização estratégica na Zona Sul do Rio.",
      "Em um dos endereços mais tradicionais de Laranjeiras, esta propriedade comercial de 278 m² oferece uma estrutura diferenciada, com ambientes amplos e uma configuração que permite diversas possibilidades de ocupação.",
      "O imóvel está distribuído em 2 pavimentos e dispõe de 10 salas, cozinha, área destinada a refeitório e 3 banheiros, proporcionando praticidade para operações que necessitam de vários ambientes independentes.",
      "A propriedade conta também com 1 anexo com sala e amplo varandão coberto, um espaço adicional que pode ser aproveitado de diferentes formas, de acordo com o perfil do negócio.",
      "A planta versátil atende muito bem a atividades como clínicas, consultórios, escritórios, escolas, cursos, creches, estúdios, empresas de serviços e outros negócios que valorizem ambientes separados e uma boa área de apoio.",
      "Outro ponto positivo é a garagem para 1 veículo, atualmente utilizada como sala, mas que pode ser facilmente revertida para sua finalidade original.",
      "Localizado na Rua das Laranjeiras, o imóvel está próximo a comércio, serviços, transporte público e importantes acessos da cidade, reunindo conveniência para clientes, funcionários e fornecedores.",
      "Uma propriedade com características pouco comuns na região, pronta para receber diferentes projetos comerciais e com excelente potencial de valorização e aproveitamento.",
    ],
    alt: "Fachada da casa comercial na Rua das Laranjeiras",
    foto: "/fotos/cse-1003/01.webp",
    fotos: galeriaDe("CSE-1003", 25),
    video: "/video/tour/cse-1003.mp4",
  },
  {
    codigo: "CSE-1004",
    cena: "casa",
    titulo: "Casa com jardim no Cosme Velho",
    bairro: "Cosme Velho",
    regiao: "Zona Sul",
    finalidade: "comprar",
    preco: 3700000,
    condominio: 0,
    iptu: null,
    quartos: 4,
    suites: 1,
    banheiros: 2,
    vagas: 1,
    area: 568,
    andar: null,
    ano: null,
    selos: ["Jardim", "Anexos independentes"],
    destaque: true,
    resumo:
      "Casa de 568 m² no Cosme Velho, com 4 salas, 4 quartos, 3 varandas, anexos independentes, ateliê e um extenso jardim com árvores frutíferas.",
    descricao: [
      "Casa charmosa e espaçosa no Cosme Velho, cercada pelo verde e com excelente potencial de uso e renda.",
      "Com 568 m², a propriedade oferece 4 amplas salas, 4 quartos (1 suíte), 2 banheiros sociais e 3 varandas, proporcionando conforto, privacidade e ambientes versáteis para morar, receber e trabalhar.",
      "Um grande diferencial são os anexos independentes, com 3 quartos, cozinha, 2 banheiros e lavanderia, ideais para familiares, hóspedes ou para locação independente. A casa conta ainda com uma ampla sala anexa, atualmente utilizada como ateliê, que pode ser adaptada para escritório, estúdio ou espaço de criação.",
      "O extenso jardim, com árvores frutíferas e espécies ornamentais, cria um verdadeiro refúgio de tranquilidade e contato com a natureza.",
      "Possui 1 vaga de garagem, com possibilidade de ampliação.",
      "Uma oportunidade única para quem busca amplitude, natureza, privacidade e versatilidade, em uma das ruas mais tradicionais e charmosas do Cosme Velho.",
    ],
    alt: "Fachada e jardim da casa na Rua Marechal Pires Ferreira, no Cosme Velho",
    foto: "/fotos/cse-1004/01.webp",
    fotos: galeriaDe("CSE-1004", 28),
    video: "/video/tour/cse-1004.mp4",
  },
  {
    codigo: "CSE-1005",
    cena: "casa",
    titulo: "Casa com piscina e casa anexa em Irajá",
    bairro: "Irajá",
    regiao: "Zona Norte",
    finalidade: "comprar",
    preco: 530000,
    condominio: 0,
    iptu: 0,
    quartos: 3,
    suites: 0,
    banheiros: 1,
    vagas: 2,
    area: 74,
    andar: null,
    ano: null,
    selos: ["Piscina", "Casa anexa"],
    destaque: false,
    resumo:
      "Casa de 3 quartos em Irajá com terraço, quintal com piscina e churrasqueira, garagem para 2 carros e uma segunda casa completa no mesmo terreno.",
    descricao: [
      "Espaço, lazer e versatilidade, esta propriedade reúne uma casa principal confortável, uma área externa com piscina e uma segunda casa completa, que pode ser utilizada para receber familiares, acomodar hóspedes, montar um home office ou explorar uma possibilidade de locação.",
      "A casa principal conta com 3 quartos, sendo um com armários, sala confortável, banheiro social amplo, varanda, copa-cozinha com armários, garagem para 2 carros, terraço em toda a extensão da casa e lavanderia.",
      "Nos fundos, o imóvel oferece um quintal com piscina e churrasqueira, criando um espaço agradável para momentos de lazer e convivência.",
      "Um dos grandes diferenciais é a casa anexa, com possibilidade de entrada independente, composta por quarto e sala, cozinha, banheiro e quintal frontal. Uma configuração que amplia as possibilidades de uso da propriedade, seja para acomodar familiares, receber visitas ou buscar uma fonte adicional de renda.",
      "Localizada em uma região residencial de Irajá, a aproximadamente 1 km da estação do metrô de Irajá, próxima à Av. Padre Roser, Praça Dalva de Oliveira e Largo do Bicão, com comércio e serviços no entorno.",
      "Uma oportunidade para quem procura uma casa com ambientes amplos, área de lazer e uma segunda residência no mesmo terreno.",
    ],
    alt: "Piscina no quintal da casa na Rua Barroso Pereira, em Irajá",
    foto: "/fotos/cse-1005/01.webp",
    fotos: galeriaDe("CSE-1005", 20),
    video: "/video/tour/cse-1005.mp4",
  },
  {
    codigo: "CSE-1006",
    cena: "predio",
    titulo: "Quarto e sala na Rua Riachuelo",
    bairro: "Centro",
    regiao: "Centro",
    finalidade: "comprar",
    preco: 260000,
    condominio: 900,
    iptu: 100,
    quartos: 1,
    suites: 0,
    banheiros: 1,
    vagas: 0,
    area: 44,
    andar: null,
    ano: null,
    selos: ["Portaria 24h", "Aceita Airbnb"],
    destaque: false,
    resumo:
      "Apartamento de quarto e sala com 44 m² na Rua Riachuelo, para modernizar do seu jeito, em prédio com portaria 24 horas que aceita locação por Airbnb.",
    descricao: [
      "Ótimo apartamento de quarto e sala com potencial de valorização e excelente oportunidade para investimento!",
      "Imóvel composto por sala, quarto, banheiro social, cozinha com espaço para fogão e geladeira, área de serviço e quarto de serviço, que pode ser aproveitado de acordo com as necessidades do novo proprietário.",
      "A unidade necessita de modernização, oferecendo a possibilidade de personalização dos ambientes e criação de um imóvel sob medida, seja para moradia ou investimento.",
      "O prédio conta com portaria 24 horas e aceita locação por Airbnb, ampliando as possibilidades de uso e rentabilidade. O imóvel não possui vaga de garagem, mas existe a possibilidade de locação de vaga no prédio.",
    ],
    alt: "Sala do apartamento na Rua Riachuelo, no Centro do Rio",
    foto: "/fotos/cse-1006/01.webp",
    fotos: galeriaDe("CSE-1006", 9),
    video: "/video/tour/cse-1006.mp4",
  },
  {
    codigo: "CSE-1007",
    cena: "vista",
    titulo: "Casa com vista para o mar em São Conrado",
    bairro: "São Conrado",
    regiao: "Zona Sul",
    finalidade: "comprar",
    preco: 1850000,
    condominio: 0,
    iptu: 1427,
    quartos: 4,
    suites: 2,
    banheiros: 0,
    vagas: 6,
    area: 493,
    andar: null,
    ano: null,
    selos: ["Vista para o mar", "Piscina", "Para reformar"],
    destaque: false,
    resumo:
      "Casa de 493 m² em São Conrado, com vista para o mar, piscina e jardim, pronta para receber um projeto novo, em condomínio com cancela e guarita.",
    descricao: [
      "Casa com vista para o mar, cercada pelo verde e com liberdade para se transformar em um projeto único.",
      "Em São Conrado, esta casa de 493 m² reúne uma combinação difícil de reproduzir: amplitude, privacidade, natureza, piscina, vista para o mar e espaço para desenvolver uma nova proposta arquitetônica.",
      "A residência ocupa dois níveis e oferece uma planta generosa, capaz de se adaptar a diferentes estilos de morar.",
      "No pavimento social, o salão de grandes proporções permite a criação de ambientes distintos e se conecta à sala de jantar. O andar conta ainda com lavabo, copa-cozinha, lavanderia, área de serviço e dependência completa.",
      "No nível reservado aos dormitórios, são 4 quartos, sendo 2 suítes. A principal possui closet e varanda. Outro dormitório também tem vista para o mar e acesso à varanda, criando uma relação privilegiada entre os ambientes internos e a paisagem.",
      "A área externa é um dos pontos altos da propriedade. Piscina, churrasqueira, jardim e banheiro social formam uma estrutura de lazer envolvida pela vegetação. O espaço permite ainda a criação de uma área gourmet, ampliando o potencial para receber, relaxar e aproveitar a casa ao ar livre.",
      "São 6 vagas de estacionamento, sendo 4 cobertas e 2 descobertas, além de rampa de acesso.",
      "Na Rua São Leobaldo, a propriedade integra a Associação de Moradores da Rua Capuri e está inserida em condomínio com cancela e guarita de segurança. E, embora o entorno proporcione a sensação de estar em um refúgio particular, a conveniência está próxima: metrô de São Conrado e comércio da região ficam a poucos minutos.",
    ],
    alt: "Vista para o mar a partir da casa na Rua São Leobaldo, em São Conrado",
    foto: "/fotos/cse-1007/01.webp",
    fotos: galeriaDe("CSE-1007", 23),
    video: "/video/tour/cse-1007.mp4",
  },
  {
    codigo: "CSE-1009",
    cena: "predio",
    titulo: "Três quartos na Ribeiro de Almeida",
    bairro: "Laranjeiras",
    regiao: "Zona Sul",
    finalidade: "comprar",
    preco: 1200000,
    condominio: 1815,
    iptu: 304,
    quartos: 3,
    suites: 1,
    banheiros: 2,
    vagas: 1,
    area: 95,
    andar: null,
    ano: null,
    selos: ["Rua sem saída", "Lazer completo", "Aceita pet"],
    destaque: true,
    resumo:
      "Apartamento de 95 m² com 3 quartos (1 suíte) e vaga escriturada, em condomínio com piscinas e portaria 24 horas, numa rua sem saída com guarita em Laranjeiras.",
    descricao: [
      "Em uma localização privilegiada, na charmosa e arborizada Rua Ribeiro de Almeida, uma rua sem saída com guarita de segurança, este apartamento de 95 m² reúne uma planta muito bem distribuída, ambientes confortáveis e a praticidade de viver em um dos bairros mais tradicionais e desejados da Zona Sul do Rio.",
      "A ampla sala em dois ambientes proporciona espaços aconchegantes para estar e jantar, com excelente iluminação e ventilação natural. São 3 quartos com armários embutidos, sendo 1 suíte, além de banheiro social.",
      "A cozinha é funcional e conta com armários planejados e uma excelente despensa, oferecendo praticidade e espaço para a organização do dia a dia. A área de serviço é independente e possui dependências completas, garantindo ainda mais comodidade.",
      "Outro diferencial é a 1 vaga de garagem livre e escriturada, um atributo especialmente valorizado na região.",
      "O condomínio, bem administrado, oferece portaria 24 horas e uma completa estrutura de lazer, com piscinas adulto e infantil, playground, salão de festas e espaços agradáveis para convivência. Além disso, é pet friendly, proporcionando mais liberdade e conforto para toda a família.",
      "Uma excelente escolha para quem deseja morar em uma rua tranquila e segura, sem abrir mão da proximidade com comércio, serviços, escolas e tudo o que faz de Laranjeiras um dos bairros mais especiais do Rio de Janeiro.",
    ],
    alt: "Sala em dois ambientes do apartamento na Rua Ribeiro de Almeida, em Laranjeiras",
    foto: "/fotos/cse-1009/01.webp",
    fotos: galeriaDe("CSE-1009", 15),
    video: "/video/tour/cse-1009.mp4",
  },
  {
    codigo: "CSE-1010",
    cena: "predio",
    titulo: "Quarto e sala reformado no Flamengo",
    bairro: "Flamengo",
    regiao: "Zona Sul",
    finalidade: "comprar",
    preco: 589000,
    condominio: 869,
    iptu: 105,
    quartos: 1,
    suites: 0,
    banheiros: 1,
    vagas: 0,
    area: 34,
    andar: "Alto",
    ano: null,
    selos: ["Reformado", "Aceita pet"],
    destaque: false,
    resumo:
      "Apartamento reformado de 34 m² na Rua Senador Vergueiro, de frente e em andar alto, claro e ventilado, perto do metrô, em prédio com portaria 24 horas.",
    descricao: [
      "Exclusividade! Apartamento reformado de 1 quarto na Rua Senador Vergueiro, no Flamengo. Com 34 m², frente, andar alto, claro e ventilado, o imóvel tem ótima distribuição e excelente aproveitamento dos espaços.",
      "A planta conta com sala confortável, 1 quarto com armário embutido, cozinha funcional com espaço para fogão e geladeira e banheiro com espaço para máquina de lavar.",
      "O condomínio é bem administrado, aceita pets e oferece portaria 24 horas e quadra de praia.",
      "A localização é um dos grandes diferenciais: próximo ao metrô, supermercados, comércio, restaurantes e serviços, com fácil acesso a outras regiões da cidade.",
      "Uma ótima oportunidade para morar no Flamengo em um apartamento reformado, bem localizado e pronto para morar.",
    ],
    alt: "Apartamento reformado na Rua Senador Vergueiro, no Flamengo",
    foto: "/fotos/cse-1010/01.webp",
    fotos: galeriaDe("CSE-1010", 13),
    video: "/video/tour/cse-1010.mp4",
  },
];

export type Bairro = {
  nome: string;
  local: string;
  chave: Regiao;
  apelido: string;
  cena: NomeCena;
  linha: string;
  texto: string;
};

export const BAIRROS: Bairro[] = [
  {
    nome: "Centro",
    local: "no Centro",
    chave: "Centro",
    apelido: "centro",
    cena: "predio",
    linha: "O escritório fica aqui, e é daqui que sai a papelada.",
    texto:
      "Aqui ficam os cartórios e a Prefeitura. Metro quadrado com história, e condomínio que costuma surpreender: a gente abre a planilha antes da proposta.",
  },
  {
    nome: "Tijuca",
    local: "na Tijuca",
    chave: "Tijuca",
    apelido: "tijuca",
    cena: "casa",
    linha: "Bairro de família, com metrô e a floresta ali em cima.",
    texto:
      "Casa de vila, prédio dos anos 60 e lançamento na mesma rua. Entre a Conde de Bonfim e a Muda o preço muda muito, e essa diferença é metade da negociação.",
  },
  {
    nome: "Zona Sul",
    local: "na Zona Sul",
    chave: "Zona Sul",
    apelido: "zona-sul",
    cena: "vista",
    linha: "Do Flamengo a Copacabana, venda e aluguel.",
    texto:
      "O investidor entra pelo aluguel, o morador entra pelo metrô. São duas contas, e a gente faz as duas antes de indicar.",
  },
  {
    nome: "Zona Norte",
    local: "na Zona Norte",
    chave: "Zona Norte",
    apelido: "zona-norte",
    cena: "casa",
    linha: "Casa com quintal, perto do metrô.",
    texto:
      "Terreno maior pelo preço de um apartamento, e o metrô a poucas quadras. Em casa, a conta inclui a manutenção: telhado, muro e piscina entram na visita.",
  },
  {
    nome: "Barra",
    local: "na Barra",
    chave: "Barra",
    apelido: "barra",
    cena: "predio",
    linha: "Do Jardim Oceânico à praia, com o metrô na porta.",
    texto:
      "Prédio mais novo e condomínio com lazer, e é o condomínio que decide a conta do mês. A gente abre a planilha dele antes da proposta.",
  },
];

export function localDaRegiao(regiao: Regiao) {
  return BAIRROS.find((b) => b.chave === regiao)?.local ?? `em ${regiao}`;
}
