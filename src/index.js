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
  OperatorType,
  UserConfigurationType
} from './types';

class FinalResultSentinel {
  value: *;

  constructor (value: *) {
    this.value = value;
  }
}

// eslint-disable-next-line complexity, flowtype/no-weak-types
const play = (instructions, startValue, subroutines, bindle: Object, handleResult?: Function) => {
  let result = startValue;

  let index = 0;

  for (const instruction of instructions) {
    index++;

    if (instruction.operator) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const nextOperator: OperatorType | null = instructions[index] && instructions[index].operator || null;

    if (instruction.namedChildren) {
      const children = {};

      const childrenNames = Object.keys(instruction.namedChildren);

      for (const childName of childrenNames) {
        children[childName] = play(instruction.namedChildren[childName], result, subroutines, bindle, handleResult);
      }

      const remainingInstructions = instructions.slice(index);

      return play(remainingInstructions, children, subroutines, bindle, handleResult);
    } else if (instruction.margeChildren) {
      let value = result;

      value = play(instruction.margeChildren, value, subroutines, bindle, handleResult);

      const remainingInstructions = instructions.slice(index);

      return play(remainingInstructions, value, subroutines, bindle, handleResult);
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

    if (Array.isArray(result) && nextOperator === 'PIPELINE') {
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
