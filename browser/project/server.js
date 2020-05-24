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
    .mainWrapper { 
      margin: 20px; 
      border-top: 10px; 
      display: flex; 
      width: 500px; height: 500px; 
      flex-wrap: wrap; 
      background-color: rgb(233,233,233);
      justify-content: space-around;
      align-content: space-between;
    }
    .mainWrapper .left { width: 200px; background-color: rgb(11,222,33); }
    .mainWrapper .right { width: 50px; height: 50px; background-color: rgb(27,239,208) }
    #gaga + div { width: 150px; height: 250px; background-color: rgb(223,0,0) }
    img + div > header ~div.last { background-color: rgb(250,250,84); width: 200px; height: 200px; }
    .last + div { flex: 1; background-color: rgb(236,158,79) }
    div.mainWrapper > div:not(.last) { background-color: rgb(223,0,232) }
  </style>
</head>
<body>
  <h1>hello world</h1>
  <img src="https://www.baidu.com" alt="head" />
  <div class="mainWrapper">
    <header class="left">big head</header>
    <section id="gaga" class="right">
      <h1>gaga</h1>
    </section>
    <div>111</div>
    <div class="last">222</div>
    <div>333</div>
  </div>
</body>
</html>`);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
