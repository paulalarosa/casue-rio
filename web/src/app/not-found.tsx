import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Painel } from "@/components/painel";
import { AssinaturaLinha } from "@/components/assinatura";

import { NOME } from "@/lib/site";

export const metadata = { title: `Página não encontrada · ${NOME}` };

export default function NaoEncontrada() {
  return (
    <div className="trilho flex min-h-[70svh] items-center justify-center py-32">
      <Painel className="max-w-xl p-12 text-center">
        <AssinaturaLinha className="text-[1.9rem]" />
        <h1 className="mt-8 text-3xl">Esta página não existe mais</h1>
        <p className="mt-4 text-tinta-500">
          Talvez o imóvel já tenha sido vendido. A carteira continua aqui.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/imoveis"
            className="rounded-full bg-tinta-800 px-6 py-3 font-semibold text-papel shadow-[var(--shadow-flutua-2)] transition-transform duration-300 hover:-translate-y-0.5"
          >
            Ver a carteira
          </Link>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 rounded-full border border-tinta-800/20 px-6 py-3 font-semibold text-tinta-800 transition-colors hover:bg-tinta-800/6"
          >
            <MessageCircle className="size-5" aria-hidden /> Falar com a gente
          </Link>
        </div>
      </Painel>
    </div>
  );
}
