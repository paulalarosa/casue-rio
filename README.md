# Casuê Rio · Negócios Imobiliários

Site da imobiliária de **Débora de Almeida Carvalho** (CRECI/RJ 92.984 · CNAI
53.073) e **Alessandra Soverchi de Seixas** (CRECI/RJ 92.989 · CNAI 53.072),
no Rio de Janeiro.

- Site: <https://casuerio.com.br>
- Painel de conteúdo: <https://casue-rio.sanity.studio>

## Pastas

| pasta      | o que é                                                         |
| ---------- | --------------------------------------------------------------- |
| `web/`     | o site. Next.js 16 em exportação estática, React 19, Tailwind 4 |
| `estudio/` | o painel Sanity onde as corretoras escrevem a revista            |
| `infra/`   | regras do formulário e o Lambda antigo, a sair                   |
| `scripts/` | ferramentas do repositório                                       |

## Rodar

```bash
cd web
npm install
npm run dev
```

```bash
cd estudio
npm install
npm run dev
```

Cada pasta tem um `.env.example`. Copie para `.env.local` (site) ou `.env`
(painel) e preencha.

## Conferir

```bash
node scripts/sem-comentarios.mjs --exigir
cd web
npm run format:check
npm run lint
npm run typecheck
npm run test
```

Os cinco rodam no CI antes de qualquer publicação.

## Onde mora o conteúdo

| conteúdo               | onde                      | quem edita                 |
| ---------------------- | ------------------------- | -------------------------- |
| Artigos da revista     | Sanity                    | as corretoras, pelo painel |
| Carteira de imóveis    | `web/src/lib/carteira.ts` | manutenção, em código      |
| Textos das páginas     | os próprios componentes   | manutenção, em código      |
| Marca, endereço, CRECI | `web/src/lib/site.ts`     | manutenção, em código      |

O painel tem uma porta só, Revista, mais uma página de ajuda. Imóvel e bairro
saíram de lá de propósito: alteração de site passa pela manutenção.

## Publicar
Empurrar na `main` publica. `.github/workflows/publicar.yml` confere,
constrói e sobe `web/out/` para o **Cloudflare Pages**, projeto `casuerio`.
O fluxo também dispara por webhook do Sanity e por tarefa agendada.

Gatilhos, variáveis, o que ainda escreve na AWS, hospedagem, domínio,
e-mail e o caminho de volta: [DEPLOY.md](DEPLOY.md).

