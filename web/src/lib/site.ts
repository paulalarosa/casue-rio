/* Endereço público do site.

   🔴 Fica em variável de ambiente porque o domínio ainda NÃO foi decidido, e
   inventar um domínio aqui produziria link canônico errado, sitemap errado e
   imagem de compartilhamento apontando para o nada. Antes de publicar:
   `NEXT_PUBLIC_SITE_URL=https://dominio-real` no ambiente de build. */
export const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

/* A marca sem o descritivo. Serve para onde o nome aparece GRANDE, como a
   marca d'água da abertura e o título de página: ali o descritivo só faria
   a palavra caber menor, e "Negócios Imobiliários" em caixa alta espaçada
   mede mais de dez vezes a altura da letra.

   `NOME` é o nome por extenso, e vale onde a máquina lê: JSON-LD, nome do
   site no compartilhamento, e o título padrão da home. */
export const MARCA = "Casuê Rio";
export const DESCRITIVO = "Negócios Imobiliários";
export const NOME = `${MARCA} ${DESCRITIVO}`;
export const DESCRICAO =
  "Imobiliária de duas sócias no Rio, corretoras com CRECI e avaliadoras com CNAI. Compra, venda, aluguel e avaliação no Centro, na Tijuca e na Zona Sul, com a documentação conferida antes da proposta.";

/* As duas frases da marca ficam aqui porque aparecem em lugares que não se
   olham: a abertura, o rodapé, o cartão de compartilhamento da home e o
   cartão de cada imóvel. Espalhadas, uma correção sempre esquecia uma. */
export const FRASE = "Quem mostra o imóvel é quem lê a matrícula.";

/* 🔴 O slogan é a frase que ELAS pediram para aparecer mais, e por isso ele
   saiu de um lugar só. Hoje ele abre a faixa de vídeo da home, fecha o
   rodapé, assina a página de quem somos e encerra a carteira.

   Uma segunda frase vem delas e ainda não chegou. O lugar dela já existe
   aqui embaixo, VAZIO: quem consome `SEGUNDA_FRASE` some com o bloco
   enquanto ela for string vazia, do mesmo jeito que o botão de WhatsApp
   some sem número. Frase de marca inventada por mim é pior do que espaço
   em branco, porque parece decidida. */
export const SLOGAN = "Aqui seu sonho vira patrimônio.";
export const SEGUNDA_FRASE: string = "";

/* Canal único da empresa, e não um por sócia: foi decisão delas. Enquanto
   o número não existe a constante fica VAZIA, e quem monta botão de
   WhatsApp tem de tratar isso: `wa.me/` sem número abre o aplicativo sem
   destinatário, o que é pior do que não ter botão, porque a pessoa acha
   que falou com alguém. Quando o número chegar, é só preencher aqui. */
/* Tipados como `string` e não pelo literal vazio: sem isso o TypeScript
   entende que TELEFONE só pode ser "" e trata todo caminho com número como
   inalcançável, o que faz o próprio código que vai usá-lo parar de
   compilar. */
export const TELEFONE: string = "";

/* E-mail e Instagram chegaram em 17/09/2026 e são REAIS, ao contrário do
   telefone. O e-mail vira `mailto:` de verdade e o perfil vira link. */
export const EMAIL: string = "rio.casue@gmail.com";
export const INSTAGRAM: string = "casuerio";
export const INSTAGRAM_URL = INSTAGRAM ? `https://instagram.com/${INSTAGRAM}` : "";
export const HORARIO = "Das 9h às 19h, de segunda a sexta.";

/* Metadado de página, num lugar só.

   🔴 Existe porque metadado declarado no layout DESCE para todas as
   páginas: o `canonical: "/"` que estava lá fazia /contato, /imoveis,
   /avaliacao e os bairros dizerem ao buscador que são cópia da home.
   Com o ajudante, cada página declara o SEU endereço, e o Open Graph sai
   junto sem ninguém precisar lembrar.

   O caminho vem com barra no fim porque `trailingSlash` está ligado: o
   canônico tem de ser igual ao endereço que existe de verdade. */
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

/* As sócias, com registro conferível.

   🔴 CPF NÃO ENTRA AQUI. Ela mandou os dois CPFs para o contrato, e
   contrato é uma coisa, página indexada é outra: CPF em site público é
   dado pessoal exposto sem necessidade nenhuma, porque não é ele que prova
   habilitação. Quem prova é o CRECI, que qualquer pessoa confere no site
   do conselho, e o CNAI, que é o cadastro de avaliadora. */
export const SOCIAS = [
  {
    inicial: "C",
    sobrenome: "Carvalho",
    nome: "Débora de Almeida Carvalho",
    creci: "CRECI/RJ 92.984",
    cnai: "CNAI 53.073",
    /* 🔴 As duas cuidam de TUDO. A divisão por bairro e por assunto que
       estava aqui era suposição minha, e elas desfizeram: quem atender
       resolve compra, venda, aluguel e avaliação em todas as regiões.

       🔴 TEMPORADA SAIU em 17/09/2026: elas não trabalham com temporada.
       O que existe é venda e aluguel. */
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

/* Endereço do escritório. Uma linha só, porque é assim que se lê num
   rodapé, e desmembrado para o JSON-LD, que é o que a busca local usa. */
export const ENDERECO = {
  rua: "Av. Franklin Roosevelt, 39",
  complemento: "sala 1402",
  bairro: "Centro",
  cidade: "Rio de Janeiro",
  estado: "RJ",
  cep: "20021-120",
  linha: "Av. Franklin Roosevelt, 39 · sala 1402 · Centro · Rio de Janeiro/RJ · 20021-120",
};
