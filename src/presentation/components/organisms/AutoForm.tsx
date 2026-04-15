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
            // Edición parcial
            const updatedData: any = {
                marca: formData.get('marca') as string,
                modelo: formData.get('modelo') as string,
                anio: parseInt(formData.get('anio') as string, 10),
                tipo: formData.get('tipo') as TipoAuto,
                version: formData.get('version') as string,
                kilometraje: parseInt(formData.get('kilometraje') as string, 10) || 0,
                numero_duenos: parseInt(formData.get('numero_duenos') as string, 10) || 1,
            };

            const result = await updateAutoAction(initialData!.id, updatedData);
            if (result?.error) setErrorMsg(result.error);
            else window.location.href = `/auto/${initialData!.id}`;
        }
      } catch (err) {
        setErrorMsg("Error procesando los datos");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10 max-w-5xl mx-auto w-full">
      
      {errorMsg && (
        <div className="p-5 bg-red-50 border border-red-100 rounded-3xl text-red-600 text-xs font-bold flex items-center gap-3 animate-in shake-in duration-300">
          <X className="size-5 shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col gap-10">
        
        {/* Ficha Técnica Card */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col gap-10">
            <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                    <Activity className="size-6 text-indigo-500" />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Ficha Técnica</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormInput label="Marca" name="marca" defaultValue={initialData?.marca} placeholder="Ej. BMW, Mazda..." required />
                <FormInput label="Modelo" name="modelo" defaultValue={initialData?.modelo} placeholder="Ej. Serie 3, CX-5..." required />
                
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Año</label>
                    <select name="anio" defaultValue={initialData?.anio || new Date().getFullYear()} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-extrabold appearance-none cursor-pointer">
                        {Array.from({ length: 30 }, (_, i) => 2026 - i).map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Carrocería</label>
                    <select name="tipo" defaultValue={initialData?.tipo || 'sedan'} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-extrabold appearance-none cursor-pointer">
                        <option value="sedan">Sedán</option>
                        <option value="suv">SUV / Crossover</option>
                        <option value="hatchback">Hatchback</option>
                        <option value="camion">Camioneta / PickUp</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-slate-50">
                <FormInput label="Versión" name="version" defaultValue={initialData?.version} placeholder="Ej. Sport, GS..." />
                <FormInput label="Kilometraje" name="kilometraje" type="number" defaultValue={initialData?.kilometraje?.toString()} placeholder="0" />
                <FormInput label="Nº Dueños" name="numero_duenos" type="number" defaultValue={initialData?.numero_duenos?.toString() || "1"} />
            </div>
        </div>

        {/* Documentación Section (Only for Create Mode) */}
        {mode === 'create' && (
            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                        <FileText className="size-6 text-indigo-500" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Documentos de la Unidad</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <DocumentField label="Factura / IVA" name="factura" />
                    <DocumentField label="Tarjeta Circulación" name="tarjeta_circulacion" />
                    <DocumentField label="Póliza de Seguro" name="poliza_seguro" />
                    <DocumentField label="INE Propietario" name="ine_propietario" />
                    <DocumentField label="Contrato Compra-Venta" name="contrato_compraventa" />
                </div>
            </div>
        )}

        {/* Multimedia Card */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col gap-10">
            <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                    <Camera className="size-6 text-emerald-500" />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Galería de Imágenes</h2>
            </div>

            <div className="flex flex-col gap-8">
                <div className="relative group">
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="bg-slate-50 p-12 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center group-hover:border-indigo-500/30 group-hover:bg-white transition-all flex flex-col items-center gap-4 shadow-inner">
                        <div className="size-16 rounded-2xl bg-white flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-all shadow-sm">
                            <Plus className="size-8 text-slate-300" />
                        </div>
                        <span className="text-sm font-black text-slate-900">Haz clic para añadir fotos</span>
                    </div>
                </div>

                {selectedFiles.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedFiles.map((f) => (
                            <div key={f.id} className="relative aspect-square rounded-[1.5rem] overflow-hidden border border-slate-200 group">
                                <img src={f.preview} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Preview" />
                                <button 
                                    type="button" 
                                    onClick={() => removeFile(f.id, f.preview, f.isNew)}
                                    className="absolute top-2 right-2 size-8 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Final Actions Section */}
        <div className="bg-slate-900 p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Confirmación</span>
                <h3 className="text-white font-extrabold text-2xl tracking-tighter uppercase">
                    {mode === 'create' ? 'Dar de Alta Inventario' : 'Guardar Cambios'}
                </h3>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Sincronización inmediata con stock central</p>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto">
                <button
                    disabled={isPending}
                    className="flex-1 md:flex-none px-12 py-6 rounded-2xl bg-indigo-500 hover:bg-indigo-400 active:scale-95 transition-all text-white font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 disabled:opacity-50"
                >
                    {isPending ? <Loader2 className="size-6 animate-spin" /> : <><CheckCircle2 className="size-5" /> Finalizar Registro</>}
                </button>
            </div>
        </div>
      </div>
    </form>
  );
}

function DocumentField({ label, name }: { label: string; name: string }) {
    const [hasFile, setHasFile] = useState(false);

    return (
        <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
            <div className="relative group">
                <input 
                    type="file" 
                    name={name} 
                    accept="image/*,application/pdf" 
                    onChange={(e) => setHasFile(!!e.target.files?.length)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                <div className={`flex items-center gap-4 p-5 rounded-2xl border border-dashed transition-all ${hasFile ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200 group-hover:border-indigo-300 group-hover:bg-white'}`}>
                    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${hasFile ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-slate-300 shadow-sm'}`}>
                        {hasFile ? <CheckCircle2 className="size-5" /> : <FileText className="size-5" />}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-tight truncate ${hasFile ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {hasFile ? 'Archivo Listo' : 'Subir Archivo'}
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
