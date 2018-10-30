// @flow

import test from 'ava';
import {
  assertValidDenormalizedQuery
} from '../../../src/assertions';

test('throws an error when invalid query is provided', (t) => {
  t.throws(() => {
    // $FlowFixMe
    assertValidDenormalizedQuery(1, false);
  });
});
