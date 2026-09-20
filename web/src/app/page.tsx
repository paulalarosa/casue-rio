import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Abertura } from "@/components/abertura";
import { FaixaVideo } from "@/components/faixa-video";
import posterSala from "../../public/video/sala.webp";
import { Busca } from "@/components/busca";
import { CartaoImovel } from "@/components/cartao-imovel";
import { Painel } from "@/components/painel";
import { Midia } from "@/components/midia";
import { EntradaAbertura, Revela } from "@/components/entrada";
import { DISPONIVEIS, moeda } from "@/lib/imoveis";
import { SLOGAN } from "@/lib/site";
import { arquivo } from "@/lib/caminho";
import { VideoFundo } from "@/components/video-fundo";
import posterNoite from "../../public/video/noite.webp";

export default function Home() {
  const destaques = DISPONIVEIS.filter((im) => im.destaque);

  return (
    <>
      <Abertura>
        <EntradaAbertura>
          <Painel variante="escuro" className="max-w-3xl rounded-[1rem] p-8 sm:p-12">
            <h1
              data-entra="titulo"
              className="max-w-[16ch] font-display text-[clamp(1.9rem,min(5.2vw,6.4svh),4.25rem)] leading-[1.03] text-papel"
            >
              {SLOGAN}
            </h1>
          </Painel>

          <div data-entra="busca" className="mt-4 max-w-3xl sm:mt-6">
            <Busca />
          </div>

          {destaques[0] && (
            <Link
              href={`/imoveis/${destaques[0].codigo}/`}
              data-entra="ficha"
              className="vidro absolute bottom-24 right-0 hidden w-[19.5rem] items-center gap-4 rounded-[1rem] p-4 text-papel transition-transform duration-500 ease-[var(--ease-saida)] hover:-translate-y-1 lg:flex"
            >
              <span className="relative size-20 shrink-0 overflow-hidden rounded-[0.75rem]">
                <Midia
                  foto={destaques[0].foto}
                  alt={destaques[0].alt}
                  cena={destaques[0].cena}
                  semente={destaques[0].codigo}
                  rotulo={`Ilustração da marca: ${destaques[0].titulo}`}
                  sizes="5rem"
                />
              </span>
              <span className="min-w-0">
                <span className="rotulo block text-areia-300">
                  {destaques[0].bairro} · {destaques[0].codigo}
                </span>
                <span className="mt-1 block truncate font-display text-lg font-semibold">
                  {destaques[0].titulo}
                </span>
                <span className="num mt-1 block text-sm text-tinta-200">
                  {moeda(destaques[0].preco)} · {destaques[0].area} m²
                </span>
              </span>
            </Link>
          )}
        </EntradaAbertura>
      </Abertura>

      <Revela id="destaques" className="trilho secao">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[clamp(1.8rem,3.4vw,2.75rem)]">Imóveis em destaque</h2>
            <p className="mt-3 text-lg text-tinta-500">
              Escolhidos por elas, com documentação conferida.
            </p>
          </div>
          <Link
            href="/imoveis"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-tinta-800/15 px-5 text-sm font-semibold text-tinta-800 transition-colors hover:bg-tinta-800/6"
          >
            Ver os {DISPONIVEIS.length} imóveis
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div data-revela>
            <CartaoImovel im={destaques[0]} variante="largo" />
          </div>
          <div className="grid gap-6">
            {destaques.slice(1, 3).map((im) => (
              <div key={im.codigo} data-revela className="h-full">
                <CartaoImovel im={im} variante="fila" />
              </div>
            ))}
          </div>
        </div>
      </Revela>

      <FaixaVideo
        fonte={arquivo("/video/sala.mp4")}
        poster={posterSala}
        altura="min-h-[24rem] sm:min-h-[32rem]"
      >
        <p className="max-w-[18ch] font-display text-[clamp(1.8rem,4.4vw,3.2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-papel">
          O imóvel vazio é o que a gente entrega.
        </p>
        <p className="mt-5 max-w-[42ch] text-base text-tinta-200 sm:text-lg">
          Sem móvel e sem montagem. O resto quem imagina é você.
        </p>
      </FaixaVideo>

      <Revela className="trilho secao">
        <div
          data-revela
          className="ilha relative isolate overflow-hidden bg-tinta-900 text-papel"
        >
          <div aria-hidden className="absolute inset-0 -z-20">
            <VideoFundo
              fonte={arquivo("/video/noite.mp4")}
              poster={posterNoite}
              paralaxe
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(100deg, rgba(5,5,4,.93) 0%, rgba(5,5,4,.78) 46%, rgba(5,5,4,.52) 100%)",
            }}
          />
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="max-w-[24ch] text-[clamp(1.9rem,4vw,3rem)] text-papel">
                Diga o bairro, os quartos e o valor.
              </h2>
              <p className="mt-5 max-w-[46ch] text-tinta-200">
                Resposta no mesmo dia, com o que temos e com o que não temos.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contato"
                className="inline-flex items-center gap-2 rounded-full bg-terracota-600 px-7 py-4 font-semibold text-papel shadow-[var(--shadow-flutua-2)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-terracota-700"
              >
                <MessageCircle className="size-5" aria-hidden />
                Falar com a gente
              </Link>
              <Link
                href="/imoveis"
                className="vidro inline-flex items-center gap-2 rounded-full px-7 py-4 font-semibold text-papel transition-transform duration-300 hover:-translate-y-0.5"
              >
                Ver os imóveis
              </Link>
            </div>
          </div>
        </div>
      </Revela>
    </>
  );
}
