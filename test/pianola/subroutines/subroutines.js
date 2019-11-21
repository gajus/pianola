// @flow

import test from 'ava';
import sinon from 'sinon';
import pianola, {
  FinalResultSentinel,
  NotFoundError,
} from '../../../src';

test('empty instructions return the original input value', async (t) => {
  const startValue = {};

  const x = pianola({
    subroutines: {},
  });

  const result = await x([], startValue);

  t.deepEqual(result, startValue);
});

test('executes a subroutine and returns the subroutine result value', async (t) => {
  const foo = sinon.stub().returns('bar');

  const x = pianola({
    subroutines: {
      foo,
    },
  });

  const result = await x('foo', null);

  t.is(result, 'bar');
});

test('executes the first subroutine with the input value', async (t) => {
  const foo = sinon.stub().returns();

  const x = pianola({
    subroutines: {
      foo,
    },
  });

  await x('foo', 'bar');

  t.true(foo.calledOnce);
  t.true(foo.calledWith('bar'));
});

test('short-circuits the subroutine after receiving FinalResultSentinel', async (t) => {
  const foo = sinon.stub().returns(new FinalResultSentinel('FOO'));
  const bar = sinon.stub().throws(new Error());

  const x = pianola({
    subroutines: {
      bar,
      foo,
    },
  });

  const result = await x('foo | bar', null);

  t.true(foo.calledOnce);
  t.is(result, 'FOO');
});

test('executes a subroutine with a list of the parameter values', async (t) => {
  const foo = sinon.stub();

  const x = pianola({
    subroutines: {
      foo,
    },
  });

  await x('foo bar baz', 'qux');

  t.true(foo.calledOnce);
  t.true(foo.calledWith('qux', ['bar', 'baz']));
});

test('executes a subroutine with a user configured bindle', async (t) => {
  const foo = sinon.stub();

  const bindle = {};

  const x = pianola({
    bindle,
    subroutines: {
      foo,
    },
  });

  await x('foo', 'qux');

  t.true(foo.calledOnce);
  t.true(foo.calledWith('qux', [], bindle));
});

test('throws an error if a subroutine does not exist', async (t) => {
  const x = pianola({
    subroutines: {},
  });

  const error = await t.throwsAsync(x('foo', null));

  t.true(error instanceof NotFoundError);
});

test('calls handleResult for each intermediate result', async (t) => {
  const handleResult = sinon.stub();
  const foo = sinon.stub().returns('FOO');

  const x = pianola({
    handleResult,
    subroutines: {
      foo,
    },
  });

  const result = await x('foo | foo | foo', 'qux');

  t.is(handleResult.callCount, 3);

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

  t.is(result, 'FOO');
});

test('executes an inline subroutine', async (t) => {
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

  await x([
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
