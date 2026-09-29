const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', 'public');
const mimes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let fp = path.join(root, p);
  if (fs.existsSync(fp) && fs.statSync(fp).isDirectory()) fp = path.join(fp, 'index.html');
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': mimes[path.extname(fp)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(4321, () => console.log('listening on 4321'));
