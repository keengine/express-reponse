import { Response } from 'express';
import { ServerResponse } from 'http';
import { ReponseProvider } from './ResponseProvider';

function sendSuccess(this: Response, data: any) {
  return new ReponseProvider(this).setData(data);
}

function sendError(this: Response, message: string, statusCode = 500) {
  return new ReponseProvider(this)
    .setMessage(message)
    .setStatusCode(statusCode);
}

function sendBadInput(this: Response, message: string) {
  return new ReponseProvider(this).setStatusCode(400).setMessage(message);
}

function sendUnauthenticated(this: Response, message: string) {
  return new ReponseProvider(this).setMessage(message).setStatusCode(401);
}

function sendUnauthorised(this: Response, message: string) {
  return new ReponseProvider(this).setMessage(message).setStatusCode(403);
}

function sendNotFound(this: Response, message: string) {
  return new ReponseProvider(this).setMessage(message).setStatusCode(404);
}

function sendPermamentRedirect(this: Response, location: string) {
  return new ReponseProvider(this)
    .setHeader('Location', location)
    .setStatusCode(301);
}

function sendTemporaryRedirect(this: Response, location: string) {
  return new ReponseProvider(this)
    .setHeader('Location', location)
    .setStatusCode(302);
}

(ServerResponse.prototype as unknown as Response).sendSuccess = sendSuccess;
(ServerResponse.prototype as unknown as Response).sendError = sendError;
(ServerResponse.prototype as unknown as Response).sendBadInput = sendBadInput;
(ServerResponse.prototype as unknown as Response).sendUnauthenticated =
  sendUnauthenticated;
(ServerResponse.prototype as unknown as Response).sendUnauthorised =
  sendUnauthorised;
(ServerResponse.prototype as unknown as Response).sendNotFound = sendNotFound;
(ServerResponse.prototype as unknown as Response).sendPermamentRedirect =
  sendPermamentRedirect;
(ServerResponse.prototype as unknown as Response).sendTemporaryRedirect =
  sendTemporaryRedirect;

export type SendSuccess = typeof sendSuccess;
export type SendError = typeof sendError;
export type SendBadInput = typeof sendBadInput;
export type SendUnauthenticated = typeof sendUnauthenticated;
export type SendUnauthorised = typeof sendUnauthorised;
export type SendNotFound = typeof sendNotFound;
export type SendTemporaryRedirect = typeof sendTemporaryRedirect;
export type SendPermamentRedirect = typeof sendPermamentRedirect;

export * from '../@types/express.d';
export { ReponseProvider } from './ResponseProvider';
