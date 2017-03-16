// @flow

import {
  parseExpression
} from '../parsers';
import type {
  DenormalizedQueryType,
  QueryType
} from '../types';

const createQuery = (denormalizedQuery: DenormalizedQueryType): QueryType => {
  if (typeof denormalizedQuery === 'string' || !Array.isArray(denormalizedQuery)) {
    // eslint-disable-next-line no-param-reassign
    denormalizedQuery = [
      denormalizedQuery
    ];
  }

  const commands = [];

  for (const maybeExpression of denormalizedQuery) {
    if (typeof maybeExpression === 'string') {
      const expressionCommands = parseExpression(maybeExpression);

      for (const command of expressionCommands) {
        commands.push(command);
      }
    } else {
      const adoption = maybeExpression;

      const childrenNames = Object.keys(adoption);

      const children = {};

      for (const childName of childrenNames) {
        children[childName] = createQuery(adoption[childName]);
      }

      commands.push({
        children
      });
    }
  }

  return commands;
};

export default createQuery;
