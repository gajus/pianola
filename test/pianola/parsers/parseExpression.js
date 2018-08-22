// @flow

import test from 'ava';
import parseExpression from '../../../src/parsers/parseExpression';

test('parses an expression of a single subroutine', (t): void => {
  t.deepEqual(parseExpression('foo'), [
    {
      subroutine: 'foo',
      values: []
    }
  ]);
});

test('parses an expression of a single subroutine with multiple values', (t): void => {
  t.deepEqual(parseExpression('foo bar baz'), [
    {
      subroutine: 'foo',
      values: [
        'bar',
        'baz'
      ]
    }
  ]);
});

test('parses an expression of multiple subroutines combined using the pipe operator', (t): void => {
  t.deepEqual(parseExpression('foo | bar'), [
    {
      subroutine: 'foo',
      values: []
    },
    {
      subroutine: 'bar',
      values: []
    }
  ]);
});

test('parses an expression of multiple subroutines (with values) combined using the pipe operator', (t): void => {
  t.deepEqual(parseExpression('foo a0 b0 c0 | bar a1 b1 c1'), [
    {
      subroutine: 'foo',
      values: [
        'a0',
        'b0',
        'c0'
      ]
    },
    {
      subroutine: 'bar',
      values: [
        'a1',
        'b1',
        'c1'
      ]
    }
  ]);
});

test('parses an expression of a single subroutine with escaped values', (t): void => {
  t.deepEqual(parseExpression('foo a \'b\' "c"'), [
    {
      subroutine: 'foo',
      values: [
        'a',
        'b',
        'c'
      ]
    }
  ]);
});

test('parses an expression (foo "a b")', (t): void => {
  t.deepEqual(parseExpression('foo "a b"'), [
    {
      subroutine: 'foo',
      values: [
        'a b'
      ]
    }
  ]);
});

// eslint-disable-next-line ava/no-skip-test
test.skip('parses an expression (foo "a b)', (t): void => {
  t.deepEqual(parseExpression('foo "a b'), [
    {
      subroutine: 'foo',
      values: [
        '"a',
        'b'
      ]
    }
  ]);
});

// eslint-disable-next-line ava/no-skip-test
test.skip('parses an expression (foo a b")', (t): void => {
  t.deepEqual(parseExpression('foo a b"'), [
    {
      subroutine: 'foo',
      values: [
        'a',
        'b"'
      ]
    }
  ]);
});

test('parses an expression (foo \'a b\')', (t): void => {
  t.deepEqual(parseExpression('foo \'a b\''), [
    {
      subroutine: 'foo',
      values: [
        'a b'
      ]
    }
  ]);
});

// eslint-disable-next-line ava/no-skip-test
test.skip('parses an expression (foo \'a b)', (t): void => {
  t.deepEqual(parseExpression('foo \'a b'), [
    {
      subroutine: 'foo',
      values: [
        '\'a',
        'b'
      ]
    }
  ]);
});

// eslint-disable-next-line ava/no-skip-test
test.skip('parses an expression (foo a b\')', (t): void => {
  t.deepEqual(parseExpression('foo a b\''), [
    {
      subroutine: 'foo',
      values: [
        'a',
        'b\''
      ]
    }
  ]);
});

test('parses an expression (foo a b)', (t): void => {
  t.deepEqual(parseExpression('foo a b'), [
    {
      subroutine: 'foo',
      values: [
        'a',
        'b'
      ]
    }
  ]);
});

test('parses an expression (foo "a" \'b\')', (t): void => {
  t.deepEqual(parseExpression('foo "a" \'b\''), [
    {
      subroutine: 'foo',
      values: [
        'a',
        'b'
      ]
    }
  ]);
});
