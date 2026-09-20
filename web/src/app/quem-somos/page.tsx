import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { CabecaPagina } from "@/components/cabeca-pagina";
import { Revela } from "@/components/entrada";
import { Painel } from "@/components/painel";
import { arquivo } from "@/lib/caminho";
import posterPortaria from "../../../public/video/portaria.webp";
import { SOCIAS, SLOGAN, metaDaPagina } from "@/lib/site";

export const metadata = metaDaPagina({
  titulo: "Quem somos",
  descricao:
    "Duas corretoras e avaliadoras no Rio de Janeiro, com CRECI e CNAI. Quem mostra o imóvel é quem cuida da papelada e quem assina o contrato.",
  caminho: "/quem-somos",
});

export default function PaginaQuemSomos() {
  return (
    <>
      <CabecaPagina
        titulo="Quem somos"
        linha="Duas corretoras. A mesma pessoa cuida da visita, da papelada e do contrato."
        video={{ fonte: arquivo("/video/portaria.mp4"), poster: posterPortaria }}
        trilha={[{ href: "/", texto: "Início" }, { texto: "Quem somos" }]}
      />
      <p className="trilho mt-3 text-sm text-tinta-500">
        Imagem de ambiente. Não retrata imóvel da carteira.
      </p>

      <Revela className="trilho secao">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <h2
            data-revela
            className="max-w-[16ch] text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.08]"
          >
            {SLOGAN}
          </h2>
          <div data-revela className="border-t border-terracota-600/30 pt-6">
            <p className="text-lg leading-relaxed text-tinta-500">
              Você não é passado para outro setor. Quem abre a porta do imóvel é a mesma
              que levanta a papelada, conversa com o condomínio e senta na assinatura.
            </p>
          </div>
        </div>
      </Revela>

      <Revela className="campo-luz trilho secao relative">
        <h2 className="text-[clamp(1.8rem,3.4vw,2.75rem)]">Quem atende você</h2>
        <p className="mt-3 text-lg text-tinta-500">
          As duas são corretoras com CRECI e avaliadoras com CNAI.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {SOCIAS.map((s) => (
            <div key={s.nome} data-revela className="flex flex-col gap-5">
              <div className="relative isolate flex aspect-4/5 items-center justify-center overflow-hidden rounded-[0.875rem] bg-tinta-800 shadow-[var(--shadow-flutua-2)]">
                <span
                  aria-hidden
                  className="font-display text-[9rem] font-bold leading-none text-papel/15"
                >
                  {s.inicial}
                </span>
                <span className="rotulo absolute inset-x-6 bottom-6 border-t border-white/20 pt-4 text-areia-300">
                  Retrato entra aqui · foto vertical 4:5
                </span>
              </div>
              <div>
                <span className="rotulo block text-bronze-500">
                  Corretora e avaliadora
                </span>
                <span className="mt-1 block font-display text-3xl font-bold leading-tight text-tinta-800">
                  {s.nome}
                </span>
                <span className="num mt-3 block text-sm text-tinta-500">
                  {s.creci} · {s.cnai}
                </span>
                <p className="mt-4 text-tinta-500">{s.linha}</p>
              </div>
            </div>
          ))}
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
          <h2 className="text-3xl text-papel">Fale com uma das duas.</h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-tinta-200">
            Um canal só, da empresa, e as duas atendem por ele. A resposta chega no mesmo
            dia.
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
