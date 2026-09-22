const FICHA = process.env.NEXT_PUBLIC_CF_ANALYTICS ?? "";

export function Audiencia() {
  if (!FICHA) return null;

  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: FICHA })}
    />
  );
}
