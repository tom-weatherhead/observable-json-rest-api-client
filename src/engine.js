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

				//if (method === 'GET') {

					try {
						result.jsonResponseBody = JSON.parse(rawResponseBody);

						if (verbose) {
							console.log('JSON parse succeeded.');
						}
					} catch (error) {
						result.jsonParseError = error;

						if (verbose) {
							console.log('JSON parse failed. Error:', error);
						}
					}
				//}

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

const postRaw = (urlString, requestData, verbose = false) => request('POST', urlString, requestData, verbose);
const getRaw = (urlString, verbose = false) => request('GET', urlString, null, verbose);
const putRaw = (urlString, requestData, verbose = false) => request('PUT', urlString, requestData, verbose);
const deleteRaw = (urlString, verbose = false) => request('DELETE', urlString, null, verbose);


const errorHandlerForJsonRequest = result => {
			
	if (result.statusCode >= 400) {
		return Rx.Observable.throw(`HTTP request error: ${result.statusCode} ${result.statusMessage}`);
	} else if (!result.jsonResponseBody) {
		return Rx.Observable.throw('HTTP request error: No JSON data in HTTP response body.');
	}
	
	return Rx.Observable.of(result.jsonResponseBody);
}

const post = (urlString, requestData, verbose = false) => postRaw(urlString, requestData, verbose).switchMap(errorHandlerForJsonRequest);
const get = (urlString, verbose = false) => getRaw(urlString, verbose).switchMap(errorHandlerForJsonRequest);
const put = (urlString, requestData, verbose = false) => putRaw(urlString, requestData, verbose).switchMap(errorHandlerForJsonRequest);
const _delete = (urlString, verbose = false) => deleteRaw(urlString, verbose).switchMap(errorHandlerForJsonRequest);

module.exports = {
	request: request,
	postRaw: postRaw,
	getRaw: getRaw,
	putRaw: putRaw,
	deleteRaw: deleteRaw,
	post: post,
	get: get,
	put: put,
	delete: _delete
};
