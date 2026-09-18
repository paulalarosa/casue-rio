import { buildLegacyTheme } from "sanity";

/* As cores da Casuê dentro do painel.

   🔴 Só o que é IDENTIDADE muda de cor. Verde de sucesso, amarelo de aviso e
   vermelho de erro ficam como a Sanity os entrega, e isso é decisão, não
   preguiça: esses três não são enfeite, são sinal. Pintar um erro de
   terracota para combinar com a marca é o tipo de coisa que faz alguém
   apagar um texto achando que clicou em salvar. A marca fica na barra, no
   símbolo e nos botões de ação. O alarme continua sendo alarme.

   🔴 `--white` é o papel da marca, não branco puro. É o que dá ao painel a
   mesma temperatura do site sem repintar um componente sequer: a Sanity
   deriva dezenas de tons a partir dessas chaves, e mudar a base muda tudo
   de uma vez, no lugar certo.

   `buildLegacyTheme` está marcado como obsoleto na versão 6 e vai sair numa
   major futura. Quando sair, o painel volta ao tema padrão da Sanity e nada
   quebra: perde a cor, não a função. Está aqui de propósito, é a única via
   suportada hoje, e o custo do dia em que cair é uma tarde. */
export const tema = buildLegacyTheme({
  "--font-family-base":
    '"Archivo", "Segoe UI", system-ui, -apple-system, Arial, sans-serif',

  "--black": "#171310",
  "--white": "#f6f2e9",

  "--brand-primary": "#a8482a",
  "--focus-color": "#a8482a",

  "--component-bg": "#f6f2e9",
  "--component-text-color": "#171310",

  "--gray-base": "#5a544e",
  "--gray": "#807870",

  "--main-navigation-color": "#171310",
  "--main-navigation-color--inverted": "#f6f2e9",

  "--default-button-color": "#5a544e",
  "--default-button-primary-color": "#a8482a",

  "--state-info-color": "#8a5a33",
});
