const expect = require('chai').expect;
const { Lexer, parseSelector } = require('../selector')

const selector = "div.mainWrapper SPAN>a#id.cls[href=\"www.baidu.com\"]"

describe('selector', () => {
  describe('lexer tokens', () => {
    it('should return', () => {
      const lexer = new Lexer()
      const tokens = lexer.tokens(selector)
      expect(tokens.filter(x => x.type === 'ident').map(x => x.text).join(' ')).to.equal('div mainWrapper SPAN a cls href')
    });
  });

  describe('parser', () => {
    it('should return', () => {
      const selectors = parseSelector(selector);
      expect(selectors).to.have.lengthOf(3);
      expect(selectors[0].classes[0]).to.equal('mainWrapper');
      expect(selectors[1].tagName).to.equal('SPAN');
      expect(selectors[2].ids[0]).to.equal('id');
    });
  });
});

