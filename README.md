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
| `infra/`   | políticas de IAM e de balde, e a função do CloudFront            |
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

Empurrar na `main` publica. `.github/workflows/aws.yml` confere, constrói,
sincroniza com o S3 em duas passadas de cache e invalida o CloudFront.

O fluxo também dispara por:

- **webhook do Sanity**, via `repository_dispatch`, quando alguém publica um
  texto;
- **tarefa agendada**, a cada quinze minutos, que só republica quando um
  artigo marcado para o futuro vence a hora. Quem decide é
  `.github/scripts/venceu.sh`, comparando o painel com o sitemap do site.

## Formulários

Os três formulários do site (contato, "busque para mim" em Imóveis e "quer
vender" em Avaliação) postam para uma função Lambda com Function URL, que
monta o e-mail e entrega pelo Amazon SES.

O código mora em `infra/formulario/`. `regras.mjs` é a parte pura, coberta por
`web/src/lib/formulario.test.ts`; `indice.mjs` só acrescenta o SES. `subir.sh`
zipa os dois e atualiza a função.

Quatro travas, e nenhuma delas é captcha:

- **o destino é fixo no código**, e a política do papel ainda prende o SES a um
  único remetente e a um único destinatário, então nem alterar o código abre a
  porta para usar isso como relé;
- **campo-armadilha** escondido, que só robô preenche;
- **trava de tempo**: formulário respondido em menos de três segundos não sai;
- **limite por IP**: três envios em dez minutos.

O SES está no modo restrito, que só entrega para endereço verificado. Como o
único destino é verificado, isso serve de teto: 200 e-mails por dia.

### Variáveis do repositório

| variável                              | para quê                                                           |
| ------------------------------------- | ------------------------------------------------------------------ |
| `AWS_ROLE_ARN`                        | papel assumido por OIDC na publicação. Vazia desliga o fluxo        |
| `CLOUDFRONT_ID`                       | distribuição a invalidar                                            |
| `SITE_URL`                            | endereço canônico                                                   |
| `SANITY_PROJECT_ID`, `SANITY_DATASET` | leitura do painel                                                   |
| `GA_ID`                               | medição. Vazia: sem script, sem cookie e sem faixa de consentimento |
| `FORM_URL`                            | Function URL que recebe os formulários. Vazia: os formulários avisam que o envio não está ligado |

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

## Pendente, do lado do cliente

- O **número único de WhatsApp** da empresa. Enquanto não chega, os botões
  levam à página de contato.
- A **segunda frase** da marca, ao lado de "Aqui seu sonho vira patrimônio".
- As **fotos reais** dos imóveis e os **retratos** das duas, verticais 4:5.
- Os **prazos de guarda** de dado pessoal, confirmados pelas duas, na página de
  privacidade.
