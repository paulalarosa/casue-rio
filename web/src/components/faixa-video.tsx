import { type StaticImageData } from "next/image";
import { VideoFundo } from "@/components/video-fundo";
import { cn } from "@/lib/utils";

/* Faixa de largura total com vídeo no fundo e conteúdo por cima. Quem cuida
   do vídeo, do pôster e de quem pediu menos movimento é o `VideoFundo`; aqui
   sobra só a forma da faixa, que é o que muda de um lugar para outro. */
export function FaixaVideo({
  fonte,
  poster,
  children,
  className,
  altura = "min-h-[26rem] sm:min-h-[34rem]",
  veu = "linear-gradient(to top, rgba(10,10,9,.82), rgba(10,10,9,.42) 60%, rgba(10,10,9,.62))",
}: {
  fonte: string;
  poster: StaticImageData;
  children: React.ReactNode;
  className?: string;
  altura?: string;
  veu?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden bg-tinta-900", altura, className)}>
      <VideoFundo fonte={fonte} poster={poster} />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: veu }} />
      <div className="trilho relative flex h-full min-h-[inherit] flex-col items-center justify-center py-20 text-center">
        {children}
      </div>
    </section>
  );
}
