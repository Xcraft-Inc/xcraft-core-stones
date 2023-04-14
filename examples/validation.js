/* eslint-disable no-unused-labels */
// @ts-check

const {number, string} = require('../base-types.js');
const parse = require('../parse.js');
const validate = require('../validate.js');

class UserType {
  name = string;
  age = number;
}

/** @type {any} */
let obj = {
  name: 'toto',
  age: 12,
};

example1: {
  if (validate(obj, UserType)) {
    obj; // type {name: string, age: number}
  } else {
    obj; // type any
  }
}

example2: {
  let user = parse(obj, UserType);
  user; // type {name: string, age: number}
  user.name = 'tata';
  user.age = '11'; // error
}

example3: {
  try {
    /** @type {any} */
    let obj2 = {
      name: 'tata',
      age: '11',
    };

    let user2 = parse(obj2, UserType); // throws error
    user2; // type {name: string, age: number}
  } catch (err) {
    console.log(err.message);
  }
}
