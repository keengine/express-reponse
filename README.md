# Clean Redux Reducer

Easy response create for express.

## Installation

NPM:
```
npm install express-reponse-provider
```

Yarn:
```
yarn add express-reponse-provider
```

## Usage

Use any one of the patterns below. Try not to mix and match.

### Middleware pattern

```js
const express = require('express');
const { withMiddleware } = require('express-reponse-provider');

const app = express();

app.use(withMiddlware());

app.get('/all-ok', (req, res) => {
	res.success('Ok');
	// responsd with 200, { "data": "Ok", "isError": false }
});

app.get('/not-ok', (req, res) => {
	res.badInput({ message: 'This doesn\'t seem right' });
	// responsd with 400, { "message": "This doesn't seem right", "isError": true }
});

app.get('/with-extra-info', (req, res) => {
	res.success({ hello: 'world!', token: '<token>' }, {
		message: 'Get hello world!',
		meta: {
			tokenLength: 7,
		},
	});
});

app.get('/with-unknown-error', (req, res) => {
	try {
		throw new Error('Oops');
	} catch (e) {
		res.error();
		// responsd with 500, { "message": "Something went wrong!", "isError": true }
	}
});

app.get('/with-unauthenticated-error', (req, res) => {
	try {
		throw new Error('Oops');
	} catch (e) {
		res.unauthenticated();
		// responsd with 500, { "message": "Couldn't validate the user", "isError": true }
	}
});

app.get('/with-unauthorised-error', (req, res) => {
	try {
		throw new Error('Oops');
	} catch (e) {
		res.unauthenticated();
		// responsd with 500, { "message": "Insufficient permission", "isError": true }
	}
});

app.listen(3000, (err) => err ? console.error(err) : console.log('> Listening at 3000'));

```

#### `withMiddleware`

Definition

```ts
interface Options {
  genericErrorMessage?: string;
  genericUnauthenticatedMessage?: string;
  genericUnauthorizedMessage?: string;
  genericBadInputMessage?: string;
}

export function withMiddleware(options: Options = {}) => (res: http.IncommingMessage, res: http.OutgoingResponse, next: (err?: Error) => void);
```


### Using classes

```js
// server.js
const express = require('express');
const ResponseProvider = require('express-reponse-provider');

const app = express();

app.get('/all-ok', (req, res) => {
	ResponseProvider
		.success('Ok')
		.writeTo(res);
	// responsd with 200, { "message": "Ok", "isError": false }
});

app.get('/not-ok', (req, res) => {
	ResponseProvider
		.error('This doesn\'t seem right', 400)
		.writeTo(res);
	// responsd with 400, { "message": "This doesn't seem right", "isError": true }
});

app.get('/with-extra-info', (req, res) => {
	ResponseProvider
		.success('Successfully logged in.')
		.addExtra({ token: '<token>' })
		.setMeta({ tokenLength: 16 })
		.writeTo(res);
	// responsd with
	// 200, {
		// "message": "Successfully logged in.",
		// "token": "<token>",
		// "isError": false,
		// "meta": { "tokenLength": 16 }
	// }
});

app.get('/with-unknown-error', (req, res) => {
	try {
		throw new Error('Oops');
	} catch (e) {
		ResponseProvider
			.genericError()
			.writeTo(res);
		// responsd with 500, { "message": "Uh! Something went wrong.", "isError": true }
	}
});

app.listen(3000, (err) => err ? console.error(err) : console.log('> Listening at 3000'));

```

## Class _ReponseProvider_

`constructor({ message?: string = '', statusCode?: number = 200  })`

### Properties

#### static GENERIC_ERROR_MSG

Message used by `genericError`.
*Default* "Uh! Something went wrong."

#### static UNAUTHORIZED_MSG

**Default** "Unauthorized"

Message used by `errorUnauthorized`.

### Methods

#### addExtra(extra: any): this

`extra` will be spread into response json.

#### setData(data): this

**Alias** `addExtra({ data })`

#### setMessage(message: string): this

**Alias** `setMessage({ message })`

#### setMeta(meta: any): this

**Alias** `setMeta({ meta })`

#### setStatusCode(statusCode: number): this

Set HTTP response code for the response

#### setHeaders({[key: string]: string }): this

Set multiple header

#### setHeader(name: string, value: string): this

Set single header

#### setCookie(name: string, value: string, options: Express.CookieOptins): this

Set cookie using express [`cookie`](https://expressjs.com/en/4x/api.html#res.cookie) method. Refer for list of options.

#### writeResponse(res: express.Response): void

**Alias** _pipe_, _writeTo_

Writes the set values to response using `res.json(...)` method.

#### _static_ success(message: string): new ResponseProvider({ message })

#### _static_ error(message: string, statusCode = 500): new ResponseProvider({ message, statusCode })

#### _static_ genericError(): ResponseProvider.error(ResponseProvider.GENERIC_ERROR_MSG)

#### _static_ errorUnauthorized(): ResponseProvider.error(ResponseProvider.UNAUTHORIZED_MSG)
