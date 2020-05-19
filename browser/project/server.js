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
    #gaga { flex: 2 }
    .mainWrapper .left { width: 200px; }
    .mainWrapper .right { flex: 1 }
    img[src] { font-size: 100px; }
    [alt] { color: red; }
    div header.left + section#gaga { background: green; }
    section.right>h1 { color: blue; }
    img + div > header + section + div + div.last { color: #22777f; }
    img + div > header ~div.last { color: #22777f; }
    img ~ div > header ~div ~div.last { color: #22777f; }
  </style>
</head>
<body>
  <h1>hello world</h1>
  <img src="https://www.baidu.com" alt="head" />
  <div class="mainWrapper">
    <header class="left">big head</header>
    <section id="gaga" class="right">
      <h1>gaga</h1>
      <article class=" left test right ">hello</article>
    </section>
    <div>111</div>
    <div class="last">222</div>
  </div>
</body>
</html>`);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
