const { Lexer, parseSelector } = require('../selector')

const expect = (a, b) => { if (a !== b) console.error(a, b) }

const selector = "div.mainWapper SPAN>a#id.cls[href=\"www.baidu.com\"]"
const lexer = new Lexer()
const tokens = lexer.tokens(selector)
console.log(tokens);
expect(
  tokens.filter(x => x.type === 'ident').map(x => x.text).join(' '),
  'div mainWrapper span a cls href'
)

const selectors = parseSelector(selector);
console.log(JSON.stringify(selectors, null, 2));
