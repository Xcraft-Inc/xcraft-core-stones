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
module.exports = {
  ...require('./base-types.js'),
  ...require('./types/date-time.js'),
  ...require('./types/date.js'),
  ...require('./types/pattern.js'),
  ...require('./types/percentage.js'),
  ...require('./types/time.js'),
  ...require('./types/year-month.js'),
  ...require('./check.js'),
  parse: require('./parse.js'),
  ...require('./sculpt.js'),
  validate: require('./validate.js'),
};
