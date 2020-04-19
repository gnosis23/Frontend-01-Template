/**
 * JavaScript String Regex
 */

const { combine, or } = require('./heler');

const Dot = '\\.';

const HexDigit = "[0-9a-fA-F]";
const Hex4Digits = "[0-9a-fA-F]{4}";
// less than 10FFFF
const CodePoint = or(
  '0[0-9a-fA-F]{5}',
  '10[0-9a-fA-F]{4}',
  '[0-9a-fA-F]{1,5}'
);


const SingleEscapeCharacter = `['"\\bfnrtv]`;
const EscapeCharacter = or(
  SingleEscapeCharacter,
  '\d',
  'x',
  'u'
);
// source character but not EscapeCharacter or LineTerminator
const NonEscapeCharacter = `[^'"\\bfnrtv\dxu\r\n\u2028\u2029]`;
const CharacterEscapeSequence = or(
  SingleEscapeCharacter,
  NonEscapeCharacter
);
const UnicodeEscapeSequence = or(
  combine('u', Hex4Digits),
  combine('u{', CodePoint, '}')
);
const HexEscapeSequence = combine('x', HexDigit, HexDigit);

const LineTerminatorSequence = `(\r\n|[\r\n\u2028\u2029])`;
const LineContinuation = combine('\\\\', LineTerminatorSequence);

const EscapeSequence = or(
  CharacterEscapeSequence,
  // 0 [lookahead not in DecimalDigit]
  '0(?!\d)',
  HexEscapeSequence,
  UnicodeEscapeSequence
);

const SingleStringCharacter = or(
  // SourceCharacter but not one of ' or \ or Line terminator
  `[^'\r\n\u2028\u2029\\\\]`,
  '\u2028',
  '\u2029',
  combine('\\\\', EscapeSequence),
  LineContinuation
);

const DoubleStringCharacter = or(
  `[^"\r\n\u2028\u2029\\\\]`,
  '\u2028',
  '\u2029',
  combine('\\\\', EscapeSequence),
  LineContinuation
);

const StringLiteral = or(
  combine('"', combine(DoubleStringCharacter, '*'), '"'),
  combine('\'', combine(SingleStringCharacter, '*'), '\'')
);

module.exports = StringLiteral;
