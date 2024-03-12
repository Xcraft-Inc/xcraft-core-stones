/* eslint-disable jsdoc/require-returns */
// @ts-check

/**
 * @typedef {false | 0 | "" | null | undefined} falsy
 */

/**
 * @template T
 * @typedef {Exclude<T, falsy>} Truthy
 */

/**
 * @template T
 * @param {T} value
 * @returns {value is Truthy<T>}
 */
function isTrue(value) {
  return Boolean(value);
}

/**
 * @template T
 * @param {T[]} array
 */
function filterOptional(array) {
  return array.filter(isTrue);
}

module.exports = {isTrue, filterOptional};
