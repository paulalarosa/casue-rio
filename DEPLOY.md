# Publicar

Aqui a publicação é automática. Empurrar na `main` publica. Não há comando
para rodar na sua máquina.

| | |
| --- | --- |
| Onde está | Cloudflare Pages, projeto `casuerio` |
| Conta | `88b931de85808fe2a341c083ccbad9ba` |
| Domínios | `casuerio.com.br`, `www.casuerio.com.br`, `casuerio.pages.dev` |
| DNS | zona na Cloudflare, servidores `apollo` e `aria` |
| Quem publica | `.github/workflows/publicar.yml` |
| Desde | 22/09/2026. Antes era S3 + CloudFront |

O projeto no Pages é **direct upload**. Quem envia é o fluxo do GitHub, com o
wrangler em versão fixa; o Pages não está ligado ao repositório por conta
própria.

## Os quatro gatilhos

| gatilho | quando |
| --- | --- |
| `push` na `main` | sempre que alguém empurra código |
| `repository_dispatch` tipo `conteudo` | webhook do Sanity, quando publicam um texto |
| `schedule`, a cada quinze minutos | só republica se um artigo marcado para o futuro venceu a hora |
| `workflow_dispatch` | à mão, pelo botão do GitHub ou `gh workflow run publicar.yml` |

Quem decide no agendado é `.github/scripts/venceu.sh`: ele conta os artigos já
publicados no Sanity e compara com quantos `/revista/` aparecem no
`sitemap.xml` do site. Se não conseguir ler as duas pontas, **fica quieto** e
não publica. Isso é de propósito: melhor não publicar do que publicar às cegas.

Nos outros três gatilhos ele nem roda, publica direto.

## O que o fluxo faz

1. **painel**: `npm ci` e `typecheck` no `estudio/` (o Sanity Studio).
2. **decidir**: o `venceu.sh` acima, só no agendado.
3. **publicar**, dentro de `web/`:
   - `npm ci`
   - `node scripts/sem-comentarios.mjs --exigir` no repositório inteiro
   - `format:check`, `lint`, `typecheck`, `test`
   - `npm run build`, com as variáveis do repositório
   - guarda as peças de Instagram de `web/cards/` como artefato, 90 dias
   - `wrangler pages deploy out --project-name=casuerio`

O `web/functions/` sobe junto e vira a função do formulário, na mesma origem
do site.

## Variáveis e segredo

Ficam no repositório, em Settings. Medido em 23/09/2026:

| nome | para quê |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | liga o passo do Pages. **Vazio desliga a publicação** |
| `SANITY_PROJECT_ID`, `SANITY_DATASET` | painel e build |
| `SITE_URL` | usado pelo `venceu.sh` e pelo build |
| `GA_ID`, `CF_ANALYTICS`, `TURNSTILE_KEY` | medição e o anti-robô do formulário |
| `AWS_ROLE_ARN`, `CLOUDFRONT_ID` | só o caminho de volta, ver abaixo |

Um segredo: `CLOUDFLARE_API_TOKEN`.

## 🔴 O fluxo ainda escreve na AWS

`AWS_ROLE_ARN` e `CLOUDFRONT_ID` **continuam preenchidas**. Os passos da AWS
são condicionados a elas existirem, então hoje toda publicação também
sincroniza o `casuerio-site-prod` e invalida o CloudFront `EXP9HRVUWH2GF`,
depois de já ter publicado no Pages.

Isso não afeta quem visita: desde 22/09 o site não é servido de lá. É rede de
segurança, e custa alguns segundos por publicação.

**Apagar as duas variáveis desliga esses passos**, sem tocar no arquivo do
fluxo. É o que está previsto para quando a limpeza da AWS acontecer.

## Conferir depois

```bash
curl -sI https://casuerio.com.br/ | grep -iE "server|via|x-frame|strict-transport|referrer|x-content"
```

Tem que aparecer `Server: cloudflare` e **nenhum** `via: ... cloudfront`, mais
os quatro cabeçalhos de segurança. Conferido em 23/09: os quatro estão no ar.

Para texto publicado no Sanity, o caminho mais curto é abrir o
`sitemap.xml` e ver se o artigo entrou.

## Hospedagem, domínio e e-mail

Tudo na Cloudflare desde 22/09/2026.

| peça | onde |
| --- | --- |
| DNS | zona `casuerio.com.br`, servidores `apollo` e `aria` |
| site | Pages, projeto `casuerio`, domínio e `www` anexados |
| cabeçalhos | `web/public/_headers`: segurança em `/*`, imutável em `_next/static` |
| redirecionamentos | `web/public/_redirects`: `/bairros` e bairro com maiúscula ou espaço |
| `www` para o ápice | Regra de Redirecionamento na zona, 301 com a query junto |
| caixa de e-mail | Zoho (`mx.zoho.com`), das donas |
| e-mail do formulário | Resend, domínio `casuerio.com.br`, pelo subdomínio `send.` |

🔴 O `_redirects` do Pages **ignora regra com host** quando o domínio está no
mesmo projeto. Por isso o `www` mora na zona, não no arquivo.

🔴 O `_headers` **soma** as regras que casam. Cache-Control só na exceção
(`_next/static`); o padrão do Pages para página já é `max-age=0, must-revalidate`.

## Se precisar voltar para a AWS

Nada foi apagado:

- distribuição CloudFront `EXP9HRVUWH2GF`
- balde `casuerio-site-prod`, que continua recebendo cada publicação
- registros de DNS de antes em `Downloads/_pages-config/volta-casuerio.txt`

Como o balde continua atualizado, voltar é só apontar o DNS. 🔴 O formulário
não volta junto: ele hoje é função do Pages. A versão em Lambda está em
`infra/formulario/`, também à espera de ser apagada.
