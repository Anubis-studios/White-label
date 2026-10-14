// SPDX-License-Identifier: MIT
import { createServer } from 'node:http';
import { readFileSync, realpathSync, statSync } from 'node:fs';
import { extname, isAbsolute, relative, resolve, sep } from 'node:path';

function inside(root, file) {
  const rel = relative(root, file);
  return rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
}

// Serve an explicitly selected deck directory, including its in-root assets.
// Both lexical traversal and symlinks to files outside the deck are rejected.
export async function startDeckServer(directory, entry, mimeTypes = {}) {
  const root = realpathSync(directory);
  if (!statSync(root).isDirectory()) throw new TypeError('Deck root must be a directory');
  const server = createServer((req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const port = server.address()?.port;
    const allowedHosts = new Set([`localhost:${port}`, `127.0.0.1:${port}`]);
    if (!allowedHosts.has(req.headers.host || '')) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      res.end('Method not allowed');
      return;
    }
    try {
      const pathname = decodeURIComponent((req.url || '/').split('?')[0]);
      if (!pathname.startsWith('/') || /[\0\r\n]/.test(pathname)) {
        res.writeHead(400); res.end('Bad request'); return;
      }
      const candidate = resolve(root, pathname === '/' ? entry : `.${pathname}`);
      if (!inside(root, candidate)) {
        res.writeHead(403); res.end('Forbidden'); return;
      }
      const file = realpathSync(candidate);
      if (!inside(root, file)) {
        res.writeHead(403); res.end('Forbidden'); return;
      }
      if (!statSync(file).isFile()) {
        res.writeHead(404); res.end('Not found'); return;
      }
      res.writeHead(200, { 'Content-Type': mimeTypes[extname(file).toLowerCase()] || 'application/octet-stream' });
      res.end(req.method === 'HEAD' ? undefined : readFileSync(file));
    } catch (error) {
      res.writeHead(error instanceof URIError ? 400 : 404);
      res.end(error instanceof URIError ? 'Bad request' : 'Not found');
    }
  });
  await new Promise((done, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => { server.removeListener('error', reject); done(); });
  });
  return server;
}
