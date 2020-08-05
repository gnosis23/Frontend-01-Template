const ansiEscape = require('ansi-escapes');

// 命令行光标移动
// https://stackoverflow.com/questions/10585683/how-do-you-edit-existing-text-and-move-the-cursor-around-in-the-terminal/10830168
function up(output, n = 1) {
  output.write(ansiEscape.cursorUp(n));
}

function down(output, n = 1) {
  output.write(ansiEscape.cursorDown(n));
}

function right(output, n = 1) {
  output.write(ansiEscape.cursorForward(n));
}

function left(output, n = 1) {
  output.write(ansiEscape.cursorBackward(n));
}

function clearLine(output, n) {
  output.write(ansiEscape.eraseLines(n));
}

function to(output, x, y) {
  output.write(ansiEscape.cursorMove(x, y));
}

function savePosition(output) {
  output.write(ansiEscape.cursorSavePosition);
}

function restorePosition(output) {
  output.write(ansiEscape.cursorRestorePosition);
}

module.exports = {
  up,
  down,
  left,
  right,
  clearLine,
  to,
  savePosition,
  restorePosition
}
