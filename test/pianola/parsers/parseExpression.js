// @flow

import test from 'ava';
import parseExpression from '../../../src/parsers/parseExpression';

test('parses an expression of a single subroutine', (t) => {
  t.deepEqual(parseExpression('foo'), [
    {
      subroutine: 'foo',
      type: 'SUBROUTINE',
      values: [],
    },
  ]);
});

test('parses an expression of a single subroutine with multiple values', (t) => {
  t.deepEqual(parseExpression('foo bar baz'), [
    {
      subroutine: 'foo',
      type: 'SUBROUTINE',
      values: [
        'bar',
        'baz',
      ],
    },
  ]);
});

test('parses an expression of multiple subroutines combined using the pipeline (|) operator', (t) => {
  t.deepEqual(parseExpression('foo | bar'), [
    {
      subroutine: 'foo',
      type: 'SUBROUTINE',
      values: [],
    },
    {
      operator: 'PIPELINE',
      type: 'OPERATOR',
    },
    {
      subroutine: 'bar',
      type: 'SUBROUTINE',
      values: [],
    },
  ]);
});

test('parses an expression of multiple subroutines combined using the aggregate pipeline (>|) operator', (t) => {
  t.deepEqual(parseExpression('foo >| bar'), [
    {
      subroutine: 'foo',
      type: 'SUBROUTINE',
      values: [],
    },
    {
      operator: 'AGGREGATE_PIPELINE',
      type: 'OPERATOR',
    },
    {
      subroutine: 'bar',
      type: 'SUBROUTINE',
      values: [],
    },
  ]);
});

test('parses an expression of multiple subroutines (with values) combined using the pipe operator', (t) => {
  t.deepEqual(parseExpression('foo a0 b0 c0 | bar a1 b1 c1'), [
    {
      subroutine: 'foo',
      type: 'SUBROUTINE',
      values: [
        'a0',
        'b0',
        'c0',
      ],
    },
    {
      operator: 'PIPELINE',
      type: 'OPERATOR',
    },
    {
      subroutine: 'bar',
      type: 'SUBROUTINE',
      values: [
        'a1',
        'b1',
        'c1',
      ],
    },
  ]);
});

test('parses an expression of a single subroutine with escaped values', (t) => {
  t.deepEqual(parseExpression('foo a \'b\' "c"'), [
    {
      subroutine: 'foo',
      type: 'SUBROUTINE',
      values: [
        'a',
        'b',
        'c',
      ],
    },
  ]);
});

test('parses an expression (foo "a b")', (t) => {
  t.deepEqual(parseExpression('foo "a b"'), [
    {
      subroutine: 'foo',
      type: 'SUBROUTINE',
      values: [
        'a b',
      ],
    },
  ]);
});

// eslint-disable-next-line ava/no-skip-test
test.skip('parses an expression (foo "a b)', (t) => {
  t.deepEqual(parseExpression('foo "a b'), [
    {
      subroutine: 'foo',
      type: 'SUBROUTINE',
      values: [
        '"a',
        'b',
      ],
    },
  ]);
});

// eslint-disable-next-line ava/no-skip-test
test.skip('parses an expression (foo a b")', (t) => {
  t.deepEqual(parseExpression('foo a b"'), [
    {
      subroutine: 'foo',
      type: 'SUBROUTINE',
      values: [
        'a',
        'b"',
      ],
    },
  ]);
});

test('parses an expression (foo \'a b\')', (t) => {
  t.deepEqual(parseExpression('foo \'a b\''), [
    {
      subroutine: 'foo',
      type: 'SUBROUTINE',
      values: [
        'a b',
      ],
    },
  ]);
});

// eslint-disable-next-line ava/no-skip-test
test.skip('parses an expression (foo \'a b)', (t) => {
  t.deepEqual(parseExpression('foo \'a b'), [
    {
      subroutine: 'foo',
      type: 'SUBROUTINE',
      values: [
        '\'a',
        'b',
      ],
    },
  ]);
});

// eslint-disable-next-line ava/no-skip-test
test.skip('parses an expression (foo a b\')', (t) => {
  t.deepEqual(parseExpression('foo a b\''), [
    {
      subroutine: 'foo',
      type: 'SUBROUTINE',
      values: [
        'a',
        'b\'',
      ],
    },
  ]);
});

test('parses an expression (foo a b)', (t) => {
  t.deepEqual(parseExpression('foo a b'), [
    {
      subroutine: 'foo',
      type: 'SUBROUTINE',
      values: [
        'a',
        'b',
      ],
    },
  ]);
});

test('parses an expression (foo "a" \'b\')', (t) => {
  t.deepEqual(parseExpression('foo "a" \'b\''), [
    {
      subroutine: 'foo',
      type: 'SUBROUTINE',
      values: [
        'a',
        'b',
      ],
    },
  ]);
});
