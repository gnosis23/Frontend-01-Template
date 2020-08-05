const readline = require('readline');
const MuteStream = require('mute-stream');
const chalk = require('chalk');
const cursor = require('./cursor');

// https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin

let renderId = 0;
function render(rl, choices, nextSelected) {

  // clear
  if (renderId !== 0) {
    cursor.to(rl.output, 0, choices.length);
    cursor.clearLine(rl.output, choices.length + 1);
  } else {
    cursor.savePosition(rl.output);
  }
  renderId++;

  // rerender
  for (let i = 0;  i < choices.length; i++) {
    let choice = choices[i];
    if (i === nextSelected) {
      rl.output.write(chalk.blue(`[x] ${choice}\n`));
    } else {
      rl.output.write('[ ] ' + choice + '\n');
    }
  }

  // move cursor
  cursor.restorePosition(rl.output);
  cursor.to(rl.output, 1, nextSelected);
}

module.exports = async function select(choices) {
  const output = new MuteStream();
  output.pipe(process.stdout);

  const rl = readline.createInterface({
    terminal: true,
    input: process.stdin,
    output
  });

  let selected = 0;

  render(rl, choices, selected);

  const keyHandler = (char) => {
    if (char === 'w' && selected > 0) {
      render(rl, choices, selected - 1);
      selected--;
    }
    if (char === 's' && selected < choices.length - 1) {
      render(rl, choices, selected + 1);
      selected++;
    }
    if (char === '\r') {
      cursor.down(rl.output, choices.length - selected);
      cursor.left(rl.output);
    }
  };

  rl.output.mute();
  return new Promise(resolve => {
    let handler = (c, k) => {
      rl.output.unmute();
      keyHandler(c);
      rl.output.mute();

      if (c === '\r') {
        rl.input.removeListener('keypress', handler);
        rl.output.unmute();
        resolve(choices[selected]);
      }
    };
    rl.input.on('keypress', handler);
  });
}
