// server.js
const fs = require('fs');
const https = require('https');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, hostname: 'keycloak.montfermeil.local', port: 3000 });
const handle = app.getRequestHandler();

// Options HTTPS avec tes fichiers certs
const httpsOptions = {
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.crt'),
};

app.prepare().then(() => {
  https.createServer(httpsOptions, (req, res) => {
    handle(req, res);
  }).listen(3000, () => {
    console.log('> Ready on https://keycloak.montfermeil.local:3000');
  });
});