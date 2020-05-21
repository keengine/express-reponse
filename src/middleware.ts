import ResponseProvider from '.';

interface Options {
  genericErrorMessage?: string;
  genericUnauthenticatedMessage?: string;
  genericUnauthorizedMessage?: string;
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

const defaultGenericErrorMessage = 'Something went wrong!';
const defaultGenericUnauthenticatedMessage = 'Couldn\'t validate the user';
const defaultGenericUnauthorizedMessage = 'Insufficient permission';
const defaultGenericBadInputMessage = 'Invalid data provided';

export type SuccessFn = (data: any, options: SuccessResponseOptions) => void;
export type ErrorFn = (data: any, options: ErrorResponseOptions) => void;
export type ErrorStrictFn = (data: any, options: ErrorResponseOptionsStrict) => void;

export function withMiddleware(options: Options = {}) {
  return (req, res, next) => {
    const resp = ({ data, isError, statusCode, message, meta }: ReponseOptions = {}) => res.status(statusCode).json({
      data,
      meta,
      message,
      isError,
    });

    const success: SuccessFn = (
      data,
      {
        statusCode,
        message,
        meta,
      } = {
        message: 'Success',
        statusCode: 200,
      },
    ) => resp({
      data,
      message,
      meta,
      statusCode,
      isError: false,
    });

    const error: ErrorFn = (
      {
        statusCode = 500,
        message = options.genericErrorMessage ?? defaultGenericErrorMessage,
      } = {},
      data: any,
    ) => resp({
      data,
      message,
      statusCode,
      isError: true,
    });

    const badInput: ErrorStrictFn = (
      {
        message = options.genericBadInputMessage ?? defaultGenericBadInputMessage,
      } = {},
      data: any,
    ) => resp({
      data,
      message,
      statusCode: 400,
      isError: true,
    });

    const unauthenticated: ErrorStrictFn = (
      {
        message = options.genericUnauthenticatedMessage ?? defaultGenericUnauthenticatedMessage,
      } = {},
      data: any,
    ) => resp({
      data,
      message,
      statusCode: 401,
      isError: true,
    });

    const unauthorized: ErrorStrictFn = (
      {
        message = options.genericUnauthorizedMessage ?? defaultGenericUnauthorizedMessage,
      }: ErrorResponseOptions = {},
      data: any,
    ) => resp({
      data,
      message,
      statusCode: 403,
      isError: true,
    });

    res.success = success;
    res.error = error;
    res.badInput = badInput;
    res.unauthenticated = unauthenticated;
    res.unauthorized = unauthorized;

    next();
  };
}
