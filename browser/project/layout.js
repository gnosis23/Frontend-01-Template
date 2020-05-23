/**
 * flex layout
 */

/**
 * 获取style属性，必要时初始化
 * @param element
 * @returns {Object}
 */
function getStyle(element) {
  if (!element.style)
    element.style = {};

  for (let prop of Object.getOwnPropertyNames(element.computedStyle)) {
    element.style[prop] = element.computedStyle[prop].value

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    if (element.style[prop].toString().match(/^[0-9.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
  return element.style;
}

function layout(element) {
  if (!element.computedStyle)
    return;

  let elementStyle = getStyle(element);

  if (elementStyle.display !== 'flex')
    return;

  let items = element.children.filter(x => x.type === 'element');

  items.sort((a, b) => {
    return (a.order || 0) - (b.order || 0);
  });

  let style = elementStyle;

  ['width', 'height'].forEach(size => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null;
    }
  });

  if (!style.flexDirection || style.flexDirection === 'auto')
    style.flexDirection = 'row';

  // align-items：定义当前行纵轴对齐方式
  if (!style.alignItems || style.alignItems === 'auto')
    style.alignItems = 'stretch';

  // justify-content: 定义了主轴方向的对齐方式
  if (!style.justifyContent || style.justifyContent === 'auto')
    style.justifyContent = 'flex-start';

  // flex-wrap: 默认行为不换行，可以定义为 nowrap, wrap, wrap-reverse
  if (!style.flexWrap || style.flexWrap === 'auto')
    style.flexWrap = 'nowrap';

  // align-content: 定义了纵轴方向多个行之间对齐方式
  if (!style.alignContent || style.alignContent === 'auto')
    style.alignContent = 'stretch';

  let mainSize, mainStart, mainEnd, mainSign, mainBase,
      crossSize, crossStart, crossEnd, crossSign, crossBase;

  if (style.flexDirection === 'row') {
    mainSize = 'width';
    mainStart = 'left';
    mainEnd = 'right';
    mainSign = 1;
    mainBase = 0;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }
  if (style.flexDirection === 'row-reverse') {
    mainSize = 'width';
    mainStart = 'right';
    mainEnd = 'left';
    mainSign = -1;
    mainBase = style.width;

    crossSize = 'height';
    crossStart = 'top';
    crossEnd = 'bottom';
  }
  if (style.flexDirection === 'column') {
    mainSize = 'height';
    mainStart = 'top';
    mainEnd = 'bottom';
    mainSign = +1;
    mainBase = 0;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }
  if (style.flexDirection === 'column-reverse') {
    mainSize = 'height';
    mainStart = 'bottom';
    mainEnd = 'top';
    mainSign = +1;
    mainBase = style.height;

    crossSize = 'width';
    crossStart = 'left';
    crossEnd = 'right';
  }
  if (style.flexWrap === 'wrap-reverse') {
    let tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }

  // 主轴大小
  let isAutoMainSize = false;
  if (!style[mainSize]) {
    elementStyle[mainSize] = 0;
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let itemStyle = getStyle(item);
      if (itemStyle[mainSize] !== undefined && itemStyle[mainSize] !== 'auto')
        elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
    }
    isAutoMainSize = true;
  }

  let flexLine = [];
  let flexLines = [flexLine];

  let mainSpace = elementStyle[mainSize];
  let crossSpace = 0;

  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let itemStyle = getStyle(item);

    if (itemStyle[mainSize] === null || itemStyle[mainSize] === undefined) {
      itemStyle[mainSize] = 0;
    }

    if (itemStyle.flex) {
      flexLine.push(item);
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
    }
    else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize];
      flexLine.push(item);
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
    }
    else {
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize];
      }
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;

        flexLine = [];
        flexLines.push(flexLine);

        flexLine.push(item);

        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
    }
  }
  flexLine.mainSpace = mainSpace;
  // 漏了crossSpace？
}

module.exports = layout;
