/* eslint-disable no-unused-labels */
// @ts-check

const {number, string, array, option} = require('../base-types.js');
const {sculpt, Sculpt} = require('../sculpt.js');

/**
 * @template T
 * @typedef {import("../base-types.js").t<T>} t
 */

class ValinorType {
  name = string;
  age = number;
}

// Old

/** @type {t<ValinorType>} */
let state = {
  name: 'toto',
  age: 12,
};

console.log(state);

// New

const Valinor = sculpt(ValinorType);

let state2 = new Valinor({
  name: 'toto',
  age: 12,
});

console.log(state2);

class Valinor2 extends Sculpt(ValinorType) {}

let state3 = new Valinor2({
  name: 'toto',
  age: 12,
});

console.log(state3);
