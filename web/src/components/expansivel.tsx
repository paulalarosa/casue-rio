"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Expansivel({
  rotulo,
  dica,
  children,
  className,
}: {
  rotulo: string;
  dica?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const id = useId();
  const [aberto, setAberto] = useState(false);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1rem] border border-tinta-800/12 bg-areia-100 shadow-[var(--shadow-flutua-1)]",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        aria-controls={id}
        className="flex w-full items-center gap-5 px-6 py-6 text-left transition-colors hover:bg-tinta-800/4 sm:px-8"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-display text-lg font-semibold text-tinta-800 sm:text-xl">
            {rotulo}
          </span>
          {dica && <span className="mt-1.5 block text-sm text-tinta-500">{dica}</span>}
        </span>
        <span
          aria-hidden
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-full border transition-colors duration-300",
            aberto
              ? "border-transparent bg-terracota-600 text-papel"
              : "border-tinta-800/15 text-tinta-800",
          )}
        >
          <ChevronDown
            className={cn(
              "size-5 transition-transform duration-300",
              aberto && "rotate-180",
            )}
          />
        </span>
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-[var(--ease-saida)]",
          aberto ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div id={id} inert={!aberto} className="overflow-hidden">
          <div className="border-t border-tinta-800/10 px-6 pb-8 pt-8 sm:px-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
