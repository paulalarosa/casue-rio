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

type Cores = { nome?: string; lugar?: string; acento?: string; categoria?: string };

/* 🔴 Quem carrega a cor da marca é o Ê, não o "Rio".

   Eu tinha pintado o "Rio" de terracota em 16/09, por falta de símbolo. A
   folha de montagens da marca, montagem 05 "Sem placa", diz outra coisa com
   todas as letras: "Só o nome, com o ê em terracota". O "Rio" fica num
   neutro quente, e o acento é o único ponto de cor.
   
   Faz mais sentido do que o que eu tinha feito: o ê é a letra que vira a
   placa esmaltada do símbolo, então pintá-lo aqui é a mesma marca em dois
   pesos, e não duas ideias diferentes.
   
   Medido: terracota sobre o off-white dá 5,18:1, então o acento vale como
   texto de verdade mesmo sendo um pedaço de palavra. */
const PADRAO: Required<Cores> = {
  nome: "text-tinta-800",
  lugar: "text-tinta-600",
  acento: "text-terracota-600",
  categoria: "text-tinta-500",
};

/** "Casuê" com o ê destacado. Parte a palavra em duas peças para o acento
 *  poder ter cor própria, e mantém a entreletra negativa nas duas, senão a
 *  emenda abre um vão no meio do nome. */
function Casue({ nome, acento }: { nome: string; acento: string }) {
  return (
    <span className={cn("font-bold tracking-[-0.035em]", nome)}>
      Casu<span className={acento}>ê</span>
    </span>
  );
}

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
      <Casue nome={c.nome} acento={c.acento} />
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
      <Casue nome={c.nome} acento={c.acento} />
      <span className={cn("ml-[0.22em] font-bold tracking-[-0.035em]", c.lugar)}>Rio</span>
    </span>
  );
}
