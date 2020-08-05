const Core = require('./core');
const chalk = require('chalk');

// https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin

class SelectAction {
  constructor(choices) {
    this.selected = 0;
    this.choices = choices;
  }

  render(core, output) {
    for (let i = 0;  i < this.choices.length; i++) {
      let choice = this.choices[i];
      if (i === this.selected) {
        output.write(chalk.blue(`[x] ${choice}\n`));
      } else {
        output.write('[ ] ' + choice + '\n');
      }
    }

    core.moveTo(1, this.selected);
  }

  keyHandler(char, key) {
    if ((char === 'w' || key.name === 'up') && this.selected > 0) {
      this.selected--;
    }
    if ((char === 's' || key.name === 'down') && this.selected < this.choices.length - 1) {
      this.selected++;
    }
  }

  resolve() {
    return this.choices[this.selected];
  }
}

module.exports = async function select(choices) {
  let core = new Core(choices.length || 10);
  let action = new SelectAction(choices);
  core.registerAction(action);
  return await core.run();
}
