const engine = require('..');

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
