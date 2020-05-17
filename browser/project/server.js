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
  res.setHeader('Transfer-Encoding', 'chunked');
  res.end(`<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Hypertext Transfer Protocol</title>
  <style>
    body { font-size: 100px; }
    body h1 { color: #111; }
    div { margin: 0; padding: 0; }
    .mainWrapper { margin: 20px; border-top: 10px; display: flex }
    .mainWrapper .left { width: 200px; }
    .mainWrapper .right { flex: 1 }
  </style>
</head>
<body>
  <h1>hello world</h1>
  <img src="https://www.baidu.com" alt="head" />
  <div class="mainWrapper">
    <header class="left">big head</header>
    <section class="right">
      <h1>gaga</h1>
      <article class=" left test right ">hello</article>
    </section>
  </div>
</body>
</html>`);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
