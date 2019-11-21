// @flow

import test from 'ava';
import sinon from 'sinon';
import pianola, {
  FinalResultSentinel,
  NotFoundError,
} from '../../../src';

test('empty instructions return the original input value', (t) => {
  const startValue = {};

  const x = pianola({
    subroutines: {},
  });

  t.true(x([], startValue) === startValue);
});

test('executes a subroutine and returns the subroutine result value', (t) => {
  const foo = sinon.stub().returns('bar');

  const x = pianola({
    subroutines: {
      foo,
    },
  });

  const result = x('foo', null);

  t.true(result === 'bar');
});

test('executes the first subroutine with the input value', (t) => {
  const foo = sinon.stub().returns();

  const x = pianola({
    subroutines: {
      foo,
    },
  });

  x('foo', 'bar');

  t.true(foo.calledOnce);
  t.true(foo.calledWith('bar'));
});

test('short-circuits the subroutine after receiving FinalResultSentinel', (t) => {
  const foo = sinon.stub().returns(new FinalResultSentinel('FOO'));
  const bar = sinon.stub().throws(new Error());

  const x = pianola({
    subroutines: {
      bar,
      foo,
    },
  });

  const result = x('foo | bar', null);

  t.true(foo.calledOnce);
  t.true(result === 'FOO');
});

test('executes a subroutine with a list of the parameter values', (t) => {
  const foo = sinon.stub();

  const x = pianola({
    subroutines: {
      foo,
    },
  });

  x('foo bar baz', 'qux');

  t.true(foo.calledOnce);
  t.true(foo.calledWith('qux', ['bar', 'baz']));
});

test('executes a subroutine with a user configured bindle', (t) => {
  const foo = sinon.stub();

  const bindle = {};

  const x = pianola({
    bindle,
    subroutines: {
      foo,
    },
  });

  x('foo', 'qux');

  t.true(foo.calledOnce);
  t.true(foo.calledWith('qux', [], bindle));
});

test('throws an error if a subroutine does not exist', (t) => {
  const x = pianola({
    subroutines: {},
  });

  t.throws(() => {
    x('foo', null);
  }, NotFoundError);
});

test('calls handleResult for each intermediate result', (t) => {
  const handleResult = sinon.stub();
  const foo = sinon.stub().returns('FOO');

  const x = pianola({
    handleResult,
    subroutines: {
      foo,
    },
  });

  const result = x('foo | foo | foo', 'qux');

  t.true(handleResult.callCount === 3);
  t.deepEqual(handleResult.args, [
    [
      'FOO',
      'qux',
    ],
    [
      'FOO',
      'FOO',
    ],
    [
      'FOO',
      'FOO',
    ],
  ]);

  t.true(result === 'FOO');
});

test('executes an inline subroutine', (t) => {
  const foo = sinon.stub().returns('FOO');
  const bar = sinon.stub();

  const bindle = {};

  const x = pianola({
    bindle,
    subroutines: {
      bar,
      foo,
    },
  });

  x([
    'foo',
    (subject) => {
      t.is(subject, 'FOO');

      return 'BAR';
    },
    'bar',
  ], 'qux');

  t.true(bar.calledOnce);
  t.true(bar.calledWith('BAR', [], bindle));
});
