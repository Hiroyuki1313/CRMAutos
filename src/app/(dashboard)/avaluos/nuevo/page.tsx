import { getSession } from "@/core/usecases/authService";
import { redirect } from "next/navigation";
import { ChevronLeft, Car } from "lucide-react";
import Link from "next/link";
import AvaluoCreationForm from "@/presentation/components/organisms/AvaluoCreationForm";

export default async function NuevoAvaluoPage() {
    const session = await getSession();
    const role = session?.role as string;

    // Protección estricta: Director y Gerencia
    if (role !== 'director' && role !== 'gerente') {
        redirect('/');
    }

    return (
        <div className="bg-white min-h-screen animate-in fade-in duration-700">
            <div className="px-6 py-12 lg:px-12 lg:py-16 max-w-6xl mx-auto flex flex-col gap-10">
                
                {/* Header Section */}
                <div className="flex flex-col gap-8">
                    <Link 
                        href="/avaluos" 
                        className="group flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-all w-fit"
                    >
                        <div className="size-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-white group-hover:border-[var(--color-primary)] transition-all shadow-sm active:scale-95">
                            <ChevronLeft className="size-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">Volver a Avalúos</span>
                    </Link>

                    <div className="flex items-center gap-6 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
                        <div className="size-20 rounded-[2rem] bg-white flex items-center justify-center border border-slate-200 shadow-xl shadow-slate-200/50">
                            <Car className="size-10 text-[var(--color-primary)]" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter">Nuevo Registro</h1>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Alta de Unidad y Evaluación Comercial</p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="animate-in slide-in-from-bottom-4 duration-1000">
                    <AvaluoCreationForm />
                </div>
            </div>
        </div>
    );
}
