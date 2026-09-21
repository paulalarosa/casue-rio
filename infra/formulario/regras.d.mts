export type Regra =
  | { tipo: "texto"; max: number }
  | { tipo: "lista"; opcoes: string[] }
  | { tipo: "varios"; max: number };

export type Campo = [chave: string, rotulo: string, regra: Regra, obrigatorio: boolean];

export type Formulario = { assunto: string; campos: Campo[] };

export type Resposta = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

export type Recado = { assunto: string; texto: string; respostaDe: string | null };

export type Lido = { erro: string; linhas?: undefined } | { erro?: undefined; linhas: string[]; respostaDe: string | null };

export type Exame =
  | { resposta: Resposta; origem?: undefined; recado?: undefined }
  | { resposta?: undefined; origem: string; recado: Recado };

export type Porteiro = (ip: string, agora: number) => boolean;

export declare const DESTINO: string;
export declare const REMETENTE: string;
export declare const FORMULARIOS: Record<"contato" | "busca" | "avaliacao", Formulario>;

export declare function limpar(valor: unknown, max: number): string;
export declare function responder(status: number, corpo: unknown, origem: string): Resposta;
export declare function criarPorteiro(): Porteiro;
export declare function ler(formulario: Formulario, entrada: Record<string, unknown>): Lido;
export declare function examinar(evento: unknown, passou: Porteiro, agora?: number): Exame;
