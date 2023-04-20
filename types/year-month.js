const {PatternType} = require('./pattern.js');

class YearMonthType extends PatternType {
  name = 'yearMonth';
  // Regex from https://www.w3.org/TR/xmlschema11-2/#gYearMonth
  pattern = /^-?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?$/;
}

const yearMonth = new YearMonthType();

module.exports = {
  YearMonthType,
  yearMonth,
};
