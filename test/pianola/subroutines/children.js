// @flow

import test from 'ava';
import sinon from 'sinon';
import pianola from '../../../src';

test('names results when instruction is a {[key: string]: [pianola expression]}', async (t) => {
  const foo = sinon.stub().returns('bar');

  const x = pianola({
    subroutines: {
      foo,
    },
  });

  const result = await x([
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

test('uses instruction after query children expression (object)', async (t) => {
  const foo = sinon.stub().returns('bar');

  const x = pianola({
    subroutines: {
      foo,
    },
  });

  const result = await x([
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

  t.is(result, 'bar');
});

test('uses instruction after query children expression (array)', async (t) => {
  const foo = sinon.stub().returns('bar');

  const x = pianola({
    subroutines: {
      foo,
    },
  });

  const result = await x([
    [
      'foo',
      'foo',
    ],
    'foo',
  ], 'qux');

  t.is(foo.args[2][0], 'bar');

  t.is(result, 'bar');
});

test('uses instruction after query children expression (nested arrays)', async (t) => {
  const foo = sinon.stub().returns('bar');

  const x = pianola({
    subroutines: {
      foo,
    },
  });

  const result = await x([
    [
      [
        'foo',
      ],
      'foo',
    ],
    'foo',
  ], 'qux');

  t.is(foo.args[1][0], 'bar');
  t.is(foo.args[2][0], 'bar');

  t.is(result, 'bar');
});
