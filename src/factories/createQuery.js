// @flow

import {
  parseExpression,
} from '../parsers';
import type {
  DenormalizedQueryType,
  QueryType,
} from '../types';

const createQuery = (denormalizedQuery: DenormalizedQueryType): QueryType => {
  if (typeof denormalizedQuery === 'string' || typeof denormalizedQuery === 'function' || !Array.isArray(denormalizedQuery)) {
    // eslint-disable-next-line no-param-reassign
    denormalizedQuery = [
      denormalizedQuery,
    ];
  }

  const commands = [];

  let index = 0;

  for (const maybeExpression of denormalizedQuery) {
    index++;

    const nextExpression = denormalizedQuery[index];

    if (typeof maybeExpression === 'string') {
      const expressionCommands = parseExpression(maybeExpression);

      for (const command of expressionCommands) {
        commands.push(command);
      }

      if (nextExpression) {
        commands.push({
          operator: 'PIPELINE',
          type: 'OPERATOR',
        });
      }
    } else if (typeof maybeExpression === 'function') {
      commands.push({
        inlineSubroutine: maybeExpression,
        type: 'INLINE_SUBROUTINE',
      });

      if (nextExpression) {
        commands.push({
          operator: 'PIPELINE',
          type: 'OPERATOR',
        });
      }
    } else if (Array.isArray(maybeExpression)) {
      const children = createQuery(maybeExpression);

      commands.push({
        margeChildren: children,
        type: 'MERGE_ADOPTION',
      });
    } else {
      const adoption = maybeExpression;

      const childrenNames = Object.keys(adoption);

      const children = {};

      for (const childName of childrenNames) {
        children[childName] = createQuery(adoption[childName]);
      }

      commands.push({
        namedChildren: children,
        type: 'NAMED_ADOPTION',
      });
    }
  }

  return commands;
};

export default createQuery;
