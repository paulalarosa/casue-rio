import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";

const daquiUmaHora = () => {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return d.toISOString();
};

export const artigo = defineType({
  name: "artigo",
  title: "Artigo",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      description:
        "Curto e direto. Sai grande no topo do artigo, no card da lista e na aba do navegador.",
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
      title: "Publicar em",
      type: "datetime",
      options: {
        dateFormat: "DD/MM/YYYY",
        timeFormat: "HH:mm",
        timeStep: 15,
      },
      initialValue: daquiUmaHora,
      description:
        "Data e hora passadas publicam na próxima conferência. À frente, agenda: o texto entra no site na hora marcada, com uma folga de uns quinze minutos, e é essa data que sai assinada nele.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "autora",
      title: "Quem escreveu",
      type: "string",
      description: "Quem assina. O nome aparece no artigo e na lista da revista.",
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
      description:
        "Opcional, e sem ela funciona: a lista mostra só o texto. Se puser, use horizontal e de 1600 px de largura para cima, senão ela sai borrada no topo do artigo.",
    }),
    defineField({
      name: "corpo",
      title: "Texto",
      type: "array",
      description:
        "O menu de estilos tem parágrafo, dois subtítulos, citação e lista. Não tem cor nem tamanho, e isso é de propósito: a aparência é do site. Colar do Word funciona, a formatação do Word é descartada.",
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
  preview: {
    select: { titulo: "titulo", data: "data", autora: "autora", media: "capa" },
    prepare({ titulo, data, autora, media }) {
      const quando = data
        ? new Date(data).toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "sem data";
      const agendado = Boolean(data) && new Date(data) > new Date();
      return {
        title: titulo ?? "Sem título",
        subtitle: agendado
          ? `Agendado para ${quando} · ${autora ?? "sem autora"}`
          : `${quando} · ${autora ?? "sem autora"}`,
        media,
      };
    },
  },
  orderings: [{ name: "recentes", title: "Mais recentes", by: [{ field: "data", direction: "desc" }] }],
});
