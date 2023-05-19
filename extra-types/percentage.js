/* eslint-disable jsdoc/valid-types */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable jsdoc/require-param-description */
// @ts-check

const {Type} = require('../base-types.js');
const parse = require('../parse.js');

/**
 * @extends {Type<`${number}%`>}
 */
class PercentageType extends Type {
  constructor() {
    super('percentage');
  }

  /** @type {Type["check"]} */
  check(value, check) {
    if (!check.typeOf(value, 'string')) {
      return;
    }
    const pattern = /^-?\d+(\.\d+)?%$/;
    check.true(pattern.test(value), 'bad pattern', {
      actual: value,
      expected: '{number}%',
      expectedPattern: pattern.toString(),
    });
  }

  parse(value) {
    return parse(value, this);
  }
}

const percentage = new PercentageType();

module.exports = {
  PercentageType,
  percentage,
};
