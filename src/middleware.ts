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
type ErrorResponseOptions = Exclude<ReponseOptions, 'isError' | 'data'>;
type ErrorResponseOptionsStrict = Exclude<ReponseOptions, 'isError' | 'data' | 'statusCode'>;

export type SuccessFn = (data: any, options: SuccessResponseOptions) => void;
export type ErrorFn = (data: any, options: ErrorResponseOptions) => void;
export type ErrorStrictFn = (data: any, options: ErrorResponseOptionsStrict) => void;

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
      .setData(data)
      .setMessage(message)
      .setMeta(meta)
      .setStatusCode(statusCode)
      .send(res);

    const error: ErrorFn = (
      {
        statusCode = 500,
        message = messageProvider.genericErrorMessage,
      } = {},
      data?: any,
    ) => new ResponseProvider(res)
    .setData(data)
    .error(message, statusCode);

    const badInput: ErrorStrictFn = (
      message = messageProvider.genericBadInputMessage,
      data?: any,
    ) => new ResponseProvider(res)
      .setData(data)
      .badInput(message);

    const unauthenticated: ErrorStrictFn = (
      message = messageProvider.genericUnauthenticatedMessage,
      data?: any,
    ) => new ResponseProvider(res)
      .setData(data)
      .unauthenticated(message);

    const unauthorized: ErrorStrictFn = (
      message = messageProvider.genericUnauthorizedMessage,
      data?: any,
    ) => new ResponseProvider(res)
      .setData(data)
      .unauthorized(message);

    const notFound: ErrorStrictFn = (
      message = messageProvider.genericNotFoundMessage,
      data?: any,
    ) => new ResponseProvider(res)
    .setData(data)
    .notFound(message);

    res.success = success;
    res.error = error;
    res.badInput = badInput;
    res.unauthenticated = unauthenticated;
    res.unauthorized = unauthorized;
    res.notFound = notFound;

    next();
  };
}
