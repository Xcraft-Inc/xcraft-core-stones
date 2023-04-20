/* eslint-disable jsdoc/check-types */
/* eslint jsdoc/check-tag-names: "off" */
/* eslint jsdoc/no-undefined-types: "off" */
/* eslint jsdoc/require-jsdoc: "off" */
/* eslint jsdoc/require-param-description: "off" */
/* eslint jsdoc/valid-types: "off" */
/* eslint no-inner-declarations: "off" */
/* eslint no-unused-labels: "off" */
/* eslint no-unused-vars: "off" */
// @ts-check

const parse = require('../parse.js');
const {dateTime} = require('../types/date-time.js');
const {date} = require('../types/date.js');
const {pattern} = require('../types/pattern.js');
const {time} = require('../types/time.js');
const {yearMonth} = require('../types/year-month.js');
/**
 * @template T
 * @typedef {import("../base-types.js").t<T>} t
 */

class TestType {
  dateTime = dateTime;
  date = date;
  time = time;
  yearMonth = yearMonth;
}

example1: {
  console.log('# Example 1');

  let p1 = pattern(/test/);

  /** @type {t<date>} */
  let d1 = '2020-01-01';

  let d2 = date.parse('2020-01-01');

  let t1 = time.parse('10:00:00');
}

example2: {
  console.log('# Example 2');

  let obj = {
    dateTime: '2020-01-02T03:04:05.670Z',
    date: '2020-01-02Z',
    time: '03:04:05.670Z',
    yearMonth: '2020-01Z',
  };

  try {
    let test = parse(obj, TestType);
    console.log(test);
  } catch (err) {
    console.log(err.message);
  }
}

example3: {
  console.log('# Example 3');

  let obj = {
    dateTime: '2020-01-02T03:04:05.670',
    date: '2020-01-02',
    time: '03:04:05',
    yearMonth: '2020-01',
  };

  try {
    let test = parse(obj, TestType);
    console.log(test);
  } catch (err) {
    console.log(err.message);
  }
}

example4: {
  console.log('# Example 4');

  let obj = {
    dateTime: 'bad-value',
    date: 'bad-value',
    time: 'bad-value',
    yearMonth: 'bad-value',
  };

  try {
    let test = parse(obj, TestType); // throws error
    console.log(test);
  } catch (err) {
    console.log(err.message);
  }
}
