
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
}

module.exports = layout;
