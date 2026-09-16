# Casuê Rio · Negócios Imobiliários

Site da imobiliária de **Débora de Almeida Carvalho** (CRECI/RJ 92.984 · CNAI
53.073) e **Alessandra Soverchi de Seixas** (CRECI/RJ 92.989 · CNAI 53.072),
no Rio de Janeiro.

**No ar:** https://paulalarosa.github.io/casue-rio/

> A marca era **Carvalho & Seixas** e passou a ser **Casuê Rio** em 15/09/2026.
> O repositório mudou de nome junto. Se algum lugar ainda disser o nome antigo,
> é resto de migração e pode ser trocado.

---

## O que é

Site estático, exportado e publicado no GitHub Pages a cada empurrão na `main`.
Sem servidor, sem banco e sem CMS: a carteira de imóveis é um módulo
TypeScript (`web/src/lib/imoveis.ts`), que é o arquivo que a manutenção mensal
edita.

```bash
cd web
npm install
npm run dev     # http://localhost:3000
npm run build   # exporta para web/out
```

A publicação é automática (`.github/workflows/`). O prefixo de caminho e o
endereço canônico são **derivados do nome do repositório**, então renomear o
repo não quebra o site; o que muda é a URL.

---

## A identidade, em uma tela

| | |
|---|---|
| Marca | **Casuê Rio** · descritivo **Negócios Imobiliários** |
| Frase | "Quem mostra o imóvel é quem lê a matrícula." |
| Display | **Unbounded** (400, 600, 700 · entreletra negativa) |
| Corpo | **Archivo** |
| Número | **IBM Plex Mono**, tabular |
| Raio base | `0.5rem` |
| Símbolo | **ainda não existe.** A marca é só tipográfica, por decisão. |

**Cor** (a fonte de verdade é o bloco `@theme` em `web/src/app/globals.css`;
nenhum outro arquivo define paleta):

- **Tinta**, a rampa neutra e a única — de `#F2F1EE` a `#050504`, com
  `#111110` de texto e `#45443F` de dado secundário.
- **Areia** — `#DDCBAA`. Plano, faixa, realce.
- **Verde Tijuca** — `#1E4D3B`.
- **Off-white** — `#F6F2E9`, fundo da página.

### Três regras que não se negociam

1. 🔴 **Vermelho não entra em lugar nenhum.** Pedido das sócias. Até o estado
   de erro é tinta escura: o erro fala pelo peso e pelo ícone.
2. 🔴 **Verde só na ação.** Botão, link, foco, estado ativo. Nunca fundo de
   seção nem enfeite. Ele só tem força porque aparece pouco.
3. 🔴 **Areia é plano, nunca texto.** `#DDCBAA` sobre o off-white dá **1,4:1**.
   Quem pode virar texto pequeno é `#71634A`, medido em **5,24:1**.

---

## O que este site não faz, de propósito

Vale a pena ler antes de "completar" alguma coisa: o vazio abaixo é decisão,
não pendência esquecida.

- **Nenhum número inventado.** Não há contagem de vendas, prazo médio, taxa de
  sucesso nem depoimento. O que aparece é derivado da carteira e se atualiza
  sozinho quando ela muda.
- **Nenhum CPF.** Registro profissional é público e entra; CPF vai em contrato,
  nunca em página indexada.
- **Nenhum telefone inventado.** `TELEFONE` e `EMAIL` em `web/src/lib/site.ts`
  estão vazios de propósito e o botão de WhatsApp some sozinho enquanto
  estiverem. Botão que não leva a ninguém é pior que botão nenhum, porque a
  pessoa acha que falou com alguém.
- **Nenhuma foto de imóvel real.** Ainda não chegaram. O lugar delas é ocupado
  por ilustração da marca, que não finge ser foto, e por vídeo de ambiente,
  que sempre carrega a linha *"Imagem de ambiente. Não retrata imóvel da
  carteira."*

---

## Vídeo

Seis peças em `web/public/video/`, todas H.264 e sem áudio.

| Arquivo | Onde | Peso |
|---|---|---|
| `abertura.mp4` + `abertura-retrato.mp4` | abertura da home | 858 kB · 390 kB |
| `sala.mp4` | faixa do slogan | 562 kB |
| `bairros.mp4` | cabeça de `/bairros` | 489 kB |
| `gradil.mp4` | cabeça de `/juridico` | 304 kB |
| `calcadao.mp4` | cabeça de `/contato` | 456 kB |
| `carteira.mp4` | cabeça de `/imoveis` | 615 kB |

Regras que valem para qualquer vídeo que entre depois:

- 🔴 **Caminho de vídeo passa por `arquivo()`** (`web/src/lib/caminho.ts`). O
  `basePath` do Next reescreve `<Link>` e `<Image>` importado, mas **não**
  reescreve string que eu escrevi dentro de um atributo. Sem o ajudante o
  vídeo toca em desenvolvimento e dá 404 calado no ar.
- **O laço fecha de dois jeitos, e a escolha é medida.** Onde a câmera anda
  devagar, cruzamento de 0,5s entre a cauda e a cabeça. Onde ela anda muito
  (a aérea de `carteira.mp4`), o cruzamento vira fantasma, e o laço é
  vai-e-volta.
- 🔴 **Sem WebM.** Medido neste material: o VP9 saiu **maior** que o H.264
  (930 kB contra 858 kB), porque é plano largo, pouco movimento e muita área
  lisa. Dois formatos onde um ganha em tudo é peso sem ganho.
- 🔴 **Marca d'água de gerador sai por CORTE, não por filtro.** O `delogo`
  deixa borrão visível sobre grade e gradil.
- **Nada preso à rolagem.** MP4 comum tem quadro-chave a cada 8–12 quadros:
  arrastar trava. Laço simples com texto por cima entrega o mesmo e funciona
  no telefone.

---

## Movimento

GSAP, com uma doutrina escrita em `web/src/components/entrada.tsx` e que
existe porque a home já ficou inteira em opacidade zero, em produção:

- O que **esconde para revelar depois** nunca depende do `ScrollTrigger`. Usa
  `scroll` + `getBoundingClientRect`, e leva cão de guarda: se em 1,6s nada
  deu sinal de vida, o conteúdo aparece por decreto.
- O que só **mexe em coisa já visível** (paralaxe) pode usar `ScrollTrigger`,
  porque o pior caso dele é a peça ficar parada.
- Nada roda com `prefers-reduced-motion: reduce`.

---

## Onde ficam as coisas

```
web/src/app/globals.css      cor, tipo, forma. A fonte de verdade.
web/src/lib/site.ts          nome, sócias, endereço, contato. Sem CPF.
web/src/lib/imoveis.ts       a carteira. É isto que a manutenção edita.
web/src/lib/caminho.ts       prefixo de arquivo de `public/`.
web/src/components/entrada.tsx  a doutrina de animação.
web/public/video/            as seis peças de vídeo e seus pôsteres.
```

---

## Pendente, do lado do cliente

- O **símbolo**: dez propostas de fine line art e dez tiradas das referências
  estão com as sócias. Escolhido o desenho, entram o favicon definitivo (hoje
  é o "C" da Unbounded tirado do arquivo da fonte) e o cartão de
  compartilhamento refeito.
- O **número único de WhatsApp** da empresa.
- O **domínio**, para `NEXT_PUBLIC_SITE_URL`.
- As **fotos reais** dos imóveis.
