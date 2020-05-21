import { IncomingMessage as IM } from 'http';

import { ErrorFn, SuccessFn, ErrorStrictFn } from './middleware';

export declare module http {
  export interface ImcomingMessage extends IM {
    success: SuccessFn;
    error: ErrorFn;
    badInput: ErrorStrictFn;
    unauthenticated: ErrorStrictFn;
    unauthorized: ErrorStrictFn;
  }
}
