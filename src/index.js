// @flow

import {
  createConfiguration,
  createQuery
} from './factories';
import {
  NotFoundError,
  PianolaError
} from './errors';
import type {
  DenormalizedQueryType,
  UserConfigurationType
} from './types';

export {
  NotFoundError,
  PianolaError
};

// eslint-disable-next-line flowtype/no-weak-types
const play = (instructions, startValue, subroutines, bindle: Object, handleResult?: Function) => {
  let result = startValue;

  let index = 0;

  for (const instruction of instructions) {
    if (instruction.children) {
      const children = {};

      const childrenNames = Object.keys(instruction.children);

      for (const childName of childrenNames) {
        children[childName] = play(instruction.children[childName], result, subroutines, bindle, handleResult);
      }

      return children;
    }

    const lastResult = result;

    if (!subroutines[instruction.subroutine]) {
      throw new NotFoundError('Subroutine does not exist.');
    }

    result = subroutines[instruction.subroutine](result, instruction.values, bindle);

    if (handleResult) {
      handleResult(result, lastResult);
    }

    index++;

    if (Array.isArray(result)) {
      const remainingInstructions = instructions.slice(index);

      return result.map((newStartValue) => {
        return play(remainingInstructions, newStartValue, subroutines, bindle, handleResult);
      });
    }
  }

  return result;
};

export default (userConfiguration: UserConfigurationType) => {
  return (denormalizedQuery: DenormalizedQueryType, startValue: mixed) => {
    const configuration = createConfiguration(userConfiguration);

    const instructions = createQuery(denormalizedQuery);

    return play(
      instructions,
      startValue,
      configuration.subroutines,
      configuration.bindle,
      configuration.handleResult
    );
  };
};
