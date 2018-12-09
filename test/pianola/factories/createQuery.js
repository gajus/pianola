// @flow

import test from 'ava';
import createQuery from '../../../src/factories/createQuery';
import type {
  QueryType
} from '../../../src/types';

test('converts string expressions to subroutines', (t) => {
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
      operator: 'PIPELINE'
    },
    {
      subroutine: 'bar',
      values: []
    }
  ];

  t.deepEqual(createQuery(denormalizedQuery), query);
});

test('concatenates pipe separated subroutines with the sibling subroutines', (t) => {
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
      operator: 'PIPELINE'
    },
    {
      subroutine: 'foo1',
      values: []
    },
    {
      operator: 'PIPELINE'
    },
    {
      subroutine: 'foo2',
      values: []
    },
    {
      operator: 'PIPELINE'
    },
    {
      subroutine: 'bar',
      values: []
    }
  ];

  t.deepEqual(createQuery(denormalizedQuery), query);
});

test('converts simple object command into "adopt" subroutine (string expression)', (t) => {
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
      operator: 'PIPELINE'
    },
    {
      subroutine: 'bar',
      values: []
    },
    {
      operator: 'PIPELINE'
    },
    {
      namedChildren: {
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

test('converts simple object command into "adopt" subroutine (string expression) (nested; simple object)', (t) => {
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
      operator: 'PIPELINE'
    },
    {
      subroutine: 'bar',
      values: []
    },
    {
      operator: 'PIPELINE'
    },
    {
      namedChildren: {
        baz: [
          {
            subroutine: 'baz',
            values: []
          }
        ],
        qux: [
          {
            namedChildren: {
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

test('converts simple object command into "adopt" subroutine (array expression)', (t) => {
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
      operator: 'PIPELINE'
    },
    {
      subroutine: 'bar',
      values: []
    },
    {
      operator: 'PIPELINE'
    },
    {
      namedChildren: {
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
