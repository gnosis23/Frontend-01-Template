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

function match(element, selector) {
  if (!selector || !element.attributes) return false;

  if (selector.charAt(0) === '#') {
    const attr = element.attributes.find(attr => attr.name === 'id')
    if (attr && attr.value === selector.replace('#', ''))
      return true;
  } else if (selector.charAt(0) === '.') {
    // class可以用空格分割
    const attr = element.attributes.find(attr => attr.name === 'class')
    if (attr && attr.value) {
      const classNames = attr.value.split(' ').filter(x => x);
      if (classNames.some(name => name === selector.replace('.', '')))
        return true;
    }
  }

  return element.tagName === selector;
}

/**
 * 计算元素css
 * 创建 html 元素的时候还没有规则，等到规则加载完成后会进行 *重绘*
 * @param element
 */
function computeCSS(element) {
  const elements = getParents(element);
  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (let rule of rules) {
    let matched
    // 其他情况:
    // main>div.a#id[attr=value]
    const selectorParts = rule.selectors[0].split(' ').reverse();

    if (!match(element, selectorParts[0]))
      continue;

    let j = 1;
    for (let i = 0; i < elements.length && selectorParts.length > j; i++) {
      if (match(elements[i], selectorParts[j])) j++;
    }
    if (j >= selectorParts.length) matched = true;

    if (matched) {
      console.log("Element", element.tagName, "rule", rule.selectors)
    }
  }

  // TODO: 加上行内样式
}

module.exports = {
  addCSSRules,
  computeCSS
}
