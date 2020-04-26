const num2str = require('./num2str');

function expect(a, b) {
  if ((a) !== b) {
    console.log(a, '!=', b);
  }
}

expect(num2str(0, 2), '0');
expect(num2str(0, 10), '0');
expect(num2str(1000, 10), '1000');
expect(num2str(1000, 2), '1111101000');
expect(num2str(1000, 16), '3E8');
expect(num2str(1024, 16), '400');
expect(num2str(1234.5, 10), '1234.5');
expect(num2str(1234.125, 10), '1234.125');
expect(num2str(1234.125, 16), '4D2.2');
expect(num2str(0.1, 10), '0.1');
expect(num2str(0.125, 2), '0.001');
expect(num2str(1e-4, 10), '0.0001');
// expect(num2str(Number.EPSILON, 10), '0.0001');
