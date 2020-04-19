const combine = (...args) => args.join("");
const atLeastOne = (reg) => `${reg}+`;
const optional = (reg) => `(${reg})?` ;
const or = (...args) => `(${args.join("|")})`;

module.exports  = {
  combine,
  atLeastOne,
  optional,
  or
};
