# Clean Redux Reducer

Easy response create for express.

## Installation

NPM:
```
npm install @keengine/express-reponse
```

Yarn:
```
yarn add @keengine/express-reponse
```

## Usage

```js
// server.js
const express = require('express');
const ResponseProvider = require('@keengine/express-reponse');

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

## _Class_ ReponseProvider

`_constructor_({ message?: string = '', statusCode?: number = 200  })`

### Properties

#### static GENERIC_ERROR_MSG

Message used by `genericError`.
_Default_ "Uh! Something went wrong."

#### static UNAUTHORIZED_MSG

Message used by `errorUnauthorized`.
_Default_ "Unauthorized"

### Methods

#### addExtra(extra: any): this

`extra` will be spread into response json.

#### setData(data): this

_Alias_ `addExtra({ data })`

#### setMessage(message: string): this

_Alias_ `setMessage({ message })`

#### setMeta(meta: any): this

_Alias_ `setMeta({ meta })`

#### setStatusCode(statusCode: number): this

Set HTTP response code for the response

#### writeResponse(res: express.Response): void

_Alias_ pipe, writeTo

Writes the set values to response using `res.json(...)` method.

#### _static_ success(message: string): new ResponseProvider({ message })

#### _static_ error(message: string, statusCode = 500): new ResponseProvider({ message, statusCode })

#### _static_ genericError(): ResponseProvider.error(ResponseProvider.GENERIC_ERROR_MSG)

#### _static_ errorUnauthorized(): ResponseProvider.error(ResponseProvider.UNAUTHORIZED_MSG)
