/* eslint jsdoc/check-tag-names: "off" */
/* eslint jsdoc/no-undefined-types: "off" */
/* eslint jsdoc/require-param-description: "off" */
/* eslint jsdoc/require-returns-description: "off" */
/* eslint jsdoc/valid-types: "off" */
// @ts-check

/**
 * @typedef {import("./base-types.js").AnyTypeOrShape} AnyTypeOrShape
 */
/**
 * @typedef {import("./base-types.js").ObjectShape} ObjectShape
 */
/**
 * @template {ObjectShape} S
 * @typedef {import("./base-types.js").objectType<S>} objectType
 */
/**
 * @template T
 * @typedef {import("./base-types.js").t<T>} t
 */

const {Type, AnyType} = require('./base-types.js');
const setProtoAndProps = require('./set-proto-and-props.js');

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
 * @extends {Type<t<T> | undefined | null>}
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
 * @extends {Type<Function>}
 */
class FunctionType extends Type {
  constructor() {
    super('function');
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

/**
 * @extends {ArrayType<AnyType>}
 */
class AnyArrayType extends ArrayType {
  constructor() {
    super(any);
  }
}

/**
 * @typedef {{[K in keyof any]: any}} օbject
 */

/**
 * @extends {Type<օbject>}
 */
class AnyObjectType extends Type {
  constructor() {
    super('object');
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
 * @type {AnyArrayType & (<T extends AnyTypeOrShape>(valuesType: T) => ArrayType<T>)}
 */
const array = setProtoAndProps(function array(valuesType) {
  return new ArrayType(valuesType);
}, new AnyArrayType());

/**
 * @template {AnyTypeOrShape[]} T
 * @param {T} types
 * @returns {TupleType<T>}
 */
const tuple = (...types) => new TupleType(types);

/**
 * @type {AnyObjectType & (<T extends ObjectShape>(properties: T) => ObjectType<T>)}
 */
const object = setProtoAndProps(function object(properties) {
  return new ObjectType('object', properties);
}, new AnyObjectType());

/** @type {<const T extends readonly unknown[]>(...values: T) => EnumerationType<T>} */
const enumeration = (...values) => new EnumerationType(values);

/**
 * @template {AnyTypeOrShape[]} T
 * @param {T} types
 * @returns {UnionType<T>}
 */
const union = (...types) => new UnionType(types);

const type = new TypeType();

const func = new FunctionType();

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
  tuple,
  object,
  enumeration,
  union,
  type,
  func,
  map,
  objectMap,
};
