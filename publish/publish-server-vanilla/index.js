const http = require('http');
const https = require('https');
const fs = require('fs');
const axios = require('axios');

const server = http.createServer((req, res) => {
  if (req.url.match(/^\/auth/))
    return auth(req, res)

  if (!req.url.match(/^\/?/)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('not found');
  }


  const options = {
    hostname: 'api.github.com',
    port: 443,
    path: `/user`,
    method: 'GET',
    headers: {
      Authorization: 'token ' + req.headers.token,
      "User-Agent": "Awesome-Octocat-App"
    }
  };

  const request = https.request(options, (response) => {
    response.on('data', d => {
      let result = d.toString();
      console.log(result);
    })
  });

  request.on('error', e => console.error(e));

  request.end();

  // let matched = req.url.match(/filename=([^&]+)/);
  // let filename = (matched && matched[1]);
  // if (!filename) return;
  // console.log(filename);
  // let writeStream = fs.createWriteStream('../server/public/' + filename)
  // req.pipe(writeStream);
  // req.on('end', () => {
  //   res.writeHead(200, { 'Content-Type': 'text/plain' });
  //   res.end('okay');
  // });
});

server.listen(8081);

function auth(req, res) {
  let code = req.url.match(/code=([^&]+)/)[1];
  console.log(code);

  let state = "abc123"
  // FIXME: 换回私钥
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
    let match = response.data.match(/access_token=([^&]+)/)
    if (match) {
      const token = match[1];
      res.writeHead(200, {
        'access_token': token,
        'Content-Type': 'text/html'
      })
      res.end(`<a href="http://localhost:8080/publish?token=${token}">publish</a>`);
    } else {
      res.writeHead(400, {
        'Content-Type': 'text/plain'
      })
      res.end('error');
    }
  }).catch(err => {
    console.error(err);
    res.end('error');
  })
}
