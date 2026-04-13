'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/core/usecases/authService";

function normalizeString(str: string): string {
    return str.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

export async function createAvaluoAction(formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== 'director') {
        throw new Error("No autorizado");
    }

    const { MySQLAutoRepository } = await import("@/infrastructure/repositories/MySQLAutoRepository");
    const { MySQLAvaluoRepository } = await import("@/infrastructure/repositories/MySQLAvaluoRepository");
    const { SharpImageProcessor } = await import("@/infrastructure/services/SharpImageProcessor");
    const { LocalStorageService } = await import("@/infrastructure/services/LocalStorageService");

    const autoRepo = new MySQLAutoRepository();
    const avaluoRepo = new MySQLAvaluoRepository();
    const imageProcessor = new SharpImageProcessor();
    const storageService = new LocalStorageService();

    // 1. Extraer datos del vehículo
    const marca = formData.get('marca') as string;
    const modelo = formData.get('modelo') as string;
    const anio = parseInt(formData.get('anio') as string);
    const tipo = formData.get('tipo') as any;
    
    // Procesar Fotos
    const photoFiles = formData.getAll('fotos') as File[];
    const uploadedUrls: string[] = [];

    const normalizedMarca = normalizeString(marca);
    const normalizedModelo = normalizeString(modelo);
    const timestamp = Date.now();

    for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];
        if (file.size === 0) continue;

        const buffer = Buffer.from(await file.arrayBuffer());
        const optimizedBuffer = await imageProcessor.optimize(buffer);
        
        const filename = `${normalizedMarca}_${normalizedModelo}_${timestamp}_${i}.webp`;
        const url = await storageService.save(optimizedBuffer, filename);
        uploadedUrls.push(url);
    }

    const autoId = await autoRepo.create({
        marca,
        modelo,
        anio,
        tipo,
        fotos_url: uploadedUrls,
        estado_logico: 'frio',
        fecha_registro_inventario: null
    });

    // 2. Extraer datos del avalúo
    const ubicacion = formData.get('ubicacion') as any;
    const origen_prospeccion = formData.get('origen_prospeccion') as any;
    const oferta = parseFloat(formData.get('oferta') as string) || 0;
    const venta = parseFloat(formData.get('venta') as string) || 0;
    const compra = 0; // Se definirá después
    const comentarios = formData.get('comentarios') as string;
    const hojaAvaluoFile = formData.get('hoja_avaluo') as File;

    const avaluoId = await avaluoRepo.create({
        id_auto: autoId,
        ubicacion,
        origen_prospeccion,
        oferta,
        compra,
        venta,
        foto_principal_url: uploadedUrls[0] || null,
        sub_estado_avaluo: 'frio',
        comentarios_historial: [{
            fecha: new Date().toISOString(),
            comentario: comentarios || "Registro inicial de avalúo",
            usuario: session.nombre
        }] as any
    });

    // 3. Procesar Hoja de Avalúo si existe
    if (hojaAvaluoFile && hojaAvaluoFile.size > 0) {
        const docStorage = new LocalStorageService(`avaluos/${avaluoId}`);
        const docBuffer = Buffer.from(await hojaAvaluoFile.arrayBuffer());
        let finalDocBuffer = docBuffer;
        let ext = hojaAvaluoFile.name.split('.').pop()?.toLowerCase();
        let docFilename = `hoja_avaluo_${Date.now()}.${ext}`;

        if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
            finalDocBuffer = await imageProcessor.optimize(docBuffer);
            docFilename = `hoja_avaluo_${Date.now()}.webp`;
        }

        const docUrl = await docStorage.save(finalDocBuffer, docFilename);
        await avaluoRepo.update(avaluoId, { hoja_avaluo_url: docUrl });
    }

    revalidatePath('/avaluos');
    revalidatePath('/inventario');
    redirect('/avaluos');
}

