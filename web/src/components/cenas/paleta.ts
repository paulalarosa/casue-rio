import type { Sorte } from "./semente";

export const cor = (nome: string) => `var(--color-${nome})`;

export type Hora = {
  ceu: string;
  morro: string;
  massa: string;
  topo: string;
  parede: string;
  vao: string;
  luz: string;
  rua: string;
  vizinho: string;
  acesa: number;
  sol: boolean;
  noite: boolean;
  peso: number;
};

const HORAS: Hora[] = [
  {
    ceu: cor("areia-200"),
    morro: cor("areia-500"),
    massa: cor("tinta-600"),
    topo: cor("terracota-500"),
    parede: cor("tinta-500"),
    vao: cor("tinta-800"),
    luz: cor("areia-300"),
    rua: cor("tinta-700"),
    vizinho: cor("tinta-400"),
    acesa: 0.14,
    sol: true,
    noite: false,
    peso: 42,
  },
  {
    ceu: cor("areia-400"),
    morro: cor("areia-600"),
    massa: cor("tinta-600"),
    topo: cor("terracota-600"),
    parede: cor("tinta-600"),
    vao: cor("tinta-800"),
    luz: cor("areia-200"),
    rua: cor("tinta-800"),
    vizinho: cor("tinta-400"),
    acesa: 0.36,
    sol: true,
    noite: false,
    peso: 40,
  },
  {
    ceu: cor("tinta-700"),
    morro: cor("tinta-900"),
    massa: cor("tinta-600"),
    topo: cor("terracota-800"),
    parede: cor("tinta-700"),
    vao: cor("tinta-900"),
    luz: cor("areia-100"),
    rua: cor("tinta-900"),
    vizinho: cor("tinta-500"),
    acesa: 0.66,
    sol: false,
    noite: true,
    peso: 18,
  },
];

export function horaSorteada(s: Sorte) {
  const total = HORAS.reduce((soma, h) => soma + h.peso, 0);
  let ponto = s.fracao() * total;
  for (const h of HORAS) {
    ponto -= h.peso;
    if (ponto < 0) return h;
  }
  return HORAS[0];
}
