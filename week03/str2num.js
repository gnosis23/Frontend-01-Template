/**
 * StrToNum
 * 
 */


const charToNumber = (str) => {
  if (/\d/.test(str)) return str.codePointAt(0) - '0'.codePointAt(0);
  if (/[a-f]/.test(str)) return str.codePointAt(0) - 'a'.codePointAt(0) + 10;
  if (/[A-F]/.test(str)) return str.codePointAt(0) - 'A'.codePointAt(0) + 10;
  throw new Error('unsuppported character: ' + str)
};

function str2num(str, radix = 10) {
  let chars = str.split('');
  let number = 0;
  
  let begin = 0;
  while (begin < chars.length && chars[begin] !== '.') {
    number = number * radix;
    number += charToNumber(chars[begin]);
    begin++;
  }
  if (chars[begin] === '.') {
    begin++;
  }

  let end = chars.length - 1;
  let fraction = 0;
  while(end >= begin) {
    fraction = fraction / radix;
    fraction = charToNumber(chars[end]) + fraction;
    end--;
  }
  fraction = fraction / radix;

  return number + fraction;
}

module.exports = str2num;
