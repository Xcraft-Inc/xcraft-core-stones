/**
 * @template T
 * @typedef {import("./base-types.js").t<T>} t
 */
/**
 * @typedef {import("./base-types.js").AnyTypeOrShape} AnyTypeOrShape
 */
/**
 * @template T
 * @template {keyof T} U
 * @typedef {import("./base-types.js").markOptional<T,U>} markOptional
 */

// Ensure typedefs are loaded when importing xcraft-core-stones
require('xcraft-core-stones/typedefs.js');

module.exports = {
  ...require('./base-types.js'),
  ...require('./types.js'),
  ...require('./extra-types/date-time.js'),
  ...require('./extra-types/date.js'),
  ...require('./extra-types/pattern.js'),
  ...require('./extra-types/percentage.js'),
  ...require('./extra-types/time.js'),
  ...require('./extra-types/year-month.js'),
  ...require('./check.js'),
  checkType: require('./check-type.js'),
  ...require('./get-type-instance.js'),
  parse: require('./parse.js'),
  ...require('./sculpt.js'),
  validate: require('./validate.js'),
};