export async function addAvaluoCommentAction(avaluoId: number, comment: string) {
    const session = await getSession();
    if (!session || session.role !== 'director') throw new Error("No autorizado");

    const { MySQLAvaluoRepository } = await import("@/infrastructure/repositories/MySQLAvaluoRepository");
    const repo = new MySQLAvaluoRepository();
    const avaluo = await repo.findById(avaluoId);
    if (!avaluo) throw new Error("Avalúo no encontrado");

    // Manejar historial (parsing si es string, o arreglo si ya viene procesado)
    let history = [];
    if (typeof avaluo.comentarios_historial === 'string') {
        try {
            history = JSON.parse(avaluo.comentarios_historial);
        } catch {
            history = [];
        }
    } else if (Array.isArray(avaluo.comentarios_historial)) {
        history = avaluo.comentarios_historial;
    }

    history.push({
        fecha: new Date().toISOString(),
        comentario: comment,
        usuario: session.nombre
    });

    await repo.update(avaluoId, { comentarios_historial: history });
    revalidatePath(`/avaluos/${avaluoId}`);
}

export async function updateAvaluoStatusAction(avaluoId: number, status: any) {
    const session = await getSession();
    if (!session || session.role !== 'director') throw new Error("No autorizado");

    const { MySQLAvaluoRepository } = await import("@/infrastructure/repositories/MySQLAvaluoRepository");
    const repo = new MySQLAvaluoRepository();
    
    const avaluo = await repo.findById(avaluoId);
    if (!avaluo) throw new Error("Avalúo no encontrado");

    let history = [];
    if (typeof avaluo.comentarios_historial === 'string') {
        try {
            history = JSON.parse(avaluo.comentarios_historial);
        } catch {
            history = [];
        }
    } else if (Array.isArray(avaluo.comentarios_historial)) {
        history = avaluo.comentarios_historial;
    }

    history.push({
        fecha: new Date().toISOString(),
        comentario: `Cambio de estado a: ${status.toUpperCase()}`,
        usuario: session.nombre
    });

    await repo.update(avaluoId, { 
        sub_estado_avaluo: status,
        comentarios_historial: history
    });

    revalidatePath(`/avaluos/${avaluoId}`);
    revalidatePath('/avaluos');
}

export async function updateAvaluoCompleteAction(formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== 'director') throw new Error("No autorizado");

    const { MySQLAutoRepository } = await import("@/infrastructure/repositories/MySQLAutoRepository");
    const { MySQLAvaluoRepository } = await import("@/infrastructure/repositories/MySQLAvaluoRepository");
    const { SharpImageProcessor } = await import("@/infrastructure/services/SharpImageProcessor");
    const { LocalStorageService } = await import("@/infrastructure/services/LocalStorageService");

    const autoRepo = new MySQLAutoRepository();
    const avaluoRepo = new MySQLAvaluoRepository();
    const imageProcessor = new SharpImageProcessor();
    const storageService = new LocalStorageService();

    const avaluoId = parseInt(formData.get('avaluoId') as string);
    const id_auto = parseInt(formData.get('id_auto') as string);
    const oferta = parseFloat(formData.get('oferta') as string);
    const venta = parseFloat(formData.get('venta') as string);
    const justification = formData.get('justification') as string;
    
    const currentPhotos = JSON.parse(formData.get('currentPhotos') as string);
    const newPhotos = formData.getAll('newPhotos') as File[];

    if (!justification?.trim()) throw new Error("El comentario de justificación es obligatorio");

    const avaluo = await avaluoRepo.findById(avaluoId);
    if (!avaluo) throw new Error("Avalúo no encontrado");

    // Procesar nuevas fotos si existen
    const uploadedUrls: string[] = [...currentPhotos];
    if (newPhotos && newPhotos.length > 0) {
        for (let i = 0; i < newPhotos.length; i++) {
            const file = newPhotos[i];
            if (!file || file.size === 0) continue;
            const buffer = Buffer.from(await file.arrayBuffer());
            const optimizedBuffer = await imageProcessor.optimize(buffer);
            const filename = `rev_${avaluoId}_${Date.now()}_${i}.webp`;
            const url = await storageService.save(optimizedBuffer, filename);
            uploadedUrls.push(url);
        }
    }

    // Actualizar fotos en la tabla autos
    await autoRepo.update(id_auto, { fotos_url: uploadedUrls });

    // Actualizar precios e historial
    let history = [];
    if (typeof avaluo.comentarios_historial === 'string') {
        try {
            history = JSON.parse(avaluo.comentarios_historial);
        } catch { history = []; }
    } else if (Array.isArray(avaluo.comentarios_historial)) {
        history = avaluo.comentarios_historial;
    }

    history.push({
        fecha: new Date().toISOString(),
        comentario: `[Actualización de Datos] ${justification}`,
        usuario: session.nombre,
        metadata: { oferta, venta, fotos_count: uploadedUrls.length }
    });

    await avaluoRepo.update(avaluoId, {
        oferta,
        venta,
        foto_principal_url: uploadedUrls[0] || null,
        comentarios_historial: history
    });

    revalidatePath(`/avaluos/${avaluoId}`);
    revalidatePath('/avaluos');
}

