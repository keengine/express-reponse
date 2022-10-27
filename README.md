# Express response

Send semantic response from your API with ease.

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

```js
// server.js
const express = require('express');

require('express-reponse-provider');

const app = express();

app.get('/all-ok', (req, res) => {
  req.sendSuccess('ok'); // responsd with 200, { "message": "Ok", "isError": false }
});

app.get('/not-ok', (req, res) => {
  res.sendError("This doesn't seem right", 500);
  // responsd with 500, { "message": "This doesn't seem right", "isError": true }
});

app.post('/bad-input', (req, res) => {
  res.sendBadInput('Invalid username or password.');
  // responsd with 400, { "message": "Invalid username or password.", "isError": true }
});

app.get('/unauthenticated', (req, res) => {
  res.sendUnauthenticated('You are not logged in.');
  // responsd with 401, { "message": "You are not logged in.", "isError": true }
});

app.get('/unauthenticated', (req, res) => {
  res.sendUnauthorised('You are not authorized to perform this action.');
  // responsd with 403, { "message": "You are not authorized to perform this action.", "isError": true }
});

app.get('/resource-moved-temporarily', (req, res) => {
  res.sendTemporaryRedirect('https://example.com/new-resouce-path');
  // responsd with 302, {}
  // Headers:
  //    - Location: https://example.com/new-resouce-path
});

app.get('/resource-moved-permamently', (req, res) => {
  res.sendTemporaryRedirect('https://example.com/new-resouce-path');
  // responsd with 301, {}
  // Headers:
  //    - Location: https://example.com/new-resouce-path
});

app.get('/*', (req, res) => {
  res.sendNotFound("Route doesn't exist.");
  // responsd with 404, { "message": "Route doesn't exist", "isError": true }
});

app.listen(3000, (err) =>
  err ? console.error(err) : console.log('> Listening at 3000'),
);
```

## API Reference

[`ReponseProvider`](./dist/ResponseProvider.d.ts)
