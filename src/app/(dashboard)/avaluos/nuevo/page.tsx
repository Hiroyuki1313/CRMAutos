import { getSession } from "@/core/usecases/authService";
import { redirect } from "next/navigation";
import { ChevronLeft, Car } from "lucide-react";
import Link from "next/link";
import AvaluoCreationForm from "@/presentation/components/organisms/AvaluoCreationForm";

export default async function NuevoAvaluoPage() {
    const session = await getSession();
    const role = session?.role as string;

    // Protección estricta: Solo Director
    if (role !== 'director') {
        redirect('/');
    }

    return (
        <div className="px-6 py-12 lg:px-12 lg:py-16">
            <div className="max-w-6xl mx-auto flex flex-col gap-10">
                
                {/* Header Section */}
                <div className="flex flex-col gap-6">
                    <Link 
                        href="/avaluos" 
                        className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors w-fit"
                    >
                        <div className="size-8 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                            <ChevronLeft className="size-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest mt-0.5">Volver a Avalúos</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="size-16 rounded-[1.5rem] bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-white/5 shadow-2xl">
                            <Car className="size-8 text-[var(--color-primary)]" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Nuevo Registro</h1>
                            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">Alta de Unidad y Evaluación Comercial</p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <AvaluoCreationForm />
            </div>
        </div>
    );
}
