import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { PortableTextBlock } from "@portabletext/react";

export const TINTA = "#171310";
export const PAPEL = "#F6F2E9";
export const AREIA = "#DDCBAA";
export const TERRACOTA = "#A8482A";
export const BRONZE = "#C0AC87";

export async function fontes() {
  const p = (n: string) => join(process.cwd(), "scripts", "fontes", n);
  const [display, corpo, corpoForte] = await Promise.all([
    readFile(p("unbounded-700.ttf")),
    readFile(p("archivo-400.ttf")),
    readFile(p("archivo-600.ttf")),
  ]);
  return [
    { name: "Unbounded", data: display, weight: 700 as const, style: "normal" as const },
    { name: "Archivo", data: corpo, weight: 400 as const, style: "normal" as const },
    { name: "Archivo", data: corpoForte, weight: 600 as const, style: "normal" as const },
  ];
}

export function Placa({ lado }: { lado: number }) {
  return (
    <div
      style={{
        display: "flex",
        width: lado,
        height: lado,
        borderRadius: lado * 0.173,
        background: TERRACOTA,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: lado * 0.787,
          height: lado * 0.787,
          borderRadius: lado * 0.107,
          border: `${Math.max(2, lado * 0.02)}px solid ${PAPEL}`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Unbounded",
            fontWeight: 700,
            fontSize: lado * 0.44,
            color: PAPEL,
            lineHeight: 1,
            marginTop: -lado * 0.027,
          }}
        >
          ê
        </div>
      </div>
    </div>
  );
}

export function frasePara(corpo: PortableTextBlock[] | undefined, reserva: string) {
  const citacao = (corpo ?? []).find(
    (b) => b._type === "block" && (b as { style?: string }).style === "blockquote",
  );
  if (!citacao) return reserva;
  const filhos = (citacao as { children?: { text?: string }[] }).children ?? [];
  const texto = filhos
    .map((c) => c.text ?? "")
    .join("")
    .trim();
  return texto || reserva;
}
