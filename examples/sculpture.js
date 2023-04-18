/* eslint-disable no-unused-labels */
// @ts-check

const {number, string} = require('../base-types.js');
const {Sculpt, sculpt} = require('../sculpt.js');

class UserType {
  name = string;
  age = number;
}

example2: {
  const User = sculpt(UserType);

  let user = User({
    name: 'toto',
    age: 12,
  });

  user.name = 'tata';
  user.age = '11'; // error

  console.log(user);
}

example1: {
  class User extends Sculpt(UserType) {
    sayHello() {
      console.log(`Hello ${this.name}`);
    }
  }

  let user = new User({
    name: 'toto',
    age: 12,
  });

  user.name = 'tata';
  user.age = '11'; // error

  console.log(user);
  user.sayHello();
}
