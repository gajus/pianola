// @flow

/* eslint-disable no-use-before-define, import/exports-last */

type QueryChildrenType = {
  +[key: string]: DenormalizedQueryType
};

type QueryInstructionType = string;

export type OperatorType = 'PIPELINE' | 'AGGREGATE_PIPELINE';

export type DenormalizedQueryType =
  QueryInstructionType |
  $ReadOnlyArray<QueryInstructionType | QueryChildrenType> |
  QueryChildrenType;

export type SubroutineInstructionType = {|
  +subroutine: string,
  +values: $ReadOnlyArray<string>
|};

export type OperatorInstructionType = {|
  +operator: OperatorType
|};

export type AdoptionInstructionType = {|
  +children: {
    +[key: string]: QueryType
  }
|};

export type InstructionType =
  AdoptionInstructionType |
  SubroutineInstructionType |
  OperatorInstructionType;

export type QueryType = $ReadOnlyArray<InstructionType>;

// eslint-disable-next-line flowtype/no-weak-types
type BindleType = Object;

export type SubroutineType = (subject: mixed, values: $ReadOnlyArray<string>, bindle: BindleType) => mixed;

export type ResultHandlerType = (output: mixed, input: mixed) => void;

export type UserConfigurationType = {|
  +bindle?: BindleType,
  +handleResult?: ResultHandlerType,
  +subroutines: {
    +[key: string]: SubroutineType
  }
|};

export type ConfigurationType = {|
  +bindle: BindleType,
  +handleResult?: ResultHandlerType,
  +subroutines: {
    +[key: string]: SubroutineType
  }
|};
