const fs = require('fs');
const https = require('https');
const next = require('next');

const dev = true;

const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./certs/montfermeil-intranet+2-key.pem'),
  cert: fs.readFileSync('./certs/montfermeil-intranet+2.pem'),
};

app.prepare().then(() => {
  https.createServer(httpsOptions, (req, res) => {
    handle(req, res);
  }).listen(3000, '0.0.0.0', () => {
    console.log('READY https://192.168.56.11:3000');
  });
});