import { describe, expect, it } from "vitest";
import { dataPorExtenso } from "@/lib/revista";

describe("dataPorExtenso", () => {
  it("escreve por extenso em português", () => {
    expect(dataPorExtenso("2026-09-18T13:00:00.000Z")).toBe("18 de setembro de 2026");
  });

  it("22h no Rio ainda é o mesmo dia, mesmo já sendo o dia seguinte em UTC", () => {
    expect(dataPorExtenso("2026-09-19T01:00:00.000Z")).toBe("18 de setembro de 2026");
  });

  it("23h do dia anterior no Rio não vira o dia seguinte", () => {
    expect(dataPorExtenso("2026-09-18T02:00:00.000Z")).toBe("17 de setembro de 2026");
  });

  it("vira o ano na hora certa do Rio", () => {
    expect(dataPorExtenso("2027-01-01T02:00:00.000Z")).toBe("31 de dezembro de 2026");
  });
});
