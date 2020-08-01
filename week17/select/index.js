
// FIXME: getChar实现很傻
// https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin
const { stdout } = require("ttys");
var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

function getChar() {
  return new Promise(resolve => {
    stdin.once('data', key => resolve(key));
  });
}

// 命令行光标移动
// https://stackoverflow.com/questions/10585683/how-do-you-edit-existing-text-and-move-the-cursor-around-in-the-terminal/10830168
function up(n = 1) {
  stdout.write('\033[' + n + 'A');
}

function down(n = 1) {
  stdout.write('\033[' + n + 'B');
}

function right(n = 1) {
  stdout.write('\033[' + n + 'C');
}

function left(n = 1) {
  stdout.write('\033[' + n + 'D');
}

async function select(choices) {
  let selected = 0;
  for (let i = 0;  i < choices.length; i++) {
    let choice = choices[i];
    if (i === selected) {
      stdout.write('[x] ' + choice + '\n');
    } else {
      stdout.write('[ ] ' + choice + '\n');
    }
  }
  up(choices.length);
  right();
  while(true) {
    let char = await getChar();
    if (char === '\u0003') {
      process.exit();
      break;
    }
    if (char === 'w' && selected > 0) {
      stdout.write(' ');
      left();
      selected--;
      up();
      stdout.write('x')
      left();
    }
    if (char === 's' && selected < choices.length - 1) {
      stdout.write(' ');
      left();
      selected++;
      down();
      stdout.write('x');
      left();
    }
    if (char === '\r') {
      down(choices.length - selected);
      left();
      return choices[selected];
    }
  }
}

void async function () {
  stdout.write('which framework do you want to use?\n');
  const selected = await select(["vue", "react", "angular"]);
  stdout.write('You selected ' + selected + '\n');
  process.exit();
}();
