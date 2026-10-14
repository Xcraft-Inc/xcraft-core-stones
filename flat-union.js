// @ts-check
const {PatternType, pattern} = require('./extra-types/pattern.js');
const {getTypeInstance} = require('./get-type-instance.js');
const {
  UnionType,
  StringType,
  NumberType,
  BooleanType,
  string,
  number,
  boolean,
} = require('./types.js');

/**
 * @template {AnyTypeOrShape[] | []} T
 * @typedef {T extends [UnionType<infer U extends AnyTypeOrShape[]>, ...infer R extends AnyTypeOrShape[]] ? FlattenUnion<[...U, ...R]>
 *  : T extends [infer U, ...infer R extends AnyTypeOrShape[]] ? [U, ...FlattenUnion<R>]
 *  : T} FlattenUnion
 */

/**
 * @template {AnyTypeOrShape[] | []} T
 * @typedef {T extends [StringType<infer U>, StringType<infer V>, ...infer R extends AnyTypeOrShape[]] ? MergeUnion<[StringType<U | V>, ...R]>
 *  : T extends [NumberType, NumberType, ...infer R extends AnyTypeOrShape[]] ? MergeUnion<[NumberType, ...R]>
 *  : T extends [BooleanType, BooleanType, ...infer R extends AnyTypeOrShape[]] ? MergeUnion<[BooleanType, ...R]>
 *  : T extends [infer U, ...infer R extends AnyTypeOrShape[]] ? [U, ...MergeUnion<R>]
 *  : T} MergeUnion
 */
//  : T extends [OptionType<infer U>, infer V, ...infer R extends AnyTypeOrShape[]] ? ([V] extends [U] ? MergeUnion<[OptionType<U>, ...R]> : [OptionType<U>, ...MergeUnion<[V, ...R]>])
//  : T extends [infer U, OptionType<infer V>, ...infer R extends AnyTypeOrShape[]] ? ([U] extends [V] ? MergeUnion<[OptionType<V>, ...R]> : [U, ...MergeUnion<[OptionType<V>, ...R]>])

/**
 * @template {AnyTypeOrShape[] | []} T
 * @typedef {T extends [infer U extends AnyTypeOrShape] ? GetType<U> : UnionType<T>} BaseUnion
 */

/**
 * @template {AnyTypeOrShape[] | []} T
 * @typedef {BaseUnion<MergeUnion<FlattenUnion<T>>>} FlatUnionType
 */

/**
 * @template {AnyTypeOrShape[] | []} T
 * @param {T} types
 * @returns {FlattenUnion<T>}
 */
const flattenUnion = (types) => {
  return /** @type {FlattenUnion<T>} */ (types.flatMap((type) =>
    type instanceof UnionType ? flattenUnion(type.types) : type
  ));
};

/**
 * @param {AnyTypeOrShape} a
 * @param {AnyTypeOrShape} b
 */
function mergeUnionItems(a, b) {
  if (a instanceof PatternType && b instanceof PatternType) {
    return pattern(new RegExp([a.pattern.source + '|' + b.pattern.source]));
  }
  if (a instanceof StringType && b instanceof StringType) {
    return string;
  }
  if (a instanceof NumberType && b instanceof NumberType) {
    return number;
  }
  if (a instanceof BooleanType && b instanceof BooleanType) {
    return boolean;
  }
  return null;
}

/**
 * @template {AnyTypeOrShape[]} T
 * @param {T} types
 * @returns {MergeUnion<T>}
 */
const mergeUnion = (types) => {
  return /** @type {MergeUnion<T>} */ (types.reduce(
    /**
     * @param {AnyTypeOrShape[]} result
     * @param {AnyTypeOrShape} type
     * @returns {AnyTypeOrShape[]}
     */
    (result, type) => {
      if (result.length > 0) {
        const prev = result[result.length - 1];
        const newValue = mergeUnionItems(prev, type);
        if (newValue) {
          result[result.length - 1] = newValue;
          return result;
        }
      }
      result.push(type);
      return result;
    },
    []
  ));
};

/**
 * @template {AnyTypeOrShape[] | []} T
 * @param {T} types
 * @returns {BaseUnion<T>}
 */
const baseUnion = (types) => {
  if (types.length === 1) {
    return /** @type {BaseUnion<T>} */ (getTypeInstance(types[0]));
  }
  return /** @type {BaseUnion<T>} */ (new UnionType(types));
};

/**
 * @template {AnyTypeOrShape[] | []} T
 * @param {T} types
 * @returns {FlatUnionType<T>}
 */
const flatUnion = (...types) => {
  return baseUnion(mergeUnion(flattenUnion(types)));
};

module.exports = {
  flatUnion,
};
