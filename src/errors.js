// @flow

import ExtendableError from 'es6-error';

export class PianolaError extends ExtendableError {}

export class NotFoundError extends PianolaError {}
