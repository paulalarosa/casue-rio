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

## As páginas

| | |
|---|---|
| `/` | abertura, destaques, slogan e a chamada. Quatro blocos. |
| `/imoveis` | a carteira, com filtro, busca por código e a faixa de bairros |
| `/imoveis/[codigo]` | a ficha |
| `/bairros` e `/bairros/[chave]` | Centro, Tijuca e Zona Sul |
| `/avaliacao` | o parecer de valor, que é o que o CNAI habilita |
| `/quem-somos` | as duas, os registros e o que cada um autoriza |
| `/revista` | o blog, ainda sem o primeiro texto |
| `/contato` | a única porta de contato do site |

O **menu do topo** tem quatro entradas: Imóveis, Avaliação, Quem somos,
Revista. Saíram três, todas em 17/09/2026:

- **Jurídico**, e a página junto, por decisão das sócias;
- **Bairros**, por redundância com "Imóveis" — as duas mandavam para a mesma
  coisa vista de dois ângulos. Os bairros agora aparecem numa faixa dentro de
  `/imoveis`, e as páginas continuam existindo, indexadas e linkadas;
- **Contato**, porque o botão ao lado dele já era a página de contato. Duas
  portas para a mesma conversa fazem a pessoa procurar a diferença entre elas.

---

## A marca

🟢 **O símbolo existe desde 17/09/2026.** Chegou como pacote de vetores e está
em [`marca/`](marca/), com o `LEIA-ME.txt` que traz a construção. É uma placa
esmaltada com o **ê**, e treze montagens ao redor dela.

O site usa quatro:

| | onde |
|---|---|
| **01** horizontal | erro e página não encontrada |
| **03** com descritivo | rodapé |
| **04** faixa | barra do topo, que é o que a folha manda: "04 em barras e testeiras" |
| **05** sem placa | gaveta do celular, e o cartão de compartilhamento usa a **16** |
| **12** reduzida | favicon |

Três coisas medidas que valem mais que qualquer descrição:

- 🔴 **A placa é exatamente `#A8482A`**, o mesmo valor que o site já tinha.
- 🔴 **O ê só é colorido quando NÃO há placa.** Nas montagens 01, 03 e 04 o
  "Casuê" sai numa cor só; o ê em terracota é a **05**, que existe justamente
  para substituir a placa quando ela não cabe. Ter os dois é dizer a mesma
  coisa duas vezes, com um ponto de cor a dois centímetros de outro igual.
- 🔴 **Sobre fundo escuro a placa não inverte.** A montagem 16 mantém o esmalte
  e muda só o nome ao lado: a placa é bloco cheio, pede 3:1 e mede 3,19:1 ali.

Construção, com o lado da placa valendo 1: raio externo `0,173`; filete a
`0,1065` de recuo, `0,02` de espessura e raio `0,107`; ê com `0,413` de corpo,
centrado, com `0,027` de correção óptica para cima. É isso que
`web/src/components/placa.tsx` desenha, vezes cem.

🔴 **O ê do site é CURVA, não `<text>`.** Duas razões: a fonte carrega com
`display: swap`, então um `<text>` mostraria o ê em Century Gothic dentro da
placa até a Unbounded chegar, e logo que pisca de fonte não é logo; e o
favicon, que não carrega fonte nenhuma, usa a mesma curva. Ela saiu da
Unbounded 700 com `fontTools`, no lugar exato em que o SVG do pacote a
desenha — não no centro da mancha da letra, que é um por cento mais baixo,
porque o arquivo usa `text-anchor: middle` e `dominant-baseline: central`, e
os dois medem outra coisa.

🔴 **A fonte É a Unbounded.** Eu tinha dito o contrário em 16/09, comparando a
imagem da folha com a Unbounded renderizada: o `LEIA-ME.txt` do pacote diz
"Unbounded 700 (nome) e Archivo 600 (descritivo)". O que eu comparei foi um
PNG em que a fonte não tinha carregado.

**Reserva:** meio lado da placa, em qualquer direção.
**Mínimos:** com nome ao lado, 24 px em tela e 8 mm em impresso; a placa
sozinha vai a 16 px, na variante reduzida.
**Não pode:** distorcer, trocar o esmalte, girar, aplicar sobre cor próxima.

### Tipo e cor

| | |
|---|---|
| Display | **Unbounded**, pesos 400/600/700. 800 e 900 não entram: a contraforma fecha |
| Corpo | **Archivo** |
| Número | **IBM Plex Mono**, tabular |
| Raio base | `0.5rem` |

A fonte de verdade da cor é o bloco `@theme` em `web/src/app/globals.css`;
nenhum outro arquivo define paleta.

