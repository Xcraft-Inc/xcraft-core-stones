const {PatternType} = require('./pattern.js');

class DateType extends PatternType {
  name = 'date';
  // Regex from https://www.w3.org/TR/xmlschema11-2/#date
  pattern = /^-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/;
}

const date = new DateType();

module.exports = {
  DateType,
  date,
};
