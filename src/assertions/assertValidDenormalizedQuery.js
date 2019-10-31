// @flow

import Ajv from 'ajv';
import denormalizedQueryShema from '../schemas/denormalizedQueryShema.json';
import {
  PianolaError,
} from '../errors';
import type {
  DenormalizedQueryType,
} from '../types';

const ajv = new Ajv();

const validate = ajv.compile(denormalizedQueryShema);

export default (denormalizedQuery: DenormalizedQueryType, log: boolean = true): void => {
  if (!validate(denormalizedQuery)) {
    if (log) {
      // eslint-disable-next-line no-console
      console.log('query', denormalizedQuery);

      // eslint-disable-next-line no-console
      console.error('Validation errors', validate.errors);
    }

    throw new PianolaError('Invalid query.');
  }
};
