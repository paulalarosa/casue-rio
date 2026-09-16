import Link from "next/link";
import { CabecaPagina } from "@/components/cabeca-pagina";
import { FaixaVideo } from "@/components/faixa-video";
import posterBairros from "../../../public/video/bairros.webp";
import { Cena } from "@/components/cenas";
import { BAIRROS, DISPONIVEIS } from "@/lib/imoveis";
import { metaDaPagina } from "@/lib/site";
import { arquivo } from "@/lib/caminho";

export const metadata = metaDaPagina({
  titulo: "Onde a gente atua",
  descricao:
    "Centro, Tijuca, Grajaú e Zona Sul: quatro mercados diferentes, quatro contas diferentes.",
  caminho: "/bairros",
});

export default function PaginaBairros() {
  return (
    <>
      <CabecaPagina
        titulo="Onde a gente atua"
        linha="Clique no bairro que você procura."
        trilha={[{ href: "/", texto: "Início" }, { texto: "Bairros" }]}
      />

      {/* Era uma rua em 3D com um volume clicável por bairro. Saiu, e o que
          justifica é a própria página: a GRADE de bairros logo abaixo já faz
          essa navegação, com nome, contagem e descrição. O 3D custava mais de
          400 kB de pacote para repetir um índice que já existia, e não ligava
          no celular. O vídeo fica no lugar como ambiente, e quem navega
          navega pela grade. */}
      <div className="trilho mt-10">
        <FaixaVideo
          fonte={arquivo("/video/bairros.mp4")}
          poster={posterBairros}
          altura="aspect-[21/9] min-h-0"
          className="rounded-[1rem] shadow-[var(--shadow-flutua-3)]"
          veu="linear-gradient(to top, rgba(10,10,9,.8), rgba(10,10,9,.46) 55%, rgba(10,10,9,.2))"
        >
          <p className="max-w-[26ch] font-display text-[clamp(1.3rem,2.6vw,2rem)] font-semibold leading-tight tracking-[-0.03em] text-papel">
            Quatro mercados diferentes, quatro contas diferentes.
          </p>
        </FaixaVideo>
        {/* 🔴 O aviso continua, e mudou de texto junto com a peça: a imagem é
            de ambiente e não retrata imóvel da carteira. Vídeo de fachada num
            site de imobiliária sem essa linha vira anúncio do que não existe. */}
        <p className="mt-3 text-sm text-tinta-500">
          Imagem de ambiente. Não retrata imóvel da carteira.
        </p>
      </div>

      <div className="trilho secao grid gap-6 md:grid-cols-3">
        {BAIRROS.map((b) => {
          const n = DISPONIVEIS.filter((im) => im.regiao === b.chave).length;
          return (
            <Link
              key={b.chave}
              href={`/bairros/${encodeURIComponent(b.chave)}`}
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
                <h2 className="font-display text-2xl font-bold text-papel">{b.nome}</h2>
                <span className="num mt-1 block text-sm text-areia-300">
                  {n} {n === 1 ? "imóvel" : "imóveis"}
                </span>
                <p className="mt-3 text-sm text-tinta-200">{b.linha}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
