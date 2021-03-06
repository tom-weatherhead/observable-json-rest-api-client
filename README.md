# observable-json-rest-api-client
Send HTTP requests to JSON REST Web services; receive responses as RxJS Observables.

[![Build Status](https://secure.travis-ci.org/tom-weatherhead/common-utilities.js.svg)](https://travis-ci.org/tom-weatherhead/common-utilities.js)
[![npm](https://img.shields.io/npm/v/observable-json-rest-api-client.svg)](https://www.npmjs.com/package/observable-json-rest-api-client)
[![npm](https://img.shields.io/npm/dt/observable-json-rest-api-client.svg)](https://www.npmjs.com/package/observable-json-rest-api-client)
[![Maintainability](https://api.codeclimate.com/v1/badges/38e9a99ce18dbc61ab63/maintainability)](https://codeclimate.com/github/tom-weatherhead/common-utilities.js/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/tom-weatherhead/common-utilities.js/badge.svg?targetFile=package.json&package-lock.json)](https://snyk.io/test/github/tom-weatherhead/common-utilities.js?targetFile=package.json&package-lock.json)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/tom-weatherhead/observable-json-rest-api-client/blob/master/LICENSE)

This package can send HTTP requests of type POST, GET, PUT, and DELETE; these types correspond to the CRUD operations (create, read, update, and delete) of a REST Web service. Any data sent is JSON, and attempts are made to parse any data received as JSON.

This package's API is:

```
	request(httpMethod, urlString, requestData, verbose = false)
	post(urlString, requestData, verbose = false)
	get(urlString, verbose = false)
	put(urlString, requestData, verbose = false)
	delete(urlString, verbose = false)
```

post(), get(), put(), and delete() are merely convenience functions that call request() with a specific httpMethod.

Each function returns an [RxJS Observable](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html) that yields an object with the following fields:

- statusCode : The HTTP status code from the response from the server
- statusMessage : The HTTP status message from the response from the server
- rawResponseBody : The raw body from the response from the server
- jsonResponseBody : The body from the response from the server after it has been parsed as JSON. This field is only present if the response body was successfully parsed as JSON.
- jsonParseError : The error, if any, that was encountered during the parsing of the response body as JSON.

Example 1: POST:

```js
const engine = require('observable-json-rest-api-client');

const postData = {
	field1: 'abc',
	field2: 123
};

engine.post('https://httpbin.org/post', postData).subscribe(
	result => {
		console.log('POST: Result:', result);
		console.log('POST: Response body as JSON:', result.jsonResponseBody);
		console.log('POST: Posted data:', result.jsonResponseBody.data);
	},
	error => {
		console.error('POST: Error:', error);
	},
	() => {
		console.log('POST: Done.');
	}
);
```

Example 2: GET:

```js
const engine = require('observable-json-rest-api-client');

engine.get('https://httpbin.org/uuid').subscribe(
	result => {
		console.log('GET: result:', result);
		console.log(`GET: HTTP response status: ${result.statusCode} ${result.statusMessage}`);
		console.log('GET: Response body as JSON:', result.jsonResponseBody);
		console.log('GET: UUID:', result.jsonResponseBody.uuid);
		console.log('GET: typeof UUID:', typeof result.jsonResponseBody.uuid);
	},
	error => {
		console.error('GET: Error:', error);
	},
	() => {
		console.log('GET: Done.');
	}
);
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
