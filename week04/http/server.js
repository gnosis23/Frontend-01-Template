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
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.setHeader('server', 'node.js http server');
  res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Hypertext Transfer Protocol</title>
  <style>
    body { font-size: 100px; }
  </style>
</head>
<body>
  <h1>hello world</h1>
</body>
</html>
  `);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
