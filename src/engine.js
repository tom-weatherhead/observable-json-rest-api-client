// observable-json-rest-api-client/src/engine.js

'use strict';

const http = require('http');
const url = require('url');

const Rx = require('rxjs/Rx');

function getBody (url, options = {}) {
	const responseEncoding = options.responseEncoding || 'utf8';

	return new Promise((resolve, reject) => {
		let requestEngine;

		if (options.requestEngine) {
			requestEngine = options.requestEngine;
		} else if (/^http\:\/\//.test(url)) {
			requestEngine = require('http').get;
		} else if (/^https\:\/\//.test(url)) {
			requestEngine = require('https').get;
		} else {
			let error = new Error(`Unrecognized protocol in URL ${url}`);

			console.error(error.message);
			reject(error);
		}

		let requestObject = requestEngine(url, response => {
			// const { statusCode } = response;
			const statusCode = response.statusCode;
			const statusMessage = response.statusMessage;
			// const contentType = response.headers['content-type'];

			// console.log('Requested URL:', url);
			// console.log('Response status:', statusCode, statusMessage);
			// console.log('Response content type:', contentType);

			let error;

			if (statusCode !== 200) {
				error = new Error(`Request failed with HTTP status ${statusCode} ${statusMessage}`);
			// } else if (!/^application\/json/.test(contentType)) {
				// error = new Error('Invalid content-type.\n' +
				// `Expected application/json but received ${contentType}`);
			}

			if (error) {
				// error.httpHeaders = response.headers;
				error.httpStatusCode = statusCode;
				error.httpStatusMessage = statusMessage;
				// error.httpResponse = response;
				console.error(error.message);

				// Consume response data to free up memory
				response.resume();

				reject(error);
			}

			response.setEncoding(responseEncoding);

			let rawData = '';

			response.on('data', chunk => { rawData += chunk; });

			response.on('end', () => {
				resolve(rawData);
			});
		});

		if (requestObject.on) {
			requestObject.on('error', error => {
				console.error(`Got error: ${error.message}`);
				reject(error);
			});
		}
	});
}

function getBodyAsJSON (url, options = {}) {
	return getBody(url, options)
		.then(body => {

			try {
				const parsedData = JSON.parse(body);

				//console.log('getBodyAsJSON() : Type of parsed JSON data:', typeof parsedData);
				//console.log('getBodyAsJSON() : Parsed JSON data:', parsedData);

				return Promise.resolve(parsedData);
			} catch (error) {
				console.error('getBodyAsJSON() : JSON.parse() error:', error.message);

				return Promise.reject(error);
			}
		});
}

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

function request(method, urlString, requestData = null) {
	return Rx.Observable.create(observer => {
		let parsedUrl = url.parse(urlString);
		const options = {
		  protocol: parsedUrl.protocol,
		  hostname: parsedUrl.hostname,
		  port: parsedUrl.port,
		  path: parsedUrl.path,
		  method: method
		};

		// TODO:
		// const req = http.request(url, (res) => { });
		// req.setHeader('Content-Type', 'application/json');	// See https://nodejs.org/api/http.html#http_request_setheader_name_value
		// req.setHeader('Content-Length', Buffer.byteLength(putDataString);

		const req = http.request(options, (res) => {
		  console.log(`STATUS: ${res.statusCode} ${res.statusMessage}`);
		  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
		  res.setEncoding('utf8');
		  res.on('data', (chunk) => {
			console.log(`BODY: ${chunk}`);
		  });
		  res.on('end', () => {
			console.log('No more data in response.');
			let result = {
				statusCode: res.statusCode,
				statusMessage: res.statusMessage
				// , rawResponseBody: 
				// , jsonResponseBody: 
			};
			observer.next(result);
			observer.complete();
		  });
		});

		req.on('error', (e) => {
		  console.error(`problem with request: ${e.message}`);
		  observer.error(e.message);
		});

		if (requestData != null) {
			// write data to request body
			let requestDataString = JSON.stringify(requestData);

			req.setHeader('Content-Type', 'application/json');
			req.setHeader('Content-Length', Buffer.byteLength(requestDataString));
			req.write(requestDataString);
		}

		req.end();

		return () => {
			console.log('request() : The End.');
		};
	});
}

