const f = require('./str2num');

function expect(str, num) {
  if (str !== num) {
    console.log(str, '!=', num);
  }
}

expect(f('123.456', 10), 123.456);
expect(f('101.001', 2), 5.125);
expect(f('4d2.', 16), 1234);
expect(f('4d2.1', 16), 1234.0625);
expect(f('0.0', 16), 0);
expect(f('0', 2), 0);