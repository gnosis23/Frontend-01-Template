const http = require('http');

const options = {
  host: 'localhost',
  port: 8081,
  path: '/?filename=x.html',
  method: 'GET'
};

const req = http.request(options)
req.end()
