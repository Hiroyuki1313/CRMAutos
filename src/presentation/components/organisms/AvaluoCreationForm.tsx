'use client';

import { useState } from 'react';
import { 
    Car, 
    Calendar, 
    MapPin, 
    Search, 
    Plus, 
    X, 
    Image as ImageIcon, 
    DollarSign, 
    FileText,
    ArrowRight,
    Loader2,
    ShieldCheck,
    Upload,
    CheckCircle2
} from 'lucide-react';
import { createAvaluoAction } from '@/app/(dashboard)/avaluos/actions';

export default function AvaluoCreationForm() {
    const [pending, setPending] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<{ file: File; id: string; preview: string }[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                file,
                id: Math.random().toString(36).substr(2, 9),
                preview: URL.createObjectURL(file)
            }));
            setSelectedFiles(prev => [...prev, ...newFiles]);
        }
        // Reset input to allow selecting same file again if needed
        e.target.value = '';
    };

    const removeFile = (id: string, previewUrl: string) => {
        setSelectedFiles(prev => prev.filter(f => f.id !== id));
        URL.revokeObjectURL(previewUrl);
    };

    async function handleSubmit(formData: FormData) {
        setPending(true);
        try {
            // Limpiar cualquier entrada previa de fotos si existiera
            formData.delete('fotos');
            // Agregar cada archivo al FormData
            selectedFiles.forEach(f => {
                formData.append('fotos', f.file);
            });
            await createAvaluoAction(formData);
        } catch (error) {
            console.error(error);
            setPending(false);
        }
    }

    return (
        <form action={handleSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Vehículo Section */}
                <div className="flex flex-col gap-6 bg-white/60 p-8 rounded-[2.5rem] border border-slate-200 backdrop-blur-xl shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="size-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center border border-[var(--color-primary)]/20">
                            <Car className="size-5 text-[var(--color-primary)]" />
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Datos del Vehículo</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Marca</label>
                            <input 
                                required
                                name="marca"
                                placeholder="Ej: Toyota"
                                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all placeholder:text-slate-400 font-bold text-slate-900"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Modelo</label>
                            <input 
                                required
                                name="modelo"
                                placeholder="Ej: Corolla"
                                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all placeholder:text-slate-400 font-bold text-slate-900"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Año</label>
                            <select 
                                name="anio"
                                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all font-bold appearance-none text-slate-900"
                            >
                                {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() + 1 - i).map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Carrocería</label>
                            <select 
                                name="tipo"
                                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all font-bold appearance-none text-slate-900"
                            >
                                <option value="sedan">Sedán</option>
                                <option value="suv">SUV</option>
                                <option value="hatchback">Hatchback</option>
                                <option value="camion">Camión</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Versión</label>
                            <input 
                                name="version"
                                placeholder="Ej: SE"
                                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all placeholder:text-slate-400 font-bold text-slate-900"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">KM</label>
                            <input 
                                name="kilometraje"
                                type="number"
                                placeholder="0"
                                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all placeholder:text-slate-400 font-bold text-slate-900"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Dueños</label>
                            <input 
                                name="numero_duenos"
                                type="number"
                                defaultValue="1"
                                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all font-bold text-slate-900"
                            />
                        </div>
                    </div>

                    {/* Fotos Section */}
                    <div className="flex flex-col gap-4 mt-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1 flex items-center gap-2">
                            <ImageIcon className="size-3" /> Fotos del Vehículo (Múltiples)
                        </label>
                        
                        <div className="relative group">
                            <input 
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center group-hover:border-[var(--color-primary)]/30 transition-all">
                                <Plus className="size-6 text-slate-400 mx-auto mb-2" />
                                <span className="text-xs font-bold text-slate-500">Haz clic o arrastra fotos aquí</span>
                            </div>
                        </div>
                        
                        {selectedFiles.length > 0 && (
                            <div className="grid grid-cols-4 gap-3">
                                {selectedFiles.map(f => (
                                    <div key={f.id} className="relative group aspect-square">
                                        <img 
                                            src={f.preview} 
                                            className="w-full h-full object-cover rounded-xl border border-white/10" 
                                            alt="Preview"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => removeFile(f.id, f.preview)}
                                            className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-red-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X className="size-3 text-white" />
                                        </button>
                                        {selectedFiles.indexOf(f) === 0 && (
                                            <div className="absolute bottom-1 left-1 bg-blue-500 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md text-white">
                                                Principal
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Avalúo Section */}
                <div className="flex flex-col gap-6 bg-white/60 p-8 rounded-[2.5rem] border border-slate-200 backdrop-blur-xl shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="size-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center border border-[var(--color-primary)]/20">
                            <DollarSign className="size-5 text-[var(--color-primary)]" />
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Detalles del Avalúo</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Ubicación</label>
                            <select 
                                name="ubicacion"
                                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all font-bold appearance-none text-slate-900"
                            >
                                <option value="Chihuahua">Chihuahua</option>
                                <option value="Juárez">Juárez</option>
                                <option value="Saltillo">Saltillo</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Origen Pros.</label>
                            <select 
                                name="origen_prospeccion"
                                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all font-bold appearance-none text-slate-900"
                            >
                                <option value="redes sociales">Redes Sociales</option>
                                <option value="cartera">Cartera</option>
                                <option value="prospeccion">Prospección</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Oferta Compra</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                                <input 
                                    name="oferta"
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-8 text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all font-bold tabular-nums text-slate-900"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Precio Venta Est.</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                                <input 
                                    name="venta"
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-8 text-sm focus:border-emerald-500/50 outline-none transition-all font-bold tabular-nums text-slate-900"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Comentario Histórico Inicial</label>
                        <textarea 
                            name="comentarios"
                            rows={4}
                            placeholder="Describa brevemente el estado general del vehículo o detalles de la prospección..."
                            className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all placeholder:text-slate-400 font-medium resize-none text-slate-900"
                        />
                    </div>

                    {/* Documentación Digital */}
                    <div className="flex flex-col gap-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="size-4 text-[var(--color-primary)]" />
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Documentación Digital</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <DocumentInput name="factura" label="Factura" />
                            <DocumentInput name="tarjeta_circulacion" label="Tarjeta Circ." />
                            <DocumentInput name="poliza_seguro" label="Póliza" />
                            <DocumentInput name="ine_propietario" label="INE" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <DocumentInput name="contrato_compraventa" label="Contrato C/V" />
                            <DocumentInput name="hoja_avaluo" label="Hoja Avalúo" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer with Submit */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-slate-50/80 p-8 rounded-[2rem] border border-slate-200 backdrop-blur-md">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)]">Confirmación</span>
                    <p className="text-slate-500 text-xs font-bold leading-tight max-w-sm">
                        Al registrar, el vehículo entrará en estado <span className="text-[var(--color-primary)]">"FRÍO"</span>. Solo será visible en la sección de Avalúos para Directivos.
                    </p>
                </div>
                <button 
                    disabled={pending}
                    className="w-full lg:w-auto font-black rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 active:scale-95 transition-all text-white text-sm px-12 py-5 flex items-center justify-center gap-3 shadow-2xl shadow-[var(--color-primary)]/30 uppercase tracking-widest disabled:opacity-50 disabled:scale-100"
                >
                    {pending ? (
                        <>
                            <Loader2 className="size-5 animate-spin" />
                            <span>Procesando...</span>
                        </>
                    ) : (
                        <>
                            <span>Registrar Avalúo</span>
                            <ArrowRight className="size-5" />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

function DocumentInput({ name, label }: { name: string, label: string }) {
    const [nameFile, setNameFile] = useState<string | null>(null);

    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">{label}</label>
            <div className="relative group">
                <input 
                    type="file"
                    name={name}
                    accept="image/*,application/pdf"
                    onChange={(e) => setNameFile(e.target.files?.[0]?.name || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`p-3 rounded-xl border border-dashed transition-all flex items-center justify-between ${nameFile ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-50 border-slate-200 group-hover:border-slate-300'}`}>
                    <div className="flex items-center gap-2 min-w-0">
                        <FileText className={`size-3 shrink-0 ${nameFile ? 'text-emerald-500' : 'text-slate-400'}`} />
                        <span className={`text-[10px] font-bold uppercase truncate min-w-0 ${nameFile ? 'text-emerald-500' : 'text-slate-500'}`}>
                            {nameFile ? nameFile : 'Subir...'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
