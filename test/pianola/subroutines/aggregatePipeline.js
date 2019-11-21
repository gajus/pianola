// @flow

import test from 'ava';
import sinon from 'sinon';
import pianola from '../../../src';

test('passes on array result to the next subroutine', async (t) => {
  const foo = sinon.stub().returns([1, 2, 3]);
  const bar = sinon.stub().onCall(0).returnsArg(0);

  const x = pianola({
    subroutines: {
      bar,
      foo,
    },
  });

  const result = await x('foo >| bar', 'qux');

  t.deepEqual(result, [1, 2, 3]);
});

test('calls handleResult for each intermediate result', async (t) => {
  const handleResult = sinon.stub();
  const foo = sinon.stub().returns([1, 2, 3]);
  const bar = sinon.stub().returns('a');

  bar.onCall(0).returns('a');

  const x = pianola({
    handleResult,
    subroutines: {
      bar,
      foo,
    },
  });

  await x('foo >| bar', 'qux');

  t.is(handleResult.callCount, 2);

  t.deepEqual(handleResult.args, [
    [
      [
        1,
        2,
        3,
      ],
      'qux',
    ],
    [
      'a',
      [
        1,
        2,
        3,
      ],
    ],
  ]);
});
