import { Suspense } from "react";
import Link from "next/link";

import { CabecaPagina } from "@/components/cabeca-pagina";
import { FormBusca } from "@/components/form-busca";
import { arquivo } from "@/lib/caminho";
import carteira from "../../../public/video/carteira.webp";
import { Vitrine } from "@/components/vitrine";
import { Cena } from "@/components/cenas";
import { BAIRROS } from "@/lib/carteira";
import { DISPONIVEIS, moeda, retratoDaRegiao } from "@/lib/imoveis";
import { metaDaPagina } from "@/lib/site";

export const metadata = metaDaPagina({
  titulo: "Imóveis no Rio",
  descricao:
    "Imóveis para comprar e alugar no Centro, na Tijuca e na Zona Sul do Rio, com documentação conferida antes da proposta.",
  caminho: "/imoveis",
});

export default function PaginaImoveis() {
  return (
    <>
      <CabecaPagina
        titulo="Imóveis no Rio"
        linha="Documentação conferida antes de entrar na lista."
        trilha={[{ href: "/", texto: "Início" }, { texto: "Imóveis" }]}
        video={{ fonte: arquivo("/video/carteira.mp4"), poster: carteira }}
      />
      <p className="trilho mt-3 text-sm text-tinta-500">
        Imagem de ambiente. Não retrata imóvel anunciado.
      </p>
      <Suspense
        fallback={
          <div className="trilho py-24 text-tinta-500">Carregando os imóveis…</div>
        }
      >
        <Vitrine />
      </Suspense>

      <section className="trilho secao">
        <div className="mb-10">
          <h2 className="text-[clamp(1.7rem,3vw,2.4rem)]">Procurar por bairro</h2>
          <p className="mt-3 max-w-[52ch] text-lg text-tinta-500">
            Cada região tem uma conta diferente, e a gente faz as três.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {BAIRROS.map((b) => {
            const n = DISPONIVEIS.filter((im) => im.regiao === b.chave).length;
            const retrato = retratoDaRegiao(b.chave);
            return (
              <Link
                key={b.chave}
                href={`/bairros/${b.apelido}/`}
                className="group relative isolate flex min-h-[18rem] flex-col justify-end overflow-hidden rounded-[0.875rem] p-5 shadow-[var(--shadow-flutua-2)] transition-transform duration-500 ease-[var(--ease-saida)] hover:-translate-y-1.5"
              >
                <Cena
                  nome={b.cena}
                  semente={b.chave}
                  rotulo={`Ilustração da marca: ${b.nome}`}
                  className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 ease-[var(--ease-saida)] group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-gradient-to-t from-tinta-900/85 via-tinta-900/25 to-transparent"
                />
                <div className="tinta rounded-[0.75rem] p-4">
                  <h3 className="font-display text-xl font-bold text-papel">{b.nome}</h3>
                  <span className="num mt-1 block text-sm text-areia-300">
                    {n} {n === 1 ? "imóvel" : "imóveis"}
                    {retrato && (
                      <>
                        {" · "}
                        {retrato.menor === retrato.maior
                          ? moeda(retrato.menor)
                          : `${moeda(retrato.menor)} a ${moeda(retrato.maior)}`}
                      </>
                    )}
                  </span>
                  <p className="mt-2 text-sm text-tinta-200">{b.linha}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="trilho secao" id="buscamos-para-voce">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <h2 className="text-[clamp(1.8rem,3.4vw,2.75rem)]">
              Não encontrou o imóvel que procura?
            </h2>
            <p className="mt-5 max-w-[46ch] text-lg text-tinta-500">
              A gente pode buscar para você. A atuação da Casuê Rio não para nos imóveis
              que estão nesta página.
            </p>
            <p className="mt-6 max-w-[46ch] text-tinta-500">
              Primeiro a gente entende o que você procura: localização, características,
              necessidades, estilo e objetivo. Quando a oportunidade certa ainda não está
              disponível, sai uma captação direcionada, procurando no mercado o imóvel que
              combina com esse perfil.
            </p>
            <p className="mt-6 max-w-[46ch] text-tinta-500">
              Porque achar o imóvel certo não é mostrar o que a gente tem. É entender o
              que você procura e ir atrás do que faz sentido.
            </p>
          </div>
          <div className="ilha border border-tinta-800/10 bg-areia-100">
            <FormBusca />
          </div>
        </div>
      </section>
    </>
  );
}
