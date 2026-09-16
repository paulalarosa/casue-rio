/* Caminho de arquivo servido de `public/`.

   🔴 Isto existe por um defeito de publicação que só aparece NO AR.

   O site é página de projeto do GitHub Pages, ou seja, mora em
   `usuario.github.io/REPO`, e o `next.config.ts` cuida disso com
   `basePath`. O `basePath` reescreve sozinho o que o Next enxerga: `<Link>`,
   e `<Image>` com importação estática. Ele NÃO reescreve uma string que eu
   escrevi à mão dentro de um atributo, e `<video src="/video/x.mp4">` é
   exatamente isso.

   Resultado, medido: em desenvolvimento tudo toca, porque ali o prefixo é
   vazio; publicado, os cinco vídeos do site dariam 404 em silêncio, com o
   pôster no lugar e nenhum erro na tela. É a pior categoria de falha que
   existe neste projeto, a que parece que funcionou.

   Vale para QUALQUER arquivo de `public/` referido por string: vídeo, som,
   PDF, fonte. Imagem importada com `import x from "…"` não precisa. */
const PREFIXO = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function arquivo(caminho: string) {
  return `${PREFIXO}${caminho}`;
}
