import { defineArrayMember, defineField, defineType } from "sanity";

/* O artigo da revista.

   🔴 O corpo é texto ESTRUTURADO, não HTML colado, e a diferença aparece no
   dia em que alguém escrever no Word e colar aqui: HTML de editor traz fonte,
   tamanho e cor embutidos, e o artigo sai com Calibri no meio de um site em
   Unbounded. Aqui o editor guarda só o PAPEL de cada trecho — isto é um
   parágrafo, isto é um subtítulo, isto é uma citação — e quem decide a
   aparência continua sendo o CSS do site.

   Por isso a lista de estilos é curta de propósito: parágrafo, dois níveis de
   subtítulo e citação. Não existe escolha de cor nem de tamanho, e isso é a
   funcionalidade, não a falta dela. */
export const artigo = defineType({
  name: "artigo",
  title: "Artigo",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: "slug",
      title: "Endereço",
      type: "slug",
      options: { source: "titulo", maxLength: 70 },
      description:
        "O que aparece depois de /revista/ no link. Depois de publicado, não troque: quem salvou o link antigo perde a página.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "linha",
      title: "Chamada",
      type: "text",
      rows: 2,
      description:
        "Uma ou duas frases, que aparecem na lista e no link compartilhado. Não repita o título com outras palavras: diga o que o texto entrega.",
      validation: (r) => r.required().min(40).max(200),
    }),
    defineField({
      name: "data",
      title: "Data",
      type: "date",
      options: { dateFormat: "DD/MM/YYYY" },
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "autora",
      title: "Quem escreveu",
      type: "string",
      /* 🔴 Os dois nomes vêm por extenso, e batem com `SOCIAS` em
         `web/src/lib/site.ts`. Nome e sobrenome sempre: chamar alguém só
         pelo sobrenome soa a departamento, e esta empresa é o contrário
         disso. Mudou lá, muda aqui. */
      options: {
        list: [
          { title: "Débora de Almeida Carvalho", value: "Débora de Almeida Carvalho" },
          { title: "Alessandra Soverchi de Seixas", value: "Alessandra Soverchi de Seixas" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "capa",
      title: "Capa",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Descrição",
          type: "string",
          description: "O que aparece na imagem, para quem não enxerga a tela.",
          validation: (r) => r.required(),
        }),
      ],
      description: "Opcional. Sem capa, a lista mostra só o texto, que também funciona.",
    }),
    defineField({
      name: "corpo",
      title: "Texto",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Parágrafo", value: "normal" },
            { title: "Subtítulo", value: "h2" },
            { title: "Subtítulo menor", value: "h3" },
            { title: "Citação", value: "blockquote" },
          ],
          lists: [
            { title: "Lista", value: "bullet" },
            { title: "Lista numerada", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Negrito", value: "strong" },
              { title: "Itálico", value: "em" },
            ],
            annotations: [
              defineField({
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "Endereço",
                    type: "url",
                    validation: (r) => r.required(),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Descrição",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({ name: "legenda", title: "Legenda", type: "string" }),
          ],
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
  ],
  /* 🔴 NÃO existe campo "publicado" aqui, e a ausência é a decisão.

     Eu tinha criado um, e ele era um SEGUNDO interruptor por cima do botão
     de publicar da própria Sanity. Medido: a consulta pública não devolve
     rascunho nem com esse campo ligado. Ou seja, quem escrevesse o primeiro
     texto clicaria no botão verde grande, o texto não apareceria no site, e
     não haveria nada na tela explicando o porquê.

     Um botão para uma coisa. Publicar é publicar, e despublicar está no menu
     do próprio documento. */
  preview: {
    select: { titulo: "titulo", data: "data", autora: "autora", media: "capa" },
    prepare({ titulo, data, autora, media }) {
      const quando = data
        ? new Date(`${data}T12:00:00`).toLocaleDateString("pt-BR")
        : "sem data";
      return {
        title: titulo ?? "Sem título",
        subtitle: `${quando} · ${autora ?? "—"}`,
        media,
      };
    },
  },
  orderings: [{ name: "recentes", title: "Mais recentes", by: [{ field: "data", direction: "desc" }] }],
});
