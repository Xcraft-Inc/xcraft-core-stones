# xcraft-core-stones

_Core stones are building blocks that are useful to create robust elvish applications but can also be used in any other JS code.
Base stones gather together into shapes describing complexes objects. Shapes can be sculpted to form JS classes. Check methods allows to verify that unknown objects match specific shapes._

## Why to use stones

The main goal is to do runtime checks to ensure a JS value corresponds to a specific type. For example, when reading JSON data from a file or from a network request, it's useful to check that the data correspond to a specific shape.

Core-stones also allows to infer TypeScript types from a stone type. After an object is checked, it's type is known and the editor auto-complete feature can be used for easier development.

## Alternatives

This project is inspired by [zod](https://github.com/colinhacks/zod). If you want to use a popular project, use Zod. On the other side, xcraft-core-stones have a nicer syntax to define types. In addition, if you want to understand how it works, stones are more simple.

Another alternative is to build your own function to convert class shapes to zod types and then you could benefit from both.

## Requirements

To work with stones, it's required to know some basic JS and also useful to know the base types in TypeScript.

To understand how stones work, it's necessary to have a good understanding of "mapped types" in TS.

This project uses `.js` files with types in JSDoc instead of using `.ts` files. It allows to develop without the need to compile. More information can be found in the [TS documentation](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html).

## Installation

```sh
npm install xcraft-core-stones
```

## Usage

1. Add `// @ts-check` at the top of the file
2. Import some stones
3. Define a shape
4. Validate data
5. _"Pura vida"_

```js
// @ts-check
const {string, number, parse} = require('xcraft-core-stones');

class UserShape {
  name = string;
  age = number;
}

const data = JSON.parse('{"name": "Toto", "age": 12}');

const user = parse(data, UserShape);

user; // type: {name: string, age: number}
user.name; // type: string
user.age; // type: number
```

## Recommendations

To make life easier, it's recommanded to use the auto-complete features of the code editor.
In VSCodium, when you type `user.` with a dot at the end, it gives you what are the properties of the `user` type. When you define shapes, put the cursor at the end of a type, like `age = number`, then use the `ctrl+space` shortcut followed by the `enter` key. It'll automatically create the import line for `number` from `xcraft-core-stones`.

## Create complex shapes

Shapes are JS classes describing types. They can be reused to describe a value in another shape.

As shapes and stone types are JS values, they can be stored in variables or used in function parameters as any other JS value.

```js
// @ts-check
const {
  string,
  number,
  option,
  date,
  array,
  enumeration,
  parse,
} = require('xcraft-core-stones');

class AddressShape {
  streetName = string;
  buildingNumber = string;
  postalCode = string;
  townName = string;
  countryCode = string;
}

const StatusType = enumeration('draft', 'published', 'archived');

class ContactShape {
  firstname = string;
  lastname = string;
  birthdate = option(date);
  age = option(number);
  address = AddressShape;
  emails = array(string);
  preferredDay = enumeration('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');
  status = StatusType;
}
```

Note that it's easy to navigate through shapes by using `F12` or `ctrl+click`, for example to find the definition of `AddressShape` from `ContactShape.address`.

## Stones

This section describe the different stones that can be used. It gives their corresponding TypeScript type and other information.

- Stone type: the JS class representing the type.
- Runtime check: how to usually check without using stones if a value has the corresponding type. With stones, simply use `validate(value, type)`.

| Stone                | TypeScript type           | Stone type       | Runtime check                  |
| -------------------- | ------------------------- | ---------------- | ------------------------------ |
| any                  | any                       | AnyType          | -                              |
| boolean              | boolean                   | BooleanType      | typeof x === 'boolean'         |
| string               | string                    | StringType       | typeof x === 'string'          |
| number               | number                    | NumberType       | typeof x === 'number'          |
| value(v)             | `"str"` or `42` or ...    | ValueType        | x === v                        |
| option               | T \| null \| undefined    | OptionType       | x !== null && x !== undefined  |
| array(T)             | T[]                       | ArrayType        | `*` Array.isArray(x)           |
| tuple(A,B,C)         | [A,B,C]                   | TupleType        | `*`                            |
| object(S)            | {}                        | ObjectType       | `*` x && typeof x === 'object' |
| enumeration("A","B") | "A" \| "B"                | EnumerationType  | ["A","B"].includes(x)          |
| union(A,B)           | A \| B                    | UnionType        | checkA \|\| checkB             |
| intersection(A,B)    | A & B                     | IntersectionType | checkA && checkB               |
| type                 | Type                      | TypeType         | x instanceof Type              |
| func                 | Function                  | FunctionType     | typeof x === 'function'        |
| instance(T)          | new (...args: any) => any | InstanceType     | x instanceof T                 |
| set(T)               | Set<T>                    | SetType          | `*` x instanceof Set           |
| map(K,V)             | Map<K,V>                  | MapType          | `*` x instanceof Map           |
| objectMap(V)         | {[key: string]: V}        | ObjectMapType    | `*` x && typeof x === 'object' |
| record(K,V)          | Record<K,V>               | RecordType       | `*` x && typeof x === 'object' |

`*` deep check is more complicated than a one liner.

## Static type checking

- In VSCodium editor, add `// @ts-check` at the top of a file to enable static type checks. Mouse over a variable will show its type.
- The TypeScript checker can also be run from the command-line with `npx -p typescript tsc --noEmit --allowJs --checkJs --target esnext --skipLibCheck my-file.js`.

## Runtime validation

All the examples are done with this simple shape.

```js
// @ts-check
const {string, number} = require('xcraft-core-stones');

class UserShape {
  name = string;
  age = number;
}

const data = JSON.parse('{"name": "Toto", "age": 12}');
```

### parse

`parse(value: any, type: AnyTypeOrShape)`

Throws an error if the value has the wrong type.
The error has a precise description of which part of the object doesn't match the shape.

```js
const {parse} = require('xcraft-core-stones');

const user = parse(data, UserShape);
user; // type: {name: string, age: number}

const wrongData = JSON.parse('{"name": "Toto"}');

const user2 = parse(wrongData, UserShape);
/* throws an error:
   Error while parsing UserShape
     bad type
     at 'age'
     with type 'number'
     info: {
       actual: undefined,
       expected: number
     }
*/
```

### validate

`validate(value: any, type: AnyTypeOrShape)`

Returns `true` if the value has the right type. Returns `false` otherwise.
In addition it narrows the type of the value given to the function.

```js
const {validate} = require('xcraft-core-stones');

if (validate(data, UserShape)) {
  user; // type: {name: string, age: number}
} else {
  user; // type: any
}
```

### checkType

```
checkType<T extends AnyTypeOrShape>(value: any, type: T):
  {ok:true, value:t<T>} |
  {ok:false, errors: CheckError[], errorMessage: string}
```

Returns the typed value if the value has the right type or an error message otherwise.

```js
const {checkType} = require('xcraft-core-stones');

const check = checkType(data, UserShape);
if (!check.ok) {
  console.log(check.errorMessage);
  return;
}
const user = check.value; // type: {name: string, age: number}
```

## Type inference

### `t<T>`

`t<T>` is a type operator that returns the corresponding TypeScript type from any stone type or shape.

It can be used for example to define the type of variables or function parameters.

```js
// Import the definition of t<T>
require('xcraft-core-stones');

/** @type {t<UserShape>} */
let user;

/**
 * @param {t<UserShape>} user
 */
function printUser(user) {
  console.log(`My name is ${user.name} and I'm ${user.age}`);
}
```

Alternatively, `t<T>` can also be imported like this:

```js
/**
 * @template T
 * @typedef {import("xcraft-core-stones").t<T>} t
 */
