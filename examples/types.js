/* eslint jsdoc/check-tag-names: "off" */
/* eslint jsdoc/no-undefined-types: "off" */
/* eslint jsdoc/require-jsdoc: "off" */
/* eslint jsdoc/require-param-description: "off" */
/* eslint jsdoc/valid-types: "off" */
/* eslint no-inner-declarations: "off" */
/* eslint no-unused-labels: "off" */
/* eslint no-unused-vars: "off" */
// @ts-check

const {
  value,
  string,
  number,
  option,
  array,
  tuple,
  object,
  set,
  map,
  enumeration,
  union,
  objectMap,
  any,
  intersection,
} = require('../types.js');
/**
 * @template T
 * @typedef {import("../base-types.js").t<T>} t
 */

example1: {
  const NameType = string;

  /** @type {t<typeof NameType>} */
  let myName = 'toto';

  /** @type {t<typeof NameType>} */
  let wrongName = 2; // error

  /** @type {t<typeof number>} */
  let myNum = 42;

  const MayBeNameType = option(NameType);
  const MayBeNameType2 = option(option(option(NameType)));

  /** @type {t<typeof MayBeNameType>} */
  let myName2 = 'toto';

  /** @type {t<typeof MayBeNameType2>} */
  let myName3 = 'toto';

  const NameListType = array(NameType);

  /** @type {t<typeof NameListType>} */
  let names = ['toto', 'tata', 'titi'];
  /** @type {t<typeof NameListType>} */
  let wrongNames = [1, 'toto']; // error
}

example2: {
  const NameType = string;

  const UserType = object({
    name: NameType,
    age: number,
  });

  /** @type {t<typeof UserType>} */
  let toto = {
    name: 'Toto',
    age: 12,
  };

  class User {
    /** @param {t<typeof UserType>} obj */
    constructor(obj) {
      this.name = obj.name;
      this.age = obj.age;
    }
  }

  /** @typedef {t<typeof UserType>} User3 */

  let tata = new User({
    name: 'Tata',
    age: 11,
  });

  function User2(obj) {
    return new User(obj);
  }

  let titi = User2({
    name: 'Titi',
    age: 11,
  });

  let users = [toto, tata, titi];
  let user = users.find((user) => user.name === 'Toto');
  console.log(user.name); // user could be undefined
}

example3: {
  let AddressType = object({
    postalCode: number,
    townName: string,
  });

  let NameAndAddressType = object({
    name: string,
    address: AddressType,
  });

  /** @type {t<typeof NameAndAddressType>} */
  let test = {
    name: 'Toto',
    address: {
      // postalCode: 1000,
      postalCode: '1000', // error
      townName: 'Lausanne',
    },
  };
}

example4: {
  class AddressType {
    postalCode = number;
    townName = string;
  }

  class NameAndAddressType {
    name = string;
    address = AddressType;
  }

  class Address {
    /** @param {t<AddressType>} obj */
    constructor(obj) {
      this.postalCode = obj.postalCode;
      this.townName = obj.townName;
    }
  }

  class NameAndAddress {
    /** @param {t<NameAndAddressType>} obj */
    constructor(obj) {
      this.name = obj.name;
      this.address = new Address(obj.address);
    }
  }

  const test = new NameAndAddress({
    name: 'Toto',
    address: {
      // postalCode: 1000,
      postalCode: '1000', // error
      townName: 'Lausanne',
    },
  });
}

example5: {
  class CircleType {
    name = value('circle');
    radius = number;
  }

  /** @type {t<typeof CircleType>} */
  let circle1 = {
    name: 'circle',
    radius: 2,
  };

  circle1.name = 'square'; // error

  /** @type {t<typeof CircleType>} */
  let circle2 = {
    name: 'circle',
    radius: 100,
  };

  // Array

  const CirclesArray = array(CircleType);

  /** @type {t<typeof CirclesArray>} */
  let circleList = [circle1, circle2];

  /** @type {t<typeof CirclesArray>} */
  let circleListError = [{name: 'square', radius: '2'}]; // error

  // Tuple

  const CircleAndKind = tuple(CircleType, string);

  /** @type {t<typeof CircleAndKind>} */
  let circleAndKind1 = [circle1, 'small'];
  circleAndKind1 = [circle2, 42, 'small']; // error
  circleAndKind1 = [circle2, 'small', 'toto']; // error

  // Option

  const MaybeCircleType = option(CircleType);

  /** @type {t<typeof MaybeCircleType>} */
  let optionalCircle = undefined;
  optionalCircle = circle1;

  class ObjectWithOptionType {
    required = string;
    optional = option(string);
  }

  /** @type {t<ObjectWithOptionType>} */
  let testObj = {
    required: 'toto',
    optional: 'tata',
  };
  testObj = {
    required: 'toto',
  };
  testObj = {
    required: 'toto',
    optional: null,
  };

  // Enum

  const ShapeNameType = enumeration('circle', 'square', 'triangle');

  /** @type {t<typeof ShapeNameType>} */
  let shapeName = 'circle';
  shapeName = 'square';
  shapeName = 'wrong'; // error

  // Union

  class SquareType {
    name = value('square');
    length = number;
  }

  let square1 = {
    name: 'square',
    length: 10,
  };

  const ShapeType = union(CircleType, SquareType);

  /** @type {t<typeof ShapeType>} */
  let shape = circle1;
  shape = square1; // error

  // Intersection

  class ColorableType {
    color = string;
  }
  const CircleWithColorType = intersection(CircleType, ColorableType);
  /** @type {t<typeof CircleWithColorType>} */
  let coloredCircle = {...circle1, color: 'orange'};
  coloredCircle = circle1; // error

  // Set

  const CirclesSet = set(CircleType);

  /** @type {t<typeof CirclesSet>} */
  let circlesSet = new Set();
  circlesSet.add(circle1);
  circlesSet.add(circle2);

  circlesSet.add(square1); // error

  // Map

  const CirclesMap = map(string, CircleType);

  /** @type {t<typeof CirclesMap>} */
  let kindOfCircles = new Map();
  kindOfCircles.set('small', circle1);
  kindOfCircles.set('large', circle2);

  kindOfCircles.set('error', square1); // error

  // Object Map

  const CirclesMap2 = objectMap(CircleType);

  /** @type {t<typeof CirclesMap2>} */
  let kindOfCircles2 = {};
  kindOfCircles2.small = circle1;
  kindOfCircles2.large = circle2;
  kindOfCircles2.error = square1; // error

  // Any array and any object
  class AnyTestType {
    list1 = array;
    list2 = array(any);
    list3 = array(string);
    props1 = object;
    props2 = object({
      name: string,
      age: number,
    });
  }

  /** @type {t<typeof AnyTestType>} */
  let anyTest = {
    list1: ['test'],
    list2: ['test'],
    list3: ['test'],
    props1: {name: 'toto', age: 12},
    props2: {name: 'toto', age: 12},
  };
  anyTest = {
    list1: [123],
    list2: [123],
    list3: [123], // error
    props1: {key: 'value'},
    props2: {key: 'value'}, // error
  };
}

example7: {
  class UserType {
    name = string;
    age = number;
  }

  class User {
    /** @typedef {t<UserType>} user */

    /** @type {user["name"]} */
    name = '';
    /** @type {user["age"]} */
    age;

    test() {
      this.name = 'toto';
      this.age = '42'; // error
    }
  }

  let u = new User();
  u.age = '42'; // error
}
