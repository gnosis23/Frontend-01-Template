/**
 * NumberToString
 * 
 */

const digits = '0123456789ABCDEF';
const MAX_FLOAT_LENGTH = 64;

function convertNumberToString(number, radix) {
  if (typeof number !== 'number') {
    throw new Error('param1 must be a number');
  }
  if (radix - Math.floor(radix) !== 0 || (radix < 2 || radix > 16)) {
    throw new Error('unsupported radix');
  }

  let integer = Math.floor(number);
  let fraction = number - integer;
  let str = integer === 0 ? '0' : '';

  while (integer > 0) {
    str = radixNumber(integer % radix) + str;
    integer = Math.floor(integer / radix);
  }

  if (fraction === 0) return str;

  str += '.';
  let length = 0;
  while (fraction !== 0 && length < MAX_FLOAT_LENGTH) {
    fraction *= radix;
    str = str + radixNumber(Math.floor(fraction));
    fraction = fraction - Math.floor(fraction);
    length++;
  }
  
  return str;
}


function radixNumber(number) {
  return digits[number]
}

module.exports = convertNumberToString;
