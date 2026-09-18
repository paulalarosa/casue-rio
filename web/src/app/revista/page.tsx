import Link from "next/link";
import Image from "next/image";
import { ArrowRight, AtSign } from "lucide-react";
import { CabecaPagina } from "@/components/cabeca-pagina";
import { Revela } from "@/components/entrada";
import { Painel } from "@/components/painel";
import { arquivo } from "@/lib/caminho";
import posterParede from "../../../public/video/parede.webp";
import { listarArtigos, dataPorExtenso } from "@/lib/revista";
import { Dados } from "@/components/dados";
import { revista, trilha, grafo } from "@/lib/dados-estruturados";
import { imagem } from "@/lib/sanity";
import { INSTAGRAM, INSTAGRAM_URL, metaDaPagina } from "@/lib/site";

export const metadata = metaDaPagina({
  titulo: "Revista",
  descricao:
    "O que a Casuê Rio escreve sobre comprar, vender e alugar no Rio: documentação, bairro por bairro e o que muda o preço de um imóvel.",
  caminho: "/revista",
});

/* A revista.

   🔴 Os textos vêm do painel da Sanity, e a lista chega VAZIA enquanto o
   projeto não existir ou nenhum artigo estiver publicado. Os dois casos
   caem no mesmo estado de tela, que é o de baixo: a página diz que o
   primeiro texto não saiu e manda para o Instagram, onde elas já publicam.

   🔴 O que eu NÃO fiz foi escrever matérias de exemplo para a grade não
   ficar vazia. Texto assinado por corretora com CRECI, escrito por mim, é o
   mesmo erro do depoimento inventado que já saiu deste site.

   O vídeo é o `parede.mp4`, que ficou sem casa quando a faixa escura saiu
   da home. Sombra de janela andando devagar numa parede vazia: tempo
   passando, que é do que uma revista trata. */

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

export default async function PaginaRevista() {
  const materias = await listarArtigos();

  return (
    <>
      {/* 🔴 O `Blog` só é declarado quando existe artigo. Um blog vazio em
          dado estruturado é uma promessa que a página não cumpre, e o
          buscador confere. */}
      {materias.length > 0 && (
        <Dados>
          {grafo(
            revista(materias),
            trilha([
              { nome: "Início", caminho: "/" },
              { nome: "Revista", caminho: "/revista/" },
            ]),
          )}
        </Dados>
      )}
      <CabecaPagina
        titulo="Revista"
        linha="O que a gente aprende trabalhando, escrito por quem assina o contrato."
        video={{ fonte: arquivo("/video/parede.mp4"), poster: posterParede }}
        trilha={[{ href: "/", texto: "Início" }, { texto: "Revista" }]}
      />
      <p className="trilho mt-3 text-sm text-tinta-500">
        Imagem de ambiente. Não retrata imóvel da carteira.
      </p>

      {materias.length > 0 ? (
        <Revela className="trilho secao">
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {materias.map((m) => {
              const capa = m.capa ? imagem(m.capa, 800, 500) : null;
              return (
                <Link
                  key={m.slug}
                  href={`/revista/${m.slug}/`}
                  data-revela
                  className="group flex flex-col"
                >
                  {capa && (
                    <div className="relative mb-5 aspect-16/10 overflow-hidden rounded-[0.875rem] shadow-[var(--shadow-flutua-1)]">
                      <Image
                        src={capa}
                        alt={m.capa?.alt ?? ""}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-[var(--ease-saida)] group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="border-t border-tinta-800/15 pt-5 transition-colors group-hover:border-terracota-600">
                    <span className="rotulo flex flex-wrap items-center gap-x-2 text-bronze-500">
                      <time dateTime={m.data} className="num">
                        {dataPorExtenso(m.data)}
                      </time>
                      <span aria-hidden className="text-tinta-300">·</span>
                      <span>{m.autora}</span>
                    </span>
                    <h2 className="mt-3 font-display text-2xl leading-tight text-tinta-800">
                      {m.titulo}
                    </h2>
                    <p className="mt-3 text-tinta-500">{m.linha}</p>
                  </div>
                </Link>
              );
            })}
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
