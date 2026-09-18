/* CloudFront Function, no evento viewer-request.

   🔴 ESTA FUNÇÃO NÃO É OPCIONAL, e o motivo é uma diferença real entre o
   GitHub Pages e o S3. O site é exportado com `trailingSlash: true`, então
   cada rota vira uma pasta com `index.html` dentro:

     out/imoveis/index.html
     out/bairros/Tijuca/index.html

   O Pages resolve índice de diretório em qualquer profundidade. O S3 servido
   por CloudFront com acesso de origem NÃO resolve: o `DefaultRootObject` vale
   só para a raiz. Sem esta função, a home abre e TODAS as outras páginas dão
   403, que é o erro mais assustador possível num lançamento, porque o site
   parece no ar e não está.

   Duas coisas, então:

   1. caminho terminado em "/" recebe "index.html" no fim;
   2. caminho sem barra e sem extensão é REDIRECIONADO para a versão com
      barra, com 301. Redirecionar em vez de servir direto é o que mantém um
      endereço canônico só: o site inteiro linka com barra, e o buscador não
      pode achar que /imoveis e /imoveis/ são duas páginas com o mesmo texto.

   Arquivo com extensão passa intocado, que é o caso de todo vídeo, imagem,
   fonte e pacote JavaScript. */
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.endsWith("/")) {
    request.uri = uri + "index.html";
    return request;
  }

  /* Só o ÚLTIMO trecho do caminho conta para decidir se há extensão. Um
     ponto no meio do caminho, como em /bairros/zona.sul/, não faz do final
     um arquivo. */
  var ultimo = uri.substring(uri.lastIndexOf("/") + 1);
  if (ultimo.indexOf(".") === -1) {
    var destino = uri + "/";
    if (request.querystring) {
      var partes = [];
      for (var chave in request.querystring) {
        partes.push(chave + "=" + request.querystring[chave].value);
      }
      if (partes.length) destino = destino + "?" + partes.join("&");
    }
    return {
      statusCode: 301,
      statusDescription: "Moved Permanently",
      headers: { location: { value: destino } },
    };
  }

  return request;
}
