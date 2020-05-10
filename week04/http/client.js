/**
 * http client
 *
 *
 */

const net = require('net');
const client = net.createConnection({ port: 3000 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('GET / HTTP/1.1\r\n');
  client.write('Host: www.example.com\r\n');
  client.write('Content-Length: 0\r\n');
  client.write('\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