/*
function post(hostname, port, path, postData) {
	return Rx.Observable.create(observer => {
		let postDataString = JSON.stringify(postData);
		
		const options = {
		  hostname: hostname, //'www.google.com',
		  port: port, //80,
		  path: path, //'/upload',
		  method: 'POST',
		  headers: {
			//'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(postDataString)
		  }
		};

		// TODO:
		// const req = http.request(url, (res) => { });
		// req.setHeader('Content-Type', 'application/json');	// See https://nodejs.org/api/http.html#http_request_setheader_name_value
		// req.setHeader('Content-Length', Buffer.byteLength(putDataString);

		const req = http.request(options, (res) => {
		  console.log(`STATUS: ${res.statusCode} ${res.statusMessage}`);
		  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
		  res.setEncoding('utf8');
		  res.on('data', (chunk) => {
			console.log(`BODY: ${chunk}`);
		  });
		  res.on('end', () => {
			console.log('No more data in response.');
			observer.next({
				statusCode: res.statusCode,
				statusMessage: res.statusMessage
			});
			observer.complete();
		  });
		});

		req.on('error', (e) => {
		  console.error(`problem with request: ${e.message}`);
		  observer.error(e.message);
		});

		// write data to request body
		req.write(postDataString);
		req.end();

		return () => {
			console.log('post() : The End.');
		};
	});
}

function put(hostname, port, path, putData) {
	return Rx.Observable.create(observer => {
		let putDataString = JSON.stringify(putData);
		
		const options = {
		  hostname: hostname, //'www.google.com',
		  port: port, //80,
		  path: path, //'/upload',
		  method: 'PUT',
		  headers: {
			//'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(putDataString)
		  }
		};

		const req = http.request(options, (res) => {
		  console.log(`STATUS: ${res.statusCode} ${res.statusMessage}`);
		  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
		  res.setEncoding('utf8');
		  res.on('data', (chunk) => {
			console.log(`BODY: ${chunk}`);
		  });
		  res.on('end', () => {
			console.log('No more data in response.');
			observer.next({
				statusCode: res.statusCode,
				statusMessage: res.statusMessage
			});
			observer.complete();
		  });
		});

		req.on('error', (e) => {
		  console.error(`problem with request: ${e.message}`);
		  observer.error(e.message);
		});

		// write data to request body
		req.write(putDataString);
		req.end();

		return () => {
			console.log('put() : The End.');
		};
	});
}

function _delete(hostname, port, path) {
	return Rx.Observable.create(observer => {
		const options = {
		  hostname: hostname, //'www.google.com',
		  port: port, //80,
		  path: path, //'/upload',
		  method: 'DELETE'
		};

		const req = http.request(options, (res) => {
		  console.log(`STATUS: ${res.statusCode} ${res.statusMessage}`);
		  res.setEncoding('utf8');
		  res.on('data', (chunk) => {
			console.log(`BODY: ${chunk}`);
		  });
		  res.on('end', () => {
			console.log('No more data in response.');
			observer.next({
				statusCode: res.statusCode,
				statusMessage: res.statusMessage
			});
			observer.complete();
		  });
		});

		req.on('error', (e) => {
		  console.error(`problem with request: ${e.message}`);
		  observer.error(e.message);
		});

		req.end();

		return () => {
			console.log('delet() : The End.');
		};
	});
}
*/

/*
function observableTest1() {
	return Rx.Observable.create(observer => {
		console.log('observableTest1() : Begin');
		observer.next('Yay!');
		observer.complete();
		return () => {
			console.log('observableTest1() : The End.');
		};
	});
}

function observableTest2() {
	return Rx.Observable.create(observer => {
		console.log('observableTest2() : Begin');
		//Rx.Observable.throw(new Error('Boom!'));
		//Rx.Observable._throw('Boom!');
		observer.error('Boom!');	// See https://stackoverflow.com/questions/42247574/throw-error-inside-rxjs-observable
		return () => {
			console.log('observableTest2() : The End.');
		};
	});
}
*/

