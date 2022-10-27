import type {
  SendBadInput,
  SendError,
  SendNotFound,
  SendPermamentRedirect,
  SendSuccess,
  SendTemporaryRedirect,
  SendUnauthenticated,
  SendUnauthorised,
} from '../src/index';

declare global {
  export namespace Express {
    interface Response {
      sendError: SendError;
      sendBadInput: SendBadInput;
      sendNotFound: SendNotFound;
      sendPermamentRedirect: SendPermamentRedirect;
      sendSuccess: SendSuccess;
      sendTemporaryRedirect: SendTemporaryRedirect;
      sendUnauthenticated: SendUnauthenticated;
      sendUnauthorised: SendUnauthorised;
    }
  }
}
