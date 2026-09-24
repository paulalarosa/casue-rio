export const GA = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const temMedicao = GA !== "";

export const CHAVE = "casue-medicao";

export const ID_DO_SCRIPT = "medicao-google";

export const ENDERECO_DO_SCRIPT = `https://www.googletagmanager.com/gtag/js?id=${GA}`;

export type Escolha = "sim" | "nao" | "nenhuma" | "indefinido";

const ouvintes = new Set<() => void>();

function avisar() {
  for (const f of ouvintes) f();
}

export function assinar(aoMudar: () => void) {
  ouvintes.add(aoMudar);
  window.addEventListener("storage", aoMudar);
  return () => {
    ouvintes.delete(aoMudar);
    window.removeEventListener("storage", aoMudar);
  };
}

export function lerEscolha(): Escolha {
  try {
    const v = window.localStorage.getItem(CHAVE);
    return v === "sim" || v === "nao" ? v : "nenhuma";
  } catch {
    return "nenhuma";
  }
}

export function lerNoServidor(): Escolha {
  return "indefinido";
}

function apagarCookiesDoGoogle() {
  try {
    const nomes = document.cookie
      .split(";")
      .map((c) => c.split("=")[0].trim())
      .filter((n) => n.startsWith("_ga") || n.startsWith("_gid"));

    const partes = location.hostname.split(".");
    const dominios = [
      "",
      location.hostname,
      `.${location.hostname}`,
      ...(partes.length > 2 ? [`.${partes.slice(-2).join(".")}`] : []),
    ];

    for (const nome of nomes) {
      for (const d of dominios) {
        document.cookie =
          `${nome}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/` +
          (d ? `; domain=${d}` : "");
      }
    }
  } catch {}
}

type Consentimento = Record<string, "granted" | "denied">;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function avisarConsentimento(aceitou: boolean) {
  const estado: Consentimento = {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: aceitou ? "granted" : "denied",
  };
  try {
    window.gtag?.("consent", "update", estado);
  } catch {}
}

export function carregarGoogle() {
  if (!temMedicao || document.getElementById(ID_DO_SCRIPT)) return;
  const s = document.createElement("script");
  s.id = ID_DO_SCRIPT;
  s.async = true;
  s.src = ENDERECO_DO_SCRIPT;
  document.head.appendChild(s);
}

export function gravarEscolha(v: "sim" | "nao") {
  avisarConsentimento(v === "sim");
  if (v === "sim") carregarGoogle();
  if (v === "nao") apagarCookiesDoGoogle();
  try {
    window.localStorage.setItem(CHAVE, v);
  } catch {}
  avisar();
}
