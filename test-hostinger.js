const http = require('http');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(`
    <div style="font-family: sans-serif; padding: 50px; text-align: center;">
      <h1 style="color: #22c55e;">✅ Servidor Node.js Activo</h1>
      <p>Si estás viendo esto, el servidor de Hostinger está funcionando correctamente.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #666; font-size: 14px;">Esto significa que el problema es el proceso de <b>Next.js Build</b>.</p>
      <p style="color: #666; font-size: 14px;">Próximo paso: Vuelve a poner el Entry Point a <b>server.js</b> y asegúrate de correr <b>npm run build</b>.</p>
    </div>
  `);
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
