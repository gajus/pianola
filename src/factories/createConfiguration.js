// @flow

import type {
  ConfigurationType,
  UserConfigurationType
} from '../types';

export default (userConfiguration: UserConfigurationType): ConfigurationType => {
  return {
    bindle: userConfiguration.bindle || {},
    handleResult: userConfiguration.handleResult,
    subroutines: userConfiguration.subroutines
  };
};
