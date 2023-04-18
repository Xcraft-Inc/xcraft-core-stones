const {Check} = require('./check.js');
/**
 * @template T
 * @typedef {import("./base-types.js").t<T>} t
 */
/**
 * @typedef {import("./base-types.js").AnyTypeOrShape} AnyTypeOrShape
 */

/**
 * @template {AnyTypeOrShape} T
 * @param {any} value
 * @param {T} type
 * @returns {value is t<T>}
 */
function validate(value, type) {
  const check = new Check();
  check.type(value, type);
  return check.ok;
}

module.exports = validate;