| | Hex | Sobre o off-white | Papel sobre ele | Papel |
|---|---|---|---|---|
| Areia clara | `#EDE2CB` | 1,2:1 | — | plano claro |
| **Areia** | `#DDCBAA` | 1,4:1 | — | plano · o par que dá personalidade |
| Telha | `#C6764E` | 3,1:1 | — | plano quente · texto só em faixa escura (5,4:1) |
| Argila queimada | `#B85A32` | 4,1:1 | 4,1:1 | plano forte · **reprova nos dois** |
| **Terracota** | `#A8482A` | **5,2:1** | **5,2:1** | a marca e a ação |
| Bronze | `#8A5A33` | 5,2:1 | — | rótulo, dado secundário |
| **Tinta quente** | `#171310` | 16,5:1 | — | texto longo |
| Off-white | `#F6F2E9` | — | — | fundo da página |

### Quatro regras que não se negociam

1. 🔴 **Vermelho de sinal não entra em lugar nenhum.** Era pedido das sócias e
   agora é também impossível: um vermelho de erro ao lado de uma marca
   terracota seria indistinguível. O estado de erro é tinta escura.
2. 🔴 **A terracota é a marca E a ação.** O que dá força a ela é não virar
   fundo de seção: os planos são areia, areia clara e a tinta quente.
3. 🔴 **`#A8482A` é o único degrau que serve nos dois sentidos.** O de cima,
   `#B85A32`, dá 4,13:1 de texto sobre o papel **e** 4,13:1 de papel sobre
   ele, ou seja, reprova como texto e como botão.
4. 🔴 **Areia é plano, nunca texto**, e **terracota não é texto sobre faixa
   escura** (3,19:1). Sobre escuro quem fala é a telha (5,37:1) ou a areia.
   Texto pequeno em claro: bronze `#8A5A33`, medido em 5,23:1.

O estado de repouso de botão sempre **escurece**, nunca clareia: `terracota-500`
no hover dava 4,13:1 e reprovava justo com o mouse em cima.

---

## O que este site não faz, de propósito

Vale a pena ler antes de "completar" alguma coisa: o vazio abaixo é decisão,
não pendência esquecida.

- **Nenhum número inventado.** Não há contagem de vendas, prazo médio, taxa de
  sucesso nem depoimento. O que aparece é derivado da carteira e se atualiza
  sozinho quando ela muda.
- **Nenhum CPF.** Registro profissional é público e entra; CPF vai em contrato,
  nunca em página indexada.
- **Nenhum telefone inventado.** `TELEFONE` em `web/src/lib/site.ts` está
  vazio de propósito e o botão de WhatsApp some sozinho enquanto estiver.
  Botão que não leva a ninguém é pior que botão nenhum, porque a pessoa acha
  que falou com alguém. O e-mail e o Instagram são reais e viram `mailto:` e
  link de verdade.
- **Nenhuma segunda frase de marca.** `SEGUNDA_FRASE` existe vazia, esperando
  a que elas vão mandar. Frase inventada por mim é pior que espaço em branco,
  porque parece decidida.
- **Nenhum texto na revista.** A página existe montada e a lista `MATERIAS`
  está vazia: quando o primeiro texto delas chegar, a grade nasce pronta.
  Escrever três matérias de exemplo assinadas por corretora com CRECI é a
  mesma coisa que o depoimento inventado que já saiu deste site.
- **Nenhuma foto de imóvel real.** Ainda não chegaram. O lugar delas é ocupado
  por ilustração da marca, que não finge ser foto, e por vídeo de ambiente,
  que sempre carrega a linha *"Imagem de ambiente. Não retrata imóvel da
  carteira."*

### E o que este site não vende

🔴 **Temporada não existe aqui**, desde 17/09/2026. Elas trabalham **venda** e
**aluguel**, mais avaliação. O tipo `Finalidade` é o que segura isso: com
"temporada" fora da união, qualquer imóvel, filtro ou rótulo que tente usar a
palavra não compila. **Grajaú** saiu na mesma data, pelo mesmo mecanismo.

---

## Busca

A busca da abertura tem três campos, e o primeiro ocupa uma linha só.

🔴 **Código tem atalho.** Quem digita `CR-0142` não quer uma lista com um item:
viu o código na placa da janela ou num print, e quer abrir aquele imóvel. Então
o envio vai direto para a ficha, e os dois seletores são ignorados de propósito
— filtrar por bairro um imóvel já identificado só poderia esconder o que a
pessoa pediu. A comparação joga fora tudo que não é letra ou número dos dois
lados, então `cr 0142`, `CR-0142`, `cr0142` e `0142` abrem o mesmo imóvel.

