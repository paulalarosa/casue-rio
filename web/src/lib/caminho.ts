const PREFIXO = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function arquivo(caminho: string) {
  return `${PREFIXO}${caminho}`;
}
