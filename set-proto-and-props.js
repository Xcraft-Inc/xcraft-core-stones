/**
 * @template T,U
 * @param {T} destination
 * @param {U} source
 * @returns {U & T}
 */
module.exports = function setProtoAndProps(destination, source) {
  return Object.defineProperties(
    Object.setPrototypeOf(destination, Object.getPrototypeOf(source)),
    Object.getOwnPropertyDescriptors(source)
  );
};
