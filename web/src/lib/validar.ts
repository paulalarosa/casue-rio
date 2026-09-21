export type Erros = Record<string, string>;

const EMAIL = /^[^\s@,;]+@[^\s@,;]+\.[a-z]{2,}$/i;

export function pedirNome(valor: string, erros: Erros) {
  if (valor.trim().length < 2) erros.nome = "Diga como a gente te chama.";
}

export function pedirTelefone(valor: string, erros: Erros) {
  const digitos = valor.replace(/\D/g, "").length;
  if (!valor.trim()) erros.telefone = "Sem isto a gente não tem como ligar.";
  else if (digitos < 10) erros.telefone = "Escreva o número com DDD.";
}

export function conferirEmail(valor: string, erros: Erros, obrigatorio = false) {
  const limpo = valor.trim();
  if (!limpo) {
    if (obrigatorio) erros.email = "Sem isto a gente não tem como responder.";
    return;
  }
  if (!EMAIL.test(limpo)) erros.email = "Esse e-mail não parece completo.";
}

export function pedirConsentimento(marcado: boolean, erros: Erros) {
  if (!marcado)
    erros.consentimento = "Precisa autorizar o contato para a gente responder.";
}

export function pedirFicha(ficha: string, exigida: boolean, erros: Erros) {
  if (exigida && !ficha) {
    erros.ficha = "Falta a confirmação de que você não é um robô. Aguarde um instante.";
  }
}

export function focarPrimeiroErro() {
  const alvo = document.querySelector<HTMLElement>("[aria-invalid='true']");
  alvo?.focus();
  alvo?.scrollIntoView({ block: "center", behavior: "smooth" });
}
