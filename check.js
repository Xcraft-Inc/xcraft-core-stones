/* eslint-disable jsdoc/no-undefined-types */
/* eslint-disable jsdoc/require-returns-description */
/* eslint-disable jsdoc/require-param-description */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable jsdoc/valid-types */
// @ts-check

const {isAnyType, isClassShape, isClassType} = require('./base-types.js');
/**
 * @template T
 * @typedef {import("./base-types.js").t<T>} t
 */
/**
 * @typedef {import("./base-types.js").AnyTypeOrShape} AnyTypeOrShape
 * @typedef {import("./base-types.js").ClassType} ClassType
 * @typedef {import("./base-types.js").ObjectShape} ObjectShape
 * @typedef {import("./base-types.js").ClassShape} ClassShape
 * @typedef {import("./check-error.js").PathElement} PathElement
 * @typedef {import("./check-error.js").Path} Path
 * @typedef {import("./check-error.js").CheckError} CheckError
 */

/**
 * @param {any} value
 * @returns {string}
 */
function getTypeName(value) {
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'object') {
    const constructorName = Object.getPrototypeOf(value).constructor.name;
    if (constructorName && constructorName !== 'Object') {
      return constructorName;
    }
    return 'object';
  }
  return typeof value;
}

class Check {
  /** @type {CheckError[]} */
  errors = [];

  /** @type {AnyTypeOrShape | undefined} */
  currentType;

  /** @type {Path} */
  currentPath;

  /**
   * @param {object} [options]
   * @param {AnyTypeOrShape} [options.type]
   * @param {Path} [options.path]
   */
  constructor({type, path} = {}) {
    this.currentType = type;
    this.currentPath = path || [];
  }

