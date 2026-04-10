const bcrypt = require('bcryptjs');

const users = [
    { email: 'andres@autosuz.com', pass: 'director_pass_2026' },
    { email: 'gerencia@autosuz.com', pass: 'gerente_secure_99' },
    { email: 'juan.ventas@autosuz.com', pass: 'vendedor_123' },
    { email: 'redes@autosuz.com', pass: 'social_media_2026' },
    { email: 'ti@autosuz.com', pass: 'root_admin_access' }
];

async function generateHashes() {
    console.log("--- SQL UPDATES ---");
    for (const user of users) {
        const hash = await bcrypt.hash(user.pass, 10);
        console.log(`UPDATE usuarios SET password_hash = '${hash}' WHERE email = '${user.email}';`);
    }
}

generateHashes();
