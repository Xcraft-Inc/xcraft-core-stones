// @ts-check
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
 * @typedef {import("./check-error.js").CheckError} CheckError
 */

/**
 * @template {AnyTypeOrShape} T
 * @param {any} value
 * @param {T} type
 * @returns {{ok:true, value:t<T>} | {ok:false, errors: CheckError[], errorMessage: string}}
 */
function checkType(value, type) {
  const check = new Check();
  if (!check.type(value, type)) {
    return {
      ok: false,
      errors: check.errors,
      get errorMessage() {
        return (
          `Error while checking ${fullTypeName(type)}\n` +
          check.errors.map((err) => errorMessage(err)).join('\n')
        );
      },
    };
  }
  return {ok: true, value};
}

module.exports = checkType;
