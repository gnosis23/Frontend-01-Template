const css = require('css');
const { parseSelector } = require('./selector');

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
 * 获取属性名称
 * @param element
 * @param attributeName
 * @return null | Object
 */
function getAttribute(element, attributeName) {
  const attrs = element.attributes || [];
  return attrs.find(x => x.name === attributeName);
}

/**
 * 匹配元素与选择器，须满足如下所有条件：
 * 1 如果选择器有tag名称，匹配
 * 2 如果选择器有id名称，匹配
 * 3 如果选择器有class名称，匹配
 * 4 如果选择器有attributes，匹配
 *
 * @param element
 * @param selector
 * @returns {boolean}
 */
function match(element, selector) {
  if (!selector || !element.attributes) return false;

  // 1 匹配 tag
  if (selector.tagName) {
    if (selector.tagName !== element.tagName)
      return false;
  }

  // 2 匹配 id
  if (selector.ids.length > 0) {
    const attr = getAttribute(element, 'id');
    if (!attr || attr.value !== selector.ids[0])
      return false;
  }

  // 3 匹配 class
  if (selector.classes.length > 0) {
    const attr = getAttribute(element, 'class');
    if (!attr) return false;

    const classNames = attr.value ? attr.value.split(' ').filter(x => x) : [];
    for (let i = 0; i < selector.classes.length; ++i) {
      if (!classNames.includes(selector.classes[i]))
        return false;
    }
  }

  // 4 匹配 attributes
  if (selector.attributes.length > 0) {
    for (let i = 0; i < selector.attributes.length; ++i) {
      const selectorAttr = selector.attributes[i];
      const elementAttr = getAttribute(element, selectorAttr.name);

      if (!elementAttr) return false;
      if (selector.operator) {
        // todo: 这里先只考虑=号
        if (selectorAttr.operand !== elementAttr.value)
          return false;
      }
    }
  }

  // return element.tagName === selector;
  return true;
}

function specificity(selectorParts) {
  const p = [0, 0, 0, 0];
  for (let part of selectorParts) {
    p[1] += (part.ids.length > 0 ? 1 : 0);
    p[2] += part.classes.length;
    p[3] += part.attributes.length;
  }
  return p;
}

function compare(sp1, sp2) {
  for (let i = 0; i < 4; i++)
    if (sp1[i] - sp2[i]) return sp1[i] - sp2[i];

  return 0;
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
    const selectorParts = parseSelector(rule.selectors[0]).reverse();

    if (!match(element, selectorParts[0]))
      continue;

    let j = 1;
    for (let i = 0; i < elements.length && selectorParts.length > j; i++) {
      if (match(elements[i], selectorParts[j])) j++;
    }
    if (j >= selectorParts.length) matched = true;

    if (matched) {
      // console.log(rule.selectors[0], '-', element.tagName);
      let sp = specificity(selectorParts);
      let computedStyle = element.computedStyle;
      for (let declaration of rule.declarations) {
        if (!computedStyle[declaration.property])
          computedStyle[declaration.property] = {};

        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        } else if(compare(computedStyle[declaration.property].specificity, sp) <= 0) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }
      }
    }
  }
}

module.exports = {
  addCSSRules,
  computeCSS
}
