const http = require('http');
const { fstat } = require('fs');
const fs = require('fs');
const archiver = require('archiver');
const child_process = require('child_process');

let packageName = './package';


const options = {
  host: 'localhost',
  port: 8081,
  path: '/?filename=package.zip',
  method: 'POST',  headers: {
    'Content-Type': 'application/octet-stream'
  }
};


const req = http.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
});

req.on(`error`, e => {
  console.error(`problem with request: ${e.message}`);
});

var archive = archiver('zip', {
  zlib: { level: 9 }
});

archive.directory(packageName, false);

archive.finalize();

archive.pipe(req);

archive.on('end', () => {
  req.end();
  const redirect_url = encodeURIComponent('http://localhost:8081/auth')
  child_process.exec(`open https://github.com/login/oauth/authorize?client_id=Iv1.1f5811e6477e3e00&redirect_uri=${redirect_url}&scope=user%3Aread&state=123abc`)
});

