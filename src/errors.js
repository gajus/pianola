// @flow

/* eslint-disable fp/no-class */

import ExtendableError from 'es6-error';

export class PianolaError extends ExtendableError {}

export class UnexpectedStateError extends PianolaError {}

export class NotFoundError extends PianolaError {}
