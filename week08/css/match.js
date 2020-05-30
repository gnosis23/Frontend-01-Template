const { parseSelector } = require('../../browser/project/selector');

/**
 * 获取html元素
 * @param {HTMLElement} element
 * @param attributeName
 * @returns {*}
 */
function getAttribute(element, attributeName) {
  const attrs = element.attributes || [];
  return attrs.find(x => x.name === attributeName);
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

function matchSingle(element, selector) {
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

function matchSelector(elements, selectorParts) {
  if (!matchSingle(elements[0], selectorParts[0]))
    return false;

  elements = elements.slice();
  let j = 1;
  let i = 0;
  let combinator = selectorParts[0].combinator;
  if (combinator === ' ' || combinator === '>') {i++;}

  while (i < elements.length && selectorParts.length > j) {
    if (combinator === ' ') {
      // 1 下降关系匹配，不匹配就找父结点
      if (matchSingle(elements[i], selectorParts[j])) {
        combinator = selectorParts[j].combinator;
        if (combinator === ' ' || combinator === '>') i++;
        j++;
      } else {
        i++;
      }
    } else if (combinator === '+') {
      // 2 相邻关系匹配，找前一个结点。不匹配就失败
      if (matchSingle(elements[i].previousElementSibling, selectorParts[j])) {
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
        if (matchSingle(nextNode, selectorParts[j])) {
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
      if (matchSingle(elements[i], selectorParts[j])) {
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
 * 匹配css选择器
 * @param {string} selector
 * @param {Object} element
 * @return {boolean}
 */
function match(selector, element) {
  const parents = getParents(element);
  const elementList = [element, ...parents];
  const selectorParts = parseSelector(selector).reverse();

  return matchSelector(elementList, selectorParts);
}

module.exports = match;

