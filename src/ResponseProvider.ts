import { CookieOptions, ExpressResponse } from './types';
import { ReponseOptions } from './middleware';


class ReponseProvider {
	static GENERIC_ERROR_MSG = 'Uh! Something went wrong.';
	static UNAUTHORIZED_MSG = 'Unauthorized';

	static success(message) {
		return new ReponseProvider({ message });
	};

	static error(message, statusCode = 500) {
		return new ReponseProvider({ message, statusCode });
	};

	static genericError() {
		return ReponseProvider.error(ReponseProvider.GENERIC_ERROR_MSG);
	}

	static errorUnauthorized() {
		return ReponseProvider.error(ReponseProvider.UNAUTHORIZED_MSG, 401);
	}

	protected message: string;
	protected statusCode: number;
	protected extraPayload: any = {};
	protected headers: any = {};
	protected cookies: [string, string, CookieOptions?][] = [];

	constructor({ message = '', statusCode = 200 }: { message?: string, statusCode?: number }) {
		this.message = message;
		this.statusCode = statusCode;
	}

	addExtra(extra: any): this {
		this.extraPayload = {
			...this.extraPayload,
			...extra,
		};

		return this;
	}

	setData(data: any): this {
		this.addExtra({ data });
		return this;
	}

	setMessage(message: string): this {
		this.addExtra({ message });
		return this;
	}

	setMeta(meta: any): this {
		this.addExtra({ meta });
		return this;
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

	writeResponse(res: ExpressResponse) {
		const statusCode = this.statusCode;
		const isError = statusCode < 200 || statusCode > 399;
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
				...this.extraPayload,
			});
	}

	pipe = this.writeResponse;
	writeTo = this.writeResponse;
}

export default ReponseProvider;