```

For convenience, it's possible to create a new type from the result of `t<T>'.`

```js
/**
 * @typedef {t<UserShape>} User
 */
```

### Sculpt

Create a class from a shape.

```js
const {Sculpt} = require('xcraft-core-stones');

class User extends Sculpt(UserShape) {}
```

Then it can be used as a type.

```js
/** @type {User} */
let user;

/**
 * @param {User} user
 */
function printUser(user) {
  console.log(`My name is ${user.name} and I'm ${user.age}`);
}
```

Or it can be used as a class to create new typed objects.

```js
const user = new User({
  name: 'toto',
  age: 12,
});
```

Methods can also be added to the class.

```js
const {parse} = require('xcraft-core-stones');

class User extends Sculpt(UserType) {
  static parse(value) {
    return new User(parse(value, UserType));
  }

  sayHello() {
    console.log(`Hello ${this.name}`);
  }
}

const data = JSON.parse('{"name": "Toto", "age": 12}');
const user = User.parse(data);
user.sayHello();
```

## Create custom stones

### For static type check and auto-complete

In this example, a custom `RegExp` type is created. It is only used for static type checking in the code editor and to be able to use auto-complete features. It cannot be used to perform runtime validation.

```js
// 1. Create an instance of `Type` and specify the generic parameter T.

