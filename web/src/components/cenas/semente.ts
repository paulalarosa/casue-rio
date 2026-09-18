export function sorteio(semente: string) {
  let h = 2166136261;
  for (let i = 0; i < semente.length; i++) {
    h ^= semente.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  function bruto() {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return (h >>> 0) / 4294967296;
  }
  return {
    entre: (a: number, b: number) => a + Math.floor(bruto() * (b - a + 1)),
    chance: (p: number) => bruto() < p,
    um: <T>(lista: readonly T[]) => lista[Math.floor(bruto() * lista.length)],
    fracao: bruto,
  };
}

export type Sorte = ReturnType<typeof sorteio>;
