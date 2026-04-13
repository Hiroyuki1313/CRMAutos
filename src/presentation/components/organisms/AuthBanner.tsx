import { Car } from "lucide-react";
import Image from "next/image";

interface AuthBannerProps {
  imageSrc: string;
}

/**
 * @name AuthBanner
 * @description The visual segment of the authentication layout.
 * Provides branding and atmospheric depth through gradients and high-quality imagery.
 */
export const AuthBanner = ({ imageSrc }: AuthBannerProps) => {
  return (
    <div className="relative hidden lg:flex flex-col h-full w-full overflow-hidden">
      {/* Background Image */}
      <Image
        alt="Luxury automotive experience"
        className="object-cover absolute inset-0 w-full h-full scale-105"
        src={imageSrc}
        fill
        priority
      />

      {/* Dynamic Overlays */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(135deg, rgba(18, 1, 36, 0.8) 0%, rgba(36, 1, 72, 0.4) 50%, rgba(0, 0, 0, 0) 100%)",
        }}
      />

      {/* Branding & Content */}
      <div className="relative z-20 flex flex-col h-full p-16 justify-between text-white">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-[var(--color-primary)] p-3 shadow-2xl shadow-[var(--color-primary)]/20">
            <Car className="size-10 text-[var(--color-primary-dark)]" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4">Autosuz</h2>
        </div>

        <div className="max-w-xl space-y-6">
          <h2 className="text-6xl font-extrabold leading-[1.1] tracking-tighter">
            Elevando la gestión <br />
            <span className="text-[var(--color-primary)]">Automotriz.</span>
          </h2>
          <p className="text-xl text-neutral-300 font-medium leading-relaxed">
            Plataforma inteligente diseñada para transformar cada interacción en una oportunidad de éxito para tu concesionaria.
          </p>

          <div className="flex gap-8 pt-6">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-[var(--color-primary)]">100%</span>
              <span className="text-sm text-neutral-400 font-semibold uppercase tracking-widest">Digital</span>
            </div>
            <div className="w-[1px] bg-white/20 h-12" />
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-[var(--color-primary)]">RealTime</span>
              <span className="text-sm text-neutral-400 font-semibold uppercase tracking-widest">Analytics</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-neutral-500 font-medium">
          © 2026 AutoCRM Solutions. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};
