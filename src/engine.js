// observable-json-rest-api-client/src/engine.js

'use strict';

const url = require('url');
const Rx = require('rxjs/Rx');

function request (method, urlString, requestData = null, verbose = false) {
	return Rx.Observable.create(observer => {
		const parsedUrl = url.parse(urlString);
		const options = {
			protocol: parsedUrl.protocol,
			hostname: parsedUrl.hostname,
			port: parsedUrl.port,
			path: parsedUrl.path,
			method: method
		};
		let http;

		if (options.protocol === 'http:') {
			http = require('http');
		} else if (options.protocol === 'https:') {
			http = require('https');
		} else {
			observer.error(`Unsupported protocol: ${options.protocol}`);
		}

		const requestObject = http.request(options, response => {
			let rawResponseBody = '';

			if (verbose) {
				console.log(`HTTP response status: ${response.statusCode} ${response.statusMessage}`);
				console.log(`HTTP response headers: ${JSON.stringify(response.headers)}`);
			}

			response.setEncoding('utf8');	// Do we want to allow the caller to choose the encoding?

			response.on('data', chunk => {

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

		requestObject.on('error', error => {
			console.error(`HTTP request error: ${error.message || error}`);
			observer.error(error.message);
		});

		if (requestData !== null) {
			// Write data to the request body
			let requestDataString = JSON.stringify(requestData);

			requestObject.setHeader('Content-Type', 'application/json');
			requestObject.setHeader('Content-Length', Buffer.byteLength(requestDataString));
			requestObject.write(requestDataString);
		}

		requestObject.end();

		return () => {

			if (verbose) {
				console.log('request() : The End.');
			}
		};
	});
}

module.exports = {
	request: request,
	post: (urlString, requestData, verbose = false) => request('POST', urlString, requestData, verbose),
	get: (urlString, verbose = false) => request('GET', urlString, null, verbose),
	put: (urlString, requestData, verbose = false) => request('PUT', urlString, requestData, verbose),
	delete: (urlString, verbose = false) => request('DELETE', urlString, null, verbose)
};
