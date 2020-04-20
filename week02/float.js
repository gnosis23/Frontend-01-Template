/**
 * float number to binary
 */

// Source code from:
// https://exploringjs.com/es6/ch_typed-arrays.html
const BigEndian = Symbol('BIG_ENDIAN');
const LittleEndian = Symbol('LITTLE_ENDIAN');

function getPlatformEndianness() {
  const arr32 = Uint32Array.of(0x12345678);
  const arr8 = new Uint8Array(arr32.buffer);
  switch ((arr8[0]*0x1000000) + (arr8[1]*0x10000) + (arr8[2]*0x100) + (arr8[3])) {
    case 0x12345678:
      return BigEndian;
    case 0x78563412:
      return LittleEndian;
    default:
      throw new Error('Unknown endianness');
  }
}

const endian = getPlatformEndianness();

function floatToBinary(num, separator = ',') {
  const arrayFloat = Float64Array.of(num);
  const bytes = new Uint8Array(arrayFloat.buffer);

  const output = [];
  for (let i = 0; i < 8; ++i) {
    const index = endian === BigEndian ? 0 : 8 - i -1;
    output.push(bytes[index].toString(2).padStart(8, '0'));
  }

  return output.join(separator);
}

module.exports = floatToBinary;
