// @flow

import test from 'ava';
import createQuery from '../../../src/factories/createQuery';
import type {
  QueryType,
} from '../../../src/types';

test('converts string expressions to subroutines', (t) => {
  const denormalizedQuery = [
    'foo',
    'bar',
  ];

  const query: QueryType = [
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
  ];

  t.deepEqual(createQuery(denormalizedQuery), query);
});

test('concatenates pipe separated subroutines with the sibling subroutines', (t) => {
  const denormalizedQuery = [
    'foo0 | foo1 | foo2',
    'bar',
  ];

  const query = [
    {
      subroutine: 'foo0',
      type: 'SUBROUTINE',
      values: [],
    },
    {
      operator: 'PIPELINE',
      type: 'OPERATOR',
    },
    {
      subroutine: 'foo1',
      type: 'SUBROUTINE',
      values: [],
    },
    {
      operator: 'PIPELINE',
      type: 'OPERATOR',
    },
    {
      subroutine: 'foo2',
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
  ];

  t.deepEqual(createQuery(denormalizedQuery), query);
});

test('converts simple object command into "adopt" subroutine (string expression)', (t) => {
  const denormalizedQuery = [
    'foo',
    'bar',
    {
      baz: 'baz0',
      qux: 'qux0',
    },
  ];

  const query: QueryType = [
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
    {
      operator: 'PIPELINE',
      type: 'OPERATOR',
    },
    {
      namedChildren: {
        baz: [
          {
            subroutine: 'baz0',
            type: 'SUBROUTINE',
            values: [],
          },
        ],
        qux: [
          {
            subroutine: 'qux0',
            type: 'SUBROUTINE',
            values: [],
          },
        ],
      },
      type: 'NAMED_ADOPTION',
    },
  ];

  t.deepEqual(createQuery(denormalizedQuery), query);
});

test('converts simple object command into "adopt" subroutine (string expression) (nested; simple object)', (t) => {
  const denormalizedQuery = [
    'foo',
    'bar',
    {
      baz: 'baz',
      qux: {
        quux: 'quux',
      },
    },
  ];

  const query: QueryType = [
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
    {
      operator: 'PIPELINE',
      type: 'OPERATOR',
    },
    {
      namedChildren: {
        baz: [
          {
            subroutine: 'baz',
            type: 'SUBROUTINE',
            values: [],
          },
        ],
        qux: [
          {
            namedChildren: {
              quux: [
                {
                  subroutine: 'quux',
                  type: 'SUBROUTINE',
                  values: [],
                },
              ],
            },
            type: 'NAMED_ADOPTION',
          },
        ],
      },
      type: 'NAMED_ADOPTION',
    },
  ];

  t.deepEqual(createQuery(denormalizedQuery), query);
});

test('converts simple object command into "adopt" subroutine (array expression)', (t) => {
  const denormalizedQuery = [
    'foo',
    'bar',
    {
      baz: [
        'baz0',
      ],
      qux: [
        'qux0',
      ],
    },
  ];

  const query: QueryType = [
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
    {
      operator: 'PIPELINE',
      type: 'OPERATOR',
    },
    {
      namedChildren: {
        baz: [
          {
            subroutine: 'baz0',
            type: 'SUBROUTINE',
            values: [],
          },
        ],
        qux: [
          {
            subroutine: 'qux0',
            type: 'SUBROUTINE',
            values: [],
          },
        ],
      },
      type: 'NAMED_ADOPTION',
    },
  ];

  t.deepEqual(createQuery(denormalizedQuery), query);
});
