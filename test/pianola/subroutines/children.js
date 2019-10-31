// @flow

import test from 'ava';
import sinon from 'sinon';
import pianola from '../../../src';

test('names results when instruction is a {[key: string]: [pianola expression]}', (t) => {
  const foo = sinon.stub().returns('bar');

  const x = pianola({
    subroutines: {
      foo,
    },
  });

  const result = x([
    {
      a: 'foo',
      b: 'foo',
    },
  ], 'qux');

  t.deepEqual({
    a: 'bar',
    b: 'bar',
  }, result);
});

test('uses instruction after query children expression (object)', (t) => {
  const foo = sinon.stub().returns('bar');

  const x = pianola({
    subroutines: {
      foo,
    },
  });

  const result = x([
    {
      a: 'foo',
      b: 'foo',
    },
    'foo',
  ], 'qux');

  t.deepEqual(foo.args[2][0], {
    a: 'bar',
    b: 'bar',
  });

  t.true(result === 'bar');
});

test('uses instruction after query children expression (array)', (t) => {
  const foo = sinon.stub().returns('bar');

  const x = pianola({
    subroutines: {
      foo,
    },
  });

  const result = x([
    [
      'foo',
      'foo',
    ],
    'foo',
  ], 'qux');

  t.true(foo.args[2][0] === 'bar');

  t.true(result === 'bar');
});

test('uses instruction after query children expression (nested arrays)', (t) => {
  const foo = sinon.stub().returns('bar');

  const x = pianola({
    subroutines: {
      foo,
    },
  });

  const result = x([
    [
      [
        'foo',
      ],
      'foo',
    ],
    'foo',
  ], 'qux');

  t.true(foo.args[1][0] === 'bar');
  t.true(foo.args[2][0] === 'bar');

  t.true(result === 'bar');
});
