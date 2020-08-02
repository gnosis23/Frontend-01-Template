const { stdout } = require("ttys");
const cursor = require('./cursor');

// https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin
var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

function getChar() {
  return new Promise(resolve => {
    stdin.once('data', key => resolve(key));
  });
}

module.exports = async function select(choices) {
  let selected = 0;
  for (let i = 0;  i < choices.length; i++) {
    let choice = choices[i];
    if (i === selected) {
      stdout.write('[x] ' + choice + '\n');
    } else {
      stdout.write('[ ] ' + choice + '\n');
    }
  }
  cursor.up(stdout, choices.length);
  cursor.right(stdout);
  while(true) {
    let char = await getChar();
    if (char === '\u0003') {
      process.exit();
      break;
    }
    if (char === 'w' && selected > 0) {
      stdout.write(' ');
      cursor.left(stdout);
      selected--;
      cursor.up(stdout);
      stdout.write('x')
      cursor.left(stdout);
    }
    if (char === 's' && selected < choices.length - 1) {
      stdout.write(' ');
      cursor.left(stdout);
      selected++;
      cursor.down(stdout);
      stdout.write('x');
      cursor.left(stdout);
    }
    if (char === '\r') {
      cursor.down(stdout, choices.length - selected);
      cursor.left(stdout);
      return choices[selected];
    }
  }
}
