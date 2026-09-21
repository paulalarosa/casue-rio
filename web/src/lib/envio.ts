import { useEffect, useRef, useState } from "react";

export const ENDERECO_DO_FORMULARIO = process.env.NEXT_PUBLIC_FORM_URL ?? "";

export type Nome = "contato" | "busca" | "avaliacao";
export type Campos = Record<string, string | string[]>;
export type Estado = "parado" | "enviando" | "pronto" | "falhou";

const RECADO_PADRAO = "Não consegui enviar agora. Tente de novo em instantes.";

export function useDemora() {
  const inicio = useRef(0);
  useEffect(() => {
    inicio.current = Date.now();
  }, []);
  return () => Date.now() - inicio.current;
}

export function useEnvio(formulario: Nome) {
  const [estado, setEstado] = useState<Estado>("parado");
  const [recado, setRecado] = useState("");
  const desde = useDemora();

  async function enviar(campos: Campos, armadilha: string) {
    if (!ENDERECO_DO_FORMULARIO) {
      setEstado("falhou");
      setRecado("O envio ainda não está ligado. Tente de novo daqui a pouco.");
      return false;
    }

    setEstado("enviando");
    setRecado("");

    try {
      const resposta = await fetch(ENDERECO_DO_FORMULARIO, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          formulario,
          demora: desde(),
          sobrenome: armadilha,
          campos,
        }),
      });

      const corpo = (await resposta.json().catch(() => ({}))) as { erro?: string };

      if (!resposta.ok) {
        setEstado("falhou");
        setRecado(corpo.erro || RECADO_PADRAO);
        return false;
      }

      setEstado("pronto");
      return true;
    } catch {
      setEstado("falhou");
      setRecado(RECADO_PADRAO);
      return false;
    }
  }

  return { estado, recado, enviar };
}
