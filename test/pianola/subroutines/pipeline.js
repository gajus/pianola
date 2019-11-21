// @flow

import test from 'ava';
import sinon from 'sinon';
import pianola, {
  FinalResultSentinel,
} from '../../../src';

test('executes the next subroutine with the result of the parent subroutine', async (t) => {
  const foo = sinon.stub().returns('FOO');
  const bar = sinon.stub();

  const x = pianola({
    subroutines: {
      bar,
      foo,
    },
  });

  await x('foo | bar', null);

  t.true(bar.calledOnce);
  t.true(bar.calledWith('FOO'));
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

test('executes a subroutine for each value in an array result', async (t) => {
  const foo = sinon.stub().returns([1, 2, 3]);
  const bar = sinon.stub();

  bar.onCall(0).returns('a');
  bar.onCall(1).returns('b');
  bar.onCall(2).returns('c');

  const x = pianola({
    subroutines: {
      bar,
      foo,
    },
  });

  const result = await x('foo | bar', 'qux');

  t.deepEqual(result, ['a', 'b', 'c']);
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
