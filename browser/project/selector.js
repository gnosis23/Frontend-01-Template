/**
 * a css selector parser
 *
 */

const TokenRegs = [
  { type: 'includes', pattern: /^~=/ },
  { type: 'dash-match', pattern: /^\|=/ },
  { type: 'prefix-match', pattern: /^\^=/ },
  { type: 'suffix-match', pattern: /^\$=/ },
  { type: 'substring-match', pattern: /^\*=/ },
  // fixme：escape
  { type: 'ident', pattern: /^-?([_a-zA-Z]|[^\u0000-\u00b1])([_a-zA-Z0-9-]|[^\u0000-\u00b1])*/ },
  // fixme: escape
  {
    type: 'double-quoted-string',
    pattern: /^("([^\n\r\f\\"]|\\(\n|\r\n|\r|\f)|[\u0000-\u00b1])*")/
  },
  {
    type: 'single-quoted-string',
    pattern: /^('([^\n\r\f\\"]|\\(\n|\r\n|\r|\f)|[\u0000-\u00b1])*')/
  },
  {
    type: 'hash',
    pattern: /^#([_a-zA-Z0-9-]|[^\u0000-\u00b1])+/
  },
  { type: 'plus', pattern: /^[ \t\r\n\f]*\+/ },
  { type: 'greater', pattern: /^[ \t\r\n\f]*>/ },
  { type: 'comma', pattern: /^[ \t\r\n\f]*,/ },
  { type: 'tilde', pattern: /^[ \t\r\n\f]*~/ },
  { type: 'not', pattern: /^:not\(/ },
  { type: 'space', pattern: /^[ \t\r\n\f]+/ },
];

class Lexer {
  tokens(string) {
    const tokens = [];
    while (string) {
      let i = 0;
      let word = '';
      for (i = 0; i < TokenRegs.length; ++i) {
        const matches = string.match(TokenRegs[i].pattern)
        if (matches) {
          word = matches[0];
          tokens.push({
            type: TokenRegs[i].type,
            text: word
          });
          break;
        }
      }
      if (i === TokenRegs.length) {
        word = string[0];
        tokens.push({
          type: 'single',
          text: word
        });
      }
      string = string.substring(word.length);
    }
    return tokens;
  }
}

// 暂时支持单个选择器
class Parser {
  constructor(props) {
    this.tokens = props.tokens || [];
    this.cursor = 0;
    this._selectors = [];
    this._combinator = ' ';
  }

  get top() {
    return this._selectors[this._selectors.length - 1];
  }

  get next() {
    if (this.cursor >= this.tokens.length)
      return null
    return this.tokens[this.cursor];
  }

  get lookahead() {
    if (this.cursor >= this.tokens.length)
      return ''
    return this.tokens[this.cursor].text[0];
  }

  get lookaheadType() {
    if (this.cursor >= this.tokens.length)
      return ''
    return this.tokens[this.cursor].type;
  }

  expect(type, text) {
    const nextOne = this.next;
    if (nextOne === null) {
      throw new Error(`expected ${type}, get EOF`);
    }
    if (nextOne.type !== type) {
      throw new Error(`expected ${type}, get ${JSON.stringify(nextOne)}`)
    }
    if (nextOne.type === 'single' && nextOne.text !== text) {
      throw new Error(`expected ${type}, get ${JSON.stringify(nextOne)}`)
    }
    this.cursor++;
    return nextOne;
  }

  parse() {
    this.parseSelector();
    return this._selectors;
  }

  parseSelector() {
    this.parseSimpleSelectorSequence();
    let lookahead = this.lookaheadType;
    while (lookahead === 'plus' || lookahead === 'greater' || lookahead === 'tilde' || lookahead === 'space') {
      this.parseCombinator();
      this.parseSimpleSelectorSequence();
      lookahead = this.lookaheadType;
    }
  }

  parseCombinator() {
    let next = this.next;
    if (next.type === 'plus') {
      this.expect('plus');
      this._combinator = '+';
    } else if (next.type === 'greater') {
      this.expect('greater');
      this._combinator = '>';
    } else if (next.type === 'tilde') {
      this.expect('tilde');
      this._combinator = '~';
    } else {
      // space
      this.expect('space');
      this._combinator = ' ';
    }
    if (this.lookahead === ' ') {
      this.expect('space');
    }
  }

