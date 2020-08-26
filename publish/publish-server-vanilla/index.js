const http = require('http');
const fs = require('fs');
const axios = require('axios');

const server = http.createServer((req, res) => {
  if (req.url.match(/^\/auth/))
    return auth(req, res)

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

function auth(req, res) {
  let code = req.url.match(/code=([^&]+)/)[1];
  console.log(code);

  let state = "abc123"
  // FIXME: secret
  let client_secret = ""
  let client_id = "Iv1.1f5811e6477e3e00"
  let redirect_uri = "http://localhost:8081/auth"

  let url = 'https://github.com/login/oauth/access_token'
  axios.post(url, {
    code,
    state,
    client_secret,
    client_id,
    redirect_uri
  }).then(response => {
    let token = response.data.match(/access_token=([^&]+)/)[1]
    console.log(token)
    res.writeHead(200, {
      'access_token': token,
      'Content-Type': 'text/plain'
    })
    res.end('okay');
  }).catch(err => {
    console.error(err);
    res.end('error');
  })
}
