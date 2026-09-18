"use client";

import { useState } from "react";
import { Check, Link2, Printer, Share2 } from "lucide-react";

export function Compartilhar({ titulo }: { titulo: string }) {
  const [copiado, setCopiado] = useState<"nao" | "sim" | "falhou">("nao");

  const podeCompartilhar =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function copiar() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiado("sim");
      setTimeout(() => setCopiado("nao"), 2400);
    } catch {
      setCopiado("falhou");
    }
  }

  async function compartilhar() {
    try {
      await navigator.share({ title: titulo, url: window.location.href });
    } catch {}
  }

  const botao =
    "inline-flex items-center gap-2 rounded-full border border-tinta-800/20 px-4 py-2.5 text-sm font-semibold text-tinta-800 transition-colors hover:bg-tinta-800/6";

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2" data-sem-impressao>
      {podeCompartilhar && (
        <button type="button" onClick={compartilhar} className={botao}>
          <Share2 className="size-4" aria-hidden /> Compartilhar
        </button>
      )}
      <button type="button" onClick={copiar} className={botao}>
        {copiado === "sim" ? (
          <>
            <Check className="size-4" aria-hidden /> Endereço copiado
          </>
        ) : (
          <>
            <Link2 className="size-4" aria-hidden /> Copiar o endereço
          </>
        )}
      </button>
      <button type="button" onClick={() => window.print()} className={botao}>
        <Printer className="size-4" aria-hidden /> Imprimir ou salvar em PDF
      </button>
      {copiado === "falhou" && (
        <span role="status" className="text-sm text-tinta-500">
          O navegador não deixou copiar. O endereço está na barra de cima.
        </span>
      )}
    </div>
  );
}
