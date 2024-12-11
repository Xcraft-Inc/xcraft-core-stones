/* eslint jsdoc/check-tag-names: "off" */
/* eslint jsdoc/no-undefined-types: "off" */
/* eslint jsdoc/require-param-description: "off" */
/* eslint jsdoc/require-returns-description: "off" */
/* eslint jsdoc/valid-types: "off" */
// @ts-check

/**
 * @typedef {import("./check.js").Check} Check
 */

/**
 * Base class for any type definition
 *
 * @template T
 */
class Type {
  /**
   * Type parameter T must be used somewhere
   * so it is assigned to this empty private field
   *
   * @type {T}
   */
  #type;

  /**
   * @param {string} name
   */
  constructor(name) {
    this.name = name;
  }

  get fullName() {
    return this.name;
  }

  /**
   * @param {any} value
   * @param {Check} check
   */
  check(value, check) {
    value;
    check;
    throw new Error("Method 'check' must be implemented");
  }
}

/**
 * @extends {Type<any>}
 */
class AnyType extends Type {
  constructor() {
    super('any');
  }

  /** @type {Type["check"]} */
  check() {}
}

/**
 * Get the JS type of a base type definition
 *
 * @template {AnyType} T
 * @typedef {T extends Type<infer U> ? U : never} jsType
 */

// Alternative method that doesn't work if #type is private
// /**
//  * @template {AnyType} T
//  * @typedef {T["_type"]} jsType
//  */

/**
 * @typedef {{[k: string]: any}} ObjectShape
 */

// Variant that does not work if the shape is a class
// /**
//  * @typedef {{[k: string]: AnyTypeOrShape}} ObjectShape
//  */

/**
 * @typedef {new (...args: any) => AnyType} ClassType
 */

/**
 * @typedef {new (...args: any) => ObjectShape} ClassShape
 */

// ## Type helpers ##

/**
 * @template T
 * @typedef {T} identity
 */

/**
 * Ensures the type is displayed as an object and not a combination of other types.
 *
 * @template T
 * @typedef {identity<{[k in keyof T]: T[k]}>} flatten
 */

/**
 * Get the keys of T that are not one of K
 *
 * @template T
 * @template {keyof T} K
 * @typedef {Exclude<keyof T, K>} otherKeys
 */

/**
 * Get the keys whose value can be undefined
 *
 * @template T
 * @typedef {{[K in keyof T] : undefined extends T[K] ? K : never}[keyof T]} undefinedKeys
 */

/**
 * Set optional modifier to some keys of an object
 *
 * @template T
 * @template {keyof T} U
 * @typedef {flatten<{[K in keyof T]? : T[K]} & {[K in otherKeys<T, U | undefinedKeys<T>>] : T[K]}>} markOptional
 */

// Variant that displays strange types for branded types in objects
// Example:
// /** @typedef {string | {readonly __type: unique symbol}} brandedString */
// /** @typedef {markOptional<{foo:brandedString}, never>} test */
// "test" is "foo: (brandedString | undefined) & brandedString" instead of "foo: brandedString"
// /**
//  * Set optional modifier to some keys of an object
//  *
//  * @template T
//  * @template {keyof T} K
//  * @typedef {flatten<Partial<T> & {[O in otherKeys<T, K>] : T[O]}>} markOptional
//  */

/**
 * Set optional modifier to keys whose value can be undefined
 *
 * @template T
 * @typedef {markOptional<T, undefinedKeys<T>>} markUndefinedOptional
 */

/**
 * Get the JS type of an object shape.
 *
 * @template {ObjectShape} S
 * @typedef {markUndefinedOptional<{[k in keyof S]: t<S[k]>}>} objectType
 */

/**
 * Get the JS type of a type defined as a class.
 *
 * @template {ClassShape} T
 * @typedef {objectType<InstanceType<T>>} classType
 */

/**
 * @typedef {AnyType | ClassType | ClassShape | ObjectShape} AnyTypeOrShape
 */

/**
 * Get the JS type of a complexe type definition.
 *
 * @template T
 * @typedef {T extends AnyType ? jsType<T> : T extends ClassType ? jsType<InstanceType<T>>: T extends ClassShape ? classType<T> : T extends ObjectShape ? objectType<T> : never} t
 */

// Variant constrained to AnyTypeOrShape but more complicated to import
// /**
//  * Get the JS type of a complexe type definition.
//  * @template {AnyTypeOrShape} T
//  * @typedef {T extends AnyType ? jsType<T> : T extends ClassShape ? classType<T> : objectType<T>} t
//  */

// ## Functions to differentiate types ##

/**
 * @param {any} type
 * @returns {type is AnyType}
 */
function isAnyType(type) {
  return type instanceof Type;
}

/**
 * @param {Exclude<AnyTypeOrShape, AnyType>} type
 * @returns {type is ClassType}
 */
function isClassType(type) {
  return (
    typeof type === 'function' &&
    type.prototype &&
    type.prototype instanceof Type
  );
}

/**
 * @param {Exclude<AnyTypeOrShape, AnyType | ClassType>} type
 * @returns {type is ClassShape}
 */
function isClassShape(type) {
  return typeof type === 'function' && type.prototype;
}

module.exports = {
  Type,
  AnyType,
  isAnyType,
  isClassType,
  isClassShape,
};