  /**
   * 简化处理了下，不支持伪类和取反
   */
  parseSimpleSelectorSequence() {
    this._selectors.push({
      tagName: null,
      ids: [],
      classes: [],
      attributes: [],
      combinator: this._combinator,
      notTagNames: [],
      notIds: [],
      notClasses: [],
      notAttributes: []
    });
    this._combinator = ' ';

    const lookahead = this.lookahead;
    if (this.lookaheadType === 'ident') {
      const element_name = this.expect('ident');
      this.top.tagName = element_name.text;
      this.parseHashClassAttribute(false);
    } else if (['[', '.', '#', ':'].includes(lookahead)) {
      this.parseHashClassAttribute(true);
    } else {
      throw new Error();
    }
  }

  parseHashClassAttribute(strict = false) {
    const lookahead = this.lookahead
    let next = null
    if (lookahead === '#') {
      next = this.expect('hash');
      if (this._inNot) {
        this.top.notIds.push(next.text.substring(1));
      } else {
        this.top.ids.push(next.text.substring(1));
      }
    } else if (lookahead === '.') {
      this.parseClass();
    } else if (lookahead === '[') {
      this.parseAttrib();
    } else if (lookahead === ':') {
      this.parseNegation();
    } else if (strict) {
      throw new Error('')
    } else {
      return
    }

    this.parseHashClassAttribute(false);
  }

  parseClass() {
    this.expect('single', '.');
    const ident = this.expect('ident');
    if (this._inNot) {
      this.top.notClasses.push(ident.text);
    } else {
      this.top.classes.push(ident.text);
    }
  }

  parseAttrib() {
    this.expect('single', '[');
    let lookahead = this.lookaheadType
    if (lookahead === 'space') this.expect('space');
    const ident = this.expect('ident');
    lookahead = this.lookaheadType
    if (lookahead === 'space') this.expect('space');
    lookahead = this.lookaheadType
    let operator = null;
    let operand = null;
    if (lookahead === 'prefix-match') {
      operator = '^=';
      this.expect('prefix-match');
    } else if (lookahead === 'suffix-match') {
      operator = '$=';
      this.expect('suffix-match');
    } else if (lookahead === 'substring-match') {
      operator = '-='
      this.expect('substring-match');
    } else if (lookahead === 'includes') {
      operator = '~=';
      this.expect('includes');
    } else if (lookahead === 'dash-match') {
      operator = '-=';
      this.expect('dash-match');
    } else if (this.lookahead === '=') {
      operator = '=';
      this.expect('single', '=');
    }
    if (operator) {
      if (this.lookaheadType === 'ident') {
        operand = this.expect('ident');
      } else if (this.lookaheadType === 'single-quoted-string') {
        operand = this.expect('single-quoted-string');
      } else {
        operand = this.expect('double-quoted-string')
      }
    }
    this.expect('single', ']');

    if (this._inNot) {
      this.top.notAttributes.push({
        name: ident.text,
        operator,
        operand: operand ? operand.text.substring(1, operand.text.length - 1) : null
      });
    } else {
      this.top.attributes.push({
        name: ident.text,
        operator,
        operand: operand ? operand.text.substring(1, operand.text.length - 1) : null
      });
    }
  }

  parseNegation() {
    this.expect('not');
    this._inNot = true;
    if (this.lookaheadType === 'space') this.expect('space');
    if (this.lookaheadType === 'ident') {
      const element_name = this.expect('ident');
      this.top.notTagNames.push(element_name.text);
    } else if (['[', '.', '#'].includes(this.lookahead)) {
      this.parseHashClassAttribute(true);
    } else {
      throw new Error();
    }
    if (this.lookaheadType === 'space') this.expect('space');
    this.expect('single', ')');
    this._inNot = false;
  }
}

function parseSelector(input) {
  const lexer = new Lexer()
  const tokens = lexer.tokens(input)
  const parser = new Parser({
    tokens
  });
  return parser.parse();
}

module.exports = {
  Lexer,
  Parser,
  parseSelector
};
