#!/usr/bin/env bash
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
