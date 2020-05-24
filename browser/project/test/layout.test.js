const expect = require('chai').expect;
const { putInLines, mainSizeDetermination } = require('../layout');

const toDesc = item => {
  return Object.keys(item).reduce((obj, key) => {
    obj[key] = { value: item[key] };
    return obj;
  }, {});
};
const buildItems = (styles) => styles.map(style => ({computedStyle: toDesc(style)}));

describe('layout', () => {
  it('should put in one line', () => {
    const items = buildItems([
      { width: '500px', height: '666px' },
      { width: '500px' },
      { width: '500px' },
    ]);
    const elementStyle = {
      width: 1000,
      flexWrap: 'nowrap',
      height: 500
    };

    const { flexLines, mainSpace } = putInLines(items, elementStyle, false, 'width', 'height');

    expect(flexLines).to.have.lengthOf(1);
    expect(mainSpace).to.equal(-500);
    // NOTE: 单行的高度由容器高度决定，如果没有取内部最大
    expect(flexLines[0].crossSpace).to.equal(500);
  });

  it('should put in two line', () => {
    const items = buildItems([
      { width: '500px' },
      { width: '500px', height: '200px' },
      { flex: 1, height: '250px' },
      { width: '2000px', height: '200px' },
    ]);
    const elementStyle = {
      width: 1000,
      flexWrap: 'wrap',
      height: 500
    };

    const { flexLines, mainSpace } = putInLines(items, elementStyle, false, 'width', 'height');

    expect(flexLines).to.have.lengthOf(2);
    // 第一行放了三个
    expect(flexLines[0]).to.have.lengthOf(3);
    expect(mainSpace).to.equal(0);
    expect(flexLines[0].mainSpace).to.equal(0);
    expect(flexLines[0].crossSpace).to.equal(250);
    expect(flexLines[1].crossSpace).to.equal(200);
  });

  it('should decide width', () => {
    const items = buildItems([
      { width: '500px', height: '666px' },
      { width: '500px' },
      { width: '1000px' },
    ]);
    const elementStyle = {
      width: 1000,
      flexWrap: 'nowrap',
      height: 500
    };

    const { flexLines, mainSpace } = putInLines(items, elementStyle, false, 'width', 'height');

    const mainInfo = {
      mainSize: 'width',
      mainStart: 'left',
      mainEnd: 'right',
      mainBase: 0,
      mainSign: 1
    };
    mainSizeDetermination(items, elementStyle, flexLines, mainSpace, mainInfo);
    expect(items[0].style.width).to.equal(250);
    expect(items[0].style.left).to.equal(0);
    expect(items[0].style.right).to.equal(250);
    expect(items[1].style.width).to.equal(250);
    expect(items[1].style.left).to.equal(250);
    expect(items[1].style.right).to.equal(500);
    expect(items[2].style.width).to.equal(500);
    expect(items[2].style.left).to.equal(500);
    expect(items[2].style.right).to.equal(1000);
  });

  it('should decide width in two lines', () => {
    const items = buildItems([
      { width: '400px' },
      { width: '400px', height: '200px' },
      { flex: 1, height: '250px' },
      { width: '2000px', height: '200px' },
    ]);
    const elementStyle = {
      width: 1000,
      flexWrap: 'wrap',
      height: 500,
      justifyContent: 'flex-end'
    };

    const { flexLines, mainSpace } = putInLines(items, elementStyle, false, 'width', 'height');
    const mainInfo = {
      mainSize: 'width',
      mainStart: 'left',
      mainEnd: 'right',
      mainBase: 0,
      mainSign: 1
    };
    mainSizeDetermination(items, elementStyle, flexLines, mainSpace, mainInfo);

    expect(items[0].style.width).to.equal(400);
    expect(items[0].style.left).to.equal(0);
    expect(items[0].style.right).to.equal(400);
    expect(items[1].style.width).to.equal(400);
    expect(items[1].style.left).to.equal(400);
    expect(items[1].style.right).to.equal(800);
    expect(items[2].style.width).to.equal(200);
    expect(items[2].style.left).to.equal(800);
    expect(items[2].style.right).to.equal(1000);
    // 算法里没有收缩所以是2000
    expect(items[3].style.width).to.equal(2000);
    expect(items[3].style.left).to.equal(0);
    expect(items[3].style.right).to.equal(2000);
  });

});
