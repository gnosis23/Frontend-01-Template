/**
 * JavaScript Number Regex
 */

const combine = (...args) => args.join("");
const atLeastOne = (reg) => `${reg}+`;
const optional = (reg) => `(${reg})?` ;
const or = (...args) => `(${args.join("|")})`;

const Dot = '\\.';

const BinaryDigit = "[01]";
const BinaryIntegerLiteral = combine('0[bB]', atLeastOne(BinaryDigit));

const OctalDigit = "[0-7]";
const OctalIntegerLiteral = combine('0[oO]', atLeastOne(OctalDigit));

const HexDigits = "[0-9a-fA-F]";
const HexIntegerLiteral = combine('0[xX]', atLeastOne(HexDigits));

const DecimalDigit = "[0-9]";
const DecimalDigits = atLeastOne(DecimalDigit);
const NonZeroDigit = "[1-9]";
const SignedInteger = combine("[+-]?", DecimalDigits);
const ExponentPart = combine("[eE]", SignedInteger);
const DecimalIntegerLiteral = or(
  "0",
  combine(NonZeroDigit, optional(DecimalDigits))
);
const DecimalLiteral = or(
  combine(DecimalIntegerLiteral, Dot, optional(DecimalDigits), optional(ExponentPart)),
  combine(Dot, DecimalDigits, optional(ExponentPart)),
  combine(DecimalIntegerLiteral, optional(ExponentPart))
);

let regexText = or(
  DecimalLiteral,
  BinaryIntegerLiteral,
  OctalIntegerLiteral,
  HexIntegerLiteral
);

module.exports = regexText;
