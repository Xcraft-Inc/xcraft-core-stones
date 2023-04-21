/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable no-unused-vars */
/* eslint-disable jsdoc/valid-types */
const {Type} = require('../base-types.js');
const {PatternType} = require('./pattern.js');

/** @typedef {{readonly __type: unique symbol}} ø */

/**
 * @extends {PatternType<string | ('YYYY-MM-DDTHH:mm:ss.sssZ' & ø)>}
 */
class DateTimeType extends PatternType {
  name = 'dateTime';
  // Regex from https://www.w3.org/TR/xmlschema11-2/#dateTime
  pattern = /^-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?|(24:00:00(\.0+)?))(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/;
}

const dateTime = new DateTimeType();

module.exports = {
  DateTimeType,
  dateTime,
};
