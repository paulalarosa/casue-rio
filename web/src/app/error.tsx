"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Painel } from "@/components/painel";
import { AssinaturaLinha } from "@/components/assinatura";

/* Erro de execução com saída e sem jargão. A pessoa que chega aqui quer
   falar com uma corretora, não ler pilha de exceção. */
export default function Erro({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="trilho flex min-h-[70svh] items-center justify-center py-32">
      <Painel className="max-w-xl p-12 text-center">
        <AssinaturaLinha className="text-[1.9rem]" />
        <h1 className="mt-8 text-3xl">Algo quebrou do nosso lado</h1>
        <p className="mt-4 text-tinta-500">
          Não foi você. Tente de novo, ou fale no WhatsApp que a gente resolve.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-tinta-800 px-6 py-3 font-semibold text-papel shadow-[var(--shadow-flutua-2)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            <RotateCcw className="size-5" aria-hidden /> Tentar de novo
          </button>
          <Link
            href="/contato"
            className="rounded-full border border-tinta-800/20 px-6 py-3 font-semibold text-tinta-800 transition-colors hover:bg-tinta-800/6"
          >
            Falar com a gente
          </Link>
        </div>
      </Painel>
    </div>
  );
}