/** @type {Type<RegExp>} */
const regex = new Type('Regex');

// 2. Then use the created type, for example in a shape

class ExampleShape {
  type = string;
  format = regex;
}

// 3. Declare a variable of this type and see that it displays an error in the editor if the type doesn't match.

/** @type {t<ExampleShape>} */
let example;
example = {
  type: 'test',
  format: /test/, // ok
};
example = {
  type: 'test',
  format: 'wrong', // error
};
```

### For both static and runtime checks

Another way to make custom types is to create a class that extends the base `Type` class and implement the `check` method.
Then it can be used for both static and runtime checks.
Any TS type can be used for the `T` parameter in `Type<T>`.

```js
// 1. Create the type class

/**
 * @extends {Type<RegExp>}
 */
class RegexType extends Type {
  constructor() {
    // Define the name of the type in the base class
    // It will be used in error messages
    super('regex');
  }

  /** @type {Type["check"]} */
  check(value, check) {
    // See the `Check` class in `check.js`
    // for other check methods
    check.instanceOf(value, RegExp);
  }
}

// 2. A variable with a simpler name may be created
const regex = new RegexType();

// 3. Then use the created type, for example in a shape

class ExampleShape {
  type = string;
  format = regex;
}

// 4. Perform a validation check on a variable of any type

/** @type {any} */
const data = {
  type: 'test',
  format: /test/,
};

const example = parse(data, ExampleShape);
example; // type: {type: string, format: RegExp}
```

## Inheritance

Shapes can simply extend other shapes.

```js
class SpecialUserType extends UserType {
  specialProperty = record(string, number);
}

const data = JSON.parse(
  '{"name": "Toto", "age": 12, "specialProperty": {"count1": 42}}'
);

const specialUser = parse(data, SpecialUserType);

console.log(specialUser);
```

As types are JS values, they can be manipulated to create new types.

```js
const dayOfWeek = enumeration('mon', 'tue', 'wed', 'thu', 'fri');
const weekendDay = enumeration('sat', 'sun');
const dayType = enumeration(...dayOfWeek.values, ...weekendDay.values);

let data = 'sun'; // type: string

const day = parse(data, dayType);
day; // type: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"
```

## Generic types

Simple JS functions can be used to define a type that takes another type as parameter.

```js
/**
 * @template {AnyTypeOrShape} T
 * @param {T} type
 */
function box(type) {
  return class BoxShape {
    value = option(type);
  };
}

// Usage in an example shape

class ExampleShape {
  name = string;
  boxedAge = box(number);
}

class Example extends Sculpt(ExampleShape) {}

/** @type {Example} */
const example = {
  name: 'Toto',
  boxedAge: {value: 12},
};
```

## User quotes

_"From the earth, comes our strength. From the mountains, our resilience.
Our bodies are forged from stone in the unending fires fueled by our
determination."_ - Magni Bronzebeard, World of Warcraft

_"Let's go!"_ - Blupi, Planet Blupi
