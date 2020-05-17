const css = require('css');

// 每加入一个新的函数，addCSSRules，这里我们把CSS规则暂存到一个数组里
let rules = [];
function addCSSRules(text) {
  var ast = css.parse(text);
  // console.log(JSON.stringify(ast, null, "  "));
  rules.push(...ast.stylesheet.rules);
}

/**
 * 获取父元素
 * @param element
 */
function getParents(element) {
  const elements = [];
  let node = element.parentNode
  while (node) {
    // 顺序为从里到外，匹配规则
    //
    // div <- div <- #myId
    elements.push(node);
    node = node.parentNode;
  }
  return elements;
}

/**
 * 计算元素css
 * 创建 html 元素的时候还没有规则，等到规则加载完成后会进行 *重绘*
 * @param element
 */
function computeCSS(element) {
  const elements = getParents(element);
  console.log(element);
}

module.exports = {
  addCSSRules,
  computeCSS
}
