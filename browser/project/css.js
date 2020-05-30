const css = require('css');
const camelcase = require('camelcase');
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
  if (!selector || !element || !element.attributes) return false;

  // 1 匹配 tag
  if (selector.tagName) {
    if (selector.tagName !== element.tagName)
      return false;
  }

  if (selector.notTagNames.length > 0) {
    if (selector.notTagNames.includes(element.tagName))
      return false;
  }

  // 2 匹配 id
  if (selector.ids.length > 0) {
    const attr = getAttribute(element, 'id');
    if (!attr || attr.value !== selector.ids[0])
      return false;
  }

  if (selector.notIds.length > 0) {
    const attr = getAttribute(element, 'id');
    if (attr && selector.notIds.includes(attr.value))
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

  if (selector.notClasses.length > 0) {
    const attr = getAttribute(element, 'class');

    if (attr) {
      const classNames = attr.value ? attr.value.split(' ').filter(x => x) : [];
      for (let i = 0; i < selector.notClasses.length; ++i) {
        if (classNames.includes(selector.notClasses[i]))
          return false;
      }
    }
  }

  // 4 匹配 attributes
  if (selector.attributes.length > 0) {
    for (let i = 0; i < selector.attributes.length; ++i) {
      const selectorAttr = selector.attributes[i];
      const elementAttr = getAttribute(element, selectorAttr.name);

      if (!elementAttr) return false;
      if (selectorAttr.operator) {
        // todo: 这里先只考虑=号
        if (selectorAttr.operand !== elementAttr.value)
          return false;
      }
    }
  }

  // todo: notAttributes

  // return element.tagName === selector;
  return true;
}

function specificity(selectorParts) {
  const p = [0, 0, 0, 0];
  // Selectors inside the negation pseudo-class are counted like any other,
  // but the negation itself does not count as a pseudo-class.
  for (let part of selectorParts) {
    p[1] += (part.ids.length > 0 ? 1 : 0);
    p[1] += part.notIds.length;
    p[2] += (part.classes.length + part.attributes.length);
    p[2] += (part.notClasses.length + part.notAttributes.length);
    p[3] += (part.tagName ? 1 : 0);
    p[3] += part.notTagNames.length;
  }
  return p;
}

function compare(sp1, sp2) {
  for (let i = 0; i < 4; i++)
    if (sp1[i] - sp2[i]) return sp1[i] - sp2[i];

  return 0;
}

function matchSelector(elements, selectorParts) {
  if (!match(elements[0], selectorParts[0]))
    return false;

  elements = elements.slice();
  let j = 1;
  let i = 0;
  let combinator = selectorParts[0].combinator;
  if (combinator === ' ' || combinator === '>') {i++;}

  while (i < elements.length && selectorParts.length > j) {
    if (combinator === ' ') {
      // 1 下降关系匹配，不匹配就找父结点
      if (match(elements[i], selectorParts[j])) {
        combinator = selectorParts[j].combinator;
        if (combinator === ' ' || combinator === '>') i++;
        j++;
      } else {
        i++;
      }
    } else if (combinator === '+') {
      // 2 相邻关系匹配，找前一个结点。不匹配就失败
      if (match(elements[i].previousElementSibling, selectorParts[j])) {
        // 相邻可以连续
        elements[i] = elements[i].previousElementSibling;
        combinator = selectorParts[j].combinator;
        if (combinator === ' ' || combinator === '>') i++;
        j++;
      } else {
        return false;
      }
    } else if (combinator === '~') {
      // 3 非相邻同集匹配，往前一直找，一直找到为止。不匹配就失败
      let nextNode = elements[i].previousElementSibling;
      let found = false;
      while (nextNode) {
        if (match(nextNode, selectorParts[j])) {
          elements[i] = nextNode;
          combinator = selectorParts[j].combinator;
          if (combinator === ' ' || combinator === '>') i++;
          j++;
          found = true;
          break;
        }
        nextNode = nextNode.previousElementSibling;
      }
      if (!found) return false;
    } else if (combinator === '>') {
      // 4 父子关系匹配，不匹配直接失败
      if (match(elements[i], selectorParts[j])) {
        combinator = selectorParts[j].combinator;
        if (combinator === ' ' || combinator === '>') i++;
        j++;
      } else {
        return false;
      }
    } else {
      throw new Error('unknown combinator ' + combinator);
    }
  }

  return j >= selectorParts.length;
}

/**
 * 计算元素css
 * 创建 html 元素的时候还没有规则，等到规则加载完成后会进行 *重绘*
 * @param element
 */
function computeCSS(element) {
  const elements = getParents(element);
  const elementList = [element, ...elements];

  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (let rule of rules) {
    // 其他情况:
    const selectorParts = parseSelector(rule.selectors[0]).reverse();

    const matched = matchSelector(elementList, selectorParts);

    if (matched) {
      // console.log(rule.selectors[0], '-', element.tagName);
      let sp = specificity(selectorParts);
      let computedStyle = element.computedStyle;
      for (let declaration of rule.declarations) {
        const property = camelcase(declaration.property)
        if (!computedStyle[property])
          computedStyle[property] = {};

        if (!computedStyle[property].specificity) {
          computedStyle[property].value = declaration.value;
          computedStyle[property].specificity = sp;
        } else if(compare(computedStyle[property].specificity, sp) <= 0) {
          computedStyle[property].value = declaration.value;
          computedStyle[property].specificity = sp;
        }
      }
    }
  }
}

module.exports = {
  addCSSRules,
  computeCSS
}
