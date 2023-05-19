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
  ...require('./extra-types/date-time.js'),
  ...require('./extra-types/date.js'),
  ...require('./extra-types/pattern.js'),
  ...require('./extra-types/percentage.js'),
  ...require('./extra-types/time.js'),
  ...require('./extra-types/year-month.js'),
  ...require('./check.js'),
  parse: require('./parse.js'),
  ...require('./sculpt.js'),
  validate: require('./validate.js'),
};
