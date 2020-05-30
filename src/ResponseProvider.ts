import { CookieOptions, ExpressResponse } from './types';
import { MessageProvider } from './MessageProvider';


class ReponseProvider {
	static GENERIC_ERROR_MSG = 'Uh! Something went wrong.';
	static UNAUTHORIZED_MSG = 'Unauthorized';

	protected message: string;
	protected statusCode: number;
	protected isError: boolean;
	protected payload: any = {};
	protected headers: any = {};
	protected cookies: [string, string, CookieOptions?][] = [];
	private res: ExpressResponse;

	constructor(res?: ExpressResponse, options: { autoSendOnNextTick?: boolean } = {}) {
		if (!(this instanceof ReponseProvider)) {
			return new ReponseProvider(res);
		}

		this.res = res;

		const { autoSendOnNextTick = true } = options;

		if (res && autoSendOnNextTick) {
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

	setStatusCode(code): this {
		this.statusCode = code;
		return this;
	}

	setHeaders(headers): this {
		this.headers = {
			...this.headers,
			...headers,
		};
		return this;
	}

	setHeader(name: string, value: string): this {
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

	send(res?: ExpressResponse) {
		process.nextTick(() => {
			this.sendNextTick(res);
		});
		return this;
	}

	private sendNextTick(res: ExpressResponse = this.res) {
		const statusCode = this.statusCode;
		const isError = this.isError === undefined ? statusCode < 200 || statusCode > 399 : this.isError;
		if (Object.keys(this.headers).length > 0) {
			res.set(this.headers);
		}
		if (this.cookies.length > 0) {
			this.cookies.forEach(([name, value, options]) => res.cookie(name, value, options));
		}
		res
			.status(statusCode || 200)
			.json({
				message: this.message || undefined,
				isError,
				...this.payload,
			});
	}

	pipe = this.send;
	writeTo = this.send;

	public success = this.setMessage;
	public error(message: string = MessageProvider.defaultGenericErrorMessage, statusCode = 500) {
		return this.setMessage(message).setStatusCode(statusCode);
	}
	public unauthenticated(message: string = MessageProvider.defaultGenericUnauthenticatedMessage) {
		return this.setMessage(message).setStatusCode(401);
	}
	public unauthorized(message: string = MessageProvider.defaultGenericUnauthorizedMessage) {
		return this.setMessage(message).setStatusCode(403);
	}
	public badInput(message: string = MessageProvider.defaultGenericBadInputMessage) {
		return this.setMessage(message).setStatusCode(400);
	}
	public notFound(message: string = MessageProvider.defaultGenericNotFoundMessage) {
		return this.setMessage(message).setStatusCode(404);
	}
}

export default ReponseProvider;

