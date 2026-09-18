"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  GA,
  temMedicao,
  assinar,
  lerEscolha,
  lerNoServidor,
  gravarEscolha,
} from "@/lib/medicao";

/* A faixa de consentimento e o script de audiência.

   🔴 O script SÓ EXISTE depois do "sim". Enquanto a escolha não for "sim",
   o `<Script>` não é renderizado, o `googletagmanager.com` nunca é pedido e
   nenhum cookie é criado. É a diferença entre pedir permissão e avisar que
   já fez.

   🔴 `useSyncExternalStore` e não `useState` com `useEffect`. A escolha mora
   no `localStorage`, que é estado de fora do React e não existe no servidor:
   este gancho existe exatamente para isso, e resolve de uma vez a
   hidratação, a sincronia entre abas e a atualização depois do clique. A
   versão com `useEffect` que eu escrevi antes disparava renderização em
   cascata, e o lint do React 19 reclamou com razão. */

/* 🔴 `useEscolha` e não `usarEscolha`, contra a regra de nomes deste
   repositório. Não é escolha de estilo: o lint do React só reconhece um
   gancho personalizado se o nome começar com `use`, e com `usarEscolha` ele
   trata isto como função comum e passa a acusar violação das regras de
   ganchos em todo uso. Quando a ferramenta manda no nome, ela ganha. */
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
          A gente gostaria de medir quantas pessoas visitam o site e quais
          páginas elas leem, usando o Google Analytics. Isso cria cookie no seu
          navegador. Sem o seu aceite, nada disso carrega.{" "}
          <Link
            href="/privacidade"
            className="font-semibold text-terracota-600 underline underline-offset-4 transition-colors hover:text-terracota-700"
          >
            Como funciona
          </Link>
          .
        </p>
        {/* 🔴 Os dois botões têm o MESMO peso. Recusa escondida em texto
            cinza claro ao lado de um botão colorido é consentimento obtido no
            empurrão, e consentimento assim não é livre, que é o que a lei
            pede. */}
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => responder("nao")}
            className="rounded-full border border-tinta-800/25 px-5 py-2.5 font-semibold text-tinta-800 transition-colors hover:bg-tinta-800/6"
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
  if (!temMedicao) return null;

  return (
    <>
      {escolha === "nenhuma" && <Faixa responder={gravarEscolha} />}
      {escolha === "sim" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA}`}
            strategy="afterInteractive"
          />
          <Script id="ga" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
    </>
  );
}

const ESTADO: Record<string, string> = {
  sim: "Hoje você aceita os cookies de audiência neste navegador.",
  nao: "Hoje você recusa os cookies de audiência neste navegador.",
  nenhuma: "Você ainda não respondeu sobre os cookies neste navegador.",
  indefinido: "Verificando a sua escolha neste navegador.",
};

/* O mesmo interruptor, dentro da página de privacidade.

   🔴 Política que promete "você pode revogar a qualquer momento" e não
   mostra COMO é a política que a maioria escreve. Revogar tem de ser um
   botão, no mesmo lugar onde a frase promete. */
export function EscolhaDeCookies() {
  const escolha = useEscolha();
  if (!temMedicao) return null;

  function responder(v: "sim" | "nao") {
    gravarEscolha(v);
    /* 🔴 Tirar o consentimento tem de tirar o script DE VERDADE, e ele já
       foi carregado nesta aba. Recarregar é o único jeito honesto: a página
       volta sem ele, em vez de fingir que sumiu enquanto o `gtag` continua
       na memória mandando evento. */
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
          className="rounded-full border border-tinta-800/25 px-5 py-2.5 font-semibold text-tinta-800 transition-colors hover:bg-tinta-800/6 disabled:opacity-50"
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
