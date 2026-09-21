function mover(destino) {
  return {
    statusCode: 301,
    statusDescription: "Moved Permanently",
    headers: { location: { value: destino } },
  };
}

function handler(event) {
  var request = event.request;
  var uri = request.uri;

  var host = request.headers.host && request.headers.host.value;
  if (host && host.indexOf("www.") === 0) {
    return mover("https://" + host.slice(4) + uri);
  }

  if (uri === "/bairros" || uri === "/bairros/") {
    return mover("/imoveis/");
  }

  var bairro = uri.match(/^\/bairros\/([^/]+)\/?$/);
  if (bairro) {
    var apelido = decodeURIComponent(bairro[1])
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/%20/g, "-");
    if (apelido !== bairro[1]) {
      return mover("/bairros/" + apelido + "/");
    }
  }

  if (uri.endsWith("/")) {
    request.uri = uri + "index.html";
    return request;
  }

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
    return mover(destino);
  }

  return request;
}
