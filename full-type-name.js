/* eslint-disable jsdoc/valid-types */
/* eslint-disable jsdoc/require-returns-description */
/* eslint-disable jsdoc/require-param-description */
// @ts-check

const {isAnyType, isClassType, isClassShape} = require('./base-types');

/**
 * @param {import('./base-types').AnyTypeOrShape} type
 * @returns {string}
 */
function fullTypeName(type) {
  // AnyType
  if (isAnyType(type)) {
    return type.fullName;
  }

  // Class type
  if (isClassType(type)) {
    return type.name;
  }

  // Class shape
  if (isClassShape(type)) {
    return type.name;
  }

  return 'object';
}

module.exports = fullTypeName;
