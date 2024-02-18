/**
 * @typedef {import("./base-types.js").AnyTypeOrShape} AnyTypeOrShape
 * @typedef {import('./base-types.js').AnyType} AnyType
 * @typedef {import('./base-types.js').ClassType} ClassType
 * @typedef {import("./base-types.js").ClassShape} ClassShape
 * @typedef {import("./base-types.js").ObjectShape} ObjectShape
 */
/**
 * @template T
 * @typedef {import('./base-types.js').flatten<T>} flatten
 */
/**
 * @template T
 * @typedef {import("./base-types.js").t<T>} t
 */
/**
 * @template {ObjectShape} S
 * @typedef {import('./base-types.js').objectType<S>} objectType
 */
/**
 * @template {ClassShape} T
 * @typedef {import('./base-types.js').classType<T>} classType
 */
/**
 * @typedef {import("./types.js").AnyObjectShape} AnyObjectShape
 */
/**
 * @template T
 * @typedef {import("./types.js").ObjectType<T>} ObjectType
 */

/**
 * @template {AnyTypeOrShape} T
 * @typedef {T extends AnyType ? T : T extends ClassType ? InstanceType<T>: T extends ClassShape ? ObjectType<flatten<InstanceType<T>>> : T extends ObjectShape ? ObjectType<flatten<T>> : never} GetType
 */

/**
 * @template {AnyObjectShape} T
 * @typedef {T extends ObjectType<any> ? T["properties"] : T extends ClassShape ? flatten<InstanceType<T>> : T extends ObjectShape ? T : never} GetShape
 */
