# Pianola

[![Travis build status](http://img.shields.io/travis/gajus/pianola/master.svg?style=flat-square)](https://travis-ci.org/gajus/pianola)
[![Coveralls](https://img.shields.io/coveralls/gajus/pianola.svg?style=flat-square)](https://coveralls.io/github/gajus/pianola)
[![NPM version](http://img.shields.io/npm/v/pianola.svg?style=flat-square)](https://www.npmjs.org/package/pianola)
[![Canonical Code Style](https://img.shields.io/badge/code%20style-canonical-blue.svg?style=flat-square)](https://github.com/gajus/canonical)
[![Twitter Follow](https://img.shields.io/twitter/follow/kuizinas.svg?style=social&label=Follow)](https://twitter.com/kuizinas)

A declarative function composition and evaluation engine.

* [Use cases](#use-cases)
* [Configuration](#configuration)
* [Subroutines](#subroutines)
  * [Defining subroutines](#defining-subroutines)
* [Sentinels](#sentinels)
  * [`FinalResultSentinel`](#finalresultsentinel)
* [Expression reference](#expression-reference)
  * [The pipe operator (`|`)](#the-pipe-operator-)
* [Cookbook](#cookbook)
  * [Map multiple results](#map-multiple-results)
  * [Name results](#name-results)
* [Error handling](#error-handling)
* [Debugging](#debugging)

## Use cases

* [Surgeon](https://github.com/gajus/surgeon) uses Pianola to extract information from an HTML document using a declarative API.

## Configuration

|Name|Type|Description|Default value|
|---|---|---|---|
|`bindle`|`Object`|(optional) A user-defined object that is passed to every subroutine.|
|`handleResult`|[`ResultHandlerType`](./src/types.js)|(optional) A function invoked after each subroutine with the result of the current subroutine and the subject value used to execute the subroutine. Use this method to throw an error. Return |
|`subroutines`|[`$PropertyType<UserConfigurationType, 'subroutines'>`](./src/types.js)|User defined subroutines. See [subroutines](#subroutines).|N/A|

## Subroutines

A subroutine is a function used to advance the evaluator, e.g.

```js
x('foo | bar baz', 'qux');

```

In the above example, Pianola expression uses two subroutines: `foo` and `bar`.

`foo` subroutine is invoked without additional values. `bar` subroutine is executed with 1 value ("baz").

Subroutines are executed in the order in which they are defined – the result of the last subroutine is passed on to the next one. The first subroutine receives the value used to start the evaluator.

Multiple subroutines can be written as an array. The following example is equivalent to the earlier example.

```js
x([
  'foo',
  'bar baz'
], 'qux');

```

> Note:
>
> These functions are called subroutines to emphasise the cross-platform nature of the declarative API.

### Defining subroutines

Subroutines are defined using the [`subroutines` configuration](#configuration).

A subroutine is a function. A subroutine function is invoked with the following parameters:

|Parameter name|
|---|
|Subject value, i.e. value used to start the evaluator or result of the parent subroutine.|
|An array of parameter values used in the expression.|
|Bindle. See [`subroutines` configuration](#configuration).|

Example:

```js
const x = pianola({
  subroutines: {
    mySubourtine: (subjectValue, [firstParameterValue, secondParameterValue]) => {
      console.log(subjectValue, firstParameterValue, secondParameterValue);

      return parseInt(subjectValue, 10) + 1;
    }
  }
});

x('mySubourtine foo bar | mySubourtine baz qux', 0);

```

The above example prints:

```
0 "foo" "bar"
1 "baz" "qux"

```

## Sentinels

### `FinalResultSentinel`

`FinalResultSentinel` is used to signal the final value, i.e. it will interrupt the routine and return the value used to construct an instance of `FinalResultSentinel`.

Example:

```js
import pianola, {
  FinalResultSentinel
} from 'pianola';

const x = pianola({
  subroutines: {
    a: () => {
      return new FinalResultSentinel(null);
    },
    b: () => {
      throw new Error('This method is never invoked.');
    }
  }
});

x('a | b', 0);

```

## Expression reference

Pianola subroutines are described using expressions.

An expression is defined using the following pseudo-grammar:

```
subroutines ->
    subroutines _ "|" _ subroutine
  | subroutine

subroutine ->
    subroutineName " " parameters
  | subroutineName

subroutineName ->
  [a-zA-Z0-9\-_]:+

parameters ->
    parameters " " parameter
  | parameter

```

Example:

```js
x('foo bar baz', 'qux');

```

In this example, Pianola expression evaluator (`x`) is invoked with `foo bar baz` expression and `qux` starting value. The expression tells the expression evaluator to run `foo` subroutine with parameter values "bar" and "baz". The expression evaluator runs `foo` subroutine with parameter values "bar" and "baz" and a subject value "qux".

Multiple subroutines can be combined using an array:

```js
x([
  'foo bar baz',
  'corge grault garply'
], 'qux');

```

In this example, Pianola expression evaluator (`x`) is invoked with two expressions (`foo bar baz` and `corge grault garply`). The first subroutine is executed with the subject value "qux". The second subroutine is executed with a value that is the result of the parent subroutine.

The result of the query is the result of the last subroutine.

Read [define subroutines](#define-subroutines) documentation for broader explanation of the role of the parameter values and the subject value.

### The pipe operator (`|`)

Multiple subroutines can be combined using the pipe operator.

The following examples are equivalent:

```js
x([
  'foo bar baz',
  'qux quux quuz'
]);

x([
  'foo bar baz | foo bar baz'
]);

x('foo bar baz | foo bar baz');

```

## Cookbook

Unless redefined, all examples assume the following initialisation:

```js
import pianola from 'pianola';

/**
 * @param configuration {@see https://github.com/gajus/pianola#configuration}
 */
const x = pianola();

```

### Map multiple results

When a subroutine results multiple results, then the rest of the expression is evaluated for each of the result.

```js
const foo = () => {
  return [
    1,
    2,
    3
  ];
};

const bar = (value) => {
  if (value === 1) {
    return 'one';
  }

  if (value === 2) {
    return 'two';
  }

  if (value === 3) {
    return 'three';
  }
};

const x = pianola({
  subroutines: {
    bar,
    foo
  }
});

x('foo | bar');

// [
//   'one',
//   'two',
//   'three'
// ]

```

### Name results

Use a [`QueryChildrenType`](./src/types.js) object (a plain object whose values are Pianola expressions) to name the results.

```js
const foo = (subjectValue, [name]) => {
  return name;
};

const x = pianola({
  subroutines: {
    foo
  }
});

x([
  {
    foo0: 'foo corge',
    foo1: 'foo grault',
    foo2: 'foo garply'
  }
]);

// [
//   {
//     name: 'corge'
//   },
//   {
//     name: 'grault'
//   },
//   {
//     name: 'garply'
//   }
// ]

```

## Error handling

Pianola throws the following errors to indicate a predictable error state. All Pianola errors can be imported. Use `instanceof` operator to determine the error type.

|Name|Description|
|---|---|
|`NotFoundError`|Used to indicate that a resource is not found, e.g. when a subroutine is not found.|
|`PianolaError`|A generic error. All other Pianola errors extend from `PianolaError`.|

## Debugging

Pianola is using [`debug`](https://www.npmjs.com/package/debug) to log debugging information.

Export `DEBUG=pianola:*` environment variable to enable pianola debug log.
