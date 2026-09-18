"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Finalidade } from "@/lib/carteira";
import { REGIOES, contar, acharPorCodigo } from "@/lib/imoveis";
import { cn } from "@/lib/utils";

const ROTULOS: Record<string, string> = {
  todos: "Todos os bairros",
  todas: "Comprar ou alugar",
  comprar: "Comprar",
  alugar: "Alugar",
  ...Object.fromEntries(REGIOES.map((r) => [r, r])),
};
const FINALIDADES: { valor: Finalidade; texto: string }[] = [
  { valor: "comprar", texto: "Comprar" },
  { valor: "alugar", texto: "Alugar" },
];

export function Busca({ variante = "escuro" }: { variante?: "claro" | "escuro" }) {
  const router = useRouter();
  const [regiao, setRegiao] = useState<string>("todos");
  const [finalidade, setFinalidade] = useState<string>("todas");
  const [texto, setTexto] = useState("");
  const escuro = variante === "escuro";

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const direto = acharPorCodigo(texto);
    if (direto) {
      router.push(`/imoveis/${direto.codigo}/`);
      return;
    }
    const p = new URLSearchParams();
    if (texto.trim()) p.set("q", texto.trim());
    if (regiao !== "todos") p.set("regiao", regiao);
    if (finalidade !== "todas") p.set("finalidade", finalidade);
    const q = p.toString();
    router.push(`/imoveis${q ? `?${q}` : ""}`);
  }

  const gatilho = cn(
    "h-auto w-full justify-between border-0 bg-transparent px-0 py-0 font-display text-lg font-semibold shadow-none",
    "focus-visible:ring-0 focus-visible:border-0 dark:bg-transparent",
    escuro ? "text-papel" : "text-tinta-800",
  );
  const rotulo = cn("rotulo", escuro ? "text-tinta-200" : "text-tinta-500");
  const risco = escuro ? "border-white/15" : "border-tinta-800/10";

  return (
    <form
      onSubmit={enviar}
      className={cn(
        "overflow-hidden rounded-[0.75rem]",
        escuro ? "vidro" : "vidro-claro",
      )}
    >
      <label className="flex flex-col gap-1 px-6 pb-4 pt-4">
        <span className={rotulo}>Código do imóvel ou palavra</span>
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          inputMode="search"
          autoComplete="off"
          placeholder="CR-0142, cobertura, Tijuca…"
          aria-label="Código do imóvel ou palavra"
          className={cn(
            "w-full border-0 bg-transparent p-0 font-display text-lg font-semibold outline-none",
            escuro
              ? "text-papel placeholder:text-papel/40"
              : "text-tinta-800 placeholder:text-tinta-400",
          )}
        />
      </label>

      <div className={cn("grid gap-px border-t sm:grid-cols-[1fr_1fr_auto]", risco)}>
        <label className="flex min-w-0 flex-col gap-1 px-6 py-4">
          <span className={rotulo}>Bairro</span>
          <Select value={regiao} onValueChange={(v) => setRegiao(v ?? "todos")}>
            <SelectTrigger className={gatilho} aria-label="Bairro">
              <SelectValue>{(v) => ROTULOS[String(v)] ?? String(v)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os bairros</SelectItem>
              {REGIOES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r} <span className="num ml-1 opacity-60">{contar(r, null)}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label
          className={cn(
            "flex min-w-0 flex-col gap-1 border-t px-6 py-4 sm:border-l sm:border-t-0",
            risco,
          )}
        >
          <span className={rotulo}>Finalidade</span>
          <Select value={finalidade} onValueChange={(v) => setFinalidade(v ?? "todas")}>
            <SelectTrigger className={gatilho} aria-label="Finalidade">
              <SelectValue>{(v) => ROTULOS[String(v)] ?? String(v)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Comprar ou alugar</SelectItem>
              {FINALIDADES.map((f) => (
                <SelectItem key={f.valor} value={f.valor}>
                  {f.texto}{" "}
                  <span className="num ml-1 opacity-60">{contar(null, f.valor)}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <div className="p-2">
          <button
            type="submit"
            className={cn(
              "inline-flex h-full w-full items-center justify-center gap-2 rounded-[0.75rem] px-6 py-4",
              "whitespace-nowrap bg-terracota-600 font-semibold text-papel shadow-[var(--shadow-flutua-2)]",
              "transition-transform duration-300 ease-[var(--ease-saida)] hover:-translate-y-0.5 hover:bg-terracota-700",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracota-400",
            )}
          >
            <Search className="size-4" aria-hidden />
            Ver imóveis
          </button>
        </div>
      </div>
    </form>
  );
}
