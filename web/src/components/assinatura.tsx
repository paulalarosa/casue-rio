import { cn } from "@/lib/utils";
import { Placa, type RoupaDaPlaca } from "@/components/placa";

/* A assinatura da Casuê Rio.

   🔴 A marca DEIXOU de ser só tipográfica em 17/09/2026: chegou o pacote de
   vetores, com a placa esmaltada do ê e treze montagens. O que está aqui são
   quatro delas, as que o site usa, com as proporções tiradas dos SVGs e não
   do olho:

     01 · horizontal ............ placa + nome numa linha. O padrão.
     03 · com descritivo ........ placa + nome + fio + NEGÓCIOS IMOBILIÁRIOS.
     04 · faixa ................. tudo em uma linha só. A folha manda usar
                                  esta em "barra de topo de site, rodapé e
                                  testeira de fachada", e é o que a barra usa.
     05 · sem placa ............. só o nome, com o ê em terracota. Para onde
                                  a placa já apareceu na mesma página.

   As proporções são todas em `em` do NOME, tiradas por divisão dos números
   do SVG. Exemplo, montagem 03: placa 100, nome 38, folga 31 — logo a placa
   é 2,63em do nome e a folga é 0,816em. Quem define a escala é o pai, e as
   relações internas ficam travadas em qualquer tamanho.

   🔴 A entreletra do nome é NEGATIVA (-0,035em) e continua sendo: a Unbounded
   é larga, e em display sem esse aperto a palavra parece solta.

   🔴 O ê SÓ é colorido quando NÃO há placa, e isto está nos arquivos: nas
   montagens 01, 03 e 04 o "Casuê" sai inteiro numa cor só, e o ê em
   terracota aparece apenas na 05, que é a versão sem placa. Faz sentido —
   o ê colorido é o que SUBSTITUI a placa quando ela não cabe. Ter os dois
   na mesma peça é dizer a mesma coisa duas vezes, e ainda põe um ponto de
   cor a dois centímetros de outro ponto da mesma cor.

   Por isso `acento` não tem mais valor padrão: sem ele, o ê simplesmente
   herda a cor do nome. Quem pinta o acento é a `AssinaturaNome`, que é a
   montagem 05, e mais ninguém.

   🔴 Naquela, sobre fundo escuro, o acento vira TELHA (terracota-400,
   5,37:1), porque a terracota sobre escuro dá 3,19:1 e reprova. */

type Cores = { nome?: string; lugar?: string; acento?: string; categoria?: string };

const PADRAO: Required<Omit<Cores, "acento">> = {
  nome: "text-tinta-800",
  lugar: "text-tinta-600",
  /* 🔴 O descritivo da folha é `#7A6A55`, que mede 4,68:1 sobre o papel.
     Passa, mas por pouco, e é o texto MENOR do lockup. O site já tem um
     token para exatamente este papel, o `bronze-500`, medido em 5,23:1.
     Fica o do site: mesma família de quente, mais folga. */
  categoria: "text-bronze-500",
};

/** "Casuê" com o ê destacado. Parte a palavra em duas peças para o acento
 *  poder ter cor própria, e mantém a entreletra negativa nas duas, senão a
 *  emenda abre um vão no meio do nome. */
function Casue({ nome, acento }: { nome: string; acento?: string }) {
  return (
    <span className={cn("font-bold tracking-[-0.035em]", nome)}>
      Casu<span className={acento}>ê</span>
    </span>
  );
}

function Rio({ lugar, className }: { lugar: string; className?: string }) {
  return (
    <span className={cn("font-bold tracking-[-0.035em]", lugar, className)}>Rio</span>
  );
}

function Descritivo({ cor, className }: { cor: string; className?: string }) {
  return (
    <span
      className={cn("font-sans font-semibold uppercase leading-none", cor, className)}
      style={{ fontSize: "0.289em", letterSpacing: "0.2em" }}
    >
      Negócios Imobiliários
    </span>
  );
}

/** 01 · horizontal, uma linha. Placa + nome, e nada mais.
 *
 *  Proporções do SVG: placa 100, nome 45, folga 31 entre as duas. */
export function AssinaturaLinha({
  className,
  cores,
  roupa,
}: {
  className?: string;
  cores?: Cores;
  roupa?: RoupaDaPlaca;
}) {
  const c = { ...PADRAO, ...cores };
  return (
    <span className={cn("inline-flex items-center font-display leading-none", className)}>
      <Placa roupa={roupa} className="text-[2.22em]" />
      <span className="ml-[0.689em] inline-flex items-baseline">
        <Casue nome={c.nome} />
        <Rio lugar={c.lugar} className="ml-[0.22em]" />
      </span>
    </span>
  );
}

