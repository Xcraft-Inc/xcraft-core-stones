/* eslint-disable jsdoc/valid-types */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable jsdoc/require-param-description */
// @ts-check

const {Type, StringType} = require('../base-types.js');
const parse = require('../parse.js');
/**
 * @template T
 * @typedef {import("../base-types.js").t<T>} t
 */

class PatternType extends StringType {
  name = this.constructor.name;
  pattern;

  /**
   * @param {string | RegExp} [pattern]
   */
  constructor(pattern) {
    super();
    if (typeof pattern === 'string') {
      pattern = new RegExp(pattern);
    }
    this.pattern = pattern;
  }

  /** @type {Type["check"]} */
  check(value, check) {
    const {pattern} = this;
    if (!pattern) {
      throw new Error(`Missing pattern in ${this.name}`);
    }
    check.true(pattern.test(value), 'bad pattern', {
      actual: value,
      expectedPattern: pattern.toString(),
    });
  }

  parse(value) {
    return parse(value, this);
  }
}

const pattern = (regex) => new PatternType(regex);

module.exports = {
  PatternType,
  pattern,
};
