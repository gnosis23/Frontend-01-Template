const expect = require('chai').expect;
const { parseHTML } = require('../parser')

describe('parser', () => {
  it('parse empty tag', () => {
    let doc = parseHTML("<div></div>")
    expect(doc.children[0].tagName).to.equal('div');
  });

  it('self close tag', () => {
    let doc = parseHTML("<div />")
    expect(doc.children[0].tagName).to.equal('div');
  });

  it('self close tag', () => {
    expect(() => parseHTML("<div /")).to.throw(Error);
  });

  it('self close tag 2', () => {
    expect(() => parseHTML("<div / >")).to.throw(Error);
  });

  it('lowercase', () => {
    let doc = parseHTML("<DIV />")
    expect(doc.children[0].tagName).to.equal('div');
  });

  it('before attribute value', () => {
    let doc = parseHTML(`<div name='wang' age="40"/>`)
    expect(doc.children[0].tagName).to.equal('div');
  });

  it('unquoted value', () => {
    let doc = parseHTML(`<div age=40 name=a/>`)
    expect(doc.children[0].tagName).to.equal('div');
  });

  it('unquoted value 2', () => {
    let doc = parseHTML(`<div age= 40>wang</div>`)
    expect(doc.children[0].tagName).to.equal('div');
  });

  it('parse text tag', () => {
    let doc = parseHTML("<div>hello</div>");
    expect(doc.children[0].children[0].content).to.equal('hello');
  });

  it('mismatch', () => {
    expect(() => parseHTML("<hello>hello</ello>")).to.throw();
  });

  it('has attributes', () => {
    let doc = parseHTML(`<div class="name">hello</div>`);
    expect(doc.children[0].attributes[0].name).to.equal('class');
    expect(doc.children[0].attributes[0].value).to.equal('name');
  });

  it('after attributes name', () => {
    let doc = parseHTML(`<div class  ="name">hello</div>`);
    expect(doc.children[0].attributes[0].name).to.equal('class');
    expect(doc.children[0].attributes[0].value).to.equal('name');
  });

  it('after attributes name 2', () => {
    let doc = parseHTML(`<div old>hello</div>`);
    expect(doc.children[0].attributes[0].name).to.equal('old');
    expect(doc.children[0].attributes[0].value).to.equal(true);
  });

  it('after attributes name 3', () => {
    let doc = parseHTML(`<div old from="shanghai">hello</div>`);
    expect(doc.children[0].attributes[0].name).to.equal('old');
    expect(doc.children[0].attributes[0].value).to.equal(true);
    expect(doc.children[0].attributes[1].name).to.equal('from');
    expect(doc.children[0].attributes[1].value).to.equal('shanghai');
  });

  it('after attributes name 4', () => {
    expect(() => parseHTML(`<div old `)).to.throw(Error);
  });


  it('add style', () => {
    let doc = parseHTML(`<style>body { width: 100px; }</style>`);
  });

  it('after attributes', () => {
    let doc = parseHTML(`<div class="name"  str="30">hello</div>`);
    expect(doc.children[0].attributes[0].name).to.equal('class');
    expect(doc.children[0].attributes[0].value).to.equal('name');
  });

  it('has attributes', () => {
    let doc = parseHTML(`
  <div class="name">
    <span>wang</span><span>bo</span>
  </div>
`);
    expect(doc.children[1].children[1].tagName).to.equal('span');
    expect(doc.children[1].children[1].children[0].content).to.equal('wang');
    expect(doc.children[1].children[2].previousElementSibling).to.equal(
      doc.children[1].children[1]
    );
  });
});

