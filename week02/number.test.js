const regexText = require('./number');

// ((((0|[1-9]([0-9]+)?)\.([0-9]+)?([eE][+-]?[0-9]+)?|\.[0-9]+([eE][+-]?[0-9]+)?|(0|[1-9]([0-9]+)?)([eE][+-]?[0-9]+)?)|0[bB][01]+|0[oO][0-7]+|0[xX][0-9a-fA-F]+))
const numberRegex = new RegExp(`^(${regexText})$`, 'i');

console.log(numberRegex);

const expectNumber = (a, result = true) => {
  if (numberRegex.test(a) !== result) {
    console.log('expect', a, 'error');
  }
};

expectNumber("0b0100");
expectNumber("0B00");
expectNumber("0b1");
expectNumber("0b13", false);
expectNumber("01", false);
expectNumber("0b1");
expectNumber("0b0");
expectNumber("0c0", false);
expectNumber("0c1", false);
expectNumber("0o0");
expectNumber("0o011");
expectNumber("0o088", false);
expectNumber("0x123");
expectNumber("0xaaa");
expectNumber("0X1234567890abcde");
expectNumber("0xffff");
expectNumber("0xfffg", false);
expectNumber("0x", false);
expectNumber("1234");
expectNumber("1e13");
expectNumber("1e-13");
expectNumber("1e+13");
expectNumber("1e-e", false);
expectNumber("0E13");
expectNumber("0.1");
expectNumber("1.0");
expectNumber("3.0");
expectNumber(".0");
expectNumber(".01");
expectNumber("1.0");
expectNumber(".104e123");
expectNumber("1111e123");
expectNumber("0e", false);
expectNumber("123.456e1");
