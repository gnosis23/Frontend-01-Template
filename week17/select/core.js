const MuteStream = require('mute-stream');
const readline = require('readline');
const cursor = require('./cursor');

class Core {
  constructor(nBufferLine) {
    this.nBufferLine = nBufferLine;
    this.action = null;
    this.renderTime = 0;
  }

  initIO() {
    const output = new MuteStream();
    output.pipe(process.stdout);
    this.rl = readline.createInterface({
      terminal: true,
      input: process.stdin,
      output
    });
  }

  registerAction(action) {
    this.action = action;
  }

  removeAction() {
    this.action = null;
  }

  cleanScreen() {
    let output = this.rl.output;
    if (this.renderTime !== 0) {
      cursor.restorePosition(output);
      cursor.to(output, 0, this.nBufferLine);
      cursor.clearLine(output, this.nBufferLine + 1);
    } else {
      for (let i = 0; i < this.nBufferLine; i++) {
        output.write('\n');
      }
      cursor.up(output, this.nBufferLine);
      cursor.savePosition(output);
    }
    this.renderTime++;
  }

  moveTo(x, y) {
    cursor.restorePosition(this.rl.output);
    cursor.to(this.rl.output, x, y);
  }

  run() {
    if (!this.action) {
      throw new Error('register action before run()!');
    }

    this.initIO();
    this.cleanScreen();
    this.action.render(this, this.rl.output);

    return new Promise(resolve => {
      let handler = (char, key) => {
        this.rl.output.unmute();
        this.action.keyHandler(char, key);
        this.cleanScreen();
        this.action.render(this, this.rl.output);
        this.rl.output.mute();

        if (char === '\r') {
          this.rl.input.removeListener('keypress', handler);
          this.rl.output.unmute();
          cursor.restorePosition(this.rl.output);
          cursor.down(this.rl.output, this.nBufferLine);
          this.rl.close();
          resolve(this.action.resolve());
        }
      };
      this.rl.input.on('keypress', handler);
    });
  }
}

module.exports = Core;
