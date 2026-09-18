import Image from "next/image";
import { Cena, type NomeCena } from "@/components/cenas";

export function Midia({
  foto,
  alt,
  cena,
  semente,
  ancora,
  panorama,
  rotulo,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  prioridade = false,
}: {
  foto?: string;
  alt?: string;
  cena: NomeCena;
  semente?: string;
  ancora?: "meio" | "base";
  panorama?: boolean;
  rotulo: string;
  className?: string;
  sizes?: string;
  prioridade?: boolean;
}) {
  if (foto) {
    return (
      <Image
        src={foto}
        alt={alt ?? rotulo}
        fill
        sizes={sizes}
        priority={prioridade}
        loading={prioridade ? undefined : "lazy"}
        className={`bg-tinta-100 object-cover ${className ?? ""}`}
      />
    );
  }
  return (
    <Cena
      nome={cena}
      semente={semente}
      ancora={ancora}
      panorama={panorama}
      rotulo={rotulo}
      className={`size-full ${className ?? ""}`}
    />
  );
}
