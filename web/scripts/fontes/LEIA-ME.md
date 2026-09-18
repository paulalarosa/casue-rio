# As fontes da marca, em arquivo

Unbounded 700 e Archivo 400/600, baixadas do Google Fonts e guardadas aqui.

🔴 **Por que versionadas, e não baixadas no build.** O `ImageResponse` precisa
do arquivo da fonte em memória para desenhar. Buscar em `fonts.gstatic.com` na
hora do build punha a arte dos cards na dependência de um serviço de fora: no
dia em que ele demorasse, o card sairia na fonte reserva do desenhista de SVG,
que não é nenhuma das duas, e ninguém perceberia até a peça já estar postada.
340 kB versionados compram determinismo.

🔴 **Isto não vale para o site.** Lá as fontes vêm do `next/font/google`, que
já resolve tudo no build e serve do próprio domínio. Estes arquivos existem só
para desenhar imagem.

Licença: as duas são **SIL Open Font License 1.1**, que permite uso,
redistribuição e embutir em documento. Texto completo em
<https://openfontlicense.org>.

- Unbounded: <https://fonts.google.com/specimen/Unbounded>
- Archivo: <https://fonts.google.com/specimen/Archivo>
