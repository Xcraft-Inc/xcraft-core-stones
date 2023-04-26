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
 * @param {AnyTypeOrShape} type
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

// ## Type classes ##

/**
 * @extends {Type<boolean>}
 */
class BooleanType extends Type {
  constructor() {
    super('boolean');
  }

  /** @type {Type["check"]} */
  check(value, check) {
    check.typeOf(value, 'boolean');
  }
}

/**
 * @extends {Type<string>}
 */
class StringType extends Type {
  constructor() {
    super('string');
  }

  /** @type {Type["check"]} */
  check(value, check) {
    check.typeOf(value, 'string');
  }
}

/**
 * @extends {Type<number>}
 */
class NumberType extends Type {
  constructor() {
    super('number');
  }

  /** @type {Type["check"]} */
  check(value, check) {
    check.typeOf(value, 'number');
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

  /** @type {Type["check"]} */
  check(value, check) {
    check.equal(value, this.value, 'bad value');
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

  /** @type {Type["check"]} */
  check(value, check) {
    if (value !== undefined) {
      check.type(value, this.subType);
    }
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

  /** @type {Type["check"]} */
  check(value, check) {
    if (!check.array(value)) {
      return;
    }
    for (const [index, item] of value.entries()) {
      check.typeWithPath(item, this.valuesType, index);
    }
  }
}

/**
 * @template {AnyTypeOrShape[]} T
 * @extends {Type<{[K in keyof T]: t<T[K]>}>}
 */
class TupleType extends Type {
  /**
   * @param {T} types
   */
  constructor(types) {
    super(`tuple<${types.map((type) => type.name).join(',')}>`);
    this.types = types;
  }

  /** @type {Type["check"]} */
  check(value, check) {
    if (!check.array(value)) {
      return;
    }
    if (!check.equal(value.length, this.types.length, 'bad tuple size')) {
      return;
    }
    for (const [index, item] of value.entries()) {
      const type = this.types[index];
      check.typeWithPath(item, type, index);
    }
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

  /** @type {Type["check"]} */
  check(value, check) {
    check.shape(value, this.properties);
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

  /** @type {Type["check"]} */
  check(value, check) {
    check.true(this.values.includes(value), 'enumeration mismatch', {
      actual: value,
      expectedValues: this.values,
    });
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
    super(`union<${types.map((type) => type.name).join(',')}>`);
    this.types = types;
  }

  /** @type {Type["check"]} */
  check(value, check) {
    check.oneOfTypes(value, this.types);
  }
}

/**
 * @extends {Type<AnyTypeOrShape>}
 */
class TypeType extends Type {
  constructor() {
    super('type');
  }

  /** @type {Type["check"]} */
  check(value, check) {
    throw new Error('Not implemented');
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

  /** @type {Type["check"]} */
  check(value, check) {
    if (!check.object(value)) {
      return;
    }
    for (const [k, v] of Object.entries(value)) {
      check.typeWithPath(k, this.keysType, `[key=${k}]`);
      check.typeWithPath(v, this.valuesType, k);
    }
  }
}

/**
 * @template {AnyTypeOrShape} V
 * @extends {Type<{[key: string]: t<V>}>}
 */
class ObjectMapType extends Type {
  /**
   * @param {V} valuesType
   */
  constructor(valuesType) {
    super(`object<${valuesType.name}>`);
    this.valuesType = valuesType;
  }

  /** @type {Type["check"]} */
  check(value, check) {
    if (!check.object(value)) {
      return;
    }
    for (const [k, v] of Object.entries(value)) {
      check.typeWithPath(v, this.valuesType, k);
    }
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
 * @template {AnyTypeOrShape[]} T
 * @param {T} types
 * @returns {TupleType<T>}
 */
const tuple = (...types) => new TupleType(types);

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

const type = new TypeType();

/**
 * @template {AnyTypeOrShape} K
 * @template {AnyTypeOrShape} V
 * @param {K} keysType
 * @param {V} valuesType
 * @returns {MapType<K,V>}
 */
const map = (keysType, valuesType) => new MapType(keysType, valuesType);

/**
 * @template {AnyTypeOrShape} V
 * @param {V} valuesType
 * @returns {ObjectMapType<V>}
 */
const objectMap = (valuesType) => new ObjectMapType(valuesType);

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

  isAnyType,
  isClassType,
  isClassShape,

  any,
  boolean,
  string,
  number,
  value,
  option,
  array,
  tuple,
  object,
  enumeration,
  union,
  type,
  map,
  objectMap,
};
