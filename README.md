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
| Display | **Unbounded** por enquanto. Em troca: as sócias escolheram uma fina com **A sem travessão**, entre 12 candidatas OFL |
| Corpo | **Archivo** |
| Número | **IBM Plex Mono**, tabular |
| Raio base | `0.5rem` |
| Símbolo | **ainda não existe.** A marca é só tipográfica, por decisão. |

**Cor** (a fonte de verdade é o bloco `@theme` em `web/src/app/globals.css`;
nenhum outro arquivo define paleta). A paleta virou **terracota** em
16/09/2026, a pedido das sócias, e o verde Tijuca saiu junto.

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

Onze peças em `web/public/video/`, todas H.264 e sem áudio.

| Arquivo | Onde | Peso |
|---|---|---|
| `abertura.mp4` + `abertura-retrato.mp4` | abertura da home | 858 kB · 390 kB |
| `sala.mp4` | faixa do slogan | 562 kB |
| `gradil.mp4` | cabeça de `/juridico` | 304 kB |
| `calcadao.mp4` | cabeça de `/contato` | 456 kB |
| `carteira.mp4` | cabeça de `/imoveis` | 615 kB |
| `avaliacao.mp4` | cabeça de `/avaliacao` | 192 kB |
| `alameda.mp4` | cabeça de `/bairros/[bairro]` | 595 kB |
| `parede.mp4` | faixa escura da home | 116 kB |
| `horizonte.mp4` | cabeça de `/bairros` | 120 kB |
| `noite.mp4` | chamada final da home | 238 kB |

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
  51,9%). Nenhuma das duas separa os casos. Então: vai-e-volta sempre, que
  fecha por construção, e cruzamento só onde eu gerei, olhei a emenda e
  confirmei.
- 🔴 **Sem WebM.** Medido neste material: o VP9 saiu **maior** que o H.264
  (930 kB contra 858 kB), porque é plano largo, pouco movimento e muita área
  lisa. Dois formatos onde um ganha em tudo é peso sem ganho.
- 🔴 **Marca d'água de gerador sai por CORTE, não por filtro.** O `delogo`
  deixa borrão visível sobre grade e gradil.
- 🔴 **O rodapé não leva vídeo.** Medi: com o horizonte a 40% de opacidade, o
  papel dava 5,62:1 na média e **2,86:1 na faixa clara do céu**, que é por
  onde o texto passa; o rótulo em areia caía para 2,23:1. Para o pior caso
  passar seria preciso cobrir 65% do vídeo com véu, e aí não sobra vídeo.
  Rodapé é onde mora texto pequeno em quantidade, e isso não tem conserto
  barato.
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
web/public/video/            as onze peças de vídeo e seus pôsteres.
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
