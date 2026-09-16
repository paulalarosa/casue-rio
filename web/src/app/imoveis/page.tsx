import { Suspense } from "react";
import { CabecaPagina } from "@/components/cabeca-pagina";
import { arquivo } from "@/lib/caminho";
import carteira from "../../../public/video/carteira.webp";
import { Vitrine } from "@/components/vitrine";
import { DISPONIVEIS, REGIOES, moeda } from "@/lib/imoveis";
import { metaDaPagina } from "@/lib/site";

export const metadata = metaDaPagina({
  titulo: "A carteira",
  descricao:
    "Imóveis para comprar e por temporada no Centro, na Tijuca, no Grajaú e na Zona Sul do Rio, com documentação conferida antes da proposta.",
  caminho: "/imoveis",
});

export default function PaginaImoveis() {
  /* Os três números da abertura saem da carteira, e não da mão: tirar um
     imóvel do arquivo de dados muda a manchete junto. A entrada começa em
     compra, porque diária de temporada ao lado de preço de venda faria a
     carteira parecer dez vezes mais barata. */
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
      {/* 🔴 O aviso é mais necessário AQUI do que em qualquer outra página.
          Esta é a carteira: telhado de verdade atrás dos três números, sem
          uma linha dizendo o contrário, insinua que aquele casario é o
          estoque. Não é, e elas têm CRECI. */}
      <p className="trilho mt-3 text-sm text-tinta-500">
        Imagem de ambiente. Não retrata imóvel da carteira.
      </p>
      {/* `useSearchParams` precisa de fronteira de suspense: sem ela a página
          inteira vira dinâmica e perde a geração estática. */}
      <Suspense fallback={<div className="trilho py-24 text-tinta-500">Carregando a carteira…</div>}>
        <Vitrine />
      </Suspense>
    </>
  );
}
