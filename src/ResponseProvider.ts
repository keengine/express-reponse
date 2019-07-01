import { JsonValue } from './types';

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

	constructor({ message = '', statusCode = 200 }: { message?: string, statusCode?: number }) {
		this.message = message;
		this.statusCode = statusCode;
	}

	addExtra(extra: any) {
		this.extraPayload = {
			...this.extraPayload,
			...extra,
		};

		return this;
	}

	setData(data: any) {
		this.addExtra({ data });
		return this;
	}

	setMessage(message: string) {
		this.addExtra({ message });
		return this;
	}

	setMeta(meta: any) {
		this.addExtra({ meta });
		return this;
	}

	setStatusCode(code) {
		this.statusCode = code;
		return this;
	}

	writeResponse(res) {
		const statusCode = this.statusCode;
		const isError = statusCode < 200 || statusCode > 399;
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
