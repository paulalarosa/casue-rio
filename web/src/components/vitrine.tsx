"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowUpDown, MessageCircle, Search, X } from "lucide-react";
import { GradeImoveis } from "@/components/grade-imoveis";
import { Painel } from "@/components/painel";
import { AcaoZap } from "@/components/acao";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Finalidade, Imovel, Regiao } from "@/lib/carteira";
import { DISPONIVEIS, VENDIDOS, REGIOES, acharPorCodigo, buscar } from "@/lib/imoveis";
import { cn } from "@/lib/utils";

const FINALIDADES: [Finalidade, string][] = [
  ["comprar", "Comprar"],
  ["alugar", "Alugar"],
];

const ORDENS: Record<string, { rotulo: string; cmp: (a: Imovel, b: Imovel) => number }> =
  {
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
  const ordem =
    params.get("ordem") && ORDENS[params.get("ordem")!]
      ? params.get("ordem")!
      : "selecionados";

  const [escrito, setEscrito] = useState(termo);
  const [ondeEstava, setOndeEstava] = useState(termo);
  if (ondeEstava !== termo) {
    setOndeEstava(termo);
    setEscrito(termo);
  }

  const base = termo ? buscar(termo) : DISPONIVEIS;
  const lista = base
    .filter(
      (im) =>
        (!regiao || im.regiao === regiao) &&
        (!finalidade || im.finalidade === finalidade),
    )
    .sort(ORDENS[ordem].cmp);

  function contarCom(chave: "regiao" | "finalidade", valor: string) {
    const alt = {
      regiao: regiao as string | null,
      finalidade: finalidade as string | null,
    };
    alt[chave] = valor;
    return base.filter(
      (im) =>
        (!alt.regiao || im.regiao === alt.regiao) &&
        (!alt.finalidade || im.finalidade === alt.finalidade),
    ).length;
  }

  function procurarCodigo(e: React.FormEvent) {
    e.preventDefault();
    const alvo = escrito.trim();
    const direto = acharPorCodigo(alvo);
    if (direto) {
      router.push(`/imoveis/${direto.codigo}/`);
      return;
    }
    mexer({ q: alvo || null });
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
    const vazia = contarCom(chave, valor) === 0;
    return (
      <button
        key={valor}
        type="button"
        onClick={() => mexer({ [chave]: ativa ? null : valor })}
        aria-pressed={ativa}
        disabled={vazia && !ativa}
        className={cn(
          "inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors duration-300",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-areia-500",
          "disabled:cursor-not-allowed disabled:opacity-35",
          ativa
            ? "bg-tinta-800 text-papel shadow-[var(--shadow-flutua-1)]"
            : "border border-tinta-800/15 text-tinta-800 hover:bg-tinta-800/6",
        )}
      >
        {texto}
      </button>
    );
  };

  return (
    <>
      <div className="trilho mt-10 flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
        <form onSubmit={procurarCodigo} role="search" className="flex items-center gap-3">
          <label htmlFor="busca-codigo" className="rotulo shrink-0 text-bronze-500">
            Buscar por código
          </label>
          <span className="flex min-h-11 items-center gap-2 rounded-full border border-tinta-800/15 px-4 transition-colors focus-within:border-tinta-800/40">
            <Search className="size-4 shrink-0 text-tinta-500" aria-hidden />
            <input
              id="busca-codigo"
              type="search"
              inputMode="text"
              autoComplete="off"
              placeholder="CR-0000"
              value={escrito}
              onChange={(e) => setEscrito(e.target.value)}
              className="w-[7rem] bg-transparent text-sm font-semibold text-tinta-800 placeholder:font-normal placeholder:text-tinta-500 focus:outline-none"
            />
          </span>
          <button type="submit" className="sr-only">
            Buscar
          </button>
        </form>
      </div>

      <div className="sticky top-20 z-30 mt-4">
        <div className="trilho">
          <div className="vidro-claro flex flex-col gap-2 rounded-[0.75rem] px-4 py-2.5 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
            <div className="flex min-w-0 items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {REGIOES.map((r) => pastilha("regiao", r, r))}
              <span aria-hidden className="h-6 w-px shrink-0 bg-tinta-800/15" />
              {FINALIDADES.map(([v, t]) => pastilha("finalidade", v, t))}
            </div>

            <div className="flex min-h-11 items-center gap-3 sm:ml-auto">
              <span aria-live="polite" className="shrink-0 text-sm text-tinta-500">
                <b className="num text-tinta-800">{lista.length}</b>{" "}
                {lista.length === 1 ? "imóvel" : "imóveis"}
              </span>

              <Select
                value={ordem}
                onValueChange={(v) => mexer({ ordem: v ?? "selecionados" })}
              >
                <SelectTrigger
                  aria-label="Ordenar a lista"
                  className="ml-auto min-h-11 w-auto gap-2 rounded-full border-tinta-800/15 bg-transparent px-4 text-sm font-semibold text-tinta-800 shadow-none sm:ml-0"
                >
                  <ArrowUpDown className="size-4 shrink-0 text-tinta-500" aria-hidden />
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

              {(termo || regiao || finalidade || ordem !== "selecionados") && (
                <button
                  type="button"
                  onClick={() => router.replace("/imoveis", { scroll: false })}
                  className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full px-3 text-sm font-semibold text-tinta-800 transition-colors hover:bg-tinta-800/6"
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
          <GradeImoveis imoveis={lista} />
        ) : (
          <Painel className="mx-auto max-w-xl p-10 text-center">
            <h2 className="text-2xl">Nenhum imóvel com esses filtros</h2>
            <p className="mt-4 text-tinta-500">
              Diga o que você procura. A gente avisa quando entrar, ou procura fora do que
              está anunciado.
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
              <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] text-papel">Já vendidos</h2>
              <p className="max-w-[42ch] text-tinta-200">
                Saíram do ar, e ficam aqui porque contam como a gente trabalha. Não entram
                na contagem de disponíveis.
              </p>
            </div>
            <GradeImoveis imoveis={VENDIDOS} className="mt-10" />
          </div>
        </div>
      )}
    </>
  );
}
