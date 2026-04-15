'use client';

import { useState, useTransition } from "react";
import { 
    X, 
    MessageCircle, 
    Clock, 
    Send, 
    Loader2, 
    CheckCircle2 
} from "lucide-react";
import { addApartadoCommentAction } from "@/app/(dashboard)/apartados/actions";
import { useRouter } from "next/navigation";

interface Comment {
    date: string;
    text: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    id_venta: number;
    initialComments: string;
}

export function CommentsModal({ isOpen, onClose, id_venta, initialComments }: Props) {
    const router = useRouter();
    const [newComment, setNewComment] = useState("");
    const [nextDate, setNextDate] = useState("");
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    let history: Comment[] = [];
    try {
        if (initialComments) {
            const parsed = JSON.parse(initialComments);
            history = Array.isArray(parsed) ? parsed : [{ date: new Date().toISOString(), text: initialComments }];
        }
    } catch {
        history = [{ date: new Date().toISOString(), text: initialComments || "Sin comentarios previos" }];
    }

    const handleAdd = () => {
        if (!newComment.trim()) return;
        setError(null);
        startTransition(async () => {
            const res = await addApartadoCommentAction(id_venta, newComment, nextDate || undefined);
            if (res.success) {
                setSuccess(true);
                setNewComment("");
                setNextDate("");
                router.refresh(); // Force sync
                setTimeout(() => {
                    setSuccess(false);
                }, 2000);
            } else {
                setError(res.error || "Error al guardar");
            }
        });
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
            
            <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <MessageCircle className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Historial de Seguimiento</h2>
                            <p className="text-[10px] text-slate-400 font-bold">Resumen de notas del vendedor</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200/50 rounded-xl transition-colors text-slate-400">
                        <X className="size-5" />
                    </button>
                </div>

                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Add Comment Input */}
                    <div className="flex flex-col gap-4">
                        <textarea 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escribe una nueva nota de seguimiento..."
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-5 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all min-h-[120px] resize-none shadow-sm"
                        />
                        
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            {/* Next Contact Date Picker */}
                            <div className="flex items-center gap-3 bg-slate-50 p-2 pl-4 rounded-2xl border border-slate-100 transition-all hover:border-indigo-100">
                                <div className="flex items-center gap-2">
                                    <Clock className="size-3.5 text-indigo-500" />
                                    <span className="text-[9px] font-black uppercase text-slate-400">Próximo Plazo</span>
                                </div>
                                <input 
                                    type="date" 
                                    value={nextDate}
                                    onChange={(e) => setNextDate(e.target.value)}
                                    className="bg-transparent text-[10px] font-bold text-slate-900 outline-none border-none p-2 w-[140px]"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                {isPending && <Loader2 className="size-4 animate-spin text-indigo-500" />}
                                <button 
                                    onClick={handleAdd}
                                    disabled={isPending || !newComment.trim()}
                                    className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${success ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-lg shadow-slate-200'}`}
                                >
                                    {success ? <CheckCircle2 className="size-4" /> : <Send className="size-4" />}
                                    {success ? 'Guardado' : 'Añadir Nota'}
                                </button>
                            </div>
                        </div>
                        {error && <p className="text-[10px] font-bold text-red-500 px-2">{error}</p>}
                    </div>

                    {/* Timeline */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] px-1">Comentarios Anteriores</h3>
                        <div className="space-y-4">
                            {history.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-xs font-bold text-slate-400 italic">No hay registros de seguimiento.</p>
                                </div>
                            ) : (
                                history.map((item, idx) => (
                                    <div key={idx} className="relative pl-8 group">
                                        {/* Line */}
                                        {idx !== history.length - 1 && (
                                            <div className="absolute left-[7px] top-6 bottom-[-24px] w-0.5 bg-slate-100" />
                                        )}
                                        {/* Dot */}
                                        <div className="absolute left-0 top-1.5 size-4 rounded-full border-2 border-white bg-indigo-500 shadow-sm z-10" />
                                        
                                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 group-hover:bg-white group-hover:border-indigo-100 transition-all shadow-sm">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2 text-indigo-500 font-black text-[9px] uppercase tracking-tighter">
                                                    <Clock className="size-3" />
                                                    {new Date(item.date).toLocaleDateString('es-MX', { 
                                                        day: '2-digit', 
                                                        month: 'long', 
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                            <p className="text-[11px] font-bold text-slate-700 leading-relaxed whitespace-pre-wrap">
                                                {item.text}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/30 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                        Cerrar Ventana
                    </button>
                </div>
            </div>
        </div>
    );
}
