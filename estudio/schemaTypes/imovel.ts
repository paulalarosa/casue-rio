import { defineArrayMember, defineField, defineType } from "sanity";

/* O imóvel.

   🔴 Os campos são os MESMOS de `web/src/lib/imoveis.ts`, com os mesmos
   nomes, e isso é regra e não coincidência: enquanto os dois existirem lado
   a lado, qualquer diferença de nome vira um campo que a corretora preenche
   e que o site não lê. Quando o site passar a ler daqui, o arquivo sai.

   🔴 Nada de campo de texto livre onde o site espera um valor fechado. O
   TypeScript do site trata `finalidade` e `regiao` como união fechada; um
   `string` aqui deixaria alguém digitar "venda" onde o site espera
   "comprar", e o imóvel sumiria do filtro sem erro nenhum na tela. */
export const imovel = defineType({
  name: "imovel",
  title: "Imóvel",
  type: "document",
  groups: [
    { name: "principal", title: "O anúncio", default: true },
    { name: "numeros", title: "Números" },
    { name: "imagem", title: "Fotos" },
  ],
  fields: [
    defineField({
      name: "codigo",
      title: "Código",
      type: "string",
      group: "principal",
      description:
        'O código que vai na placa e no anúncio, no formato CR-0000. É por ele que a busca do site abre o imóvel direto, então ele tem de ser único.',
      validation: (r) =>
        r
          .required()
          .regex(/^CR-\d{4}$/, { name: "CR-0000" })
          .error("Use o formato CR-0142: as letras CR, um hífen e quatro números."),
    }),
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      group: "principal",
      description:
        'O que a pessoa lê no cartão. Diga o tipo e a referência, como "Casa de vila na Muda". Endereço exato não entra aqui.',
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: "resumo",
      title: "Resumo",
      type: "text",
      rows: 3,
      group: "principal",
      description:
        "Duas ou três frases. O que a foto não mostra: reforma, barulho, sol da tarde, distância do metrô.",
      validation: (r) => r.required().min(60).max(320),
    }),
    defineField({
      name: "bairro",
      title: "Bairro",
      type: "string",
      group: "principal",
      description: 'O bairro de verdade, como Botafogo ou Catete.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "regiao",
      title: "Região",
      type: "reference",
      to: [{ type: "bairro" }],
      group: "principal",
      description:
        "A região que o site usa para filtrar. Um imóvel no Catete é da Zona Sul.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "finalidade",
      title: "Finalidade",
      type: "string",
      group: "principal",
      /* 🔴 Temporada NÃO existe nesta lista, e é decisão delas de 17/09/2026.
         A lista fechada é o que impede a palavra de voltar por digitação. */
      options: {
        list: [
          { title: "Comprar", value: "comprar" },
          { title: "Alugar", value: "alugar" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "comprar",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "preco",
      title: "Preço",
      type: "number",
      group: "principal",
      description:
        "Só o número, sem R$ e sem ponto. Em aluguel é o valor do mês.",
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "porMes",
      title: "O preço é mensal",
      type: "boolean",
      group: "principal",
      description:
        'Ligue em aluguel. É o que faz o site escrever "/ mês" ao lado do valor. Sem isso, R$ 2.800 de aluguel parece o preço do imóvel.',
      initialValue: false,
      hidden: ({ parent }) => parent?.finalidade !== "alugar",
    }),

    defineField({
      name: "area",
      title: "Área (m²)",
      type: "number",
      group: "numeros",
      validation: (r) => r.required().positive(),
    }),
    defineField({ name: "quartos", title: "Quartos", type: "number", group: "numeros", validation: (r) => r.required().min(0) }),
    defineField({ name: "suites", title: "Suítes", type: "number", group: "numeros", initialValue: 0, validation: (r) => r.min(0) }),
    defineField({ name: "banheiros", title: "Banheiros", type: "number", group: "numeros", validation: (r) => r.required().min(0) }),
    defineField({ name: "vagas", title: "Vagas", type: "number", group: "numeros", initialValue: 0, validation: (r) => r.min(0) }),
    defineField({
      name: "condominio",
      title: "Condomínio",
      type: "number",
      group: "numeros",
      description: "Deixe vazio se não souber. Zero é diferente de vazio: zero quer dizer que não há condomínio, como em casa de rua.",
    }),
    defineField({ name: "iptu", title: "IPTU mensal", type: "number", group: "numeros" }),
    defineField({
      name: "andar",
      title: "Andar",
      type: "string",
      group: "numeros",
      description: 'Como se fala: "7º". Vazio em casa e loja de rua.',
    }),
    defineField({
      name: "ano",
      title: "Ano do prédio",
      type: "number",
      group: "numeros",
      description: "Só se for conferido. Vazio é melhor do que chute.",
      validation: (r) => r.min(1850).max(new Date().getFullYear() + 3),
    }),

    defineField({
      name: "fotos",
      title: "Fotos",
      type: "array",
      group: "imagem",
      of: [
        defineArrayMember({
          type: "image",
          /* 🔴 `hotspot` ligado. As fotos vêm de celular, em proporção
             qualquer, e o site corta em 16:10 no cartão e em 4:5 na ficha.
             Sem o ponto focal, quem decide o corte é o centro geométrico da
             imagem, e o centro de uma foto de sala costuma ser o chão. */
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Descrição",
              type: "string",
              description:
                "O que aparece na foto, para quem não enxerga a tela. Ex.: sala com varanda e piso de taco.",
              validation: (r) => r.required(),
            }),
          ],
        }),
      ],
      description:
        "A primeira foto é a que aparece no cartão e no link compartilhado. Enquanto não houver foto, o site desenha uma ilustração da marca no lugar, e ela não finge ser foto.",
    }),
    defineField({
      name: "cena",
      title: "Ilustração, enquanto não há foto",
      type: "string",
      group: "imagem",
      options: {
        list: [
          { title: "Prédio", value: "predio" },
          { title: "Casa", value: "casa" },
          { title: "Comercial", value: "comercial" },
          { title: "Vista", value: "vista" },
          { title: "Interior", value: "interior" },
        ],
      },
      initialValue: "predio",
      validation: (r) => r.required(),
    }),

    defineField({
      name: "selos",
      title: "Selos",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Exclusivo", value: "Exclusivo" },
          { title: "Novo", value: "Novo" },
          { title: "Aluguel", value: "Aluguel" },
          { title: "Vendido", value: "Vendido" },
        ],
      },
      description: "Use pouco. Três selos num cartão só deixam de significar alguma coisa.",
    }),
    defineField({
      name: "destaque",
      title: "Mostrar na home",
      type: "boolean",
      initialValue: false,
      description: "A home mostra três. Marcar mais do que três não quebra nada, mas os outros não aparecem.",
    }),
    defineField({
      name: "fechado",
      title: "Já vendido ou alugado",
      type: "boolean",
      initialValue: false,
      description:
        "Ligue quando sair da carteira. O imóvel continua no site, numa faixa própria no fim da lista, e sai de toda contagem: negócio fechado é prova de trabalho, mas não é oferta.",
    }),
  ],

  /* A lista no painel tem de contar a mesma coisa que o cartão do site, senão
     elas trabalham às cegas: código, título, preço e se já saiu. */
  preview: {
    select: {
      titulo: "titulo",
      codigo: "codigo",
      bairro: "bairro",
      preco: "preco",
      porMes: "porMes",
      fechado: "fechado",
      media: "fotos.0",
    },
    prepare({ titulo, codigo, bairro, preco, porMes, fechado, media }) {
      const valor = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      }).format(preco ?? 0);
      return {
        title: `${fechado ? "· " : ""}${titulo ?? "Sem título"}`,
        subtitle: `${codigo ?? "—"} · ${bairro ?? "—"} · ${valor}${porMes ? " / mês" : ""}${
          fechado ? " · fora da carteira" : ""
        }`,
        media,
      };
    },
  },

  orderings: [
    { name: "recentes", title: "Mais recentes", by: [{ field: "_createdAt", direction: "desc" }] },
    { name: "precoAsc", title: "Menor preço", by: [{ field: "preco", direction: "asc" }] },
    { name: "codigo", title: "Código", by: [{ field: "codigo", direction: "asc" }] },
  ],
});
