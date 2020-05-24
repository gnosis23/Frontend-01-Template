const expect = require('chai').expect;
const { Lexer, parseSelector } = require('../selector')

const selector = "div.mainWrapper SPAN>a#id.cls[href=\"www.baidu.com\"]"
const notSelector = ':not(.mainWrapper):not(div) a:not([href])';

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

    it('should deal with not properly', () => {
      const selectors = parseSelector(notSelector);
      expect(selectors).to.have.lengthOf(2);
      expect(selectors[0].notClasses).to.have.lengthOf(1);
      expect(selectors[0].notClasses[0]).to.equal('mainWrapper');
      expect(selectors[0].notTagNames).to.have.lengthOf(1);
      expect(selectors[0].notTagNames[0]).to.equal('div');
      expect(selectors[1].tagName).to.equal('a');
      expect(selectors[1].notAttributes).to.have.lengthOf(1);
      expect(selectors[1].notAttributes[0]).to.deep.equal({ name: 'href', operator: null, operand: null });
    });
  });
});

