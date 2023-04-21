/* eslint-disable no-unused-labels */
// @ts-check

const {number, string} = require('../base-types.js');
const {Sculpt, sculpt} = require('../sculpt.js');

class UserType {
  name = string;
  age = number;
}

example1: {
  console.log('# Example 1');

  const User = sculpt(UserType);

  let user = User({
    name: 'toto',
    age: 12,
  });

  console.log(user.name);
  if (!user.name) {
    throw new Error('Bad user');
  }

  user.name = 'tata';
  user.age = '11'; // error

  console.log(user);
}

example2: {
  console.log('# Example 2');

  class User extends Sculpt(UserType) {
    sayHello() {
      console.log(`Hello ${this.name}`);
    }
  }

  let user = new User({
    name: 'toto',
    age: 12,
  });

  console.log(user.name);
  if (!user.name) {
    throw new Error('Bad user');
  }

  user.name = 'tata';
  user.age = '11'; // error

  console.log(user);
  user.sayHello();
}

example3: {
  console.log('# Example 3');

  const User = Sculpt(UserType);

  let user = new User({
    name: 'toto',
    age: 12,
  });

  console.log(user.name);
  if (!user.name) {
    throw new Error('Bad user');
  }

  user.name = 'tata';
  user.age = '11'; // error

  console.log(user);
}
