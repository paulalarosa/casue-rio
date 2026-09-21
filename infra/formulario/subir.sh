#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

FUNCAO=casue-rio-formulario
REGIAO=us-east-1

cp indice.mjs index.mjs
trap 'rm -f index.mjs pacote.zip' EXIT
rm -f pacote.zip
if command -v zip >/dev/null; then
  zip -q -j pacote.zip index.mjs regras.mjs
else
  powershell -NoProfile -Command "Compress-Archive -Path index.mjs,regras.mjs -DestinationPath pacote.zip -Force"
fi

aws lambda update-function-code \
  --function-name "$FUNCAO" \
  --zip-file fileb://pacote.zip \
  --region "$REGIAO" \
  --query '{tamanho:CodeSize,versao:Version}' \
  --output table
