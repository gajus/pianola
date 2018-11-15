// @flow

/* eslint-disable no-use-before-define, import/exports-last */

type QueryChildrenType = {
  +[key: string]: DenormalizedQueryType
};

type QueryInstructionType = string;

export type DenormalizedQueryType =
  QueryInstructionType |
  $ReadOnlyArray<QueryInstructionType | QueryChildrenType> |
  QueryChildrenType;

export type CommandType = {|
  +subroutine: string,
  +values: $ReadOnlyArray<string>
|};

export type AdoptionType = {|
  children: {
    +[key: string]: QueryType
  }
|};

export type QueryType = $ReadOnlyArray<CommandType | AdoptionType>;

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