## Formulários
Os três formulários do site (contato, "busque para mim" em Imóveis e "quer
vender" em Avaliação) postam para **`/api/formulario`**, função do próprio
Pages, na mesma origem do site. Ela confere, monta o e-mail e entrega pelo
**Resend**, para `rio.casue@gmail.com`.

| arquivo                           | o que faz                                              |
| --------------------------------- | ------------------------------------------------------ |
| `web/functions/api/formulario.ts` | a função: Turnstile, Resend, resposta                   |
| `infra/formulario/regras.mjs`     | a parte pura: origem, armadilhas, campos, limpeza       |
| `infra/formulario/carta.mjs`      | o e-mail em HTML com a paleta e os botões de ação       |

Cinco travas:

- **o destino é fixo no código**, nunca vem do formulário;
- **campo-armadilha** escondido, que só robô preenche;
- **trava de tempo**: formulário respondido em menos de três segundos não sai;
- **limite por IP**: três envios em dez minutos. Vale por instância da função,
  então é freio, não muro;
- **Turnstile, da Cloudflare**, conferido na função pela Siteverify. Captcha só
  no navegador o robô pula, porque posta direto no endereço.

O e-mail chega com o nome no assunto ("Procura um imóvel · Fulana"), os botões
**Ligar**, **WhatsApp** e **Responder** quando o dado existe, e o texto puro
junto. Todo valor do visitante sai escapado; `carta.test.ts` cobra isso.

**Segredos**, só no projeto do Pages, nunca no repositório:

| segredo            | o que é                                                          |
| ------------------ | ---------------------------------------------------------------- |
| `TURNSTILE_SECRET` | chave secreta do Turnstile                                        |
| `RESEND_API_KEY`   | chave **só de envio** e **só de `casuerio.com.br`**, "casue-rio-formulario" |

🔴 A chave do Resend é presa a este domínio de propósito: a conta do Resend
também tem o `khaoskontrol.com.br`, e a chave do formulário não consegue
mandar como ele (testado: 403). O plano grátis, porém, **divide** 100 por dia e
3.000 por mês entre os dois domínios.

Para testar o caminho inteiro sem ficha de verdade, a chave de teste do
Turnstile que sempre aprova é `1x0000000000000000000000000000000AA`. Só no
ambiente de preview, e devolver a de verdade logo depois.

`infra/formulario/indice.mjs` e `subir.sh` são o Lambda antigo, com SES. Ficam
até ele ser apagado, e ninguém mais chama.

## Fotos de imóvel

As fotos originais não entram no repositório. `web/scripts/fotos.mjs` converte
uma pasta de origem em WebP dentro de `web/public/fotos/<codigo>/`, em dois
tamanhos: o grande com até 1600px de largura e o `-min` de 480px, que é o que a
tira de miniaturas carrega.

```
node scripts/fotos.mjs "caminho/das/fotos" "fotos/cse-1001"
```

O `sharp` já vem junto com o Next, então não é dependência declarada. A galeria
troca `.webp` por `-min.webp` sozinha nas miniaturas.

🔴 Fotos moram em `/fotos/`, **nunca** dentro de `/imoveis/`. A rota do imóvel é
`/imoveis/CSE-1001/`; uma pasta `/imoveis/cse-1001/` só difere na caixa, e em
Windows e macOS a construção funde as duas e a página do imóvel some.
`fotos.test.ts` reprova isso.

## Peças de Instagram

Cada artigo publicado gera duas imagens na tipografia da marca, 1080×1350 para
o feed e 1080×1080 com a citação. Elas não vão para o site: saem como artefato
do fluxo do GitHub, em **Actions → última publicação → cards-instagram**.

## Padrão de código

Sem comentários, e vale para o repositório inteiro: TypeScript, JavaScript,
CSS, YAML e shell. Explicação de decisão vive fora do arquivo.

O varredor `scripts/sem-comentarios.mjs` usa um analisador por linguagem, nunca
expressão regular: o TypeScript do próprio repositório, o PostCSS e o `yaml`.
Preserva o que é funcional (`eslint-disable`, `@ts-`, `@license`, shebang),
confere que o YAML continua significando a mesma coisa e passa todo bloco
`run:` por `bash -n` antes de gravar.

```bash
node scripts/sem-comentarios.mjs
node scripts/sem-comentarios.mjs --gravar
node scripts/sem-comentarios.mjs --exigir
```

A terceira forma é a que roda no CI: acha um comentário, a publicação para.

Formatação por Prettier em `web/`, verificada no CI com `npm run format:check`.

## Página guardada: Quem somos

Saiu do ar em 23/09 porque as donas vão reescrever o texto. **Não foi apagada**:
mora em `web/src/app/_quem-somos/page.tsx`, pasta que o Next não publica, e
continua passando pelo typecheck.

Uma chave só, `QUEM_SOMOS_NO_AR` em `web/src/lib/site.ts`, tira e devolve o que
aponta para ela: menu, rodapé, o botão "Ver os registros" da avaliação, a frase
do contato, o sitemap, o `llms.txt` e a `url` das sócias na ficha do Google.

Para voltar, as duas coisas juntas:

1. `git mv web/src/app/_quem-somos web/src/app/quem-somos`
2. `QUEM_SOMOS_NO_AR = true`

`sitemap.test.ts` reprova se uma for feita sem a outra.

## Pendente, do lado do cliente

- O **texto novo do Quem somos**, que elas vão mandar.
- A **segunda frase** da marca, ao lado de "Aqui seu sonho vira patrimônio".
- As **fotos reais** dos imóveis e os **retratos** das duas, verticais 4:5.
- Os **prazos de guarda** de dado pessoal, confirmados pelas duas, na página de
  privacidade.
