"use client";

import { Car, Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { loginAction } from "@/core/usecases/authService";
import { useState, useTransition, useEffect } from "react";
import { AuthInput } from "@/presentation/components/molecules/AuthInput";
import { AuthButton } from "@/presentation/components/molecules/AuthButton";
import { AuthBanner } from "@/presentation/components/organisms/AuthBanner";

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("remembered_email");
    if (savedEmail) {
      setPrefilledEmail(savedEmail);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const remember = formData.get("remember") === "on";

    setErrorMsg(null);

    startTransition(async () => {
      const result = await loginAction(null, formData);
      if (result?.error) {
        setErrorMsg(result.error);
      } else if (result?.redirect) {
        // Handle persistence before redirect
        if (remember) {
          localStorage.setItem("remembered_email", email);
        } else {
          localStorage.removeItem("remembered_email");
        }
        window.location.href = "/inicio";
      }
    });
  };

  return (
    <main className="bg-[var(--color-surface-bg)] h-screen grid lg:grid-cols-2 overflow-hidden selection:bg-[var(--color-primary)] selection:text-[var(--color-primary-dark)]">

      {/* Left Section: Branding & Image (Desktop only) */}
      <AuthBanner
        imageSrc="https://images.unsplash.com/photo-1768965468641-39e87aa78a9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3ODc2NDd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBkZWFsZXJzaGlwJTIwZGFya3xlbnwxfDF8fHwxNzc1NzQ5ODU2fDA&ixlib=rb-4.1.0&q=80&w=2000"
      />

      {/* Right Section: Login Form */}
      <div className="relative flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 h-full overflow-y-auto lg:overflow-hidden">

        {/* Mobile Header (Visible only when Banner is hidden) */}
        <div className="lg:hidden flex flex-col items-center mb-8 text-center">
          <div className="rounded-2xl bg-[var(--color-primary)] p-3 mb-4 shadow-lg shadow-[var(--color-primary)]/20">
            <Car className="size-8 text-[var(--color-primary-dark)]" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Autosuz</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Gestión de Próxima Generación</p>
        </div>

        <div className="w-full max-w-lg lg:max-w-md space-y-10 bg-white/50 backdrop-blur-3xl border border-slate-100 p-8 sm:p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50">

          <div className="space-y-3">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Bienvenido <span className="text-[var(--color-primary)]">de nuevo.</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg">
              Ingresa tus credenciales para acceder al panel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                {errorMsg}
              </div>
            )}

            <div className="space-y-5">
              <AuthInput
                label="Correo electrónico"
                name="email"
                type="email"
                required
                defaultValue={prefilledEmail}
                key={prefilledEmail} // Force re-render when prefilledEmail is set
                placeholder="ejemplo@autocrm.com"
                icon={Mail}
              />

              <AuthInput
                label="Contraseña"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                icon={Lock}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-[var(--color-primary)] active:scale-90"
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" name="remember" className="peer sr-only" />
                  <div className="w-5 h-5 border-2 border-slate-300 rounded-md bg-slate-50 peer-checked:bg-[var(--color-primary)] peer-checked:border-[var(--color-primary)] transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                    <div className="w-2.5 h-1.5 border-l-2 border-b-2 border-white -rotate-45 mb-0.5" />
                  </div>
                </div>
                <span className="text-slate-500 text-sm font-bold group-hover:text-slate-900 transition-colors">
                  Recordarme
                </span>
              </label>
            </div>

            <AuthButton
              label="Iniciar Sesión"
              icon={LogIn}
              isLoading={isPending}
              type="submit"
            />
          </form>
        </div>
      </div>
    </main>
  );
}
