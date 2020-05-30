import ResponseProvider from '.';
import ReponseProvider from './ResponseProvider';
import { MessageProvider } from './MessageProvider';

interface Options {
  genericErrorMessage?: string;
  genericUnauthenticatedMessage?: string;
  genericUnauthorizedMessage?: string;
  genericNotFoundMessage?: string;
  genericBadInputMessage?: string;
}

export interface ReponseOptions {
  data?: any;
  isError?: boolean;
  statusCode?: number;
  message?: any;
  meta?: any;
}

type SuccessResponseOptions = Exclude<ReponseOptions, 'isError' | 'data'>;
type ErrorResponseOptions = Exclude<ReponseOptions, 'isError' | 'message'>;
type ErrorResponseOptionsStrict = Exclude<ErrorResponseOptions, 'statusCode'>;

export type SuccessFn = (data: any, options: SuccessResponseOptions) => void;
export type ErrorFn = (message?: string, options?: ErrorResponseOptions) => void;
export type ErrorStrictFn = (message?: string, options?: ErrorResponseOptionsStrict) => void;

export function withMiddleware(options: Options = {}) {
  const messageProvider = new MessageProvider(options);
  const resposnder = new ReponseProvider();

  return (req, res, next) => {
    const success: SuccessFn = (
      data,
      {
        message,
        meta,
        statusCode = 200,
      } = {
        message: 'Success',
      },
    ) => resposnder
    .reset()
    .setMessage(message)
    .setData(data)
    .setMeta(meta)
    .setStatusCode(statusCode)
    .send(res);

    const error: ErrorFn = (
      message = messageProvider.genericErrorMessage,
      {
        statusCode = 500,
        data,
        meta,
      } = {},
    ) => resposnder
    .reset()
    .setData(data)
    .setMeta(meta)
    .error(message, statusCode)
    .send(res);

    const badInput: ErrorStrictFn = (
      message = messageProvider.genericBadInputMessage,
      {
        data,
        meta,
      } = {},
    ) => resposnder
    .reset()
    .setData(data)
    .setMeta(meta)
    .badInput(message)
    .send(res);

    const unauthenticated: ErrorStrictFn = (
      message = messageProvider.genericUnauthenticatedMessage,
      {
        data,
        meta,
      } = {},
    ) => resposnder
    .reset()
    .setData(data)
    .setMeta(meta)
    .unauthenticated(message)
    .send(res);

    const unauthorized: ErrorStrictFn = (
      message = messageProvider.genericUnauthorizedMessage,
      {
        data,
        meta,
      } = {}
    ) => resposnder
    .reset()
    .setData(data)
    .setMeta(meta)
    .unauthorized(message)
    .send(res);

    const notFound: ErrorStrictFn = (
      message = messageProvider.genericNotFoundMessage,
      {
        data,
        meta,
      } = {}
    ) => resposnder
    .reset()
    .setData(data)
    .setMeta(meta)
    .notFound(message)
    .send(res);

    res.success = success;
    res.error = error;
    res.badInput = badInput;
    res.unauthenticated = unauthenticated;
    res.unauthorized = unauthorized;
    res.notFound = notFound;

    next();
  };
}
