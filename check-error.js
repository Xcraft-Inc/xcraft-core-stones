/* eslint-disable jsdoc/valid-types */
/* eslint-disable jsdoc/check-tag-names */

/**
 * @template T
 * @typedef {import("./base-types.js").t<T>} t
 */

const {any} = require('./base-types.js');

const {string, number, union, array, option, type} = require('./types.js');

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