/** 04 · faixa. Placa, nome, fio e descritivo em uma linha só.
 *
 *  É a montagem que a folha manda usar em barra de topo, rodapé e testeira.
 *  Proporções do SVG: placa 56, nome 26, folga 24, fio de 1,2 × 35,84 a 28
 *  do nome, descritivo 9,5 a 21,8 do fio.
 *
 *  🔴 O fio vai em `currentColor` com opacidade, e não no `#E0CDB4` do
 *  arquivo: sobre o papel aquele bege mede 1,39:1 e some, e sobre a barra
 *  escura ele viraria o elemento mais claro da peça, acima do próprio nome.
 *  Divisória tem de acompanhar o texto que ela divide. */
export function AssinaturaFaixa({
  className,
  cores,
  roupa,
}: {
  className?: string;
  cores?: Cores;
  roupa?: RoupaDaPlaca;
}) {
  const c = { ...PADRAO, ...cores };
  return (
    <span className={cn("inline-flex items-center font-display leading-none", className)}>
      <Placa roupa={roupa} className="text-[2.154em]" />
      <span className="ml-[0.923em] inline-flex items-baseline">
        <Casue nome={c.nome} />
        <Rio lugar={c.lugar} className="ml-[0.22em]" />
      </span>
      {/* O descritivo só existe onde cabe: abaixo de `sm` a barra tem largura
          para a marca e para o botão, e mais nada. Esconder aqui é a
          montagem 01 assumindo o lugar da 04, que é o que a ordem de
          preferência da folha manda fazer quando o espaço aperta. */}
      <span aria-hidden className="ml-[1.077em] hidden h-[1.378em] w-px bg-current opacity-25 lg:block" />
      <Descritivo cor={c.categoria} className="ml-[0.838em] hidden lg:inline" />
    </span>
  );
}

/** 03 · horizontal com descritivo. Placa à esquerda, nome em cima, fio e
 *  descritivo embaixo. É a montagem de cabeçalho de documento, e é a do
 *  rodapé, onde há largura para a caixa alta espaçada.
 *
 *  Proporções do SVG: placa 100, nome 38, folga 31; fio de 26 × 2,2 e
 *  descritivo 11, a 34 abaixo do centro do nome. */
export function Assinatura({
  className,
  cores,
  roupa,
}: {
  className?: string;
  cores?: Cores;
  roupa?: RoupaDaPlaca;
}) {
  const c = { ...PADRAO, ...cores };
  return (
    <span className={cn("inline-flex items-center font-display leading-none", className)}>
      <Placa roupa={roupa} className="text-[2.63em]" />
      <span className="ml-[0.816em] inline-flex flex-col gap-[0.42em]">
        <span className="inline-flex items-baseline">
          <Casue nome={c.nome} />
          <Rio lugar={c.lugar} className="ml-[0.22em]" />
        </span>
        <span className="inline-flex items-center">
          {/* O fio curto é TERRACOTA no arquivo, e aqui continua: é um bloco
              cheio de 0,058em, não texto, e é o que amarra o descritivo à
              marca sem repetir a cor no texto. */}
          <span aria-hidden className="h-[0.058em] w-[0.684em] bg-terracota-600" />
          <Descritivo cor={c.categoria} className="ml-[0.316em]" />
        </span>
      </span>
    </span>
  );
}

/** 05 · sem placa. Só o nome, com o ê em terracota.
 *
 *  A folha é específica sobre onde ela vale: "corpo de documento, marca
 *  d'água e situações onde a placa já aparece na mesma página". Repetir a
 *  placa duas vezes na mesma tela é o que gasta um símbolo. */
export function AssinaturaNome({
  className,
  cores,
  empilhado = false,
}: {
  className?: string;
  cores?: Cores;
  empilhado?: boolean;
}) {
  const c = { acento: "text-terracota-600", ...PADRAO, ...cores };
  return (
    <span
      className={cn(
        "font-display",
        empilhado ? "inline-flex flex-col leading-[0.94]" : "inline-flex items-baseline leading-none",
        className,
      )}
    >
      <Casue nome={c.nome} acento={c.acento} />
      <Rio lugar={c.lugar} className={empilhado ? undefined : "ml-[0.22em]"} />
    </span>
  );
}
