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
    const version = formData.get('version') as string;
    const kilometraje = parseInt(formData.get('kilometraje') as string) || 0;
    const numero_duenos = parseInt(formData.get('numero_duenos') as string) || 1;
    const es_toma_avaluo = true; // Implicitly true for appraisals
    
    // Procesar Fotos
    const photoFiles = formData.getAll('fotos') as File[];
    const uploadedUrls: string[] = [];

    const normalizedMarca = normalizeString(marca);
    const normalizedModelo = normalizeString(modelo);
    const timestamp = Date.now();

    for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];
        if (file.size === 0) continue;

        const arrayBuffer = await file.arrayBuffer();
        let finalBuffer = new Uint8Array(arrayBuffer);
        finalBuffer = await imageProcessor.optimize(finalBuffer);
        
        const filename = `${normalizedMarca}_${normalizedModelo}_${timestamp}_${i}.webp`;
        const url = await storageService.save(finalBuffer, filename);
        uploadedUrls.push(url);
    }

    // Procesar Documentos
    const processDoc = async (key: string, prefix: string) => {
        const file = formData.get(key) as File;
        if (!file || file.size === 0) return null;
        const arrayBuffer = await file.arrayBuffer();
        const optimized = await imageProcessor.optimize(new Uint8Array(arrayBuffer));
        const filename = `${prefix}_${normalizedMarca}_${normalizedModelo}_${Date.now()}.webp`;
        return await storageService.save(optimized, filename);
    };

    const url_factura = await processDoc('factura', 'doc_factura');
    const url_tarjeta_circulacion = await processDoc('tarjeta_circulacion', 'doc_tarjeta');
    const url_poliza_seguro = await processDoc('poliza_seguro', 'doc_poliza');
    const url_ine_propietario = await processDoc('ine_propietario', 'doc_ine');
    const url_contrato_compraventa = await processDoc('contrato_compraventa', 'doc_contrato');

    const autoId = await autoRepo.create({
        marca,
        modelo,
        anio,
        tipo,
        version,
        kilometraje,
        numero_duenos,
        es_toma_avaluo,
        url_factura,
        url_tarjeta_circulacion,
        url_poliza_seguro,
        url_ine_propietario,
        url_contrato_compraventa,
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
        fotos_url: uploadedUrls,
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
        const arrayBuffer = await hojaAvaluoFile.arrayBuffer();
        let finalDocBuffer = new Uint8Array(arrayBuffer);
        let ext = hojaAvaluoFile.name.split('.').pop()?.toLowerCase();
        let docFilename = `hoja_avaluo_${Date.now()}.${ext}`;

        if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) {
            finalDocBuffer = await imageProcessor.optimize(finalDocBuffer);
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

    if (status === 'toma') {
        const { MySQLAutoRepository } = await import("@/infrastructure/repositories/MySQLAutoRepository");
        const autoRepo = new MySQLAutoRepository();
        
        // Sincronizar fotos del avalúo al auto al pasar a inventario
        const photos = typeof avaluo.fotos_url === 'string' 
            ? JSON.parse(avaluo.fotos_url || '[]') 
            : (avaluo.fotos_url || []);

        await autoRepo.update(avaluo.id_auto, {
            estado_logico: 'inventario',
            fecha_registro_inventario: new Date(),
            fotos_url: photos
        });
    }

    revalidatePath(`/avaluos/${avaluoId}`);
    revalidatePath('/avaluos');
    revalidatePath('/inventario');
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
        fotos_url: uploadedUrls,
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
    await avaluoRepo.update(avaluoId, { 
        fotos_url: photos
    });

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
    await avaluoRepo.update(avaluoId, { 
        fotos_url: updatedPhotos
    });

    revalidatePath(`/avaluos/${avaluoId}`);
}


export async function updateAvaluoFieldAction(avaluoId: number, field: string, value: any) {
    const session = await getSession();
    if (!session || session.role !== 'director') throw new Error("No autorizado");

    const { MySQLAvaluoRepository } = await import("@/infrastructure/repositories/MySQLAvaluoRepository");
    const repo = new MySQLAvaluoRepository();
    
    const avaluo = await repo.findById(avaluoId);
    if (!avaluo) throw new Error("Avalúo no encontrado");

    // Si el campo es status, también agregamos al historial
    let updates: any = { [field]: value };
    
    if (field === 'sub_estado_avaluo') {
        let history = [];
        if (typeof avaluo.comentarios_historial === 'string') {
            try { history = JSON.parse(avaluo.comentarios_historial); } catch { history = []; }
        } else if (Array.isArray(avaluo.comentarios_historial)) {
            history = avaluo.comentarios_historial;
        }
        history.push({
            fecha: new Date().toISOString(),
            comentario: `Cambio de estado rápido a: ${value.toUpperCase()}`,
            usuario: session.nombre
        });
        updates.comentarios_historial = history;
    }

    const success = await repo.update(avaluoId, updates);
    if (success) {
        revalidatePath('/avaluos');
        return { success: true };
    }
    return { error: 'No se pudo actualizar' };
}

export async function updateClientFieldAction(id_cliente: number, field: string, value: any) {
    const { MySQLClientRepository } = await import("@/infrastructure/repositories/MySQLClientRepository");
    const repo = new MySQLClientRepository();
    try {
      const success = await repo.update(id_cliente, { [field]: value });
      if (success) {
        revalidatePath('/clientes');
        revalidatePath('/apartados');
        return { success: true };
      }
      return { error: 'No se pudo actualizar el cliente' };
    } catch (error) {
      console.error('Action Error:', error);
      return { error: 'Error interno del servidor' };
    }
}
