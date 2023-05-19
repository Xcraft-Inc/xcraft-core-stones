/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable no-unused-vars */
/* eslint-disable jsdoc/valid-types */
const {PatternType} = require('./pattern.js');

/** @typedef {{readonly __type: unique symbol}} ø */

/**
 * @extends {PatternType<string | ('HH:mm:ss.sssZ' & ø)>}
 */
class TimeType extends PatternType {
  name = 'time';
  // Regex from https://www.w3.org/TR/xmlschema11-2/#time
  pattern = /^(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?|(24:00:00(\.0+)?))(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/;
}

const time = new TimeType();

module.exports = {
  TimeType,
  time,
};
