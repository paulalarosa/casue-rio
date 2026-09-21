"use client";

import { useEffect, useRef } from "react";

export const CHAVE_TURNSTILE = process.env.NEXT_PUBLIC_TURNSTILE_KEY ?? "";
export const TEM_TURNSTILE = CHAVE_TURNSTILE !== "";

const FONTE = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type Opcoes = {
  sitekey: string;
  callback: (ficha: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
  theme: "light";
  language: string;
  action: string;
};

declare global {
  interface Window {
    turnstile?: {
      render: (alvo: HTMLElement, opcoes: Opcoes) => string | undefined;
      remove: (id: string) => void;
    };
  }
}

let carregando: Promise<void> | null = null;

function carregar() {
  if (typeof window === "undefined") return Promise.reject(new Error("sem janela"));
  if (window.turnstile) return Promise.resolve();
  if (carregando) return carregando;

  carregando = new Promise<void>((resolver, recusar) => {
    const script = document.createElement("script");
    script.src = FONTE;
    script.async = true;
    script.onload = () => resolver();
    script.onerror = () => {
      carregando = null;
      recusar(new Error("o script do Turnstile não carregou"));
    };
    document.head.appendChild(script);
  });

  return carregando;
}

export function Turnstile({
  aoResolver,
  acao,
}: {
  aoResolver: (ficha: string) => void;
  acao: string;
}) {
  const caixa = useRef<HTMLDivElement>(null);
  const avisar = useRef(aoResolver);

  useEffect(() => {
    avisar.current = aoResolver;
  }, [aoResolver]);

  useEffect(() => {
    if (!TEM_TURNSTILE) return;

    let vivo = true;
    let id: string | undefined;

    carregar()
      .then(() => {
        if (!vivo || !caixa.current || !window.turnstile) return;
        id = window.turnstile.render(caixa.current, {
          sitekey: CHAVE_TURNSTILE,
          callback: (ficha) => avisar.current(ficha),
          "expired-callback": () => avisar.current(""),
          "error-callback": () => avisar.current(""),
          theme: "light",
          language: "pt-br",
          action: acao,
        });
      })
      .catch(() => avisar.current(""));

    return () => {
      vivo = false;
      if (id && window.turnstile) window.turnstile.remove(id);
    };
  }, [acao]);

  if (!TEM_TURNSTILE) return null;

  return <div ref={caixa} className="min-h-[70px]" />;
}
