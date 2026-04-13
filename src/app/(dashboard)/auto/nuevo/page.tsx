'use client';

import { useState, useTransition, useRef } from "react";
import { 
    ArrowLeft, 
    ArrowRight, 
    Camera, 
    ChevronDown, 
    Info, 
    Plus, 
    X, 
    Image as ImageIcon,
    Loader2,
    CheckCircle2,
    Car,
    FileText,
    UploadCloud
} from "lucide-react";
import Link from "next/link";
import { createAutoAction } from "@/core/usecases/autoService";

function DocumentUpload({ name, label }: { name: string, label: string }) {
    const [fileName, setFileName] = useState<string | null>(null);

    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">{label}</label>
            <div className="relative group">
                <input 
                    type="file"
                    name={name}
                    accept="image/*,.pdf"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed transition-all ${fileName ? 'bg-indigo-500/5 border-indigo-500/30' : 'bg-zinc-950 border-white/5 group-hover:border-indigo-500/20'}`}>
                    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${fileName ? 'bg-indigo-500/20' : 'bg-zinc-900'}`}>
                        {fileName ? <CheckCircle2 className="size-4 text-indigo-400" /> : <UploadCloud className="size-4 text-zinc-600" />}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className={`text-xs font-bold truncate ${fileName ? 'text-indigo-400' : 'text-zinc-500'}`}>
                            {fileName || 'Seleccionar Archivo...'}
                        </span>
                        {!fileName && <span className="text-[9px] font-black text-zinc-700 uppercase">JPG, PNG o PDF</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function NuevoAutoInventarioPage() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; id: string; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const newFiles = Array.from(e.target.files).map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            preview: URL.createObjectURL(file)
        }));
        setSelectedFiles(prev => [...prev, ...newFiles]);
    }
    e.target.value = '';
  };

  const removeFile = (id: string, previewUrl: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
    URL.revokeObjectURL(previewUrl);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setErrorMsg(null);

    // Agregar fotos seleccionadas al formData
    formData.delete('fotos');
    selectedFiles.forEach(f => {
        formData.append('fotos', f.file);
    });

    startTransition(async () => {
      try {
        const result = await createAutoAction(null, formData);
        if (result?.error) {
          setErrorMsg(result.error);
        } else if (result?.redirect) {
          window.location.href = "/";
        }
      } catch (err) {
        setErrorMsg("Error de conexión con el servidor");
      }
    });
  };

  return (
    <div className="bg-zinc-950 text-neutral-50 w-full min-h-screen font-sans selection:bg-[var(--color-primary)] selection:text-[var(--color-primary-dark)]">
      <div className="max-w-4xl mx-auto flex flex-col w-full pb-24">
        
        {/* Header Section */}
        <div className="flex px-6 pt-12 pb-8 flex-col gap-8 bg-zinc-950 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3 text-zinc-500 hover:text-white transition-all">
                <div className="size-10 rounded-xl bg-zinc-900 flex items-center justify-center group-hover:bg-zinc-800 border border-white/5">
                    <ArrowLeft className="size-5" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest mt-0.5">Volver al Inventario</span>
            </Link>
            <div className="px-4 py-2 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest">
                Alta Directa
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="size-16 rounded-[1.7rem] bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-white/5 shadow-2xl">
                <Car className="size-8 text-[var(--color-primary)]" />
            </div>
            <div className="flex flex-col">
                <h1 className="text-4xl font-black text-white tracking-tight">Nuevo Ingreso</h1>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">Carga de Unidades a Stock</p>
            </div>
          </div>
        </div>

        {/* Content Form */}
        <div className="px-6">
          <form id="new-inventory-form" onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            {errorMsg && (
              <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                <X className="size-5 shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Main Info Card */}
            <div className="bg-zinc-900/40 p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-md flex flex-col gap-8">
                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Info className="size-4 text-blue-400" />
                    </div>
                    <h2 className="text-lg font-black text-white uppercase tracking-wider">Identificación del Vehículo</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Marca</label>
                        <input
                            type="text"
                            name="marca"
                            required
                            placeholder="Ej. Chevrolet, Nissan..."
                            className="bg-zinc-950 border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all placeholder:text-zinc-800 font-bold"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Modelo</label>
                        <input
                            type="text"
                            name="modelo"
                            required
                            placeholder="Ej. Silverado, Versa..."
                            className="bg-zinc-950 border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all placeholder:text-zinc-800 font-bold"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Año</label>
                        <div className="relative">
                            <select
                                name="anio"
                                required
                                defaultValue={new Date().getFullYear()}
                                className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all font-bold appearance-none"
                            >
                                {Array.from({ length: 35 }, (_, i) => new Date().getFullYear() + 1 - i).map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Carrocería</label>
                        <div className="relative">
                            <select
                                name="tipo"
                                required
                                defaultValue="sedan"
                                className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all font-bold appearance-none"
                            >
                                <option value="sedan">Sedán</option>
                                <option value="suv">SUV / Crossover</option>
                                <option value="hatchback">Hatchback</option>
                                <option value="camion">Camioneta / PickUp</option>
                                <option value="otro">Otro</option>
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Versión</label>
                        <input
                            type="text"
                            name="version"
                            placeholder="Ej. Plus, Luxury, XL..."
                            className="bg-zinc-950 border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all placeholder:text-zinc-800 font-bold"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Kilometraje</label>
                        <input
                            type="number"
                            name="kilometraje"
                            placeholder="0"
                            className="bg-zinc-950 border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all placeholder:text-zinc-800 font-bold"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Nº Dueños</label>
                        <input
                            type="number"
                            name="numero_duenos"
                            defaultValue="1"
                            className="bg-zinc-950 border border-white/10 rounded-2xl p-5 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all placeholder:text-zinc-800 font-bold"
                        />
                    </div>
                </div>
            </div>

            {/* Documentación Section */}
            <div className="bg-zinc-900/40 p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-md flex flex-col gap-8">
                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <FileText className="size-4 text-indigo-400" />
                    </div>
                    <h2 className="text-lg font-black text-white uppercase tracking-wider">Documentación Legal</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <DocumentUpload name="factura" label="Factura Original / Copia" />
                    <DocumentUpload name="tarjeta_circulacion" label="Tarjeta de Circulación" />
                    <DocumentUpload name="poliza_seguro" label="Póliza de Seguro" />
                    <DocumentUpload name="ine_propietario" label="INE Anterior Dueño" />
                    <div className="md:col-span-2">
                        <DocumentUpload name="contrato_compraventa" label="Contrato de Compra-Venta" />
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-zinc-950 rounded-2xl border border-white/5">
                    <input type="checkbox" name="es_toma_avaluo" value="true" className="size-5 rounded bg-zinc-900 border-white/10 text-[var(--color-primary)]" />
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-tighter cursor-pointer">Unidad adquirida mediante Toma de Avalúo</label>
                </div>
            </div>

            {/* Multimedia Section */}
            <div className="bg-zinc-900/40 p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-md flex flex-col gap-8">
                <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Camera className="size-4 text-emerald-400" />
                    </div>
                    <h2 className="text-lg font-black text-white uppercase tracking-wider">Galería de Imágenes</h2>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="relative group">
                        <input 
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="bg-zinc-950 p-12 border-2 border-dashed border-white/5 rounded-3xl text-center group-hover:border-[var(--color-primary)]/30 transition-all flex flex-col items-center gap-3">
                            <div className="size-16 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                                <Plus className="size-8 text-zinc-600" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-black text-white">Haz clic para añadir fotos</span>
                                <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Optimización Sharp activada</span>
                            </div>
                        </div>
                    </div>

                    {selectedFiles.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 animate-in slide-in-from-bottom-2 duration-500">
                            {selectedFiles.map((f, idx) => (
                                <div key={f.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-white/10 bg-zinc-950">
                                    <img src={f.preview} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Preview"/>
                                    <button 
                                        type="button"
                                        onClick={() => removeFile(f.id, f.preview)}
                                        className="absolute top-2 right-2 size-7 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                                    >
                                        <X className="size-4" />
                                    </button>
                                    {idx === 0 && (
                                        <div className="absolute bottom-2 left-2 px-3 py-1 bg-[var(--color-primary)] text-[var(--color-primary-dark)] text-[8px] font-black uppercase rounded-lg shadow-lg">
                                            Portada
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 bg-zinc-950/40 rounded-3xl border border-white/5 border-dashed flex items-center justify-center">
                            <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest text-center">Debes subir al menos una foto para el inventario</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Inventory Status Alert */}
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-[2rem] flex items-center gap-6">
                <div className="size-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 shadow-inner">
                    <CheckCircle2 className="size-6 text-emerald-500" />
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">Ingreso Confirmado</span>
                    <p className="text-zinc-500 text-xs font-bold leading-relaxed">
                        Esta unidad se registrará directamente como <strong className="text-emerald-400 font-black">INVENTARIO DISPONIBLE</strong>. 
                        Cualquier vendedor podrá verla en el dashboard principal tras el guardado.
                    </p>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-4">
                <button
                    disabled={isPending || selectedFiles.length === 0}
                    className="w-full font-black text-sm uppercase tracking-[0.2em] rounded-[2rem] bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 active:scale-[0.98] transition-all text-[var(--color-primary-dark)] py-7 flex items-center justify-center gap-4 shadow-2xl shadow-[var(--color-primary)]/20 disabled:opacity-40 disabled:scale-100"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="size-5 animate-spin" />
                            <span>Procesando Imágenes de Inventario...</span>
                        </>
                    ) : (
                        <>
                            <span>Dar de Alta en Inventario</span>
                            <ArrowRight className="size-5" />
                        </>
                    )}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
