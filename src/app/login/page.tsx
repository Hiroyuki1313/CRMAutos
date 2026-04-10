"use client";

import { Car, Check, EyeOff, Fingerprint, Lock, LogIn, Mail, Smartphone } from "lucide-react";
import { loginAction } from "@/core/usecases/authService";
import { useState, useTransition } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setErrorMsg(null);

    startTransition(async () => {
      const result = await loginAction(null, formData);
      if (result?.error) {
        setErrorMsg(result.error);
      } else if (result?.redirect) {
        // Simple hard re-route on successful login so Middleware takes over smoothly
        window.location.href = "/";
      }
    });
  };

  return (
    <div className="bg-[var(--color-surface-bg)] text-[var(--color-text-main)] w-full min-h-screen overflow-hidden">
      <div className="relative w-full h-screen">
        <Image
          alt="Luxury car"
          className="object-cover absolute inset-0 w-full h-full"
          src="https://images.unsplash.com/photo-1768965468641-39e87aa78a9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBkZWFsZXJzaGlwJTIwZGFya3xlbnwxfDF8fHwxNzc1NzQ5ODU2fDA&ixlib=rb-4.1.0&q=80&w=400"
          fill
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(36, 1, 72, 0.3) 0%, rgba(36, 1, 72, 0.85) 40%, rgba(18, 1, 36, 1) 60%, var(--color-surface-bg) 100%)",
          }}
        />
        
        <div className="relative flex p-8 flex-col h-full justify-center items-center z-10 w-full max-w-md mx-auto">
          <div className="flex flex-col justify-center items-center gap-2 mb-12">
            <div className="rounded-2xl bg-[var(--color-primary)] flex justify-center items-center w-16 h-16 shadow-lg shadow-[var(--color-primary)]/20">
              <Car className="size-8 text-[var(--color-primary-dark)]" />
            </div>
            <h1 className="font-bold text-[var(--color-text-main)] text-3xl leading-8 tracking-tight mt-2">
              AutoCRM
            </h1>
            <p className="text-[var(--color-text-muted)] text-sm leading-5">
              Gestión inteligente de tu concesionaria
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex pb-8 flex-col gap-6 w-full">
            <div className="flex flex-col gap-1">
              <h2 className="font-semibold text-neutral-50 text-xl leading-7">
                Iniciar Sesión
              </h2>
              <p className="text-[#9f9fa9] text-sm leading-5">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/50 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-[#9f9fa9] text-sm leading-5">
                  Correo electrónico
                </label>
                <div className="rounded-xl bg-[var(--color-card-bg)] border-white/10 border flex p-4 items-center gap-3 transition-colors focus-within:border-[var(--color-primary)]">
                  <Mail className="size-5 text-[#9f9fa9]" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="tu@correo.com"
                    className="bg-transparent outline-none flex-1 text-neutral-50 placeholder:text-zinc-600 w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-[#9f9fa9] text-sm leading-5">
                  Contraseña
                </label>
                <div className="rounded-xl bg-[var(--color-card-bg)] border-white/10 border flex p-4 items-center gap-3 transition-colors focus-within:border-[var(--color-primary)]">
                  <Lock className="size-5 text-[#9f9fa9]" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    className="bg-transparent outline-none flex-1 text-neutral-50 placeholder:text-zinc-600 w-full"
                  />
                  <EyeOff className="size-5 text-[#9f9fa9] cursor-pointer hover:text-white transition-colors" />
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="rounded-sm bg-zinc-800 border-white/10 border flex justify-center items-center w-5 h-5">
                    <Check className="size-4 text-[var(--color-primary)] opacity-0" />
                  </div>
                  <span className="text-[#9f9fa9] text-xs leading-4 select-none">
                    Recordarme
                  </span>
                </label>
                <span className="font-medium text-[var(--color-primary)] text-xs leading-4 cursor-pointer hover:underline">
                  ¿Olvidaste tu contraseña?
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="font-semibold rounded-xl bg-[var(--color-primary)] hover:bg-[#ffe040] disabled:opacity-50 transition-colors text-[var(--color-primary-dark)] text-base flex items-center justify-center gap-2 p-4 w-full"
            >
              <LogIn className="size-5" />
              {isPending ? "Validando..." : "Iniciar Sesión"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
