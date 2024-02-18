//@ts-check

const {isAnyType, isClassType, isClassShape} = require('./base-types.js');
const {object, ObjectType} = require('./types.js');

require('./index.js'); // Import typedefs

/**
 * @template {AnyTypeOrShape} T
 * @param {T} typeOrShape
 * @returns {GetType<T>}
 * //returns {Type<t<T>>}
 */
function getTypeInstance(typeOrShape) {
  // AnyType
  if (isAnyType(typeOrShape)) {
    // @ts-ignore
    return typeOrShape;
  }

  // Class type
  if (isClassType(typeOrShape)) {
    // @ts-ignore
    return new typeOrShape();
  }

  // Class shape
  if (isClassShape(typeOrShape)) {
    const objShape = new typeOrShape();
    // @ts-ignore
    return object(objShape);
  }

  // Object shape
  // @ts-ignore
  return object(typeOrShape);
}

/**
 * @template {AnyObjectShape} T
 * @param {T} typeOrShape
 * @returns {ObjectType<GetShape<T>>}
 */
function toObjectType(typeOrShape) {
  // AnyType
  if (typeOrShape instanceof ObjectType) {
    return typeOrShape;
  }

  // Class shape
  if (isClassShape(typeOrShape)) {
    const objShape = new typeOrShape();
    // @ts-ignore
    return object(objShape);
  }

  // Object shape
  // @ts-ignore
  return object(typeOrShape);
}

module.exports = {getTypeInstance, toObjectType};
