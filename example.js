/*eslint no-unused-vars: "off"*/
/*eslint no-unused-labels: "off"*/
/*eslint no-inner-declarations: "off"*/
// @ts-check

const {
  value,
  string,
  number,
  option,
  array,
  object,
  map,
  enumeration,
  union,
} = require('./base-types.js');
/**
 * @template T
 * @typedef {import("./base-types.js").t<T>} t
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

  // Option

  const MaybeCircleType = option(CircleType);

  /** @type {t<typeof MaybeCircleType>} */
  let optionalCircle = undefined;
  optionalCircle = circle1;

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

  // Map

  const CirclesMap = map(string, CircleType);

  /** @type {t<typeof CirclesMap>} */
  let kindOfCircles = new Map();
  kindOfCircles.set('small', circle1);
  kindOfCircles.set('large', circle2);

  kindOfCircles.set('error', square1); // error
}
