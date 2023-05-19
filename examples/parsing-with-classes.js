/* eslint-disable jsdoc/no-undefined-types */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable jsdoc/valid-types */
/* eslint-disable no-unused-labels */
/* eslint-disable jsdoc/require-param-description */
// @ts-check

const {string, number} = require('../types.js');
const parse = require('../parse.js');
/**
 * @template T
 * @typedef {import("../base-types.js").t<T>} t
 */

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

  static parse(obj) {
    const address = parse(obj, AddressType);
    return new Address(address);
  }
}

class NameAndAddress {
  /** @param {t<NameAndAddressType>} obj */
  constructor(obj) {
    this.name = obj.name;
    this.address = new Address(obj.address);
  }

  static parse(obj) {
    const nameAndAddress = parse(obj, NameAndAddressType);
    return new NameAndAddress(nameAndAddress);
  }

  toPrintable() {
    return `\
${this.name}
${this.address.postalCode} ${this.address.townName}`;
  }
}

example1: {
  console.log('# Example 1');
  const test = NameAndAddress.parse({
    name: 'toto',
    address: {
      postalCode: 1000,
      townName: 'Lausanne',
    },
  });

  const out = test.toPrintable();
  console.log(out);
}

example2: {
  console.log('# Example 2');
  try {
    const test = NameAndAddress.parse({
      name: 404, // bad type
      address: {
        postalCode: 'unknown', // bad type
        // townName, // missing property
        wrongKey: 'error', // unexpected property
      },
    });
    console.log(test.toPrintable());
  } catch (err) {
    console.log(err.message);
  }
}
