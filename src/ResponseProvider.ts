import { CookieOptions, Response } from 'express';

export class ReponseProvider {
  protected message: string = '';
  protected statusCode: number = 200;
  protected isError?: boolean;
  protected payload: any = {};
  protected headers: any = {};
  protected cookies: [string, string, CookieOptions?][] = [];
  private response: Response;

  constructor(
    response: Response,
    options: { autoSendOnNextTick?: boolean } = { autoSendOnNextTick: true },
  ) {
    this.response = response;

    const { autoSendOnNextTick = true } = options;

    if (response && autoSendOnNextTick) {
      process.nextTick(() => this.send());
    }
  }

  private addExtra(extra: any): this {
    this.payload = {
      ...this.payload,
      ...extra,
    };

    return this;
  }

  setData(data: any): this {
    return this.addExtra({ data });
  }

  setMessage(message: string): this {
    return this.addExtra({ message });
  }

  setMeta(meta: any): this {
    return this.addExtra({ meta });
  }

  setStatusCode(code: number): this {
    this.statusCode = code;
    return this;
  }

  setHeaders(headers: Record<string, string | string[]>): this {
    this.headers = {
      ...this.headers,
      ...headers,
    };
    return this;
  }

  setHeader(name: string, value: string): this {
    console.log('setHeaders');
    return this.setHeaders({ [name]: value });
  }

  setCookie(name: string, value: string, options?: CookieOptions): this {
    this.cookies.push([name, value, options]);
    return this;
  }

  setIsError(isError: boolean): this {
    this.isError = isError;
    return this;
  }

  markError(): this {
    return this.setIsError(true);
  }

  send() {
    console.log('send');
    process.nextTick(() => {
      this.sendNextTick();
    });
    return this;
  }

  private sendNextTick() {
    console.log('sendNextTick');
    const statusCode = this.statusCode;
    const isError =
      this.isError === undefined
        ? statusCode < 200 || statusCode > 299
        : this.isError;
    if (Object.keys(this.headers).length > 0) {
      this.response.set(this.headers);
    }
    if (this.cookies.length > 0) {
      this.cookies.forEach(([name, value, options]) =>
        this.response.cookie(name, value, options as any),
      );
    }
    this.response.status(statusCode);

    if (statusCode > 200 && statusCode < 400) {
      this.response.send();
    } else {
      this.response.json({
        message: this.message || undefined,
        isError,
        ...this.payload,
      });
    }
  }
}
