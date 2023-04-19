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
 * @return {(_?: t<T>) => t<T>}
 */
function sculpt(type) {
  type;
  return function (_) {
    return _;
  };
}

/**
 * @template {AnyTypeOrShape} T
 * @param {T} type
 * @return {new (_?: t<T>) => t<T>}
 */
function Sculpt(type) {
  type;
  return function (_) {
    return _;
  };
}

module.exports = {sculpt, Sculpt};
