// @ts-check

/**
 * Base class for any type definition
 * @template T
 */
class Type {
  /**
   * Type parameter T must be used somewhere
   * so it is assigned to this empty private field
   * @type {T}
   */
  #type;

  /**
   * @param {string} name
   */
  constructor(name) {
    this.name = name;
  }
}

/**
 * @extends {Type<any>}
 */
class AnyType extends Type {
  constructor() {
    super('any');
  }
}

/**
 * Get the JS type of a base type definition
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
//  * @typedef {{[k: string]: AnyType}} ObjectShape
//  */

/**
 * @typedef {abstract new (...args: any) => ObjectShape} ClassShape
 */

// ## Type helpers ##

/**
 * @template T
 * @typedef {T} identity
 */

/**
 * @template T
 * @typedef {identity<{[k in keyof T]: T[k]}>} flatten
 */

/**
 * Get the JS type of an object shape.
 * Note: Using "identity" is needed to display JS object types
 * and not a combination of other types.
 * @template {ObjectShape} S
 * @typedef {identity<{[k in keyof S]: t<S[k]>}>} objectType
 */

/**
 * Get the JS type of a type defined as a class.
 * @template {ClassShape} T
 * @typedef {objectType<InstanceType<T>>} classType
 */

/**
 * @typedef {AnyType | ClassShape | ObjectShape} AnyTypeOrShape
 */

/**
 * Get the JS type of a complexe type definition.
 * @template T
 * @typedef {T extends AnyType ? jsType<T> : T extends ClassShape ? classType<T> : T extends ObjectShape ? objectType<T> : never} t
 */

// Variant constrained to AnyTypeOrShape but more complicated to import
// /**
//  * Get the JS type of a complexe type definition.
//  * @template {AnyTypeOrShape} T
//  * @typedef {T extends AnyType ? jsType<T> : T extends ClassShape ? classType<T> : objectType<T>} t
//  */

// ## Type classes ##

/**
 * @extends {Type<boolean>}
 */
class BooleanType extends Type {
  constructor() {
    super('boolean');
  }
}

/**
 * @extends {Type<string>}
 */
class StringType extends Type {
  constructor() {
    super('string');
  }
}

/**
 * @extends {Type<number>}
 */
class NumberType extends Type {
  constructor() {
    super('number');
  }
}

/**
 * @template T
 * @extends {Type<T>}
 */
class ValueType extends Type {
  /** @param {T} value */
  constructor(value) {
    super(`value<${value}>`);
    this.value = value;
  }
}

/**
 * @template {AnyTypeOrShape} T
 * @extends {Type<t<T> | undefined>}
 */
class OptionType extends Type {
  /** @param {T} subType */
  constructor(subType) {
    super(`option<${subType.name}>`);
    this.subType = subType;
  }
}

/**
 * @template {AnyTypeOrShape} T
 * @extends {Type<Array<t<T>>>}
 */
class ArrayType extends Type {
  /** @param {T} valuesType */
  constructor(valuesType) {
    super(`array<${valuesType.name}>`);
    this.valuesType = valuesType;
  }
}

/**
 * @template {ObjectShape} T
 * @extends {Type<objectType<T>>}
 */
class ObjectType extends Type {
  /**
   * @param {string} name
   * @param {T} properties
   */
  constructor(name, properties) {
    super(name);
    this.properties = properties;
  }
}

/**
 * @template {readonly any[]} T
 * @extends {Type<T[number]>}
 */
class EnumerationType extends Type {
  /**
   * @param {T} values
   */
  constructor(values) {
    super('enumeration');
    this.values = values;
  }
}

/**
 * @template {AnyTypeOrShape[]} T
 * @extends {Type<t<T[number]>>}
 */
class UnionType extends Type {
  /**
   * @param {T} types
   */
  constructor(types) {
    super('union');
    this.types = types;
  }
}

/**
 * @template {AnyTypeOrShape} K
 * @template {AnyTypeOrShape} V
 * @extends {Type<Map<t<K>, t<V>>>}
 */
class MapType extends Type {
  /**
   * @param {K} keysType
   * @param {V} valuesType
   */
  constructor(keysType, valuesType) {
    super(`map<${keysType.name},${valuesType.name}>`);
    this.keysType = keysType;
    this.valuesType = valuesType;
  }
}

// ## Type instances ##

const any = new AnyType();

const boolean = new BooleanType();

const string = new StringType();

const number = new NumberType();

// This notation does not support "const" parameter
// /**
//  * @template  T
//  * @param {T} value
//  * @returns {ValueType<T>}
//  */
/** @type {<const T>(value: T) => ValueType<T>} */
const value = (value) => new ValueType(value);

/**
 * @template {AnyTypeOrShape} T
 * @param {T} subType
 * @returns {OptionType<T>}
 */
const option = (subType) => new OptionType(subType);

/**
 * @template {AnyTypeOrShape} T
 * @param {T} subType
 * @returns {ArrayType<T>}
 */
const array = (subType) => new ArrayType(subType);

/**
 * @template {ObjectShape} T
 * @param {T} properties
 * @returns {ObjectType<T>}
 */
const object = (properties) => new ObjectType('object', properties);

/** @type {<const T extends readonly unknown[]>(...values: T) => EnumerationType<T>} */
const enumeration = (...values) => new EnumerationType(values);

/**
 * @template {AnyTypeOrShape[]} T
 * @param {T} types
 * @returns {UnionType<T>}
 */
const union = (...types) => new UnionType(types);

/**
 * @template {AnyTypeOrShape} K
 * @template {AnyTypeOrShape} V
 * @param {K} keysType
 * @param {V} valuesType
 * @returns {MapType<K,V>}
 */
const map = (keysType, valuesType) => new MapType(keysType, valuesType);

module.exports = {
  Type,
  AnyType,
  BooleanType,
  StringType,
  NumberType,
  ValueType,
  OptionType,
  ArrayType,
  ObjectType,
  EnumerationType,
  UnionType,
  MapType,

  any,
  boolean,
  string,
  number,
  value,
  option,
  array,
  object,
  enumeration,
  union,
  map,
};
