import { describe, expect, it } from "vitest";
import { BAIRROS, IMOVEIS } from "@/lib/carteira";
import { DISPONIVEIS, REGIOES, acharPorCodigo, buscar, moeda } from "@/lib/imoveis";

describe("acharPorCodigo", () => {
  const alvo = IMOVEIS[0];

  it("acha pelo código exato", () => {
    expect(acharPorCodigo(alvo.codigo)?.codigo).toBe(alvo.codigo);
  });

  it("ignora caixa, espaço e hífen", () => {
    const solto = alvo.codigo.toLowerCase().replace("-", " ");
    expect(acharPorCodigo(solto)?.codigo).toBe(alvo.codigo);
  });

  it("acha só pelos dígitos da placa", () => {
    const digitos = alvo.codigo.replace(/\D/g, "");
    expect(acharPorCodigo(digitos)?.codigo).toBe(alvo.codigo);
  });

  it("não casa com dois dígitos", () => {
    expect(acharPorCodigo("42")).toBeNull();
  });

  it("devolve nulo para termo vazio", () => {
    expect(acharPorCodigo("   ")).toBeNull();
  });

  it("acha também imóvel fechado", () => {
    const fechado = IMOVEIS.find((im) => im.fechado);
    if (!fechado) return;
    expect(acharPorCodigo(fechado.codigo)?.codigo).toBe(fechado.codigo);
  });
});

describe("buscar", () => {
  it("sem termo devolve a carteira disponível inteira", () => {
    expect(buscar("")).toEqual(DISPONIVEIS);
  });

  it("código tem prioridade e devolve um só", () => {
    const alvo = DISPONIVEIS[0];
    expect(buscar(alvo.codigo)).toEqual([alvo]);
  });

  it("acha por bairro sem acento", () => {
    const comAcento = DISPONIVEIS.find((im) => /[áâãéêíóôõúç]/i.test(im.bairro));
    if (!comAcento) return;
    const semAcento = comAcento.bairro.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    expect(buscar(semAcento).map((im) => im.codigo)).toContain(comAcento.codigo);
  });

  it("nunca devolve imóvel fechado", () => {
    const fechado = IMOVEIS.find((im) => im.fechado);
    if (!fechado) return;
    expect(buscar(fechado.bairro).every((im) => !im.fechado)).toBe(true);
  });

  it("termo sem correspondência devolve lista vazia", () => {
    expect(buscar("zzzzzzzz")).toEqual([]);
  });
});

describe("moeda", () => {
  it("formata em real", () => {
    expect(moeda(1250000)).toMatch(/^R\$\s?1\.250\.000/);
  });

  it("ausência vira travessão, não zero", () => {
    expect(moeda(null)).toBe("—");
    expect(moeda(undefined)).toBe("—");
  });

  it("zero é zero, e não ausência", () => {
    expect(moeda(0)).not.toBe("—");
  });
});

describe("carteira", () => {
  it("não repete código", () => {
    const codigos = IMOVEIS.map((im) => im.codigo);
    expect(new Set(codigos).size).toBe(codigos.length);
  });

  it("todo código segue o padrão CR-0000", () => {
    for (const im of IMOVEIS) expect(im.codigo).toMatch(/^CR-\d{4}$/);
  });

  it("toda região anunciada tem bairro cadastrado", () => {
    for (const regiao of REGIOES) {
      expect(BAIRROS.some((b) => b.chave === regiao)).toBe(true);
    }
  });

  it("todo imóvel aponta para uma região que existe", () => {
    for (const im of IMOVEIS) expect(REGIOES).toContain(im.regiao);
  });

  it("aluguel por mês só existe em imóvel de alugar", () => {
    for (const im of IMOVEIS) {
      if (im.porMes) expect(im.finalidade).toBe("alugar");
    }
  });
});
