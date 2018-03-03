// observable-json-rest-api-client/src/engine.js

'use strict';

const http = require('http');
const url = require('url');

const Rx = require('rxjs/Rx');

/*
 * From https://nodejs.org/api/http.html (Node.js version 9.6.1) :
 
options can be an object, a string, or a URL object. If options is a string, it is automatically parsed with url.parse(). If it is a URL object, it will be automatically converted to an ordinary options object.

The optional callback parameter will be added as a one-time listener for the 'response' event.

http.request() returns an instance of the http.ClientRequest class. The ClientRequest instance is a writable stream. If one needs to upload a file with a POST request, then write to the ClientRequest object.

Example:

const postData = querystring.stringify({
  'msg': 'Hello World!'
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// write data to request body
req.write(postData);
req.end();

Note that in the example req.end() was called. With http.request() one must always call req.end() to signify the end of the request - even if there is no data being written to the request body.

If any error is encountered during the request (be that with DNS resolution, TCP level errors, or actual HTTP parse errors) an 'error' event is emitted on the returned request object. As with all 'error' events, if no listeners are registered the error will be thrown.

There are a few special headers that should be noted.

    Sending a 'Connection: keep-alive' will notify Node.js that the connection to the server should be persisted until the next request.

    Sending a 'Content-Length' header will disable the default chunked encoding.

    Sending an 'Expect' header will immediately send the request headers. Usually, when sending 'Expect: 100-continue', both a timeout and a listener for the continue event should be set. See RFC2616 Section 8.2.3 for more information.

    Sending an Authorization header will override using the auth option to compute basic authentication.

 */

function request(method, urlString, requestData = null, verbose = false) {
	return Rx.Observable.create(observer => {
		const parsedUrl = url.parse(urlString);
		const options = {
			protocol: parsedUrl.protocol,
			hostname: parsedUrl.hostname,
			port: parsedUrl.port,
			path: parsedUrl.path,
			method: method
		};

		const request = http.request(options, response => {
			let rawResponseBody = '';

			if (verbose) {
				console.log(`HTTP response status: ${response.statusCode} ${response.statusMessage}`);
				console.log(`HTTP response headers: ${JSON.stringify(response.headers)}`);
			}

			response.setEncoding('utf8');	// Do we want to allow the caller to choose the encoding?

			response.on('data', (chunk) => {

				if (verbose) {
					console.log(`HTTP response body chunk: ${chunk}`);
				}

				rawResponseBody += chunk;
			});

			response.on('end', () => {
				let result = {
					statusCode: response.statusCode,
					statusMessage: response.statusMessage,
					rawResponseBody: rawResponseBody
				};

				if (verbose) {
					console.log('No more data in the response.');
				}

				if (method === 'GET') {

					try {
						result.jsonResponseBody = JSON.parse(rawResponseBody);
					} catch (error) {
						result.jsonParseError = error;
					}
				}

				if (verbose) {
					console.log('Sending result:', result.statusCode, result.statusMessage);
					console.log('rawResponseBody', result.rawResponseBody);
					console.log('jsonResponseBody', result.jsonResponseBody);
				}

				observer.next(result);
				observer.complete();
			});
		});

		request.on('error', error => {
			console.error(`HTTP request error: ${error.message || error}`);
			observer.error(error.message);
		});

		if (requestData != null) {
			// Write data to the request body
			let requestDataString = JSON.stringify(requestData);

			request.setHeader('Content-Type', 'application/json');
			request.setHeader('Content-Length', Buffer.byteLength(requestDataString));
			request.write(requestDataString);
		}

		request.end();

		return () => {

			if (verbose) {
				console.log('request() : The End.');
			}
		};
	});
}

module.exports = {
	request: request,
	get: (urlString, verbose = false) => request('GET', urlString, null, verbose),
	post: (urlString, requestData, verbose = false) => request('POST', urlString, requestData, verbose),
	put: (urlString, requestData, verbose = false) => request('PUT', urlString, requestData, verbose),
	delete: (urlString, verbose = false) => request('DELETE', urlString, null, verbose)
};
