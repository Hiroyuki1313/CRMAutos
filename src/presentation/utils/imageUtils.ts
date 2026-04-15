
/**
 * Optimizador de imágenes de alta eficiencia para el lado del cliente.
 * Reduce el peso de las imágenes (especialmente fotos de WhatsApp/Cámara)
 * antes de enviarlas al servidor mediante Server Actions.
 */

export async function optimizeImage(
    file: File, 
    maxWidth = 1920, 
    maxHeight = 1080, 
    quality = 0.8
): Promise<File> {
    // Solo procesar imágenes procesables
    if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') {
        return file;
    }

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Cálculo de dimensiones manteniendo relación de aspecto
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(file);
                    return;
                }

                // Dibujar con suavizado
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                // Convertir a WebP (mejor compresión que JPEG)
                canvas.toBlob((blob) => {
                    if (blob) {
                        // Crear un nuevo archivo con el nombre original pero extensión .webp
                        const newName = file.name.split('.').slice(0, -1).join('.') + '.webp';
                        const optimizedFile = new File([blob], newName, {
                            type: 'image/webp',
                            lastModified: Date.now()
                        });
                        resolve(optimizedFile);
                    } else {
                        resolve(file);
                    }
                }, 'image/webp', quality);
            };

            img.onerror = () => resolve(file);
        };
        reader.onerror = () => resolve(file);
    });
}

/**
 * Helper para detectar si un archivo es una imagen optimizable.
 */
export const isOptimizableImage = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
    return file.type.startsWith('image/') && validTypes.includes(file.type.toLowerCase()) || 
           /\.(jpe?g|png|webp|heic)$/i.test(file.name);
};
