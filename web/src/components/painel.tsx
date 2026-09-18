import { cn } from "@/lib/utils";

export function Painel({
  variante = "claro",
  className,
  children,
  ...resto
}: React.ComponentProps<"div"> & { variante?: "claro" | "escuro" }) {
  return (
    <div
      className={cn(
        "rounded-[1rem]",
        variante === "escuro"
          ? "vidro text-papel"
          : "border border-tinta-800/10 bg-white/85 shadow-[var(--shadow-flutua-2)]",
        className,
      )}
      {...resto}
    >
      {children}
    </div>
  );
}
