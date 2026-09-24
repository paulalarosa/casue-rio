import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CabecaPagina } from "@/components/cabeca-pagina";
import { arquivo } from "@/lib/caminho";
import alameda from "../../../../public/video/alameda.webp";
import { GradeImoveis } from "@/components/grade-imoveis";
import { Painel } from "@/components/painel";
import { BAIRROS } from "@/lib/carteira";
import { DISPONIVEIS, bairroPorApelido, moeda, retratoDaRegiao } from "@/lib/imoveis";
import { metaDaPagina } from "@/lib/site";

export function generateStaticParams() {
  return BAIRROS.map((b) => ({ chave: b.apelido }));
}

export async function generateMetadata({ params }: PageProps<"/bairros/[chave]">) {
  const { chave } = await params;
  const b = bairroPorApelido(chave);
  if (!b) return {};
  const retrato = retratoDaRegiao(b.chave);
  const quantos = retrato
    ? `${retrato.quantos} ${retrato.quantos === 1 ? "imóvel anunciado" : "imóveis anunciados"}. `
    : "";
  return metaDaPagina({
    titulo: `Imóveis ${b.local}`,
    descricao: `${quantos}${b.linha} ${b.texto}`.slice(0, 300),
    caminho: `/bairros/${b.apelido}`,
  });
}

export default async function PaginaBairro({ params }: PageProps<"/bairros/[chave]">) {
  const { chave } = await params;
  const b = bairroPorApelido(chave);
  if (!b) notFound();
  const lista = DISPONIVEIS.filter((im) => im.regiao === b.chave);
  const retrato = retratoDaRegiao(b.chave);

  return (
    <>
      <CabecaPagina
        titulo={b.nome}
        linha={b.linha}
        video={{ fonte: arquivo("/video/alameda.mp4"), poster: alameda }}
        trilha={[
          { href: "/", texto: "Início" },
          { href: "/bairros", texto: "Bairros" },
          { texto: b.nome },
        ]}
      />

      <div className="trilho secao">
        <p className="max-w-[62ch] text-[clamp(1.05rem,1.5vw,1.35rem)] leading-relaxed text-tinta-500">
          {b.texto}
        </p>
      </div>

      {retrato && (
        <dl className="trilho grid grid-cols-2 gap-y-8 border-y border-tinta-800/12 py-8 sm:grid-cols-3">
          {[
            [
              "Anunciados",
              `${retrato.quantos} ${retrato.quantos === 1 ? "imóvel" : "imóveis"}`,
            ],
            ["Faixa de preço", `${moeda(retrato.menor)} a ${moeda(retrato.maior)}`],
            ["Área mediana", `${retrato.areaMediana} m²`],
          ].map(([rotulo, valor], i) => (
            <div
              key={rotulo}
              className={`flex flex-col gap-1 ${
                i > 0 ? "sm:border-l sm:border-tinta-800/10 sm:pl-6" : ""
              }`}
            >
              <dt className="rotulo text-tinta-500">{rotulo}</dt>
              <dd className="num text-xl font-semibold text-tinta-800">{valor}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="trilho secao">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl">Imóveis {b.local}</h2>
          <Link
            href={`/imoveis?regiao=${encodeURIComponent(b.chave)}`}
            className="inline-flex items-center gap-2 rounded-full border border-tinta-800/15 px-5 py-2.5 text-sm font-semibold text-tinta-800 transition-colors hover:bg-tinta-800/6"
          >
            Ver todos os imóveis <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        {lista.length > 0 ? (
          <GradeImoveis imoveis={lista} />
        ) : (
          <Painel className="p-10 text-center">
            <h3 className="text-2xl">Ainda não temos imóvel anunciado {b.local}</h3>
            <p className="mx-auto mt-4 max-w-[46ch] text-tinta-500">
              A gente atende a região e faz captação direcionada. Conte o que procura e
              vamos atrás.
            </p>
            <Link
              href="/imoveis#buscamos-para-voce"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-tinta-800 px-6 py-3.5 font-semibold text-papel shadow-[var(--shadow-flutua-2)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Contar o que eu procuro <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Painel>
        )}
      </div>
    </>
  );
}
