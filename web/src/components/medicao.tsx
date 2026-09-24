"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  temMedicao,
  assinar,
  lerEscolha,
  lerNoServidor,
  gravarEscolha,
  avisarConsentimento,
} from "@/lib/medicao";

function useEscolha() {
  return useSyncExternalStore(assinar, lerEscolha, lerNoServidor);
}

function Faixa({ responder }: { responder: (v: "sim" | "nao") => void }) {
  return (
    <div
      role="dialog"
      aria-label="Cookies de audiência"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-tinta-800/15 bg-papel/95 backdrop-blur-sm"
    >
      <div className="trilho flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[62ch] text-sm leading-relaxed text-tinta-600">
          A gente gostaria de medir quantas pessoas visitam o site e quais páginas elas
          leem, usando o Google Analytics. Isso cria cookie no seu navegador. Sem o seu
          aceite, nada disso carrega.{" "}
          <Link
            href="/privacidade"
            className="font-semibold text-terracota-600 underline underline-offset-4 transition-colors hover:text-terracota-700"
          >
            Como funciona
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => responder("nao")}
            className="rounded-full border border-tinta-800/55 px-5 py-2.5 font-semibold text-tinta-800 transition-colors hover:bg-tinta-800/6"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => responder("sim")}
            className="rounded-full bg-tinta-800 px-5 py-2.5 font-semibold text-papel transition-transform duration-300 hover:-translate-y-0.5"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}

export function Medicao() {
  const escolha = useEscolha();

  useEffect(() => {
    if (escolha === "sim" || escolha === "nao") avisarConsentimento(escolha === "sim");
  }, [escolha]);

  if (!temMedicao || escolha !== "nenhuma") return null;
  return <Faixa responder={gravarEscolha} />;
}

const ESTADO: Record<string, string> = {
  sim: "Hoje você aceita os cookies de audiência neste navegador.",
  nao: "Hoje você recusa os cookies de audiência neste navegador.",
  nenhuma: "Você ainda não respondeu sobre os cookies neste navegador.",
  indefinido: "Verificando a sua escolha neste navegador.",
};

export function EscolhaDeCookies() {
  const escolha = useEscolha();
  if (!temMedicao) return null;

  function responder(v: "sim" | "nao") {
    gravarEscolha(v);
    if (v === "nao") window.location.reload();
  }

  return (
    <div className="mt-6 rounded-[0.875rem] border border-tinta-800/12 bg-tinta-50 p-6">
      <p className="text-base text-tinta-600">{ESTADO[escolha]}</p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          disabled={escolha === "indefinido"}
          onClick={() => responder("nao")}
          className="rounded-full border border-tinta-800/55 px-5 py-2.5 font-semibold text-tinta-800 transition-colors hover:bg-tinta-800/6 disabled:opacity-50"
        >
          Recusar
        </button>
        <button
          type="button"
          disabled={escolha === "indefinido"}
          onClick={() => responder("sim")}
          className="rounded-full bg-tinta-800 px-5 py-2.5 font-semibold text-papel transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-50"
        >
          Aceitar
        </button>
      </div>
    </div>
  );
}
