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

class FinalResultSentinel {
  value: *;

  constructor (value: *) {
    this.value = value;
  }
}

// eslint-disable-next-line flowtype/no-weak-types
const play = (instructions, startValue, subroutines, bindle: Object, handleResult?: Function) => {
  let result = startValue;

  let index = 0;

  for (const instruction of instructions) {
    index++;

    if (instruction.children) {
      const children = {};

      const childrenNames = Object.keys(instruction.children);

      for (const childName of childrenNames) {
        children[childName] = play(instruction.children[childName], result, subroutines, bindle, handleResult);
      }

      const remainingInstructions = instructions.slice(index);

      return play(remainingInstructions, children, subroutines, bindle, handleResult);
    }

    const lastResult = result;

    if (!subroutines[instruction.subroutine]) {
      throw new NotFoundError('"' + instruction.subroutine + '" subroutine does not exist.');
    }

    result = subroutines[instruction.subroutine](result, instruction.values, bindle);

    if (result instanceof FinalResultSentinel) {
      return result.value;
    }

    if (handleResult) {
      const handleResultResult = handleResult(result, lastResult);

      if (handleResultResult instanceof FinalResultSentinel) {
        return handleResultResult.value;
      }
    }

    if (Array.isArray(result)) {
      const remainingInstructions = instructions.slice(index);

      return result.map((newStartValue) => {
        return play(remainingInstructions, newStartValue, subroutines, bindle, handleResult);
      });
    }
  }

  return result;
};

export {
  FinalResultSentinel,
  NotFoundError,
  PianolaError
};

export default (userConfiguration: UserConfigurationType) => {
  // eslint-disable-next-line flowtype/no-weak-types
  return (denormalizedQuery: DenormalizedQueryType, startValue: mixed): any => {
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
