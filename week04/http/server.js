/**
 * node http server
 *
 * Usage: node ./server.js
 *
 */

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

function printBaseLine(req) {
  const time = (new Date().toLocaleString())
  console.log('========================================')
  console.log(time, req.method, req.url);
  console.log('========================================')
  console.log(req.headers);
}

const server = http.createServer((req, res) => {
  printBaseLine(req);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
