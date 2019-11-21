// @flow

/* eslint-disable no-use-before-define, import/exports-last */

type QueryChildrenType = {
  +[key: string]: DenormalizedQueryType,
  ...,
};

type QueryInstructionType = string;

// eslint-disable-next-line flowtype/no-weak-types
export type InlineSubroutineType = (subject: any, bindle: BindleType) => any;

export type OperatorType = 'PIPELINE' | 'AGGREGATE_PIPELINE';

export type DenormalizedQueryType =
  QueryInstructionType |
  QueryChildrenType |
  $ReadOnlyArray<DenormalizedQueryType> |
  InlineSubroutineType;

export type InlineSubroutineInstructionType = {|
  +inlineSubroutine: InlineSubroutineType,
  +type: 'INLINE_SUBROUTINE',
|};

export type SubroutineInstructionType = {|
  +subroutine: string,
  +type: 'SUBROUTINE',
  +values: $ReadOnlyArray<string>,
|};

export type OperatorInstructionType = {|
  +operator: OperatorType,
  +type: 'OPERATOR',
|};

export type MergeAdoptionInstructionType = {|
  +margeChildren: QueryType,
  +type: 'MERGE_ADOPTION',
|};

export type NamedAdoptionInstructionType = {|
  +namedChildren: {
    +[key: string]: QueryType,
    ...,
  },
  +type: 'NAMED_ADOPTION',
|};

export type InstructionType =
  MergeAdoptionInstructionType |
  NamedAdoptionInstructionType |
  SubroutineInstructionType |
  OperatorInstructionType |
  InlineSubroutineInstructionType;

export type QueryType = $ReadOnlyArray<InstructionType>;

// eslint-disable-next-line flowtype/no-weak-types
type BindleType = Object;

// eslint-disable-next-line flowtype/no-weak-types
export type SubroutineType = (subject: any, values: $ReadOnlyArray<string>, bindle: BindleType) => any;

// eslint-disable-next-line flowtype/no-weak-types
export type ResultHandlerType = (output: any, input: any) => void;

export type UserConfigurationType = {|
  +bindle?: BindleType,
  +handleResult?: ResultHandlerType,
  +subroutines: {
    +[key: string]: SubroutineType,
    ...,
  },
|};

export type ConfigurationType = {|
  +bindle: BindleType,
  +handleResult?: ResultHandlerType,
  +subroutines: {
    +[key: string]: SubroutineType,
    ...,
  },
|};
