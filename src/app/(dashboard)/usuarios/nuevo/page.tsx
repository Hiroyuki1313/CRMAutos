import { getSession } from "@/core/usecases/authService";
import { redirect } from "next/navigation";
import { UserCreationForm } from "@/presentation/components/organisms/UserCreationForm";
import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";

export default async function NewUserPage() {
    const session = await getSession();
    const role = session?.role as string;

    // Solo el director puede añadir nuevas cuentas
    if (role !== 'director') {
        redirect("/inicio");
    }

    return (
        <div className="px-6 py-12 lg:px-12 lg:py-16 min-h-screen bg-black/20">
            <div className="max-w-4xl mx-auto flex flex-col gap-12">
                
                {/* Header Contextual */}
                <div className="flex flex-col gap-6">
                    <Link 
                        href="/inicio" 
                        className="w-fit flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group text-sm font-bold uppercase tracking-widest"
                    >
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" /> 
                        Volver al Panel
                    </Link>
                    
                    <div className="flex justify-between items-end border-b border-white/5 pb-8">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3 text-[var(--color-primary)] mb-1">
                                <UserPlus className="size-6" />
                                <span className="text-xs font-black uppercase tracking-[0.4em]">Administración de Staff</span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-none">
                                Crear Nuevo <span className="text-[var(--color-primary)]">Usuario</span>
                            </h1>
                            <p className="text-zinc-500 font-medium text-lg max-w-xl mt-2 leading-relaxed">
                                Configura una nueva cuenta para tu equipo. El sistema generará una contraseña segura automáticamente.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Formulario Section */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <UserCreationForm />
                </div>

                {/* Info Card */}
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-6 flex gap-5 items-start">
                    <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                        <span className="text-blue-500 font-bold text-lg">!</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h4 className="text-blue-400 font-bold">Privacidad y Seguridad</h4>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            Al crear una cuenta, el usuario tendrá acceso a las herramientas del CRM según su rol asignado. 
                            Asegúrate de copiar la contraseña generada al finalizar el proceso.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
