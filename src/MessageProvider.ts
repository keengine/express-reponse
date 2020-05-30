export class MessageProvider {
  public static defaultGenericErrorMessage: string = 'Something went wrong!';
  public static defaultGenericNotFoundMessage: string = 'Not found';
  public static defaultGenericBadInputMessage: string = 'Invalid data provided';
  public static defaultGenericUnauthorizedMessage: string = 'Insufficient permission';
  public static defaultGenericUnauthenticatedMessage: string = 'Couldn\'t validate the user';
  private _genericErrorMessage: string;
  private _genericNotFoundMessage: string;
  private _genericBadInputMessage: string;
  private _genericUnauthorizedMessage: string;
  private _genericUnauthenticatedMessage: string;

  constructor({
    genericErrorMessage,
    genericNotFoundMessage,
    genericBadInputMessage,
    genericUnauthorizedMessage,
    genericUnauthenticatedMessage,
  }: {
    genericErrorMessage?: string;
    genericNotFoundMessage?: string;
    genericBadInputMessage?: string;
    genericUnauthorizedMessage?: string;
    genericUnauthenticatedMessage?: string;
  }) {
    this._genericErrorMessage = genericErrorMessage;
    this._genericBadInputMessage = genericBadInputMessage;
    this._genericNotFoundMessage = genericNotFoundMessage;
    this._genericUnauthorizedMessage = genericUnauthorizedMessage;
    this._genericUnauthenticatedMessage = genericUnauthenticatedMessage;
  };

  get genericErrorMessage() { return this._genericErrorMessage ?? MessageProvider.defaultGenericErrorMessage };
  get genericBadInputMessage() { return this._genericBadInputMessage ?? MessageProvider.defaultGenericBadInputMessage };
  get genericNotFoundMessage() { return this._genericNotFoundMessage ?? MessageProvider.defaultGenericNotFoundMessage };
  get genericUnauthorizedMessage() { return this._genericUnauthorizedMessage ?? MessageProvider.defaultGenericUnauthorizedMessage };
  get genericUnauthenticatedMessage() { return this._genericUnauthenticatedMessage ?? MessageProvider.defaultGenericUnauthenticatedMessage };
}