'use client';

import { useState } from "react";
import { UserPlus, Loader2, CheckCircle2, Copy, AlertCircle, ShieldPlus } from "lucide-react";
import { registerUserAction } from "@/app/(dashboard)/inicio/actions";

export function UserCreationForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedPass, setGeneratedPass] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setGeneratedPass(null);

        const formData = new FormData(e.currentTarget);
        const res = await registerUserAction(formData);

        if (res.error) {
            setError(res.error);
        } else if (res.success && res.password) {
            setGeneratedPass(res.password);
            (e.target as HTMLFormElement).reset();
        }
        setLoading(false);
    }

    const copyToClipboard = () => {
        if (generatedPass) {
            navigator.clipboard.writeText(generatedPass);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 lg:p-10 flex flex-col gap-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <ShieldPlus className="size-32 text-[var(--color-primary)]" />
            </div>

            <div className="flex flex-col gap-1">
                <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3">
                    <UserPlus className="size-5" /> Reclutamiento & Staff
                </h3>
                <h2 className="text-white font-extrabold text-2xl lg:text-3xl tracking-tight">Crear Nueva <span className="text-[var(--color-primary)]">Cuenta</span></h2>
            </div>

            {!generatedPass ? (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-zinc-600 uppercase ml-1 tracking-widest">Nombre Completo</label>
                        <input 
                            name="nombre"
                            type="text" 
                            required
                            placeholder="Ej: Juan Pérez"
                            className="bg-zinc-950 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold outline-none text-white focus:border-[var(--color-primary)]/50 transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-zinc-600 uppercase ml-1 tracking-widest">Correo Electrónico</label>
                        <input 
                            name="email"
                            type="email" 
                            required
                            placeholder="juan@autosuz.com"
                            className="bg-zinc-950 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold outline-none text-white focus:border-[var(--color-primary)]/50 transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-zinc-600 uppercase ml-1 tracking-widest">Teléfono (Opcional)</label>
                        <input 
                            name="telefono"
                            type="tel" 
                            placeholder="449 123 4567"
                            className="bg-zinc-950 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold outline-none text-white focus:border-[var(--color-primary)]/50 transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-zinc-600 uppercase ml-1 tracking-widest">Rol Asignado</label>
                        <select 
                            name="rol"
                            required
                            className="bg-zinc-950 border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold outline-none text-white focus:border-[var(--color-primary)]/50 transition-all appearance-none cursor-pointer"
                        >
                            <option value="vendedor">Vendedor</option>
                            <option value="gerente">Gerente</option>
                            <option value="director">Director</option>
                            <option value="redes">Redes Sociales</option>
                            <option value="ti">TI / Sistemas</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 pt-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest p-4 rounded-xl mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="size-4" />
                                {error}
                            </div>
                        )}
                        <button 
                            disabled={loading}
                            className="w-full bg-[var(--color-primary)] text-[var(--color-primary-dark)] font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="size-5 animate-spin" /> : <><UserPlus className="size-5" /> Registrar Staff</>}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] p-8 flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500">
                    <div className="size-16 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                        <CheckCircle2 className="size-10 text-emerald-500" />
                    </div>
                    <div className="text-center">
                        <h4 className="text-white font-extrabold text-xl mb-1">¡Cuenta Creada con Éxito!</h4>
                        <p className="text-zinc-500 text-sm font-medium">Copia esta contraseña y entrégasela al usuario.</p>
                    </div>

                    <div className="bg-zinc-950 px-8 py-5 rounded-2xl border border-white/5 flex items-center gap-6 group/pass relative">
                        <span className="text-3xl font-black text-[var(--color-primary)] tracking-[0.3em] font-mono">
                            {generatedPass}
                        </span>
                        <button 
                            onClick={copyToClipboard}
                            className="p-3 bg-zinc-900 rounded-xl text-zinc-400 hover:text-white transition-colors"
                            title="Copiar contraseña"
                        >
                            {copied ? <CheckCircle2 className="size-5 text-emerald-500" /> : <Copy className="size-5" />}
                        </button>
                    </div>

                    <button 
                        onClick={() => setGeneratedPass(null)}
                        className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors mt-2"
                    >
                        Crear otro usuario
                    </button>
                </div>
            )}
        </div>
    );
}
