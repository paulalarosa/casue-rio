/* O interruptor da medição de audiência.

   🔴 UMA VARIÁVEL LIGA TRÊS COISAS AO MESMO TEMPO: o script do Google
   Analytics, a faixa de consentimento e o trecho da página de privacidade
   que fala de cookie. Preencheu `NEXT_PUBLIC_GA_ID`, os três aparecem;
   deixou vazia, nenhum existe e o site continua como está hoje, sem cookie
   e sem terceiro.

   Isso é o oposto do desenho que se vê por aí, em que alguém instala o
   Analytics numa terça e a política de privacidade continua jurando que o
   site não usa cookie. Política que não bate com o site não é um detalhe de
   texto: é declaração falsa de uma empresa que responde por CRECI. Aqui as
   duas não têm como divergir, porque saem da mesma variável.

   🔴 E NADA é carregado antes do "sim". Na LGPD, cookie de audiência não é
   necessário para o site funcionar, então ele depende de consentimento dado
   antes, e não de aviso dado depois. A faixa que só informa, com um botão
   "ok", é a que a maioria dos sites usa e é a que não vale. */
export const GA = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const temMedicao = GA !== "";

/* Onde a escolha de quem visita fica guardada.

   🔴 `localStorage` e não cookie, de propósito: guardar a recusa num cookie
   seria criar um cookie para registrar que a pessoa não quer cookie. O
   armazenamento local não viaja em requisição nenhuma, não é lido por
   terceiro e some quando a pessoa limpa os dados do navegador. */
const CHAVE = "casue-medicao";

/* 🔴 "indefinido" é o valor do SERVIDOR, e existe para a tela não mentir.

   Este site é estático: o HTML é escrito no build, onde `localStorage` não
   existe. Sem um valor próprio para "ainda não dá para saber", a página
   sairia do build afirmando "você ainda não respondeu" e, para quem já
   tinha aceitado, essa frase apareceria por um instante depois de carregar.
   Curto, mas é a página de privacidade dizendo algo falso sobre a escolha
   da própria pessoa. */
export type Escolha = "sim" | "nao" | "nenhuma" | "indefinido";

const ouvintes = new Set<() => void>();

function avisar() {
  for (const f of ouvintes) f();
}

/* 🔴 Assinatura própria ALÉM do evento `storage` do navegador. O `storage`
   só dispara em OUTRAS abas, nunca na aba que escreveu: sem avisar à mão,
   clicar em "aceitar" não mudaria nada na tela de quem clicou. */
export function assinar(aoMudar: () => void) {
  ouvintes.add(aoMudar);
  window.addEventListener("storage", aoMudar);
  return () => {
    ouvintes.delete(aoMudar);
    window.removeEventListener("storage", aoMudar);
  };
}

/* 🔴 Devolve string, e string se compara por valor. É o que permite chamar
   isto a cada renderização sem o `useSyncExternalStore` entrar em laço: se
   devolvesse um objeto novo, cada leitura seria "uma mudança". */
export function lerEscolha(): Escolha {
  try {
    const v = window.localStorage.getItem(CHAVE);
    return v === "sim" || v === "nao" ? v : "nenhuma";
  } catch {
    /* Aba anônima com dados de site bloqueados FAZ O ACESSO LANÇAR, e não
       devolver nulo. Sem este `catch`, a faixa de cookie derrubaria a
       árvore inteira do React. */
    return "nenhuma";
  }
}

export function lerNoServidor(): Escolha {
  return "indefinido";
}

/* 🔴 RECUSAR TEM DE APAGAR O QUE JÁ FOI CRIADO, e este pedaço faltava.

   Quem aceita e depois muda de ideia já tem os cookies do Google no
   navegador. Sem isto, a página diria "hoje você recusa" com os `_ga` ainda
   lá dentro, o que é a política mentindo na cara de quem foi justamente
   conferir se ela era verdade.

   Apagar cookie é setar validade no passado, e é preciso repetir a tentativa
   em cada combinação de caminho e domínio possível: o `_ga` é gravado no
   domínio com ponto na frente, e um `document.cookie` sem `domain` não o
   alcança. Tentar todas é barato e não faz mal nenhum. */
export function apagarCookiesDoGoogle() {
  try {
    const nomes = document.cookie
      .split(";")
      .map((c) => c.split("=")[0].trim())
      .filter((n) => n.startsWith("_ga") || n.startsWith("_gid"));

    const partes = location.hostname.split(".");
    const dominios = [
      "",
      location.hostname,
      `.${location.hostname}`,
      ...(partes.length > 2 ? [`.${partes.slice(-2).join(".")}`] : []),
    ];

    for (const nome of nomes) {
      for (const d of dominios) {
        document.cookie =
          `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/` +
          (d ? `; domain=${d}` : "");
      }
    }
  } catch {
    /* Sem acesso a cookie, não há cookie nosso para apagar. */
  }
}

export function gravarEscolha(v: "sim" | "nao") {
  if (v === "nao") apagarCookiesDoGoogle();
  try {
    window.localStorage.setItem(CHAVE, v);
  } catch {
    /* Sem onde guardar, a faixa volta na próxima visita. É chato e é
       honesto: o que não pode é o site agir como se houvesse um "sim" que
       ninguém conseguiu registrar. */
  }
  avisar();
}
