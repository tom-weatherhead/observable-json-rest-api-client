const engine = require('..');

const data = {
	field1: 'abc',
	field2: 123
};

engine.post('https://httpbin.org/post', data).subscribe(
	result => {
		console.log('POST: Result:', result);
		//console.log('POST: Response body as JSON:', result.jsonResponseBody);
		//console.log('POST: Posted data:', result.jsonResponseBody.data);
		console.log('POST: Posted data:', result.data);
	},
	error => {
		console.error('POST: Error:', error);
	},
	() => {
		console.log('POST: Done.');
	}
);
