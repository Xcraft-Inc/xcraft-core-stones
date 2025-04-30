/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable no-unused-vars */
/* eslint-disable jsdoc/valid-types */
const {PatternType} = require('./pattern.js');

/** @typedef {{readonly __type: unique symbol}} ø */

/**
 * @extends {PatternType<string | ('YYYY-MM-DDTHH:mm:ss.sss(Z|±HH:mm)[tz]' & ø)>}
 */
class ZonedDateTimeType extends PatternType {
  name = 'dateTime';
  // See "Internet Extended Date/Time Format"
  // https://datatracker.ietf.org/doc/html/rfc9557
  pattern = /^-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?|(24:00:00(\.0+)?))(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?(\[(!?[a-zA-Z0-9._+/-]+)\])?(\[(!?[a-z0-9_-]=[a-z0-9_-])\])*$/;
}

const zonedDateTime = new ZonedDateTimeType();

module.exports = {
  ZonedDateTimeType,
  zonedDateTime,
};