export async function addPhotosToAvaluoAction(avaluoId: number, id_auto: number, formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== 'director') throw new Error("No autorizado");

    const { MySQLAutoRepository } = await import("@/infrastructure/repositories/MySQLAutoRepository");
    const { MySQLAvaluoRepository } = await import("@/infrastructure/repositories/MySQLAvaluoRepository");
    const { SharpImageProcessor } = await import("@/infrastructure/services/SharpImageProcessor");
    const { LocalStorageService } = await import("@/infrastructure/services/LocalStorageService");

    const autoRepo = new MySQLAutoRepository();
    const avaluoRepo = new MySQLAvaluoRepository();
    const auto = await autoRepo.findById(id_auto);
    if (!auto) throw new Error("Auto no encontrado");

    const newFiles = formData.getAll('newPhotos') as File[];
    const imageProcessor = new SharpImageProcessor();
    const storageService = new LocalStorageService();

    let photos = [];
    try {
        photos = typeof auto.fotos_url === 'string' ? JSON.parse(auto.fotos_url) : (auto.fotos_url || []);
    } catch { photos = []; }

    for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        if (!file || file.size === 0) continue;
        const buffer = Buffer.from(await file.arrayBuffer());
        const optimizedBuffer = await imageProcessor.optimize(buffer);
        const filename = `add_${avaluoId}_${Date.now()}_${i}.webp`;
        const url = await storageService.save(optimizedBuffer, filename);
        photos.push(url);
    }

    await autoRepo.update(id_auto, { fotos_url: photos });
    await avaluoRepo.update(avaluoId, { foto_principal_url: photos[0] || null });

    revalidatePath(`/avaluos/${avaluoId}`);
}

export async function removePhotoFromAvaluoAction(avaluoId: number, id_auto: number, photoUrl: string) {
    const session = await getSession();
    if (!session || session.role !== 'director') throw new Error("No autorizado");

    const { MySQLAutoRepository } = await import("@/infrastructure/repositories/MySQLAutoRepository");
    const { MySQLAvaluoRepository } = await import("@/infrastructure/repositories/MySQLAvaluoRepository");

    const autoRepo = new MySQLAutoRepository();
    const avaluoRepo = new MySQLAvaluoRepository();
    const auto = await autoRepo.findById(id_auto);
    if (!auto) throw new Error("Auto no encontrado");

    let photos = [];
    try {
        photos = typeof auto.fotos_url === 'string' ? JSON.parse(auto.fotos_url) : (auto.fotos_url || []);
    } catch { photos = []; }

    const updatedPhotos = photos.filter((p: string) => p !== photoUrl);

    await autoRepo.update(id_auto, { fotos_url: updatedPhotos });
    await avaluoRepo.update(avaluoId, { foto_principal_url: updatedPhotos[0] || null });

    revalidatePath(`/avaluos/${avaluoId}`);
}

