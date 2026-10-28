import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const root = fileURLToPath(new URL('../dist/pages/', import.meta.url))
const { base } = JSON.parse(await readFile(resolve(root, 'site.json'), 'utf8'))
const { values } = parseArgs({ options: { port: { type: 'string', default: '4173' } } })
const port = Number(values.port)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid port')
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.md': 'text/plain', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff': 'font/woff', '.woff2': 'font/woff2' }
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    if (pathname === '/' && base !== '/' || base !== '/' && pathname === base.slice(0, -1)) {
      response.writeHead(302, { Location: base }).end()
      return
    }
    if (!pathname.startsWith(base)) { response.writeHead(404).end('Not found'); return }
    let path = resolve(root, pathname.slice(base.length))
    if (path !== root.slice(0, -1) && !path.startsWith(root.endsWith(sep) ? root : root + sep)) { response.writeHead(403).end(); return }
    if ((await stat(path)).isDirectory()) {
      if (!pathname.endsWith('/')) { response.writeHead(302, { Location: `${pathname}/` }).end(); return }
      path = resolve(path, 'index.html')
    }
    const body = await readFile(path)
    response.writeHead(200, { 'Content-Type': `${types[extname(path)] || 'application/octet-stream'}${['.html', '.js', '.css', '.json', '.md'].includes(extname(path)) ? '; charset=utf-8' : ''}`, 'Cache-Control': 'no-store' })
    response.end(request.method === 'HEAD' ? undefined : body)
  } catch (error) {
    response.writeHead(error instanceof URIError ? 400 : 404).end('Not found')
  }
})
server.listen(port, '127.0.0.1', () => console.log(`Presentations: http://localhost:${port}${base}`))
