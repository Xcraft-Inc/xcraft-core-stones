const {Check} = require('./check.js');
const errorMessage = require('./error-message.js');
const fullTypeName = require('./full-type-name.js');
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
    const error =
      `Error while parsing ${fullTypeName(type)}\n` +
      check.errors.map((err) => errorMessage(err)).join('\n');
    throw new Error(error);
  }
  return value;
}

module.exports = parse;
