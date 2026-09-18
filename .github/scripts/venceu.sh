#!/usr/bin/env bash
# Vale a pena republicar o site agora?
#
# 🔴 ESTE ARQUIVO EXISTE FORA DO YAML DE PROPÓSITO. A primeira versão morava
# dentro do `run:` do fluxo, e eu só descobri que ela estava quebrada porque
# a extraí para rodar à mão. Script dentro de YAML não tem como ser testado
# sem publicar, e "publicar para testar" é como um erro de uma linha vira
# quatro tentativas vermelhas no histórico.
#
# A pergunta é uma só: o painel tem mais artigos com a hora vencida do que o
# site tem no ar? O sitemap responde pelo site, e serve bem porque é gerado
# da MESMA consulta que monta as páginas. Comparar as duas pontas é exato e
# não guarda estado nenhum entre uma execução e outra.
#
# Escreve `precisa=true|false` em $GITHUB_OUTPUT.
set -euo pipefail

: "${PROJETO:?falta PROJETO}"
: "${CONJUNTO:?falta CONJUNTO}"
: "${SITE:?falta SITE}"
SAIDA="${GITHUB_OUTPUT:-/dev/stdout}"

decidir() {
  echo "precisa=$1" >> "$SAIDA"
  exit 0
}

AGORA=$(date -u +%Y-%m-%dT%H:%M:%SZ)
CONSULTA="count(*[_type == \"artigo\" && defined(slug.current) && data <= \"$AGORA\"])"

# 🔴 Todo `curl` sai com `|| true`. Sem isso o `pipefail` derruba o script
# inteiro na primeira falha de rede, e o trabalho aparece VERMELHO no
# histórico por causa de uma conferência que simplesmente não tinha o que
# conferir. Falha de rede aqui não é erro, é motivo para não fazer nada.
PAINEL=$(curl -sf --get \
  "https://$PROJETO.api.sanity.io/v2026-09-01/data/query/$CONJUNTO" \
  --data-urlencode "query=$CONSULTA" || true)
SITEMAP=$(curl -sf "$SITE/sitemap.xml" || true)

if [ -z "$PAINEL" ] || [ -z "$SITEMAP" ]; then
  echo "não consegui ler as duas pontas. Fico quieto."
  decidir false
fi

NO_PAINEL=$(printf '%s' "$PAINEL" | node -e \
  "let e='';process.stdin.on('data',c=>e+=c).on('end',()=>{const r=JSON.parse(e).result;process.stdout.write(typeof r==='number'?String(r):'')})" || true)

# 🔴 `grep -c` sem correspondência devolve 0 na tela e 1 no código de saída,
# e "nenhum artigo no ar" é o estado normal de um site que ainda não tem
# artigo. Sem o `|| true`, o dia mais comum do projeto derrubaria a tarefa.
#
# O `[^<]\+` depois de `/revista/` é o que separa o artigo da página da
# revista: `<loc>.../revista/</loc>` não casa, porque não sobra caractere
# nenhum antes do fecho.
NO_SITE=$(printf '%s' "$SITEMAP" | grep -c "<loc>[^<]*/revista/[^<]\+</loc>" || true)

echo "vencidos no painel: ${NO_PAINEL:-?} · no ar: ${NO_SITE:-?}"

if [ -z "$NO_PAINEL" ]; then
  echo "o painel respondeu o que eu não esperava. Fico quieto."
  decidir false
fi

if [ "$NO_PAINEL" != "$NO_SITE" ]; then
  echo "as pontas discordam: republicando."
  decidir true
fi

echo "nada vencido."
decidir false
