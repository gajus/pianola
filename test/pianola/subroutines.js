// @flow

import test from 'ava';
import sinon from 'sinon';
import pianola, {
  FinalResultSentinel,
  NotFoundError
} from '../../src';

test('empty instructions return the original input value', (t): void => {
  const startValue = {};

  const x = pianola({
    subroutines: {}
  });

  t.true(x([], startValue) === startValue);
});

test('executes a subroutine and returns the subroutine result value', (t): void => {
  const foo = sinon.stub().returns('bar');

  const x = pianola({
    subroutines: {
      foo
    }
  });

  const result = x('foo', null);

  t.true(result === 'bar');
});

test('executes the first subroutine with the input value', (t): void => {
  const foo = sinon.stub().returns();

  const x = pianola({
    subroutines: {
      foo
    }
  });

  x('foo', 'bar');

  t.true(foo.calledOnce);
  t.true(foo.calledWith('bar'));
});

test('executes the next subroutine with the result of the parent subroutine', (t): void => {
  const foo = sinon.stub().returns('FOO');
  const bar = sinon.stub();

  const x = pianola({
    subroutines: {
      bar,
      foo
    }
  });

  x('foo | bar', null);

  t.true(bar.calledOnce);
  t.true(bar.calledWith('FOO'));
});

test('short-circuits the subroutine after receiving FinalResultSentinel', (t): void => {
  const foo = sinon.stub().returns(new FinalResultSentinel('FOO'));
  const bar = sinon.stub().throws(new Error());

  const x = pianola({
    subroutines: {
      bar,
      foo
    }
  });

  const result = x('foo | bar', null);

  t.true(foo.calledOnce);
  t.true(result === 'FOO');
});

test('executes a subroutine with a list of the parameter values', (t): void => {
  const foo = sinon.stub();

  const x = pianola({
    subroutines: {
      foo
    }
  });

  x('foo bar baz', 'qux');

  t.true(foo.calledOnce);
  t.true(foo.calledWith('qux', ['bar', 'baz']));
});

test('executes a subroutine with a user configured bindle', (t): void => {
  const foo = sinon.stub();

  const bindle = {};

  const x = pianola({
    bindle,
    subroutines: {
      foo
    }
  });

  x('foo', 'qux');

  t.true(foo.calledOnce);
  t.true(foo.calledWith('qux', [], bindle));
});

test('executes a subroutine for each value in an array result', (t): void => {
  const foo = sinon.stub().returns([1, 2, 3]);
  const bar = sinon.stub();

  bar.onCall(0).returns('a');
  bar.onCall(1).returns('b');
  bar.onCall(2).returns('c');

  const x = pianola({
    subroutines: {
      bar,
      foo
    }
  });

  const result = x('foo | bar', 'qux');

  t.deepEqual(result, ['a', 'b', 'c']);
});

test('names results', (t): void => {
  const foo = sinon.stub().returns('FOO');

  const x = pianola({
    subroutines: {
      foo
    }
  });

  const result = x([
    {
      foo0: 'foo',
      foo1: 'foo',
      foo2: 'foo'
    }
  ], 'qux');

  t.true(foo.callCount === 3);
  t.true(foo.calledWith('qux'));

  t.deepEqual(result, {
    foo0: 'FOO',
    foo1: 'FOO',
    foo2: 'FOO'
  });
});

test('throws an error if a subroutine does not exist', (t): void => {
  const x = pianola({
    subroutines: {}
  });

  t.throws(() => {
    x('foo', null);
  }, NotFoundError);
});

test('calls handleResult for each intermediate result', (t): void => {
  const handleResult = sinon.stub();
  const foo = sinon.stub().returns('FOO');

  const x = pianola({
    handleResult,
    subroutines: {
      foo
    }
  });

  const result = x('foo | foo | foo', 'qux');

  t.true(handleResult.callCount === 3);
  t.deepEqual(handleResult.args, [
    [
      'FOO',
      'qux'
    ],
    [
      'FOO',
      'FOO'
    ],
    [
      'FOO',
      'FOO'
    ]
  ]);

  t.true(result === 'FOO');
});
