// @flow

import test from 'ava';
import createQuery from '../../../src/factories/createQuery';
import type {
  QueryType
} from '../../../src/types';

test('converts string expressions to subroutines', (t): void => {
  const denormalizedQuery = [
    'foo',
    'bar'
  ];

  const query: QueryType = [
    {
      subroutine: 'foo',
      values: []
    },
    {
      subroutine: 'bar',
      values: []
    }
  ];

  t.deepEqual(createQuery(denormalizedQuery), query);
});

test('concatenates pipe separated subroutines with the sibling subroutines', (t): void => {
  const denormalizedQuery = [
    'foo0 | foo1 | foo2',
    'bar'
  ];

  const query = [
    {
      subroutine: 'foo0',
      values: []
    },
    {
      subroutine: 'foo1',
      values: []
    },
    {
      subroutine: 'foo2',
      values: []
    },
    {
      subroutine: 'bar',
      values: []
    }
  ];

  t.deepEqual(createQuery(denormalizedQuery), query);
});

test('converts simple object command into "adopt" subroutine (string expression)', (t): void => {
  const denormalizedQuery = [
    'foo',
    'bar',
    {
      baz: 'baz0',
      qux: 'qux0'
    }
  ];

  const query: QueryType = [
    {
      subroutine: 'foo',
      values: []
    },
    {
      subroutine: 'bar',
      values: []
    },
    {
      children: {
        baz: [
          {
            subroutine: 'baz0',
            values: []
          }
        ],
        qux: [
          {
            subroutine: 'qux0',
            values: []
          }
        ]
      }
    }
  ];

  t.deepEqual(createQuery(denormalizedQuery), query);
});

test('converts simple object command into "adopt" subroutine (string expression) (nested; simple object)', (t): void => {
  const denormalizedQuery = [
    'foo',
    'bar',
    {
      baz: 'baz',
      qux: {
        quux: 'quux'
      }
    }
  ];

  const query: QueryType = [
    {
      subroutine: 'foo',
      values: []
    },
    {
      subroutine: 'bar',
      values: []
    },
    {
      children: {
        baz: [
          {
            subroutine: 'baz',
            values: []
          }
        ],
        qux: [
          {
            children: {
              quux: [
                {
                  subroutine: 'quux',
                  values: []
                }
              ]
            }
          }
        ]
      }
    }
  ];

  t.deepEqual(createQuery(denormalizedQuery), query);
});

test('converts simple object command into "adopt" subroutine (array expression)', (t): void => {
  const denormalizedQuery = [
    'foo',
    'bar',
    {
      baz: [
        'baz0'
      ],
      qux: [
        'qux0'
      ]
    }
  ];

  const query: QueryType = [
    {
      subroutine: 'foo',
      values: []
    },
    {
      subroutine: 'bar',
      values: []
    },
    {
      children: {
        baz: [
          {
            subroutine: 'baz0',
            values: []
          }
        ],
        qux: [
          {
            subroutine: 'qux0',
            values: []
          }
        ]
      }
    }
  ];

  t.deepEqual(createQuery(denormalizedQuery), query);
});
