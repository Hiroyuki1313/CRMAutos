'use client';

import { useState } from "react";
import { 
    MessageCircle, 
    Phone, 
    Building2, 
    Car, 
    FileText, 
    Info, 
    AlertTriangle,
    Loader2,
    CheckCircle2,
    Thermometer
} from "lucide-react";
import { updateClientBitacoraAction, deleteLastClientCommentAction } from "../actions";

interface Props {
    clientId: number;
    initialComentarios: string;
    initialProbabilidad: 'frio' | 'tibio' | 'caliente';
    role?: string;
}

export function ClientBitacora({ clientId, initialComentarios, initialProbabilidad, role }: Props) {
    const [comentarios, setComentarios] = useState("");
    const [tipoAccion, setTipoAccion] = useState<string>("");
    const [probabilidad, setProbabilidad] = useState(initialProbabilidad);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Parse historial
    let historial: any[] = [];
    try {
        if (initialComentarios) {
            const parsed = JSON.parse(initialComentarios);
            historial = Array.isArray(parsed) ? parsed : [{ text: initialComentarios, user: 'Sistema', date: new Date() }];
        }
    } catch {
        historial = [{ text: initialComentarios || "Sin notas previas", user: 'Sistema', date: new Date() }];
    }

    async function handleSave() {
        if (!tipoAccion) {
            setError("Selecciona el tipo de acción.");
            return;
        }
        if (!comentarios.trim()) {
            setError("Escribe un comentario.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await updateClientBitacoraAction(clientId, {
                comentarios_vendedor: comentarios,
                tipo_accion: tipoAccion,
                probabilidad: probabilidad
            });
            if (res.error) {
                setError(res.error);
            } else {
                setSuccess(true);
                setComentarios("");
                setTipoAccion("");
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch {
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Probabilidad Selector */}
            <div className="flex flex-col gap-3">
                <h3 className="text-[11px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                    <Thermometer className="size-4" /> Probabilidad de Venta
                </h3>
                <div className="grid grid-cols-3 gap-2">
                    <ActionButton 
                        active={probabilidad === 'frio'} 
                        onClick={() => setProbabilidad('frio')} 
                        label="Frío" 
                        activeClass="bg-blue-600 text-white border-transparent"
                        normalClass="bg-zinc-900 text-blue-400 border-white/5"
                    />
                    <ActionButton 
                        active={probabilidad === 'tibio'} 
                        onClick={() => setProbabilidad('tibio')} 
                        label="Tibio" 
                        activeClass="bg-yellow-500 text-yellow-950 border-transparent"
                        normalClass="bg-zinc-900 text-yellow-500 border-white/5"
                    />
                    <ActionButton 
                        active={probabilidad === 'caliente'} 
                        onClick={() => setProbabilidad('caliente')} 
                        label="Caliente" 
                        activeClass="bg-red-600 text-white border-transparent"
                        normalClass="bg-zinc-900 text-red-500 border-white/5"
                    />
                </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col gap-3">
                <h3 className="text-[11px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                    <MessageCircle className="size-4" /> Registrar Nota de Seguimiento
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-1">
                    <TypeButton active={tipoAccion === 'Llamada'} onClick={() => setTipoAccion('Llamada')} icon={<Phone className="size-3" />} label="Llamada" />
                    <TypeButton active={tipoAccion === 'WhatsApp'} onClick={() => setTipoAccion('WhatsApp')} icon={<MessageCircle className="size-3" />} label="WhatsApp" />
                    <TypeButton active={tipoAccion === 'Visita'} onClick={() => setTipoAccion('Visita')} icon={<Building2 className="size-3" />} label="Visita" />
                    <TypeButton active={tipoAccion === 'Demo'} onClick={() => setTipoAccion('Demo')} icon={<Car className="size-3" />} label="Demo" />
                    <TypeButton active={tipoAccion === 'Tramite'} onClick={() => setTipoAccion('Tramite')} icon={<FileText className="size-3" />} label="Trámite" />
                    <TypeButton active={tipoAccion === 'Otro'} onClick={() => setTipoAccion('Otro')} icon={<Info className="size-3" />} label="Otro" />
                </div>

                <textarea 
                    value={comentarios}
                    onChange={e => setComentarios(e.target.value)}
                    className="w-full bg-zinc-900 border-2 border-dashed border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-[var(--color-primary)] transition-all text-neutral-50 resize-none min-h-[100px]"
                    placeholder={tipoAccion ? `Escribe detalles de la ${tipoAccion}...` : "Selecciona una acción arriba..."}
                />

                <button 
                    onClick={handleSave}
                    disabled={loading}
                    className={`w-full py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${success ? 'bg-green-600 text-white' : 'bg-[var(--color-primary)] text-[var(--color-primary-dark)] active:scale-95'}`}
                >
                    {loading ? <Loader2 className="size-4 animate-spin" /> : success ? <><CheckCircle2 className="size-4" /> Registrado</> : "Guardar Seguimiento"}
                </button>
                {error && <p className="text-red-500 text-[10px] font-bold text-center">{error}</p>}
            </div>

            {/* Historial */}
            <div className="flex flex-col gap-4">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Historial de Bitácora</h4>
                <div className="flex flex-col gap-3">
                    {historial.map((item, index) => (
                        <div key={index} className="bg-zinc-900/40 rounded-2xl p-4 border border-white/5 relative group">
                             <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${item.tipo_accion === 'Llamada' ? 'bg-blue-500/20 text-blue-400' : item.tipo_accion === 'WhatsApp' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-400'}`}>
                                        {item.tipo_accion || 'Nota'}
                                    </div>
                                    <span className="text-[11px] font-bold text-zinc-300">by {item.user || 'Sist.'}</span>
                                </div>
                                <span className="text-[10px] font-medium text-zinc-500">
                                    {new Date(item.date).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-xs text-zinc-400 italic">"{item.text}"</p>

                            {index === 0 && ['gerente', 'director', 'ti'].includes(role || '') && (
                                <button 
                                    onClick={async () => {
                                        if(confirm('¿Borrar último comentario?')) {
                                            await deleteLastClientCommentAction(clientId);
                                        }
                                    }}
                                    className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <AlertTriangle className="size-3.5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ActionButton({ active, onClick, label, activeClass, normalClass }: any) {
    return (
        <button 
            onClick={onClick}
            className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${active ? activeClass : normalClass}`}
        >
            {label}
        </button>
    );
}

function TypeButton({ active, onClick, icon, label }: any) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${active ? 'bg-zinc-100 text-zinc-950 border-transparent shadow-lg' : 'bg-zinc-900 text-zinc-500 border-white/5'}`}
        >
            {icon}
            {label}
        </button>
    );
}
