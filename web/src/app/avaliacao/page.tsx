import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  MessageCircle,
  Ruler,
  ScrollText,
} from "lucide-react";
import { AcaoZap } from "@/components/acao";
import { CabecaPagina } from "@/components/cabeca-pagina";
import { arquivo } from "@/lib/caminho";
import avaliacao from "../../../public/video/avaliacao.webp";
import { Revela } from "@/components/entrada";
import { metaDaPagina } from "@/lib/site";

export const metadata = metaDaPagina({
  titulo: "Avaliação de imóvel",
  descricao:
    "Parecer de valor assinado por avaliadora cadastrada no CNAI, no Rio de Janeiro. Para definir preço de venda, inventário, partilha e garantia bancária.",
  caminho: "/avaliacao",
});

const QUANDO = [
  {
    n: "01",
    titulo: "Definir o preço de venda",
    texto:
      "Anúncio caro encalha e anúncio barato deixa dinheiro na mesa. O valor sai de imóvel comparável de verdade, não de estimativa de portaria.",
  },
  {
    n: "02",
    titulo: "Inventário e partilha",
    texto:
      "Divisão entre herdeiros e divórcio precisam de um valor defensável, porque é ele que decide quanto cada um leva.",
  },
  {
    n: "03",
    titulo: "Garantia e financiamento",
    texto: "Quando o banco ou a outra parte exige parecer técnico assinado.",
  },
  {
    n: "04",
    titulo: "Decisão de comprar",
    texto:
      "Antes da proposta, saber se o preço pedido está dentro do que a região pratica.",
  },
];

const COMO = [
  {
    n: "01",
    Ic: Ruler,
    titulo: "Visita técnica",
    texto:
      "Medição, estado de conservação, posição no prédio, iluminação e o que valoriza ou tira valor.",
  },
  {
    n: "02",
    Ic: ClipboardCheck,
    titulo: "Comparáveis",
    texto:
      "Levantamento de imóveis semelhantes na mesma região, com ajuste por área, andar, vaga e conservação.",
  },
  {
    n: "03",
    Ic: ScrollText,
    titulo: "Parecer assinado",
    texto:
      "Documento com metodologia, fotos e fundamentação, assinado por avaliadora com CNAI.",
  },
];

export default function PaginaAvaliacao() {
  return (
    <>
      <CabecaPagina
        titulo="Avaliação de imóvel"
        linha="Quanto vale, com parecer assinado por quem tem cadastro para assinar."
        video={{ fonte: arquivo("/video/avaliacao.mp4"), poster: avaliacao }}
        trilha={[{ href: "/", texto: "Início" }, { texto: "Avaliação" }]}
      />
      <p className="trilho mt-3 text-sm text-tinta-500">
        Imagem de ambiente. Não retrata imóvel da carteira.
      </p>

      <Revela className="trilho secao">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-end">
          <p
            data-revela
            className="max-w-[26ch] font-display text-[clamp(1.7rem,3.6vw,2.9rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-tinta-800"
          >
            Preço é o que alguém pede. Valor é o que se sustenta num papel assinado.
          </p>
          <p
            data-revela
            className="border-t border-terracota-600/30 pt-6 text-lg text-tinta-500"
          >
            <span className="mb-3 block font-display text-xl font-semibold text-terracota-600">
              Patrimônio se mede.
            </span>
            O parecer é o documento que transforma o que você tem num número que o banco,
            o juiz e a outra parte aceitam. Opinião não entra em processo, laudo entra.
          </p>
        </div>
      </Revela>

      <Revela className="trilho secao">
        <h2 className="text-[clamp(1.8rem,3.4vw,2.75rem)]">Quando você precisa</h2>
        <p className="mt-3 max-w-[52ch] text-lg text-tinta-500">
          Quatro situações em que a conta de cabeça sai cara.
        </p>
        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {QUANDO.map((q) => (
            <li key={q.n} data-revela className="border-t border-tinta-800/15 pt-6">
              <span className="num text-sm text-bronze-500">{q.n}</span>
              <h3 className="mt-3 font-display text-xl leading-tight">{q.titulo}</h3>
              <p className="mt-3 text-tinta-500">{q.texto}</p>
            </li>
          ))}
        </ul>
      </Revela>

      <Revela className="secao relative bg-tinta-800 text-papel">
        <div className="trilho">
          <h2 className="text-[clamp(1.7rem,3vw,2.5rem)] text-papel">Como funciona</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
            {COMO.map(({ n, Ic, titulo, texto }) => (
              <div key={n} data-revela className="border-t border-white/20 pt-6">
                <span className="num text-sm text-areia-300">{n}</span>
                <Ic className="mt-4 size-6 text-areia-300" aria-hidden />
                <h3 className="mt-3 font-display text-xl text-papel">{titulo}</h3>
                <p className="mt-2 max-w-[34ch] text-tinta-200">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </Revela>

      <Revela className="trilho secao">
        <div className="ilha relative isolate overflow-hidden border border-tinta-800/10 bg-areia-100">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div data-revela>
              <h2 className="text-2xl">Quem assina o parecer</h2>
              <p className="mt-4 max-w-[58ch] text-lg text-tinta-500">
                As duas são avaliadoras cadastradas no CNAI, e é esse cadastro que permite
                emitir parecer de valor. Prazo e preço dependem do imóvel e da finalidade,
                e são combinados na primeira conversa, antes de começar.
              </p>
            </div>
            <Link
              data-revela
              href="/quem-somos"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-tinta-800/20 px-6 py-3 font-semibold text-tinta-800 transition-colors hover:bg-tinta-800/6"
            >
              Ver os registros
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </Revela>

      <Revela className="trilho secao">
        <div
          data-revela
          className="ilha relative isolate overflow-hidden bg-tinta-800 text-center text-papel"
        >
          <h2 className="text-3xl text-papel">Precisa de um valor defensável?</h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-tinta-200">
            Diga o imóvel e para que serve o parecer. A gente responde com prazo e valor
            antes de começar.
          </p>
          <AcaoZap
            recuo="/contato/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-terracota-600 px-7 py-4 font-semibold text-papel shadow-[var(--shadow-flutua-2)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-terracota-700"
          >
            <MessageCircle className="size-5" aria-hidden /> Pedir uma avaliação
          </AcaoZap>
        </div>
      </Revela>
    </>
  );
}
