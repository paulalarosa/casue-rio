import { Suspense } from "react";
import Link from "next/link";

import { CabecaPagina } from "@/components/cabeca-pagina";
import { arquivo } from "@/lib/caminho";
import carteira from "../../../public/video/carteira.webp";
import { Vitrine } from "@/components/vitrine";
import { Cena } from "@/components/cenas";
import { BAIRROS } from "@/lib/carteira";
import { DISPONIVEIS, REGIOES, moeda, retratoDaRegiao } from "@/lib/imoveis";
import { metaDaPagina } from "@/lib/site";

export const metadata = metaDaPagina({
  titulo: "A carteira",
  descricao:
    "Imóveis para comprar e alugar no Centro, na Tijuca e na Zona Sul do Rio, com documentação conferida antes da proposta.",
  caminho: "/imoveis",
});

export default function PaginaImoveis() {
  const compra = DISPONIVEIS.filter((im) => im.finalidade === "comprar");
  const menor = Math.min(...compra.map((im) => im.preco));

  return (
    <>
      <CabecaPagina
        titulo="A carteira"
        linha="Documentação conferida antes de entrar na lista."
        fatos={[
          { valor: String(DISPONIVEIS.length), rotulo: "imóveis" },
          { valor: String(REGIOES.length), rotulo: "regiões no Rio" },
          { valor: moeda(menor), rotulo: "a partir de" },
        ]}
        trilha={[{ href: "/", texto: "Início" }, { texto: "Imóveis" }]}
        video={{ fonte: arquivo("/video/carteira.mp4"), poster: carteira }}
      />
      <p className="trilho mt-3 text-sm text-tinta-500">
        Imagem de ambiente. Não retrata imóvel da carteira.
      </p>
      <Suspense
        fallback={
          <div className="trilho py-24 text-tinta-500">Carregando a carteira…</div>
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
    </>
  );
}
