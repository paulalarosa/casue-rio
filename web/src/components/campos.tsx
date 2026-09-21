"use client";

import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Estado } from "@/lib/envio";

export function Erro({ id, texto }: { id: string; texto: string }) {
  return (
    <span id={id} className="flex items-center gap-2 text-sm text-destructive">
      <AlertTriangle className="size-4 shrink-0" aria-hidden /> {texto}
    </span>
  );
}

export function Rotulo({
  children,
  opcional,
}: {
  children: React.ReactNode;
  opcional?: boolean;
}) {
  return (
    <span className="font-semibold text-tinta-800">
      {children}
      {opcional && <span className="font-normal text-tinta-500"> · opcional</span>}
    </span>
  );
}

type Comum = {
  id: string;
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  erro?: string;
  dica?: string;
  opcional?: boolean;
};

function Moldura({
  id,
  rotulo,
  erro,
  dica,
  opcional,
  children,
}: Omit<Comum, "valor" | "aoMudar"> & { children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2" htmlFor={id}>
      <Rotulo opcional={opcional}>{rotulo}</Rotulo>
      {children}
      {erro ? (
        <Erro id={`${id}-erro`} texto={erro} />
      ) : dica ? (
        <span id={`${id}-dica`} className="text-sm text-tinta-500">
          {dica}
        </span>
      ) : null}
    </label>
  );
}

function descricao({ id, erro, dica }: Pick<Comum, "id" | "erro" | "dica">) {
  if (erro) return `${id}-erro`;
  if (dica) return `${id}-dica`;
  return undefined;
}

export function CampoTexto({
  valor,
  aoMudar,
  area,
  ...resto
}: Comum & { area?: boolean } & Omit<
    React.ComponentProps<"input">,
    "id" | "value" | "onChange"
  >) {
  const { id, rotulo, erro, dica, opcional, ...atributos } = resto;
  const moldura = { id, rotulo, erro, dica, opcional };

  return (
    <Moldura {...moldura}>
      {area ? (
        <Textarea
          id={id}
          rows={4}
          value={valor}
          onChange={(e) => aoMudar(e.target.value)}
          aria-invalid={!!erro}
          aria-describedby={descricao(moldura)}
          className="rounded-[0.75rem]"
          placeholder={atributos.placeholder}
          name={atributos.name}
        />
      ) : (
        <Input
          id={id}
          value={valor}
          onChange={(e) => aoMudar(e.target.value)}
          aria-invalid={!!erro}
          aria-describedby={descricao(moldura)}
          className="rounded-[0.75rem]"
          {...atributos}
        />
      )}
    </Moldura>
  );
}

export function Pastilhas({
  rotulo,
  opcoes,
  escolhidas,
  aoTrocar,
  varias,
  opcional,
}: {
  rotulo: string;
  opcoes: readonly string[];
  escolhidas: string[];
  aoTrocar: (v: string[]) => void;
  varias?: boolean;
  opcional?: boolean;
}) {
  function alternar(opcao: string) {
    if (!varias) {
      aoTrocar(escolhidas.includes(opcao) ? [] : [opcao]);
      return;
    }
    aoTrocar(
      escolhidas.includes(opcao)
        ? escolhidas.filter((e) => e !== opcao)
        : [...escolhidas, opcao],
    );
  }

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2">
        <Rotulo opcional={opcional}>{rotulo}</Rotulo>
      </legend>
      <div className="flex flex-wrap gap-2">
        {opcoes.map((opcao) => {
          const marcada = escolhidas.includes(opcao);
          return (
            <button
              key={opcao}
              type="button"
              onClick={() => alternar(opcao)}
              aria-pressed={marcada}
              className={cn(
                "min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors",
                marcada
                  ? "border-terracota-600 bg-terracota-600 text-papel"
                  : "border-tinta-800/15 bg-white/70 text-tinta-800 hover:border-terracota-600/50",
              )}
            >
              {opcao}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Armadilha({
  valor,
  aoMudar,
}: {
  valor: string;
  aoMudar: (v: string) => void;
}) {
  return (
    <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor="sobrenome">Sobrenome</label>
      <input
        id="sobrenome"
        name="sobrenome"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
      />
    </div>
  );
}

export function Consentimento({
  marcado,
  aoMudar,
  erro,
}: {
  marcado: boolean;
  aoMudar: (v: boolean) => void;
  erro?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex cursor-pointer items-start gap-3 text-sm text-tinta-500">
        <Checkbox
          checked={marcado}
          onCheckedChange={(v) => aoMudar(v === true)}
          aria-invalid={!!erro}
          className="mt-0.5"
        />
        <span>
          Autorizo o contato sobre este pedido. Os dados são usados só para responder, não
          vão para lista de disparo e podem ser apagados quando eu pedir.
        </span>
      </label>
      {erro && <Erro id="erro-consentimento" texto={erro} />}
    </div>
  );
}

export function BotaoEnviar({ estado, texto }: { estado: Estado; texto: string }) {
  return (
    <div className="flex justify-end">
      <button
        type="submit"
        disabled={estado === "enviando"}
        className="flex min-h-12 items-center gap-2 rounded-full bg-tinta-800 px-7 font-semibold text-papel shadow-[var(--shadow-flutua-2)] transition-transform duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
      >
        {estado === "enviando" && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {estado === "enviando" ? "Enviando" : texto}
      </button>
    </div>
  );
}

export function Resultado({
  estado,
  recado,
  sucesso,
}: {
  estado: Estado;
  recado: string;
  sucesso: string;
}) {
  if (estado === "pronto") {
    return (
      <p
        className="flex items-center gap-3 rounded-[0.75rem] bg-tinta-800 px-5 py-4 text-papel"
        role="status"
        aria-live="polite"
      >
        <Check className="size-5 shrink-0 text-areia-300" aria-hidden />
        {sucesso}
      </p>
    );
  }

  if (estado === "falhou") {
    return (
      <p
        className="flex items-center gap-3 rounded-[0.75rem] border border-destructive/30 bg-white/85 px-5 py-4 text-tinta-800"
        role="alert"
      >
        <AlertTriangle className="size-5 shrink-0 text-destructive" aria-hidden />
        {recado}
      </p>
    );
  }

  return null;
}
