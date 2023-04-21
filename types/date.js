/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable no-unused-vars */
/* eslint-disable jsdoc/valid-types */
const {PatternType} = require('./pattern.js');

/** @typedef {{readonly __type: unique symbol}} ø */

/**
 * @extends {PatternType<string | ('YYYY-MM-DD' & ø)>}
 */
class DateType extends PatternType {
  name = 'date';
  // Regex from https://www.w3.org/TR/xmlschema11-2/#date without time zone
  pattern = /^-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
}

const date = new DateType();

module.exports = {
  DateType,
  date,
};
