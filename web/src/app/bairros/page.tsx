import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CabecaPagina } from "@/components/cabeca-pagina";
import { Revela } from "@/components/entrada";
import { Cena } from "@/components/cenas";
import { BAIRROS } from "@/lib/carteira";
import { DISPONIVEIS, REGIOES } from "@/lib/imoveis";
import { metaDaPagina } from "@/lib/site";
import { arquivo } from "@/lib/caminho";
import posterHorizonte from "../../../public/video/horizonte.webp";

export const metadata = metaDaPagina({
  titulo: "Onde a gente atua",
  descricao:
    "Centro, Tijuca e Zona Sul: três mercados diferentes, três contas diferentes.",
  caminho: "/bairros",
});

const POR_EXTENSO: Record<number, string> = {
  1: "Um",
  2: "Dois",
  3: "Três",
  4: "Quatro",
  5: "Cinco",
};
function porExtenso(n: number) {
  return POR_EXTENSO[n] ?? String(n);
}

export default function PaginaBairros() {
  const quantos = porExtenso(REGIOES.length);

  return (
    <>
      <CabecaPagina
        titulo="Onde a gente atua"
        linha={`${quantos} mercados diferentes, ${quantos.toLowerCase()} contas diferentes.`}
        video={{ fonte: arquivo("/video/horizonte.mp4"), poster: posterHorizonte }}
        trilha={[{ href: "/", texto: "Início" }, { texto: "Bairros" }]}
      />
      <p className="trilho mt-3 text-sm text-tinta-500">
        Imagem de ambiente. Não retrata imóvel da carteira.
      </p>

      <Revela className="trilho secao">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[clamp(1.6rem,3vw,2.3rem)]">Escolha o bairro</h2>
          <Link
            href="/imoveis"
            className="inline-flex items-center gap-2 rounded-full border border-tinta-800/15 px-5 py-2.5 text-sm font-semibold text-tinta-800 transition-colors hover:bg-tinta-800/6"
          >
            Ver a carteira inteira
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {BAIRROS.map((b) => {
            const n = DISPONIVEIS.filter((im) => im.regiao === b.chave).length;
            return (
              <Link
                key={b.chave}
                href={`/bairros/${encodeURIComponent(b.chave)}`}
                data-revela
                className="group relative isolate flex min-h-[24rem] flex-col justify-end overflow-hidden rounded-[0.875rem] p-6 shadow-[var(--shadow-flutua-2)] transition-transform duration-500 ease-[var(--ease-saida)] hover:-translate-y-1.5"
              >
                <Cena
                  nome={b.cena}
                  semente={b.chave}
                  rotulo={`Ilustração da marca: ${b.nome}`}
                  className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-gradient-to-t from-tinta-900/85 via-tinta-900/25 to-transparent"
                />
                <div className="tinta rounded-[0.75rem] p-5">
                  <h3 className="font-display text-2xl font-bold text-papel">{b.nome}</h3>
                  <span className="num mt-1 block text-sm text-areia-300">
                    {n} {n === 1 ? "imóvel" : "imóveis"}
                  </span>
                  <p className="mt-3 text-sm text-tinta-200">{b.linha}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </Revela>
    </>
  );
}
