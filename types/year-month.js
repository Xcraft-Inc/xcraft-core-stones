/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable no-unused-vars */
/* eslint-disable jsdoc/valid-types */
const {PatternType} = require('./pattern.js');

/** @typedef {{readonly __type: unique symbol}} ø */

/**
 * @extends {PatternType<string | ('YYYY-MM' & ø)>}
 */
class YearMonthType extends PatternType {
  name = 'yearMonth';
  // Regex from https://www.w3.org/TR/xmlschema11-2/#gYearMonth without time zone
  pattern = /^-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])$/;
}

const yearMonth = new YearMonthType();

module.exports = {
  YearMonthType,
  yearMonth,
};
