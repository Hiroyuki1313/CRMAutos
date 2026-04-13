try {
    const sharp = require('sharp');
    console.log('✅ Sharp cargado correctamente');
    console.log('Versión:', sharp.versions);
} catch (error) {
    console.error('❌ Error cargando Sharp:', error.message);
}
