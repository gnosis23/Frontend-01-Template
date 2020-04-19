const regexText = require('./string');

// (("([^"\r\n\u2028\u2029\\]|\u2028|\u2029|\\((['"\bfnrtv]|[^'"\bfnrtvdxu\r\n\u2028\u2029])|0(?!d)|x[0-9a-fA-F][0-9a-fA-F]|(u[0-9a-fA-F]{4}|u{(0[0-9a-fA-F]{5}|10[0-9a-fA-F]{4}|[0-9a-fA-F]{1,4})}))|\\(\r\n|[\r\n\u2028\u2029]))*"|'([^'\r\n\u2028\u2029\\]|\u2028|\u2029|\\((['"\bfnrtv]|[^'"\bfnrtvdxu\r\n\u2028\u2029])|0(?!d)|x[0-9a-fA-F][0-9a-fA-F]|(u[0-9a-fA-F]{4}|u{(0[0-9a-fA-F]{5}|10[0-9a-fA-F]{4}|[0-9a-fA-F]{1,4})}))|\\(\r\n|[\r\n\u2028\u2029]))*'))
const stringRegex = new RegExp(`^(${regexText})$`);

console.log(stringRegex);

const expectString = (a, result = true) => {
  if (stringRegex.test(a) !== result) {
    console.log('expect', a, 'error');
  }
};


expectString(`"\\u{}"`, false);
expectString(`"\\u{0}"`);
expectString(`"\\u{0051}"`);
expectString(`"\\u{005e11}"`);
expectString(`"\\u{005e1}"`);
expectString(`"\\u{10ffff}"`);
expectString(`"\\u{11ffff}"`, false);
expectString(`"\\u{20ffff}"`, false);
expectString(`"\\x11"`);
expectString(`"\\x111"`);
expectString(`"\\x1111"`);
expectString(`"\\u1"`, false);
expectString(`"\\u12"`, false);
expectString(`"\\u123"`, false);
expectString(`"\\u1234"`);
expectString(`"\\u123g"`, false);
expectString(`"\\uffff"`);
expectString(`"\\t"`);
expectString(`"${'\t'}${'\t'}"`);
expectString(`"${'大便'}"`);
expectString(`"\\${'I❤U️'}"`);
expectString(`"\\v"`);
expectString(`"\\b"`);
expectString(`"\\0"`);
expectString(`"\\01"`);
expectString(`"\u2028"`);
expectString(`"\u2029"`);
expectString(`"a is b"`);
expectString(`"a is b\\ngagag"`);
expectString(`"I'm genius`, false);
