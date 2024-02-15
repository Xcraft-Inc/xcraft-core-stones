//@ts-check

const {Type, isAnyType, isClassType, isClassShape} = require('./base-types.js');
const {object, ObjectType} = require('./types.js');

/**
 * @template T
 * @typedef {T extends AnyType ? T : T extends ClassType ? InstanceType<T>: T extends ClassShape ? ObjectType<flatten<InstanceType<T>>> : T extends ObjectShape ? ObjectType<T> : never} GetType
 */

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

module.exports = {getTypeInstance};
