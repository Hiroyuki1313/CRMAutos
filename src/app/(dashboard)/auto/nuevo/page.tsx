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
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
            <div className="relative group">
                <input 
                    type="file"
                    name={name}
                    accept="image/*,.pdf"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed transition-all ${fileName ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200 group-hover:border-[var(--color-primary)]/30'}`}>
                    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${fileName ? 'bg-indigo-100' : 'bg-white shadow-sm'}`}>
                        {fileName ? <CheckCircle2 className="size-4 text-indigo-600" /> : <UploadCloud className="size-4 text-slate-400" />}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className={`text-xs font-bold truncate ${fileName ? 'text-indigo-600' : 'text-slate-500'}`}>
                            {fileName || 'Seleccionar Archivo...'}
                        </span>
                        {!fileName && <span className="text-[9px] font-black text-slate-300 uppercase">JPG, PNG o PDF</span>}
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
    <div className="bg-white text-slate-900 w-full min-h-screen font-sans selection:bg-[var(--color-primary)] selection:text-white animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto flex flex-col w-full pb-24">
        
        {/* Header Section */}
        <div className="flex px-6 pt-12 pb-8 flex-col gap-8 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100/50">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-all">
                <div className="size-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:border-[var(--color-primary)] border border-slate-200 shadow-sm active:scale-95 transition-all">
                    <ArrowLeft className="size-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">Volver al Inventario</span>
            </Link>
            <div className="px-5 py-2.5 rounded-full bg-[var(--color-primary)] text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-[var(--color-primary)]/20">
                Alta Directa
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="size-20 rounded-[2.5rem] bg-slate-50 flex items-center justify-center border border-slate-200 shadow-xl shadow-slate-200/50">
                <Car className="size-10 text-[var(--color-primary)]" />
            </div>
            <div className="flex flex-col">
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter">Nuevo Ingreso</h1>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Carga de Unidades a Stock</p>
            </div>
          </div>
        </div>

        {/* Content Form */}
        <div className="px-6 mt-10">
          <form id="new-inventory-form" onSubmit={handleSubmit} className="flex flex-col gap-10">
            
            {errorMsg && (
              <div className="p-5 bg-red-50 border border-red-100 rounded-[1.5rem] text-red-600 text-xs font-bold flex items-center gap-3 animate-in shake-in duration-300 shadow-sm">
                <X className="size-5 shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Main Info Card */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col gap-10">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-8">
                    <div className="size-10 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                        <Info className="size-5 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Identificación del Vehículo</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Marca</label>
                        <input
                            type="text"
                            name="marca"
                            required
                            placeholder="Ej. Chevrolet, Nissan..."
                            className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-900 focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 outline-none transition-all placeholder:text-slate-300 font-bold"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Modelo</label>
                        <input
                            type="text"
                            name="modelo"
                            required
                            placeholder="Ej. Silverado, Versa..."
                            className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-900 focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 outline-none transition-all placeholder:text-slate-300 font-bold"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Año</label>
                        <div className="relative group">
                            <select
                                name="anio"
                                required
                                defaultValue={new Date().getFullYear()}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-900 focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 outline-none transition-all font-bold appearance-none cursor-pointer"
                            >
                                {Array.from({ length: 35 }, (_, i) => new Date().getFullYear() + 1 - i).map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none transition-transform group-focus-within:rotate-180" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Carrocería</label>
                        <div className="relative group">
                            <select
                                name="tipo"
                                required
                                defaultValue="sedan"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-900 focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 outline-none transition-all font-bold appearance-none cursor-pointer"
                            >
                                <option value="sedan">Sedán</option>
                                <option value="suv">SUV / Crossover</option>
                                <option value="hatchback">Hatchback</option>
                                <option value="camion">Camioneta / PickUp</option>
                                <option value="otro">Otro</option>
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none transition-transform group-focus-within:rotate-180" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Versión</label>
                        <input
                            type="text"
                            name="version"
                            placeholder="Ej. Plus, Luxury, XL..."
                            className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-900 focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 outline-none transition-all placeholder:text-slate-300 font-bold"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kilometraje</label>
                        <input
                            type="number"
                            name="kilometraje"
                            placeholder="0"
                            className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-900 focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 outline-none transition-all placeholder:text-slate-300 font-bold"
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nº Dueños</label>
                        <input
                            type="number"
                            name="numero_duenos"
                            defaultValue="1"
                            className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-900 focus:bg-white focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 outline-none transition-all placeholder:text-slate-300 font-bold"
                        />
                    </div>
                </div>
            </div>

            {/* Documentación Section */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col gap-10">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-8">
                    <div className="size-10 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                        <FileText className="size-5 text-indigo-500" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Documentación Legal</h2>
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

                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner">
                    <input type="checkbox" name="es_toma_avaluo" value="true" className="size-6 rounded-lg bg-white border-slate-200 text-[var(--color-primary)] focus:ring-[var(--color-primary)] transition-all cursor-pointer" />
                    <label className="text-xs font-black text-slate-500 uppercase tracking-tighter cursor-pointer select-none">Unidad adquirida mediante Toma de Avalúo</label>
                </div>
            </div>

            {/* Multimedia Section */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col gap-10">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-8">
                    <div className="size-10 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                        <Camera className="size-5 text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Galería de Imágenes</h2>
                </div>

                <div className="flex flex-col gap-8">
                    <div className="relative group">
                        <input 
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="bg-slate-50 p-12 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center group-hover:border-[var(--color-primary)]/30 group-hover:bg-white transition-all flex flex-col items-center gap-4 shadow-inner">
                            <div className="size-20 rounded-[1.5rem] bg-white flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:shadow-xl transition-all shadow-sm">
                                <Plus className="size-10 text-slate-300" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-base font-black text-slate-900 tracking-tight">Haz clic para añadir fotos</span>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Optimización Sharp activada</span>
                            </div>
                        </div>
                    </div>

                    {selectedFiles.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 animate-in slide-in-from-bottom-4 duration-700">
                            {selectedFiles.map((f, idx) => (
                                <div key={f.id} className="relative group aspect-square rounded-[1.5rem] overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all">
                                    <img src={f.preview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Preview"/>
                                    <button 
                                        type="button"
                                        onClick={() => removeFile(f.id, f.preview)}
                                        className="absolute top-3 right-3 size-8 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 active:scale-95"
                                    >
                                        <X className="size-4" />
                                    </button>
                                    {idx === 0 && (
                                        <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-[var(--color-primary)] text-white text-[9px] font-black uppercase rounded-lg shadow-lg">
                                            Portada
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 bg-slate-50 rounded-[2rem] border border-slate-200 border-dashed flex items-center justify-center">
                            <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest text-center">Debes subir al menos una foto para el inventario</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Inventory Status Alert */}
            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                <div className="size-16 rounded-[1.5rem] bg-white flex items-center justify-center shrink-0 shadow-lg border border-emerald-50">
                    <CheckCircle2 className="size-8 text-emerald-500" />
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em]">Ingreso Confirmado</span>
                    <p className="text-slate-500 text-xs font-bold leading-relaxed">
                        Esta unidad se registrará directamente como <strong className="text-emerald-500 font-extrabold">INVENTARIO DISPONIBLE</strong>. 
                        Cualquier vendedor podrá verla en el dashboard principal tras el guardado.
                    </p>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-6">
                <button
                    disabled={isPending || selectedFiles.length === 0}
                    className="w-full font-black text-sm uppercase tracking-[0.3em] rounded-[2.5rem] bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 active:scale-[0.98] transition-all text-white py-8 flex items-center justify-center gap-4 shadow-2xl shadow-[var(--color-primary)]/30 disabled:opacity-40 disabled:scale-100"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="size-6 animate-spin" />
                            <span>Procesando Imágenes de Inventario...</span>
                        </>
                    ) : (
                        <>
                            <span>Dar de Alta en Inventario</span>
                            <ArrowRight className="size-6" />
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
