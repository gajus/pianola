// @flow

type QueryChildrenType = {

  // eslint-disable-next-line no-use-before-define
  [key: string]: DenormalizedQueryType
};

export type DenormalizedQueryType =
  string |
  $ReadOnlyArray<string | QueryChildrenType> |
  QueryChildrenType;

export type CommandType = {|
  +subroutine: string,
  +values: $ReadOnlyArray<string>
|};

export type AdoptionType = {|
  children: {

    // eslint-disable-next-line no-use-before-define
    [key: string]: QueryType
  }
|};

export type QueryType = $ReadOnlyArray<CommandType | AdoptionType>;

// eslint-disable-next-line flowtype/no-weak-types
export type SubroutineType = (subject: mixed, values: $ReadOnlyArray<string>, bindle: Object) => any;

export type ResultHandlerType = (output: mixed, input: mixed) => void;

export type UserConfigurationType = {

  // eslint-disable-next-line flowtype/no-weak-types
  +bindle?: Object,
  +handleResult?: ResultHandlerType,
  +subroutines: {
    [key: string]: SubroutineType
  }
};

export type ConfigurationType = {|

  // eslint-disable-next-line flowtype/no-weak-types
  +bindle: Object,
  +handleResult?: ResultHandlerType,
  +subroutines: {
    [key: string]: SubroutineType
  }
|};
