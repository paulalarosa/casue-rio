import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { CabecaPagina } from "@/components/cabeca-pagina";
import { Revela } from "@/components/entrada";
import { Painel } from "@/components/painel";
import { arquivo } from "@/lib/caminho";
import posterPortaria from "../../../public/video/portaria.webp";
import { SLOGAN, metaDaPagina } from "@/lib/site";

export const metadata = metaDaPagina({
  titulo: "Quem somos",
  descricao:
    "Na Casuê Rio, cada imóvel é uma oportunidade de construir valor. Atuação estratégica, próxima e criteriosa no mercado imobiliário do Rio de Janeiro, com CRECI e CNAI.",
  caminho: "/quem-somos",
});

export default function PaginaQuemSomos() {
  return (
    <>
      <CabecaPagina
        titulo="Quem somos"
        linha={SLOGAN}
        video={{ fonte: arquivo("/video/portaria.mp4"), poster: posterPortaria }}
        trilha={[{ href: "/", texto: "Início" }, { texto: "Quem somos" }]}
      />
      <p className="trilho mt-3 text-sm text-tinta-500">
        Imagem de ambiente. Não retrata imóvel anunciado.
      </p>

      <Revela className="trilho secao">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <h2
            data-revela
            className="max-w-[16ch] text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.08]"
          >
            Cada imóvel é uma oportunidade de construir valor.
          </h2>
          <div data-revela className="border-t border-terracota-600/30 pt-6">
            <p className="text-lg leading-relaxed text-tinta-500">
              Na Casuê Rio, acreditamos que cada imóvel representa uma oportunidade de
              construir valor e que um bom negócio imobiliário começa pela compreensão das
              necessidades de cada cliente.
            </p>
          </div>
        </div>
      </Revela>

      <Revela className="campo-luz trilho secao relative">
        <div className="max-w-[62ch]">
          <p data-revela className="text-lg leading-relaxed text-tinta-500">
            Atuamos no mercado imobiliário com uma abordagem estratégica, próxima e
            criteriosa, unindo visão comercial, conhecimento de mercado e atenção aos
            aspectos técnicos de cada negociação. Nosso trabalho envolve a curadoria de
            imóveis, a identificação de oportunidades e a compreensão dos objetivos de
            compradores, proprietários e investidores, buscando conectar pessoas e imóveis
            de forma inteligente e alinhada a cada necessidade.
          </p>
          <p data-revela className="mt-6 text-lg leading-relaxed text-tinta-500">
            Acompanhamos cada etapa do processo com organização, transparência e
            responsabilidade, para que as negociações sejam conduzidas com clareza,
            segurança e eficiência.
          </p>
          <blockquote
            data-revela
            className="mt-12 border-l-2 border-terracota-600/50 pl-6 font-display text-[clamp(1.25rem,2.2vw,1.6rem)] leading-snug text-tinta-800"
          >
            Mais do que intermediar negócios, buscamos construir relações de confiança e
            oferecer um atendimento presente e personalizado, porque acreditamos que, por
            trás de cada negociação, existe uma história, um objetivo e uma oportunidade.
          </blockquote>
        </div>
      </Revela>

      <Revela className="trilho secao">
        <div className="grid gap-8 lg:grid-cols-2">
          <Painel data-revela className="p-8">
            <span className="rotulo text-bronze-500">CRECI</span>
            <h3 className="mt-2 font-display text-xl">Autoriza a intermediar</h3>
            <p className="mt-3 text-tinta-500">
              É o registro no Conselho Regional de Corretores de Imóveis. Sem ele, ninguém
              pode anunciar, mostrar nem fechar negócio com imóvel de terceiro. Qualquer
              pessoa confere o número no site do conselho.
            </p>
          </Painel>
          <Painel data-revela className="p-8">
            <span className="rotulo text-bronze-500">CNAI</span>
            <h3 className="mt-2 font-display text-xl">Autoriza a avaliar</h3>
            <p className="mt-3 text-tinta-500">
              É o Cadastro Nacional de Avaliadores Imobiliários. É ele que permite emitir
              parecer técnico de valor, que é o documento aceito em inventário, partilha e
              garantia bancária.
            </p>
            <Link
              href="/avaliacao"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-terracota-600 underline underline-offset-4 transition-colors hover:text-terracota-700"
            >
              Ver como funciona a avaliação
            </Link>
          </Painel>
        </div>
      </Revela>

      <Revela className="trilho secao">
        <div
          data-revela
          className="ilha relative isolate overflow-hidden bg-tinta-800 text-center text-papel"
        >
          <h2 className="text-3xl text-papel">Fale com a Casuê Rio.</h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-tinta-200">
            Um canal só, e a resposta chega no mesmo dia.
          </p>
          <Link
            href="/contato"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-terracota-600 px-7 py-4 font-semibold text-papel shadow-[var(--shadow-flutua-2)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-terracota-700"
          >
            <MessageCircle className="size-5" aria-hidden /> Falar com a gente
          </Link>
        </div>
      </Revela>
    </>
  );
}
