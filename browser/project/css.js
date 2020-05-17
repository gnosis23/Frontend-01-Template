const css = require('css');

// 每加入一个新的函数，addCSSRules，这里我们把CSS规则暂存到一个数组里
let rules = [];
function addCSSRules(text) {
  var ast = css.parse(text);
  // console.log(JSON.stringify(ast, null, "  "));
  rules.push(...ast.stylesheet.rules);
}

function computeCSS(element) {
  // 创建 html 元素的时候还没有规则，等到规则加载完成后会进行 *重绘*
  console.log(element);
}

module.exports = {
  addCSSRules,
  computeCSS
}
