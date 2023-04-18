/**
 * @template T
 * @typedef {import("./base-types.js").t<T>} t
 */
/**
 * @typedef {import("./base-types.js").AnyTypeOrShape} AnyTypeOrShape
 */
module.exports = {
  ...require('./base-types.js'),
  ...require('./check.js'),
  parse: require('./parse.js'),
  ...require('./sculpt.js'),
  validate: require('./validate.js'),
};
