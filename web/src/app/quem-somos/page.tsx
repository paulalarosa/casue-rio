import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Building2, MessageCircle, Quote, ScanSearch, Users } from "lucide-react";
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

const TRABALHO: { Icone: LucideIcon; texto: string }[] = [
  { Icone: Building2, texto: "A curadoria de imóveis" },
  { Icone: ScanSearch, texto: "A identificação de oportunidades" },
  {
    Icone: Users,
    texto: "A compreensão dos objetivos de compradores, proprietários e investidores",
  },
];

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
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end lg:gap-20">
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

      <Revela className="trilho pb-20 sm:pb-28">
        <div className="grid gap-14 border-t border-tinta-800/10 pt-14 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-[60ch] space-y-6 text-lg leading-relaxed text-tinta-500">
            <p data-revela>
              Atuamos no mercado imobiliário com uma abordagem estratégica, próxima e
              criteriosa, unindo visão comercial, conhecimento de mercado e atenção aos
              aspectos técnicos de cada negociação.
            </p>
            <p data-revela>
              Acompanhamos cada etapa do processo com organização, transparência e
              responsabilidade, para que as negociações sejam conduzidas com clareza,
              segurança e eficiência.
            </p>
          </div>

          <div data-revela>
            <span className="rotulo text-bronze-500">Nosso trabalho envolve</span>
            <ul className="mt-6">
              {TRABALHO.map(({ Icone, texto }) => (
                <li
                  key={texto}
                  className="flex items-start gap-4 border-b border-tinta-800/10 py-5 first:pt-0"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-terracota-600/10 text-terracota-600">
                    <Icone className="size-5" aria-hidden />
                  </span>
                  <span className="pt-2 text-lg leading-snug text-tinta-800">
                    {texto}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-tinta-500">
              O objetivo é conectar pessoas e imóveis de forma inteligente e alinhada a
              cada necessidade.
            </p>
          </div>
        </div>
      </Revela>

      <Revela className="campo-luz trilho secao relative">
        <figure data-revela className="mx-auto max-w-[64rem] text-center">
          <Quote className="mx-auto size-8 text-terracota-600" aria-hidden />
          <blockquote className="mx-auto mt-6 max-w-[32ch] text-balance font-display text-[clamp(1.4rem,2.8vw,2.2rem)] leading-[1.25] tracking-[-0.02em] text-tinta-800">
            Mais do que intermediar negócios, buscamos construir relações de confiança e
            oferecer um atendimento presente e personalizado, porque acreditamos que, por
            trás de cada negociação, existe uma história, um objetivo e uma oportunidade.
          </blockquote>
        </figure>
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
