import { describe, expect, it } from "vitest";
import type { PortableTextBlock } from "@portabletext/react";
import { frasePara } from "@/lib/cartao";

const bloco = (style: string, texto: string) =>
  ({
    _type: "block",
    _key: style + texto.length,
    style,
    children: [{ _type: "span", _key: "s", text: texto, marks: [] }],
  }) as unknown as PortableTextBlock;

describe("frasePara", () => {
  it("prefere a primeira citação do texto", () => {
    const corpo = [
      bloco("normal", "Um parágrafo qualquer."),
      bloco("blockquote", "A citação que importa."),
      bloco("blockquote", "Uma segunda citação."),
    ];
    expect(frasePara(corpo, "reserva")).toBe("A citação que importa.");
  });

  it("sem citação, usa a reserva", () => {
    expect(frasePara([bloco("normal", "Só parágrafo.")], "reserva")).toBe("reserva");
  });

  it("corpo indefinido usa a reserva", () => {
    expect(frasePara(undefined, "reserva")).toBe("reserva");
  });

  it("citação vazia cai na reserva em vez de devolver nada", () => {
    expect(frasePara([bloco("blockquote", "   ")], "reserva")).toBe("reserva");
  });

  it("junta os pedaços de uma citação com negrito no meio", () => {
    const partido = {
      _type: "block",
      _key: "k",
      style: "blockquote",
      children: [
        { _type: "span", _key: "a", text: "O preço ", marks: [] },
        { _type: "span", _key: "b", text: "vale", marks: ["strong"] },
        { _type: "span", _key: "c", text: " como verdade.", marks: [] },
      ],
    } as unknown as PortableTextBlock;
    expect(frasePara([partido], "reserva")).toBe("O preço vale como verdade.");
  });
});
