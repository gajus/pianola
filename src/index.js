// @flow

/* eslint-disable fp/no-class, fp/no-this */

import {
  createConfiguration,
  createQuery,
} from './factories';
import {
  NotFoundError,
  PianolaError,
  UnexpectedStateError,
} from './errors';
import type {
  DenormalizedQueryType,
  OperatorType,
  UserConfigurationType,
} from './types';

class FinalResultSentinel {
  value: *;

  constructor (value: *) {
    this.value = value;
  }
}

// eslint-disable-next-line complexity, flowtype/no-weak-types
const play = async (instructions, startValue, subroutines, bindle: Object, handleResult?: Function) => {
  let result = startValue;

  let index = 0;

  if (!Array.isArray(instructions)) {
    throw new UnexpectedStateError();
  }

  for (const instruction of instructions) {
    index++;

    if (instruction.type === 'OPERATOR') {
      // eslint-disable-next-line no-continue
      continue;
    }

    const nextOperator: OperatorType | null = instructions[index] && instructions[index].operator || null;

    if (instruction.type === 'NAMED_ADOPTION') {
      const children = {};

      const childrenNames = Object.keys(instruction.namedChildren);

      for (const childName of childrenNames) {
        children[childName] = await play(instruction.namedChildren[childName], result, subroutines, bindle, handleResult);
      }

      const remainingInstructions = instructions.slice(index);

      return play(remainingInstructions, children, subroutines, bindle, handleResult);
    } else if (instruction.type === 'MERGE_ADOPTION') {
      let value = result;

      value = await play(instruction.margeChildren, value, subroutines, bindle, handleResult);

      const remainingInstructions = instructions.slice(index);

      return play(remainingInstructions, value, subroutines, bindle, handleResult);
    }

    const lastResult = result;

    if (instruction.type === 'INLINE_SUBROUTINE') {
      result = instruction.inlineSubroutine(result, bindle);
    } else if (instruction.type === 'SUBROUTINE') {
      if (!subroutines[instruction.subroutine]) {
        throw new NotFoundError('"' + instruction.subroutine + '" subroutine does not exist.');
      }

      result = subroutines[instruction.subroutine](
        result,
        instruction.values,
        bindle,
      );
    } else {
      throw new UnexpectedStateError();
    }

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

      const results = [];

      for (const newStartValue of result) {
        results.push(await play(remainingInstructions, newStartValue, subroutines, bindle, handleResult));
      }

      return results;
    }
  }

  return result;
};

export {
  FinalResultSentinel,
  NotFoundError,
  PianolaError,
};

export default (userConfiguration: UserConfigurationType) => {
  // eslint-disable-next-line flowtype/no-weak-types
  return async (denormalizedQuery: DenormalizedQueryType, startValue: any): any => {
    const configuration = createConfiguration(userConfiguration);

    const instructions = createQuery(denormalizedQuery);

    return play(
      instructions,
      startValue,
      configuration.subroutines,
      configuration.bindle,
      configuration.handleResult,
    );
  };
};
