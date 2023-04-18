/* eslint-disable jsdoc/valid-types */
/* eslint-disable jsdoc/check-tag-names */

const {
  string,
  any,
  number,
  union,
  array,
  option,
  type,
} = require('./base-types.js');

/**
 * @template T
 * @typedef {import("./base-types.js").t<T>} t
 */

const PathElementType = union(string, number);
/** @typedef {t<PathElementType>} PathElement */

const PathType = array(PathElementType);
/** @typedef {t<PathType>} Path */

class CheckErrorType {
  errorName = string;
  info = any;
  type = option(type);
  path = option(PathType);
}
/** @typedef {t<CheckErrorType>} CheckError */

module.exports = {};
