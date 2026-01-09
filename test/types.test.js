/**
 * @template {true} T
 * @typedef {never} Expect
 */

/**
 * @template T
 * @template U
 * @typedef {(<V>() => V extends T ? 1 : 2) extends (<V>() => V extends U ? 1 : 2) ? true : false} Equal
 */

import {Sculpt} from '../sculpt.js';
import {number, string} from '../types.js';

/** @typedef {Expect<Equal<string, string>>} test_ok */

/* @typedef {Expect<Equal<string, number>>} test_fail */

/** @typedef {{name: string, age: number}} Expected_User */

class UserType {
  name = string;
  age = number;
}

class User extends Sculpt(UserType) {}

/** @typedef {Expect<Equal<t<UserType>, Expected_User>>} infer_class_shape */

/** @typedef {Expect<Equal<User, Expected_User>>} sculpt_class */
