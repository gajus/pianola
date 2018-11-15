// @flow

import test from 'ava';
import sinon from 'sinon';
import pianola from '../../../src';

test('names results when instruction is a {[key: string]: [pianola expression]}', (t) => {
  const foo = sinon.stub().returns('foo');

  const x = pianola({
    subroutines: {
      foo
    }
  });

  const result = x([
    {
      a: 'foo',
      b: 'foo'
    }
  ], 'qux');

  t.deepEqual({
    a: 'foo',
    b: 'foo'
  }, result);
});

test('uses instruction after query children expression', (t) => {
  const foo = sinon.stub().returns('foo');

  const x = pianola({
    subroutines: {
      foo
    }
  });

  const result = x([
    {
      a: 'foo',
      b: 'foo'
    },
    'foo'
  ], 'qux');

  t.true(result === 'foo');
});
