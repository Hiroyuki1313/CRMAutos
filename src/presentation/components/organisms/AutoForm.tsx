'use client';

import { useState, useTransition } from "react";
import Link from "next/link";
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
    ArrowLeft,
    Activity,
    GripVertical
} from "lucide-react";
import { useDragAndDrop } from "@/presentation/hooks/useDragAndDrop";
import { optimizeImage } from "@/presentation/utils/imageUtils";
import { Auto } from "@/core/domain/entities/Auto";
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

  const { handlers, draggedIndex } = useDragAndDrop(selectedFiles, setSelectedFiles);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  
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

  const handleDropFiles = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFiles(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const imageFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (imageFiles.length > 0) {
            const newFiles = imageFiles.map(file => ({
                file,
                id: Math.random().toString(36).substr(2, 9),
                preview: URL.createObjectURL(file),
                isNew: true
            }));
            setSelectedFiles(prev => [...prev, ...newFiles]);
        }
    }
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
            const newPhotos = await Promise.all(
                selectedFiles.filter(f => f.isNew && f.file).map(f => optimizeImage(f.file!))
            );
            formData.delete('fotos');
            newPhotos.forEach(file => formData.append('fotos', file));
            formData.set('es_toma_avaluo', 'false');

            const result = await createAutoAction(null, formData);
            if (result?.error) setErrorMsg(result.error);
            else if (result?.redirect) window.location.href = "/";
        } else {
            const newPhotos = await Promise.all(
                selectedFiles.filter(f => f.isNew && f.file).map(f => optimizeImage(f.file!))
            );
            formData.delete('fotos');
            newPhotos.forEach(file => formData.append('fotos', file));
            
            const currentPhotos = selectedFiles.filter(f => !f.isNew).map(f => f.preview);
            formData.append('current_fotos_url', JSON.stringify(currentPhotos));

            const orderList = selectedFiles.map(f => {
                if (f.isNew) {
                    const newIndex = selectedFiles.slice(0, selectedFiles.indexOf(f)).filter(x => x.isNew).length;
                    return `new_${newIndex}`;
                }
                return f.preview;
            });
            formData.append('fotos_order', JSON.stringify(orderList));

            const result = await updateAutoAction(initialData!.id, formData);
            if (result?.error) setErrorMsg(result.error);
            else window.location.href = `/auto/${initialData!.id}`;
        }
      } catch (err) {
        setErrorMsg("Error procesando los datos");
      }
    });
  };

  const isCreate = mode === 'create';
  const backLink = isCreate ? "/" : `/auto/${initialData?.id}`;
  const backText = isCreate ? "Volver al Inventario" : "Volver al Detalle";
  const titleText = isCreate ? "Nuevo Ingreso" : `Editar ${initialData?.marca} ${initialData?.modelo}`;
  const subtitleText = isCreate ? "Carga de Unidades a Stock Central" : "Actualización de Especificaciones Físicas";

  return (
    <div className="flex flex-col w-full pb-24 bg-slate-50/50 min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-5 pb-4 px-6 lg:px-12 bg-white border-b border-slate-200/60 shadow-sm">
          <div className="flex flex-col gap-3">
            <Link href={backLink} className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all">
                <div className="size-8 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center group-hover:bg-slate-100 transition-all shadow-sm">
                    <ArrowLeft className="size-4" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest mt-0.5">{backText}</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm animate-in zoom-in-50 duration-350">
                  <Car className="size-6 text-indigo-600" />
              </div>
              <div className="flex flex-col">
                  <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight uppercase">{titleText}</h1>
                  <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.25em] mt-0.5">{subtitleText}</p>
              </div>
            </div>
          </div>

          {/* Action Card Section */}
          <div className="bg-slate-900 p-4 rounded-[1.5rem] flex items-center justify-between gap-6 border border-white/5 shadow-xl min-w-[320px] lg:min-w-[400px]">
              <div className="flex flex-col">
                  <h3 className="text-white font-extrabold text-sm tracking-tighter uppercase leading-tight">
                      {isCreate ? 'Dar de Alta' : 'Guardar Cambios'}
                  </h3>
                  <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Sincronización inmediata</p>
              </div>

              <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 active:scale-95 transition-all text-white font-black uppercase tracking-[0.1em] text-[9px] flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 disabled:opacity-50 min-w-[120px]"
              >
                  {isPending ? <Loader2 className="size-3.5 animate-spin" /> : <><CheckCircle2 className="size-3.5" /> Finalizar</>}
              </button>
          </div>
        </div>

        {/* Form Body Container */}
        <div className="px-6 lg:px-12 w-full max-w-[1400px] mx-auto flex flex-col gap-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-bold flex items-center gap-2 animate-in shake-in duration-300">
              <X className="size-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Data & Docs */}
            <div className="flex flex-col gap-6">
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

                        <FormInput label="Folio Interno" name="folio_interno" defaultValue={initialData?.folio_interno} placeholder="Escribir folio..." />
                        <FormInput label="VIN (Nº Serie)" name="vin" defaultValue={initialData?.vin} placeholder="Escribir VIN..." />
                        <FormInput label="Color" name="color" defaultValue={initialData?.color} placeholder="Escribir color..." />
                        <FormInput label="Placas" name="placas" defaultValue={initialData?.placas} placeholder="Escribir placas..." />

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

            {/* Right Column: Gallery */}
            <div className="flex flex-col gap-6">
                {/* Multimedia Card */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-6 h-full">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                <Camera className="size-5 text-emerald-500" />
                            </div>
                            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Galería</h2>
                        </div>
                        {selectedFiles.length > 0 && (
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                                {selectedFiles.length} foto{selectedFiles.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-6 flex-1">
                        <div 
                            className={`relative group transition-all duration-200 ${isDraggingFiles ? 'scale-[1.01]' : ''}`}
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingFiles(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setIsDraggingFiles(false); }}
                            onDrop={handleDropFiles}
                        >
                            <input 
                                type="file" 
                                multiple 
                                accept="image/*" 
                                onChange={handleFileChange} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                            />
                            <div className={`py-8 px-4 border-2 border-dashed rounded-[1.5rem] text-center transition-all flex flex-col items-center gap-2 shadow-inner ${
                                isDraggingFiles 
                                    ? 'bg-indigo-50/90 border-indigo-500 text-indigo-700' 
                                    : 'bg-slate-50 border-slate-200 group-hover:border-indigo-500/30 group-hover:bg-white text-slate-900'
                            }`}>
                                <div className={`size-10 rounded-xl bg-white flex items-center justify-center border shadow-sm transition-all ${
                                    isDraggingFiles ? 'border-indigo-200 text-indigo-600 scale-110' : 'border-slate-100 group-hover:scale-110 text-slate-300'
                                }`}>
                                    <Plus className="size-5" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider">
                                    {isDraggingFiles ? 'Suelta las fotos aquí de un tirón' : 'Añadir fotos (selecciona o arrastra varias a la vez)'}
                                </span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                    Permite selección múltiple de fotos
                                </span>
                            </div>
                        </div>

                        <div className="pr-1 flex-1">
                            {selectedFiles.length > 0 ? (
                                <div className="grid grid-cols-3 gap-3">
                                    {selectedFiles.map((f, idx) => {
                                        const isDragging = draggedIndex === idx;
                                        return (
                                            <div 
                                                key={f.id} 
                                                draggable={true}
                                                onDragStart={(e) => handlers.onDragStart(e, idx)}
                                                onDragOver={(e) => handlers.onDragOver(e, idx)}
                                                onDrop={(e) => handlers.onDrop(e, idx)}
                                                onDragEnd={handlers.onDragEnd}
                                                className={`relative aspect-square rounded-xl overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-300 group ${
                                                    isDragging 
                                                        ? 'opacity-30 border-2 border-indigo-500 border-dashed scale-95 z-50' 
                                                        : 'border border-slate-100 hover:shadow-md hover:border-slate-300'
                                                }`}
                                            >
                                                <img src={f.preview} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Preview" />
                                                
                                                {/* Drag Handle Indicator */}
                                                <div className="absolute top-1 left-1 size-6 rounded-lg bg-slate-900/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md pointer-events-none">
                                                    <GripVertical className="size-3.5" />
                                                </div>

                                                {/* Delete Button */}
                                                <button 
                                                    type="button" 
                                                    onClick={() => removeFile(f.id, f.preview, f.isNew)}
                                                    className="absolute top-1 right-1 size-6 rounded-lg bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-md"
                                                >
                                                    <X className="size-3" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="h-full py-16 flex items-center justify-center text-slate-300 flex-col gap-2 border border-dashed border-slate-100 rounded-2xl bg-slate-50/20">
                                    <Camera className="size-8 opacity-20" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Sin imágenes</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </form>
    </div>
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
