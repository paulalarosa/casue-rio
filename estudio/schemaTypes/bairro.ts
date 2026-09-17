import { defineField, defineType } from "sanity";

/* A região.

   No site, `chave` é o valor que o filtro compara e que vai na URL de
   `/bairros/[chave]`. Ele é a única coisa aqui que NÃO se muda depois de um
   imóvel apontar para ela: trocar a chave quebra o endereço da página e
   solta todos os imóveis daquela região.

   🔴 Isto é documento, e não uma lista fechada dentro do imóvel, por um
   motivo prático: o texto do bairro é conteúdo que elas escrevem, e é o que
   faz a página de bairro existir na busca. Lista fechada guardaria o nome e
   perderia o texto. */
export const bairro = defineType({
  name: "bairro",
  title: "Bairro",
  type: "document",
  fields: [
    defineField({
      name: "nome",
      title: "Nome",
      type: "string",
      description: "Como aparece no site: Centro, Tijuca, Zona Sul.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "chave",
      title: "Chave",
      type: "slug",
      options: { source: "nome", maxLength: 40 },
      description:
        "O endereço da página. Depois que houver imóvel nesta região, não troque: o link antigo para de existir.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "linha",
      title: "Uma linha",
      type: "string",
      description: "A frase que aparece no cartão do bairro. Curta.",
      validation: (r) => r.required().max(90),
    }),
    defineField({
      name: "texto",
      title: "O bairro",
      type: "text",
      rows: 4,
      description:
        "O que você diria a alguém que nunca morou ali. É este texto que faz a página aparecer na busca.",
      validation: (r) => r.required().min(80),
    }),
    defineField({
      name: "cena",
      title: "Ilustração",
      type: "string",
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
      name: "ordem",
      title: "Ordem",
      type: "number",
      description: "Menor primeiro. É a ordem dos cartões e a ordem dos filtros.",
      initialValue: 10,
    }),
  ],
  preview: {
    select: { title: "nome", subtitle: "linha" },
  },
  orderings: [{ name: "ordem", title: "Ordem", by: [{ field: "ordem", direction: "asc" }] }],
});
