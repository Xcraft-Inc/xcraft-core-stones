// @ts-check
/**
 * @template T
 * @typedef {import("./base-types.js").t<T>} t
 */
/**
 * @typedef {import("./base-types.js").AnyTypeOrShape} AnyTypeOrShape
 */

/**
 * @template {AnyTypeOrShape} T
 * @param {T} type
 * @returns {(_?: t<T>) => t<T>}
 */
function sculpt(type) {
  type;
  // @ts-ignore
  return function (_) {
    return _;
  };
}

/**
 * @template {AnyTypeOrShape} T
 * @param {T} type
 * @returns {new (_?: t<T>) => t<T>}
 */
function Sculpt(type) {
  type;
  // @ts-ignore
  return function (_) {
    Object.assign(this, _);
  };
}

module.exports = {sculpt, Sculpt};
