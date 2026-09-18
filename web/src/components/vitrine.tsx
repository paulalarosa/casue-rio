"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import { CartaoImovel } from "@/components/cartao-imovel";
import { Painel } from "@/components/painel";
import { AcaoZap } from "@/components/acao";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DISPONIVEIS,
  VENDIDOS,
  REGIOES,
  buscar,
  type Finalidade,
  type Imovel,
  type Regiao,
} from "@/lib/imoveis";
import { cn } from "@/lib/utils";

const FINALIDADES: [Finalidade, string][] = [
  ["comprar", "Comprar"],
  ["alugar", "Alugar"],
];

const ORDENS: Record<string, { rotulo: string; cmp: (a: Imovel, b: Imovel) => number }> = {
  selecionados: {
    rotulo: "Selecionados",
    cmp: (a, b) => Number(b.destaque) - Number(a.destaque),
  },
  "preco-asc": { rotulo: "Menor preço", cmp: (a, b) => a.preco - b.preco },
  "preco-desc": { rotulo: "Maior preço", cmp: (a, b) => b.preco - a.preco },
  "area-desc": { rotulo: "Maior área", cmp: (a, b) => b.area - a.area },
};

export function Vitrine() {
  const params = useSearchParams();
  const router = useRouter();
  const regiao = params.get("regiao") as Regiao | null;
  const finalidade = params.get("finalidade") as Finalidade | null;
  const termo = params.get("q") ?? "";
  const ordem = params.get("ordem") && ORDENS[params.get("ordem")!] ? params.get("ordem")! : "selecionados";

  const base = termo ? buscar(termo) : DISPONIVEIS;
  const lista = base
    .filter(
      (im) =>
        (!regiao || im.regiao === regiao) &&
        (!finalidade || im.finalidade === finalidade),
    )
    .sort(ORDENS[ordem].cmp);

  function contarCom(chave: "regiao" | "finalidade", valor: string) {
    const alt = { regiao: regiao as string | null, finalidade: finalidade as string | null };
    alt[chave] = valor;
    return base.filter(
      (im) =>
        (!alt.regiao || im.regiao === alt.regiao) &&
        (!alt.finalidade || im.finalidade === alt.finalidade),
    ).length;
  }

  function mexer(mudanca: Record<string, string | null>) {
    const p = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(mudanca)) {
      if (v === null) p.delete(k);
      else p.set(k, v);
    }
    const q = p.toString();
    router.replace(`/imoveis${q ? `?${q}` : ""}`, { scroll: false });
  }

  const pastilha = (chave: "regiao" | "finalidade", valor: string, texto: string) => {
    const ativa = (chave === "regiao" ? regiao : finalidade) === valor;
    const n = contarCom(chave, valor);
    return (
      <button
        key={valor}
        type="button"
        onClick={() => mexer({ [chave]: ativa ? null : valor })}
        aria-pressed={ativa}
        disabled={n === 0 && !ativa}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-areia-500",
          "disabled:cursor-not-allowed disabled:opacity-40",
          ativa
            ? "bg-tinta-800 text-papel shadow-[var(--shadow-flutua-1)]"
            : "border border-tinta-800/15 text-tinta-800 hover:bg-tinta-800/6",
        )}
      >
        {texto}
        <span className={cn("num text-xs", ativa ? "text-tinta-200" : "text-tinta-500")}>
          {n}
        </span>
      </button>
    );
  };

  return (
    <>
      <div className="sticky top-20 z-30 mt-10">
        <div className="trilho">
          <div className="vidro-claro flex flex-wrap items-center gap-x-3 gap-y-3 rounded-[0.75rem] px-5 py-3">
            <span className="rotulo text-tinta-500">Bairro</span>
            {REGIOES.map((r) => pastilha("regiao", r, r))}
            <span className="rotulo ml-2 text-tinta-500">Finalidade</span>
            {FINALIDADES.map(([v, t]) => pastilha("finalidade", v, t))}

            <div className="ml-auto flex items-center gap-3">
              <label className="flex items-center gap-2">
                <span className="rotulo text-tinta-500">Ordem</span>
                <Select value={ordem} onValueChange={(v) => mexer({ ordem: v ?? "selecionados" })}>
                  <SelectTrigger
                    aria-label="Ordenar a lista"
                    className="h-9 rounded-full border-tinta-800/15 bg-transparent px-4 text-sm font-semibold text-tinta-800 shadow-none"
                  >
                    <SelectValue>{(v) => ORDENS[String(v)]?.rotulo}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ORDENS).map(([k, o]) => (
                      <SelectItem key={k} value={k}>
                        {o.rotulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <span aria-live="polite" className="text-sm text-tinta-500">
                <b className="num text-tinta-800">{lista.length}</b>{" "}
                {lista.length === 1 ? "imóvel" : "imóveis"}
              </span>

              {(termo || regiao || finalidade || ordem !== "selecionados") && (
                <button
                  type="button"
                  onClick={() => router.replace("/imoveis", { scroll: false })}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-tinta-800 transition-colors hover:bg-tinta-800/6"
                >
                  <X className="size-3.5" aria-hidden /> Limpar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="trilho py-12">
        {termo && (
          <p className="mb-8 flex flex-wrap items-center gap-2 text-tinta-500">
            Busca por <b className="font-display text-tinta-800">{termo}</b>
            <button
              type="button"
              onClick={() => mexer({ q: null })}
              className="inline-flex items-center gap-1 rounded-full border border-tinta-800/15 px-3 py-1 text-sm font-semibold text-tinta-800 transition-colors hover:bg-tinta-800/6"
            >
              <X className="size-3.5" aria-hidden /> Tirar
            </button>
          </p>
        )}
        {lista.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((im) => (
              <CartaoImovel key={im.codigo} im={im} />
            ))}
          </div>
        ) : (
          <Painel className="mx-auto max-w-xl p-10 text-center">
            <h2 className="text-2xl">Nenhum imóvel com esses filtros</h2>
            <p className="mt-4 text-tinta-500">
              Diga o que você procura. A gente avisa quando entrar, ou procura
              fora da carteira.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => router.replace("/imoveis", { scroll: false })}
                className="rounded-full border border-tinta-800/20 px-6 py-3 font-semibold text-tinta-800 transition-colors hover:bg-tinta-800/6"
              >
                Limpar filtros
              </button>
              <AcaoZap
                recuo="/contato/"
                className="inline-flex items-center gap-2 rounded-full bg-tinta-800 px-6 py-3 font-semibold text-papel shadow-[var(--shadow-flutua-2)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                <MessageCircle className="size-5" aria-hidden /> Dizer o que procuro
              </AcaoZap>
            </div>
          </Painel>
        )}
      </div>

      {VENDIDOS.length > 0 && !termo && !regiao && !finalidade && (
        <div className="secao relative bg-tinta-800 text-papel">
          <div className="trilho">
            <div className="grid gap-4 lg:grid-cols-[1fr_26rem] lg:items-end">
              <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] text-papel">
                Já vendidos
              </h2>
              <p className="max-w-[42ch] text-tinta-200">
                Saíram da carteira, e ficam aqui porque contam como a gente
                trabalha. Não entram na contagem de disponíveis.
              </p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {VENDIDOS.map((im) => (
                <CartaoImovel key={im.codigo} im={im} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