/*
// Reimplementations of this project's original functionality, using Observables rather than Promises

function getBodyObs (url, options = {}) {
	const responseEncoding = options.responseEncoding || 'utf8';

	//return new Promise((resolve, reject) => {
	return Rx.Observable.create(observer => {
		let requestEngine;

		if (options.requestEngine) {
			requestEngine = options.requestEngine;
		} else if (/^http\:\/\//.test(url)) {
			requestEngine = require('http').get;
		} else if (/^https\:\/\//.test(url)) {
			requestEngine = require('https').get;
		} else {
			let error = new Error(`Unrecognized protocol in URL ${url}`);

			console.error(error.message);
			//reject(error);

			//observer.error(error.message);
			observer.error(error);
		}

		let requestObject = requestEngine(url, response => {
			// const { statusCode } = response;
			const statusCode = response.statusCode;
			const statusMessage = response.statusMessage;
			// const contentType = response.headers['content-type'];

			// console.log('Requested URL:', url);
			// console.log('Response status:', statusCode, statusMessage);
			// console.log('Response content type:', contentType);

			let error;

			if (statusCode !== 200) {
				error = new Error(`Request failed with HTTP status ${statusCode} ${statusMessage}`);
			// } else if (!/^application\/json/.test(contentType)) {
				// error = new Error('Invalid content-type.\n' +
				// `Expected application/json but received ${contentType}`);
			}

			if (error) {
				// error.httpHeaders = response.headers;
				error.httpStatusCode = statusCode;
				error.httpStatusMessage = statusMessage;
				// error.httpResponse = response;
				console.error(error.message);

				// Consume response data to free up memory
				response.resume();

				//reject(error);
				observer.error(error);
			}

			response.setEncoding(responseEncoding);

			let rawData = '';

			response.on('data', chunk => { rawData += chunk; });

			response.on('end', () => {
				//resolve(rawData);
				observer.next(rawData);
				observer.complete();
			});
		});

		if (requestObject.on) {
			requestObject.on('error', error => {
				console.error(`Got error: ${error.message}`);
				//reject(error);
				observer.error(error);
			});
		}

		return () => {
			console.log('getBodyObs() : The End.');
		};
	});
}

function getBodyAsJSONObs (url, options = {}) {
	return getBodyObs(url, options)
		.switchMap(body => {

			try {
				const parsedData = JSON.parse(body);

				//console.log('getBodyAsJSON() : Type of parsed JSON data:', typeof parsedData);
				//console.log('getBodyAsJSON() : Parsed JSON data:', parsedData);

				//return Rx.Observable.throw(new Error('Boom!'));	// No.
				//return Rx.Observable.throw('Boom 2!');			// Yes!
				return Rx.Observable.of(parsedData);
			} catch (error) {
				console.error('getBodyAsJSON() : JSON.parse() error:', error.message);

				return Rx.Observable.throw(error.message);
			}
		});
}

// TODO: Support multiple matches and multiple captures per match? Enable this via options; e.g. :
// options.globalRegex (or read this flag from the regex itself) -> If true, then return an array of "capture results"; if false, return a single "capture result".
// options.multipleCaptures (or read this flag from the regex itself?) -> If true, each "capture result" is an array; if false, each "capture result" is a string.

function matchRegexObs (url, regex, options = {}) {
	return getBodyObs(url, options)
		.switchMap(body => {
			const indexOfCaptureGroup = 1;
			let match = regex.exec(body);

			if (match !== null && match.length > indexOfCaptureGroup) {
				return Rx.Observable.of(match[indexOfCaptureGroup]);
			} else {
				let errorMessage = 'matchRegex failed.';

				console.error(errorMessage);

				//return Promise.reject(new Error(errorMessage));
				return Rx.Observable.throw(errorMessage);
			}
		});
}
*/

module.exports = {
	getBody: getBody,
	getBodyAsJSON: getBodyAsJSON,
	request: request,
	post: (urlString, requestData) => request('POST', urlString, requestData),
	put: (urlString, requestData) => request('PUT', urlString, requestData),
	delete: urlString => request('DELETE', urlString)
};