  /**
   * @param {CheckError} error
   * @returns {CheckError}
   */
  #completeError(error) {
    let path;
    if (error.path !== undefined) {
      path = [...this.currentPath, ...error.path];
    } else {
      path = this.currentPath;
    }
    return {
      ...error,
      type: error.type || this.currentType,
      path,
    };
  }

  /** @param {CheckError} error */
  #pushError(error) {
    this.errors.push(this.#completeError(error));
  }

  /** @param {CheckError[]} errors */
  #concatErrors(errors) {
    this.errors = this.errors.concat(errors);
  }

  get ok() {
    return this.errors.length === 0;
  }

  /**
   * @param {any} actual
   * @param {any} expected
   * @param {string} errorName
   * @returns {boolean}
   */
  equal(actual, expected, errorName) {
    const ok = actual === expected;
    if (!ok) {
      this.#pushError({
        errorName,
        info: {
          actual,
          expected,
        },
      });
    }
    return ok;
  }

  /**
   *
   * @param {any} actual
   * @param {any} unexpected
   * @param {string} errorName
   * @returns {boolean}
   */
  notEqual(actual, unexpected, errorName) {
    const ok = actual !== unexpected;
    if (!ok) {
      this.#pushError({
        errorName,
        info: {
          actual,
          unexpected,
        },
      });
    }
    return ok;
  }

  /**
   *
   * @param {any} actual
   * @param {any} min
   * @param {string} errorName
   * @returns {boolean}
   */
  greaterOrEqual(actual, min, errorName) {
    const ok = actual >= min;
    if (!ok) {
      this.#pushError({
        errorName,
        info: {
          actual,
          min,
        },
      });
    }
    return ok;
  }

  /**
   *
   * @param {any} actual
   * @param {any} max
   * @param {string} errorName
   * @returns {boolean}
   */
  lowerOrEqual(actual, max, errorName) {
    const ok = actual <= max;
    if (!ok) {
      this.#pushError({
        errorName,
        info: {
          actual,
          max,
        },
      });
    }
    return ok;
  }

  /**
   *
   * @param {any} actual
   * @param {string} errorName
   * @param {any} [info]
   * @returns {boolean}
   */
  true(actual, errorName, info) {
    const ok = Boolean(actual);
    if (!ok) {
      this.#pushError({
        errorName,
        info,
      });
    }
    return ok;
  }

  /**
   *
   * @param {any} actual
   * @param {string} expected
   * @returns {boolean}
   */
  typeOf(actual, expected) {
    const ok = typeof actual === expected;
    if (!ok) {
      this.#pushError({
        errorName: 'bad type',
        info: {
          actual: getTypeName(actual),
          expected,
        },
      });
    }
    return ok;
  }

  /**
   * @param {any} value
   * @returns {value is Array}
   */
  array(value) {
    const ok = Array.isArray(value);
    if (!ok) {
      this.#pushError({
        errorName: 'not an array',
        info: {
          actual: getTypeName(value),
        },
      });
    }
    return ok;
  }

  /**
   * @param {any} actual
   * @param {ClassType} expectedType
   * @returns {boolean}
   */
  #classType(actual, expectedType) {
    const typeInstance = new expectedType();
    return this.type(actual, typeInstance);
  }

  /**
   * @param {any} actual
   * @param {ObjectShape} expectedShape
   * @returns {boolean}
   */
  shape(actual, expectedShape) {
    const check = new Check({type: this.currentType, path: this.currentPath});

    if (!check.object(actual)) {
      this.#concatErrors(check.errors);
      return false;
    }

    for (const propertyName of Object.keys(actual)) {
      check.true(propertyName in expectedShape, 'unexpected-property', {
        propertyName,
      });
    }

    for (const [key, subType] of Object.entries(expectedShape)) {
      check.typeWithPath(actual[key], subType, key);
    }

    if (!check.ok) {
      this.#concatErrors(check.errors);
    }

    return check.ok;
  }

  /**
   * @param {any} actual
   * @param {ClassShape} expectedClass
   * @returns {boolean}
   */
  #classShape(actual, expectedClass) {
    const check = new Check({type: expectedClass, path: this.currentPath});
    const shape = new expectedClass();
    if (!check.shape(actual, shape)) {
      this.#concatErrors(check.errors);
    }
    return check.ok;
  }

  /**
   * @template {AnyTypeOrShape} T
   * @param {any} actual
   * @param {T} expectedType
   * @returns {actual is t<T>}
   */
  type(actual, expectedType) {
    // AnyType
    if (isAnyType(expectedType)) {
      const check = new Check({type: expectedType, path: this.currentPath});
      expectedType.check(actual, check);
      if (!check.ok) {
        this.#concatErrors(check.errors);
      }
      return check.ok;
    }

    // Class type
    if (isClassType(expectedType)) {
      return this.#classType(actual, expectedType);
    }

    // Class shape
    if (isClassShape(expectedType)) {
      return this.#classShape(actual, expectedType);
    }

    // Object shape
    return this.shape(actual, expectedType);
  }

  /**
   * @template {AnyTypeOrShape} T
   * @param {any} actual
   * @param {T} expectedType
   * @param {PathElement} path
   * @returns {actual is t<T>}
   */
  typeWithPath(actual, expectedType, path) {
    const check = new Check({path: [...this.currentPath, path]});
    check.type(actual, expectedType);
    if (!check.ok) {
      this.#concatErrors(check.errors);
    }
    return check.ok;
  }

  /**
   * @param {any} actual
   * @returns {actual is object} ('is object' does not work ?)
   */
  object(actual) {
    if (!this.equal(typeof actual, 'object', 'bad type')) {
      return false;
    }
    if (!this.notEqual(actual, null, 'bad type')) {
      return false;
    }
    return true;
  }

  /**
   * @param {any} actual
   * @param {AnyTypeOrShape[]} expectedTypes
   * @returns {boolean}
   */
  oneOfTypes(actual, expectedTypes) {
    const check = new Check();

    let ok = false;
    for (const type of expectedTypes) {
      if (check.type(actual, type)) {
        ok = true;
        break;
      }
    }

    if (!ok) {
      this.#pushError({
        errorName: 'not-one-of-types',
        info: {
          actual,
          expectedTypes: expectedTypes.map((t) => t.name),
          errors: check.errors,
        },
      });
    }

    return ok;
  }

  tooManyErrors() {
    if (this.errors.length >= 100) {
      this.#pushError({
        errorName: 'Too many errors',
        info: {
          errorCount: this.errors.length,
        },
      });
      return true;
    }
    return false;
  }
}

module.exports = {Check};
