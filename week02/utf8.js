/**
 * utf-8 encoding
 */

function encodeCodePoint(code) {
  if (code <= 0x7F) {
    return [code]
  } else if (code <= 0x7FF) {
    return [
      0xC0 | ((code >> 6) & 0x1F),
      0x80 | ((code) & 0x3F),
    ]
  } else if (code <= 0xFFFF) {
    return [
      0xE0 | ((code >> 12) & 0xF),
      0x80 | ((code >>  6) & 0x3F),
      0x80 | ((code) & 0x3F)
    ]
  } else {
    return [
      0xF0 | ((code >> 18) & 0x7),
      0x80 | ((code >> 12) & 0x3F),
      0x80 | ((code >>  6) & 0x3F),
      0x80 | ((code) & 0x3F)
    ]
  }
}

function UTF8_Encoding(string) {
  const codes = [];
  for (let ch of string) {
    const bytes = encodeCodePoint(ch.codePointAt(0));
    codes.push(...bytes);
  }
  const array = new Uint8Array(codes);
  return array.buffer;
}

module.exports = UTF8_Encoding;
