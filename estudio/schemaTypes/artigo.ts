import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";

/* Daqui a uma hora, arredondado, para o campo já nascer com algo plausível.

   🔴 O valor gravado é sempre ISO em UTC, e a tela sempre mostra o fuso do
   Rio. Essa separação é o que evita o erro clássico: guardar "18/09 09:00"
   sem fuso e o build, que roda em servidor americano, ler isso como 09:00
   UTC, ou seja, 6h da manhã no Rio. Data e hora sem fuso não são data e
   hora, são um texto que parece uma. */
const daquiUmaHora = () => {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return d.toISOString();
};

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
      /* 🔴 ESTE CAMPO AGENDA, e um campo só, de propósito.

         Data futura significa duas coisas ao mesmo tempo, e elas são a
         mesma: o texto entra no site naquele dia, e é aquele dia que
         aparece assinado embaixo do título. Já escrevi a versão com dois
         campos, "data do texto" e "data de publicação", e ela sempre acaba
         com os dois diferentes por engano e ninguém sabendo qual manda.

         O site filtra por `data <= agora` na hora de montar as páginas, e
         uma tarefa no GitHub confere de quinze em quinze minutos se chegou
         a hora de alguém. Quem venceu entra sozinho. */
      description:
        "Data e hora passadas publicam na próxima conferência. À frente, agenda: o texto entra no site na hora marcada, com uma folga de uns quinze minutos, e é essa data que sai assinada nele.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "autora",
      title: "Quem escreveu",
      type: "string",
      description: "Quem assina. O nome aparece no artigo e na lista da revista.",
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
        ? new Date(data).toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "sem data";
      /* 🔴 O agendamento aparece NA LISTA, e não só dentro do documento.
         Um texto publicado com data à frente não está no site, e a única
         tela em que isso é visível sem abrir nada é esta. Sem o aviso aqui,
         a lista mostraria um artigo com cara de no ar que não está. */
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
