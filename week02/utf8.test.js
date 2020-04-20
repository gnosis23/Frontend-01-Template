const UTF8_Encoding = require('./utf8.js');

const expect = (buffer, bytes, error) => {
  const arr = new Uint8Array(buffer);
  for (let i = 0; i < arr.length; ++i) {
    if (arr[i] !== bytes[i]) {
      console.error(error);
      break;
    }
  }
};

expect(UTF8_Encoding('$'), [0x24], '$');
expect(UTF8_Encoding('¢'), [0xC2, 0xA2], 'ह');
expect(UTF8_Encoding('ह'), [0xE0, 0xA4, 0xB9], '¢');
expect(UTF8_Encoding('€'), [0xE2, 0x82, 0xAC], '€');
expect(UTF8_Encoding('한'), [0xED, 0x95, 0x9C], '한');
expect(UTF8_Encoding('𐍈'), [0xF0, 0x90, 0x8D, 0x88], '𐍈');
expect(UTF8_Encoding('💩'), [240, 159, 146, 169], '💩');
