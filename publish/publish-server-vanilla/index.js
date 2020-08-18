const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  let matched = req.url.match(/filename=([^&]+)/);
  let filename = (matched && matched[1]);
  if (!filename) return;
  console.log(filename);
  let writeStream = fs.createWriteStream('../server/public/' + filename)
  req.pipe(writeStream);
  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
  });
});

server.listen(8081);
