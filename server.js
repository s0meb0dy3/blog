const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;
const PUBLIC_DIR = './dist';

const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(url.parse(req.url).pathname);
    let filePath = path.join(PUBLIC_DIR, pathname);

    if (pathname === '/') {
        filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1><p>Page not found</p>');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + err.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    const ip = require('os').networkInterfaces().eth0?.[0]?.address || '127.0.0.1';
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
    console.log(`WSL access: http://${ip}:${PORT}/`);
});

console.log('Starting server...');