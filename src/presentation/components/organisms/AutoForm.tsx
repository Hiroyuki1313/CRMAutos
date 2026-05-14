'use client';

import { useState, useTransition, useRef } from "react";
import { 
    Camera, 
    ChevronDown, 
    Info, 
    Plus, 
    X, 
    Loader2,
    CheckCircle2,
    Car,
    FileText,
    ArrowRight,
    Activity
} from "lucide-react";
import { optimizeImage } from "@/presentation/utils/imageUtils";
import { Auto, TipoAuto } from "@/core/domain/entities/Auto";
import { createAutoAction, updateAutoAction } from "@/core/usecases/autoService";

interface Props {
    initialData?: Auto;
    mode: 'create' | 'edit';
}

export function AutoForm({ initialData, mode }: Props) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedFiles, setSelectedFiles] = useState<{ file?: File; id: string; preview: string; isNew: boolean }[]>(
    initialData?.fotos_url ? (Array.isArray(initialData.fotos_url) ? initialData.fotos_url : JSON.parse(initialData.fotos_url as string || '[]')).map((url: string) => ({
        id: Math.random().toString(36).substr(2, 9),
        preview: url,
        isNew: false
    })) : []
  );
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const newFiles = Array.from(e.target.files).map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            preview: URL.createObjectURL(file),
            isNew: true
        }));
        setSelectedFiles(prev => [...prev, ...newFiles]);
    }
    e.target.value = '';
  };

  const removeFile = (id: string, previewUrl: string, isNew: boolean) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
    if (isNew) URL.revokeObjectURL(previewUrl);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setErrorMsg(null);

    startTransition(async () => {
      try {
        if (mode === 'create') {
            // Optimizar fotos nuevas
            const newPhotos = await Promise.all(
                selectedFiles.filter(f => f.isNew && f.file).map(f => optimizeImage(f.file!))
            );
            formData.delete('fotos');
            newPhotos.forEach(file => formData.append('fotos', file));
            
            // Forzar que NO es toma de avalúo para ingresos directos
            formData.set('es_toma_avaluo', 'false');

            const result = await createAutoAction(null, formData);
            if (result?.error) setErrorMsg(result.error);
            else if (result?.redirect) window.location.href = "/";
        } else {
            // Edición con archivos
            // Optimizar fotos nuevas
            const newPhotos = await Promise.all(
                selectedFiles.filter(f => f.isNew && f.file).map(f => optimizeImage(f.file!))
            );
            formData.delete('fotos');
            newPhotos.forEach(file => formData.append('fotos', file));
            
            // Pasar URLs de fotos actuales que se mantienen
            const currentPhotos = selectedFiles.filter(f => !f.isNew).map(f => f.preview);
            formData.append('current_fotos_url', JSON.stringify(currentPhotos));

            const result = await updateAutoAction(initialData!.id, formData);
            if (result?.error) setErrorMsg(result.error);
            else window.location.href = `/auto/${initialData!.id}`;
        }
      } catch (err) {
        setErrorMsg("Error procesando los datos");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-[1400px] mx-auto w-full h-full lg:max-h-[85vh]">
      
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-bold flex items-center gap-2 animate-in shake-in duration-300">
          <X className="size-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        
        {/* Left Column: Data & Docs */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {/* Ficha Técnica Card */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                        <Activity className="size-5 text-indigo-500" />
                    </div>
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Ficha Técnica</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Marca" name="marca" defaultValue={initialData?.marca} placeholder="BMW..." required />
                    <FormInput label="Modelo" name="modelo" defaultValue={initialData?.modelo} placeholder="Serie 3..." required />
                    
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Año</label>
                        <select name="anio" defaultValue={initialData?.anio || new Date().getFullYear()} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all font-extrabold appearance-none cursor-pointer">
                            {Array.from({ length: 30 }, (_, i) => 2026 - i).map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Carrocería</label>
                        <select name="tipo" defaultValue={initialData?.tipo || 'sedan'} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all font-extrabold appearance-none cursor-pointer">
                            <option value="sedan">Sedán</option>
                            <option value="suv">SUV / Crossover</option>
                            <option value="hatchback">Hatchback</option>
                            <option value="camion">Camioneta / PickUp</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>

                    <FormInput label="Versión" name="version" defaultValue={initialData?.version} placeholder="Sport..." />
                    <div className="grid grid-cols-2 gap-2">
                        <FormInput label="Kilometraje" name="kilometraje" type="number" defaultValue={initialData?.kilometraje?.toString()} placeholder="0" />
                        <FormInput label="Nº Dueños" name="numero_duenos" type="number" defaultValue={initialData?.numero_duenos?.toString() || "1"} />
                    </div>
                </div>
            </div>

            {/* Documentación Section */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                        <FileText className="size-5 text-indigo-500" />
                    </div>
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Documentos</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DocumentField label="Factura / IVA" name="factura" initialUrl={initialData?.url_factura} />
                    <DocumentField label="Tarjeta Circulación" name="tarjeta_circulacion" initialUrl={initialData?.url_tarjeta_circulacion} />
                    <DocumentField label="Póliza de Seguro" name="poliza_seguro" initialUrl={initialData?.url_poliza_seguro} />
                    <DocumentField label="INE Propietario" name="ine_propietario" initialUrl={initialData?.url_ine_propietario} />
                    <DocumentField label="Contrato Compra-Venta" name="contrato_compraventa" initialUrl={initialData?.url_contrato_compraventa} />
                </div>
            </div>
        </div>

        {/* Right Column: Gallery & Action */}
        <div className="flex flex-col gap-4 min-h-0">
            {/* Multimedia Card */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-6 flex-1 min-h-0">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                        <Camera className="size-5 text-emerald-500" />
                    </div>
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Galería</h2>
                </div>

                <div className="flex flex-col gap-4 flex-1 min-h-0">
                    <div className="relative group">
                        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="bg-slate-50 py-8 border-2 border-dashed border-slate-200 rounded-[1.5rem] text-center group-hover:border-indigo-500/30 group-hover:bg-white transition-all flex flex-col items-center gap-2 shadow-inner">
                            <div className="size-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-all shadow-sm">
                                <Plus className="size-5 text-slate-300" />
                            </div>
                            <span className="text-[10px] font-black text-slate-900 uppercase">Añadir fotos</span>
                        </div>
                    </div>

                    <div className="overflow-y-auto pr-1 flex-1 min-h-0 custom-scrollbar">
                        {selectedFiles.length > 0 ? (
                            <div className="grid grid-cols-3 gap-3">
                                {selectedFiles.map((f) => (
                                    <div key={f.id} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group">
                                        <img src={f.preview} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Preview" />
                                        <button 
                                            type="button" 
                                            onClick={() => removeFile(f.id, f.preview, f.isNew)}
                                            className="absolute top-1 right-1 size-6 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-300 flex-col gap-2">
                                <Camera className="size-8 opacity-20" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Sin imágenes</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Final Actions Section */}
            <div className="bg-slate-900 p-6 rounded-[2rem] flex items-center justify-between gap-4 border border-white/5 shadow-2xl">
                <div className="flex flex-col">
                    <h3 className="text-white font-extrabold text-lg tracking-tighter uppercase leading-tight">
                        {mode === 'create' ? 'Dar de Alta' : 'Guardar'}
                    </h3>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Sincronización inmediata</p>
                </div>

                <button
                    disabled={isPending}
                    className="px-8 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 active:scale-95 transition-all text-white font-black uppercase tracking-[0.1em] text-[10px] flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 disabled:opacity-50 min-w-[140px]"
                >
                    {isPending ? <Loader2 className="size-4 animate-spin" /> : <><CheckCircle2 className="size-4" /> Finalizar</>}
                </button>
            </div>
        </div>
      </div>
    </form>
  );
}

function DocumentField({ label, name, initialUrl }: { label: string; name: string; initialUrl?: string }) {
    const [hasFile, setHasFile] = useState(!!initialUrl);

    return (
        <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
            <div className="relative group">
                <input 
                    type="file" 
                    name={name} 
                    accept="image/*,application/pdf" 
                    onChange={(e) => setHasFile(!!e.target.files?.length || !!initialUrl)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                <div className={`flex items-center gap-4 p-5 rounded-2xl border border-dashed transition-all ${hasFile ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 group-hover:border-indigo-300 group-hover:bg-white'}`}>
                    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${hasFile ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-300 shadow-sm'}`}>
                        {hasFile ? <CheckCircle2 className="size-5" /> : <FileText className="size-5" />}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-tight truncate ${hasFile ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {hasFile ? (initialUrl ? 'Documento Guardado' : 'Archivo Listo') : 'Subir Archivo'}
                    </span>
                </div>
            </div>
        </div>
    );
}

function FormInput({ label, name, type = 'text', defaultValue, placeholder, required }: any) {
    return (
        <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
            <input
                type={type}
                name={name}
                defaultValue={defaultValue}
                required={required}
                placeholder={placeholder}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300 font-extrabold"
            />
        </div>
    );
}
