/* eslint-disable no-unused-labels */
// @ts-check

const {number, string, array, option} = require('../base-types.js');
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
  console.log('# Example 1');
  if (validate(obj, UserType)) {
    obj; // type {name: string, age: number}
    console.log('The object is an user');
  } else {
    obj; // type any
    console.log('The object is not an user');
  }
}

example2: {
  console.log('# Example 2');
  let user = parse(obj, UserType);
  user; // type {name: string, age: number}
  user.name = 'tata';
  console.log('User name is', user.name);
  user.age = '11'; // error
}

example3: {
  console.log('# Example 3');
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

example4: {
  console.log('# Example 4');

  const UserList = array(UserType);

  class UserGroup {
    name = string;
    description = option(string);
    users = UserList;
  }

  /** @type {any} */
  const group = {
    name: 'Comic book readers',
    users: [
      {
        name: 'Toto',
        age: 12,
      },
      {
        name: 'Tata',
        age: 11,
      },
    ],
  };
  let test1 = parse(group, UserGroup);
  console.log('Ok');

  test1.users[1].age = '11'; // wrong
  try {
    let test2 = parse(group, UserGroup); // throws error
    test2;
  } catch (err) {
    console.log(err.message);
  }
}