🔴 **O código está em linha própria porque foi medido.** Na mesma fila dos dois
seletores a grade dava 114px para ele e 256 e 281 para os outros: `fr` tem piso
de conteúdo mínimo, e "Todos os bairros" comia o espaço antes de a proporção
valer. O rótulo quebrava em três linhas e o botão saía cortado.

---

## Vídeo

Onze peças em `web/public/video/`, todas H.264 e sem áudio.

| Arquivo | Onde | Peso |
|---|---|---|
| `abertura.mp4` + `abertura-retrato.mp4` | abertura da home | 858 kB · 390 kB |
| `sala.mp4` | faixa do slogan | 562 kB |
| `gradil.mp4` | cabeça de `/quem-somos` | 304 kB |
| `calcadao.mp4` | cabeça de `/contato` | 456 kB |
| `carteira.mp4` | cabeça de `/imoveis` | 615 kB |
| `avaliacao.mp4` | cabeça de `/avaliacao` | 192 kB |
| `alameda.mp4` | cabeça de `/bairros/[bairro]` | 595 kB |
| `parede.mp4` | cabeça de `/revista` | 116 kB |
| `horizonte.mp4` | cabeça de `/bairros` | 120 kB |
| `noite.mp4` | chamada final da home | 238 kB |

🔴 O `gradil` e o `parede` **mudaram de casa** quando a página jurídica e a
faixa escura da home saíram. Cada um foi para uma página nova que não tinha
vídeo nenhum, e não para um canto de página que já tinha: reaproveitar peça em
dois lugares é o que faz o site parecer que tem um filme só.

Regras que valem para qualquer vídeo que entre depois:

- 🔴 **Caminho de vídeo passa por `arquivo()`** (`web/src/lib/caminho.ts`). O
  `basePath` do Next reescreve `<Link>` e `<Image>` importado, mas **não**
  reescreve string que eu escrevi dentro de um atributo. Sem o ajudante o
  vídeo toca em desenvolvimento e dá 404 calado no ar.
- 🔴 **O laço é vai-e-volta por padrão.** Existe um jeito mais bonito, que é
  cruzar meio segundo da cauda com a cabeça, mas ele só funciona em alguns
  planos e eu **não consegui construir a régua que diz quais**. Tentei duas:
  diferença média de luminância (gradil 46,4 e calçadão 49,6 funcionaram, a
  aérea 47,9 falhou) e diferença de bordas fortes (63,8% / 67,3% contra
  51,9%). Nenhuma das duas separa os casos.
- 🔴 **Sem WebM.** Medido neste material: o VP9 saiu **maior** que o H.264
  (930 kB contra 858 kB), porque é plano largo, pouco movimento e muita área
  lisa.
- 🔴 **Marca d'água de gerador sai por CORTE, não por filtro.** O `delogo`
  deixa borrão visível sobre grade e gradil.
- 🔴 **O rodapé não leva vídeo.** Medi: com o horizonte a 40% de opacidade, o
  papel dava 5,62:1 na média e **2,86:1 na faixa clara do céu**, que é por
  onde o texto passa; o rótulo em areia caía para 2,23:1. Rodapé é onde mora
  texto pequeno em quantidade, e isso não tem conserto barato.
- **Nada preso à rolagem.** MP4 comum tem quadro-chave a cada 8–12 quadros:
  arrastar trava.

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
marca/                       os SVGs da marca e a construção da placa.
web/src/app/globals.css      cor, tipo, forma. A fonte de verdade.
web/src/lib/site.ts          nome, sócias, endereço, contato. Sem CPF.
web/src/lib/imoveis.ts       a carteira. É isto que a manutenção edita.
web/src/lib/caminho.ts       prefixo de arquivo de `public/`.
web/src/components/placa.tsx      o símbolo.
web/src/components/assinatura.tsx as montagens da marca.
web/src/components/entrada.tsx    a doutrina de animação.
web/public/video/            as onze peças de vídeo e seus pôsteres.
web/scripts/cartao-marca.mjs o cartão de compartilhamento, gerado do código.
```

---

## Pendente, do lado do cliente

- O **número único de WhatsApp** da empresa. É um só, da empresa, e não um
  por sócia: enquanto não chega, o botão vai para a página de contato.
- A **segunda frase** da marca, que vai ao lado de "Aqui seu sonho vira
  patrimônio".
- O **domínio**, para `NEXT_PUBLIC_SITE_URL`.
- As **fotos reais** dos imóveis e os **retratos** das duas, verticais 4:5.
- O **primeiro texto** da revista.
