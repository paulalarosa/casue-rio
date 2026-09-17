import Link from "next/link";
import { ArrowRight, AtSign } from "lucide-react";
import { CabecaPagina } from "@/components/cabeca-pagina";
import { Revela } from "@/components/entrada";
import { Painel } from "@/components/painel";
import { arquivo } from "@/lib/caminho";
import posterParede from "../../../public/video/parede.webp";
import { INSTAGRAM, INSTAGRAM_URL, metaDaPagina } from "@/lib/site";

export const metadata = metaDaPagina({
  titulo: "Revista",
  descricao:
    "O que a Casuê Rio escreve sobre comprar, vender e alugar no Rio: documentação, bairro por bairro e o que muda o preço de um imóvel.",
  caminho: "/revista",
});

/* A revista, antes de ter o primeiro texto.

   🔴 Esta página está VAZIA de propósito e a lista abaixo é o motivo de ela
   já existir: no dia em que o primeiro texto for escrito, ele entra em
   `MATERIAS` e a página inteira nasce montada, com grade, data e chamada.
   Página de blog que se improvisa no dia da primeira publicação é a que sai
   com cara de improviso.

   🔴 O que NÃO fiz: escrever três matérias de exemplo para a grade não
   ficar vazia. Texto assinado por uma corretora com CRECI, escrito por mim,
   é exatamente o tipo de conteúdo que não pode existir aqui — vale a mesma
   regra do depoimento inventado que já saiu deste site. Enquanto não houver
   texto delas, a página diz que não há, e manda para onde elas de fato
   publicam hoje, que é o Instagram.

   O vídeo é o `parede.mp4`, que ficou sem casa quando a faixa escura saiu
   da home. Sombra de janela andando devagar numa parede vazia: tempo
   passando, que é do que uma revista trata. */

type Materia = {
  slug: string;
  titulo: string;
  linha: string;
  data: string;
};

const MATERIAS: Materia[] = [];

const ASSUNTOS = [
  {
    titulo: "O que a matrícula conta",
    texto:
      "Inventário em aberto, penhora, dívida de condomínio e obra sem averbação: o que aparece no papel e não aparece na visita.",
  },
  {
    titulo: "Bairro por bairro",
    texto:
      "O que muda de uma rua para a outra no Centro, na Tijuca e na Zona Sul, e por que o mesmo metro quadrado custa dois preços.",
  },
  {
    titulo: "Quanto vale, e por quê",
    texto:
      "Como um parecer de avaliação chega a um número, e o que realmente pesa: andar, vaga, conservação e comparável de verdade.",
  },
];

export default function PaginaRevista() {
  return (
    <>
      <CabecaPagina
        titulo="Revista"
        linha="O que a gente aprende trabalhando, escrito por quem assina o contrato."
        video={{ fonte: arquivo("/video/parede.mp4"), poster: posterParede }}
        trilha={[{ href: "/", texto: "Início" }, { texto: "Revista" }]}
      />
      <p className="trilho mt-3 text-sm text-tinta-500">
        Imagem de ambiente. Não retrata imóvel da carteira.
      </p>

      {MATERIAS.length > 0 ? (
        <Revela className="trilho secao">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {MATERIAS.map((m) => (
              <Link
                key={m.slug}
                href={`/revista/${m.slug}/`}
                data-revela
                className="group flex flex-col border-t border-tinta-800/15 pt-6 transition-colors hover:border-terracota-600"
              >
                <span className="num text-sm text-bronze-500">{m.data}</span>
                <h2 className="mt-3 font-display text-2xl leading-tight text-tinta-800">
                  {m.titulo}
                </h2>
                <p className="mt-3 text-tinta-500">{m.linha}</p>
              </Link>
            ))}
          </div>
        </Revela>
      ) : (
        <Revela className="trilho secao">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div data-revela>
              <h2 className="max-w-[18ch] text-[clamp(1.8rem,3.4vw,2.75rem)] leading-[1.1]">
                O primeiro texto ainda não saiu.
              </h2>
              <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-tinta-500">
                A revista vai ser escrita por elas, sobre o que aparece no
                trabalho de verdade. Enquanto o primeiro não sai, o que já
                existe está no Instagram.
              </p>
              {INSTAGRAM && (
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-tinta-800 px-6 py-3 font-semibold text-papel shadow-[var(--shadow-flutua-2)] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <AtSign className="size-4" aria-hidden />
                  {INSTAGRAM}
                  <ArrowRight className="size-4" aria-hidden />
                </a>
              )}
            </div>

            <Painel data-revela className="p-8 sm:p-10">
              <span className="rotulo text-bronze-500">O que vem aí</span>
              <ul className="mt-6 space-y-7">
                {ASSUNTOS.map((a) => (
                  <li key={a.titulo} className="border-t border-tinta-800/12 pt-5">
                    <h3 className="font-display text-xl leading-tight">{a.titulo}</h3>
                    <p className="mt-2 text-tinta-500">{a.texto}</p>
                  </li>
                ))}
              </ul>
            </Painel>
          </div>
        </Revela>
      )}
    </>
  );
}
