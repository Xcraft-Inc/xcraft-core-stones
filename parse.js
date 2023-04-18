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
 * @returns {t<T>}
 */
function parse(value, type) {
  const check = new Check();
  if (!check.type(value, type)) {
    throw check.error();
  }
  return value;
}

module.exports = parse;
