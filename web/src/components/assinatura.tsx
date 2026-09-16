import { cn } from "@/lib/utils";

/* A assinatura da Casuê Rio.

   🔴 A marca hoje é SÓ TIPOGRÁFICA. O símbolo ainda está em escolha com as
   sócias, e marca boa não fica esperando desenho: a palavra já é a marca, e
   o símbolo, quando entrar, entra à esquerda deste bloco sem mexer nele.

   Três decisões que estão medidas, não chutadas:

   · O nome vai em Unbounded, que elas escolheram numa folha de nove opções.
     É display de verdade: geométrica, larga, com contraforma grande. Em
     display grande ela precisa de entreletra NEGATIVA, senão a palavra
     parece solta; em corpo de texto ela não serve, e por isso o descritivo
     desce para a Archivo.

   · "Rio" sai na areia, e não na tinta. É o único ponto de cor do lockup, e
     é o que separa o nome do lugar sem precisar de segunda linha.

   · "Negócios Imobiliários" é caixa alta espaçada, na sans. Em Unbounded o
     descritivo competiria com o nome, porque as duas têm a mesma voz. O
     contraste entre display larga e sans espaçada é o que faz o lockup ter
     hierarquia com duas palavras só.

   O tamanho é todo em `em`: quem define a escala é o pai, e as proporções
   internas ficam travadas em qualquer lugar onde o lockup apareça. */

type Cores = { nome?: string; lugar?: string; categoria?: string };

/* 🔴 O "Rio" passou a ser TERRACOTA. Antes era areia escura, um neutro que
   nao dizia nada; agora ele e o unico lugar do lockup que carrega a cor da
   marca, e e por isso que a assinatura funciona sem simbolo. Medido em
   5,18:1 sobre o off-white, entao vale como texto de verdade. */
const PADRAO: Required<Cores> = {
  nome: "text-tinta-800",
  lugar: "text-terracota-600",
  categoria: "text-tinta-500",
};

/** Lockup empilhado: o principal. Nome em duas linhas e o descritivo embaixo. */
export function Assinatura({
  className,
  cores,
}: {
  className?: string;
  cores?: Cores;
}) {
  const c = { ...PADRAO, ...cores };
  return (
    <span className={cn("inline-flex flex-col font-display leading-[0.94]", className)}>
      <span className={cn("font-bold tracking-[-0.035em]", c.nome)}>Casuê</span>
      <span className={cn("font-bold tracking-[-0.035em]", c.lugar)}>Rio</span>
      <span
        className={cn("mt-[0.5em] font-sans font-semibold uppercase leading-none", c.categoria)}
        style={{ fontSize: "0.3em", letterSpacing: "0.2em" }}
      >
        Negócios Imobiliários
      </span>
    </span>
  );
}

/** Versão em linha, para a barra do topo e outros lugares de pouca altura.

    Sem o descritivo de propósito: "NEGÓCIOS IMOBILIÁRIOS" em caixa alta
    espaçada mede mais de dez vezes a altura da letra, e numa barra de 8rem
    de altura ele empurraria o menu ou sairia ilegível de tão pequeno. Barra
    estreita é lugar de marca, não de descrição. */
export function AssinaturaLinha({
  className,
  cores,
}: {
  className?: string;
  cores?: Cores;
}) {
  const c = { ...PADRAO, ...cores };
  return (
    <span className={cn("inline-flex items-baseline font-display leading-none", className)}>
      <span className={cn("font-bold tracking-[-0.035em]", c.nome)}>Casuê</span>
      <span className={cn("ml-[0.22em] font-bold tracking-[-0.035em]", c.lugar)}>Rio</span>
    </span>
  );
}
