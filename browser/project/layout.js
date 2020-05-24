/**
 * flex layout
 */

const isNotBlank = value => value !== null && value !== undefined;

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

/**
 * 将item依次放入行中
 * @param items
 * @param elementStyle
 * @param isAutoMainSize
 * @param mainSize
 * @param crossSize
 */
function putInLines(items, elementStyle, isAutoMainSize, mainSize, crossSize) {
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
    else if (elementStyle.flexWrap === 'nowrap' || isAutoMainSize) { // 这里因为没法判断100%的宽度，所以用或
      mainSpace -= itemStyle[mainSize];
      flexLine.push(item);
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
    }
    else {
      if (itemStyle[mainSize] > elementStyle[mainSize]) {
        itemStyle[mainSize] = elementStyle[mainSize];
      }
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;

        flexLine = [];
        flexLines.push(flexLine);

        flexLine.push(item);

        mainSpace = elementStyle[mainSize];
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

  if (elementStyle.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = (elementStyle[crossSize] !== undefined) ? elementStyle[crossSize] : crossSpace;
  } else {
    flexLine.crossSpace = crossSpace;
  }

  // mainSpace 最后一行的剩余主轴大小
  return { flexLines, mainSpace };
}

/**
 * 主轴大小和位置计算
 * @param items
 * @param style
 * @param flexLines
 * @param mainSpace
 * @param mainInfo
 */
function mainSizeDetermination(items, style, flexLines, mainSpace, mainInfo) {
  const { mainSize, mainStart, mainEnd, mainBase, mainSign } = mainInfo;
  if (mainSpace < 0) {
    // overflow (happens only if container is single line), scale every item
    let scale = style[mainSize] / (style[mainSize] - mainSpace);
    let currentMain = mainBase;
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let itemStyle = getStyle(item);

      if (itemStyle.flex) {
        itemStyle[mainSize] = 0;
      }

      itemStyle[mainSize] = itemStyle[mainSize] * scale;

      itemStyle[mainStart] = currentMain;
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    }
  } else {
    flexLines.forEach(items => {
      let mainSpace = items.mainSpace;
      let flexTotal = 0;
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let itemStyle = getStyle(item);

        if ((itemStyle.flex !== null) && (itemStyle.flex !== undefined)) {
          flexTotal += itemStyle.flex;
          // continue;
        }
      }

      if (flexTotal > 0) {
        // There is flexible items
        let currentMain = mainBase;
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          let itemStyle = getStyle(item);

          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
          }
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd];
        }
      } else {
        // There is *NO* flexible flex items, which means, justifyContent should work
        let currentMain, step
        if (style.justifyContent === 'flex-start') {
          currentMain = mainBase;
          step = 0;
        }
        if (style.justifyContent === 'flex-end') {
          currentMain = mainSpace * mainSign + mainBase;
          step = 0;
        }
        if (style.justifyContent === 'center') {
          currentMain = mainSpace / 2 * mainSign + mainBase;
          step = 0;
        }
        if (style.justifyContent === 'space-between') {
          step = mainSpace / (items.length - 1) * mainSign;
          currentMain = mainBase;
        }
        if (style.justifyContent === 'space-around') {
          step = mainSpace / items.length * mainSign;
          currentMain = step / 2 + mainBase;
        }
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          const itemStyle = getStyle(item);
          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd] + step;
        }
      }
    });
  }
}

function crossSizeDetermine(items, style, flexLines, crossInfo) {
  let { crossSize, crossBase, crossStart, crossEnd, crossSign } = crossInfo;
  let restCrossSpace = 0;
  if (!style[crossSize]) {  // auto sizing
    restCrossSpace = 0;
    style[crossSize] = 0;
    for (let i = 0; i < flexLines.length; i++) {
      style[crossSize] = style[crossSize] + flexLines[i].crossSpace;
    }
  }
  else {
    restCrossSpace = style[crossSize];
    for (let i = 0; i < flexLines.length; i++) {
      restCrossSpace -= flexLines[i].crossSpace;
    }
  }

  if (style.flexWrap === 'wrap-reverse') {
    crossBase = style[crossSize];
  } else {
    crossBase = 0;
  }
  // let lineSize = style[crossSize] / flexLines.length;

  let step;
  if (style.alignContent === 'flex-start') {
    crossBase += 0;
    step = 0;
  }
  if (style.alignContent === 'flex-end') {
    crossBase += crossSign * restCrossSpace;
    step = 0;
  }
  if (style.alignContent === 'center') {
    crossBase += crossSign * restCrossSpace / 2;
    step = 0;
  }
  if (style.alignContent === 'space-between') {
    crossBase += 0;
    step = restCrossSpace / (flexLines.length - 1);
  }
  if (style.alignContent === 'space-around') {
    step = restCrossSpace / (flexLines.length - 1);
    crossBase += crossSign * step / 2;
  }
  if (style.alignContent === 'stretch') {
    crossBase += 0;
    step = 0;
  }

  flexLines.forEach(items => {
    // https://drafts.csswg.org/css-flexbox-1/#align-content-property
    let lineCrossSize = style.alignContent === 'stretch'
      ? items.crossSpace + restCrossSpace / flexLines.length // 瓜分剩余
      : items.crossSpace;
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let itemStyle = getStyle(item);

      let align = itemStyle.alignSelf || style.alignItems;

      if (itemStyle[crossSize] === null || itemStyle[crossSize] === undefined) {
        itemStyle[crossSize] = (align === 'stretch') ? lineCrossSize : 0;
      }

      if (align === 'flex-start') {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }
      if (align === 'flex-end') {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
        itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
      }
      if (align === 'center') {
        itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }
      if (align === 'stretch') {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] = crossBase
          + crossSign * (isNotBlank(itemStyle[crossSize])? itemStyle[crossSize] : lineCrossSize);
        itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
      }
    }
    crossBase += crossSign * (lineCrossSize + step);
  });
}

function layout(element) {
  if (!element.computedStyle)
    return;

  // 0 初始化
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

  // 1 外部容器主轴大小
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

  // 2 将item按行依次放入
  const { flexLines, mainSpace } = putInLines(items, elementStyle, isAutoMainSize, mainSize, crossSize);

  // 3 确定主轴大小
  const mainInfo = { mainSize, mainBase, mainStart, mainEnd, mainSign };
  mainSizeDetermination(items, style, flexLines, mainSpace, mainInfo);

  // 4 确定纵轴大小
  // align-items, align-self
  const crossInfo = { crossSize, crossBase, crossStart, crossEnd, crossSign } ;
  crossSizeDetermine(items, style, flexLines, crossInfo);

  // console.log(flexLines);
}

module.exports = {
  putInLines,
  mainSizeDetermination,
  layout
};
