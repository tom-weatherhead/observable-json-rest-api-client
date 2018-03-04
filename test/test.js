const engine = require('..');

const url_u = 'http://localhost:3000/u/';
const url_u1 = url_u + '1';

const data = { "secret": "Wo ai ni!" };

const verbose = true;

engine.get('https://httpbin.org/get', verbose).subscribe(
//engine.get('https://httpbin.org/status/404').subscribe(
	result => {
		console.log('GET: Result:', result);
		// console.log('get JSON name:', result.jsonResponseBody.name);
		// console.log('get JSON typeof name:', typeof result.jsonResponseBody.name);
		// console.log('get JSON numUndergraduateStudents:', result.jsonResponseBody.numUndergraduateStudents);
		// console.log('get JSON typeof numUndergraduateStudents:', typeof result.jsonResponseBody.numUndergraduateStudents);
	},
	error => {
		console.error('GET: Error:', error);
	},
	() => {
		console.log('GET: Done.');
	}
);
/*
engine.get(url_u, verbose).subscribe(
	result => {
		console.log('get all result:', result);
		console.log('get all JSON:', result.jsonResponseBody);
		// console.log('get JSON name:', result.jsonResponseBody.name);
		// console.log('get JSON typeof name:', typeof result.jsonResponseBody.name);
		// console.log('get JSON numUndergraduateStudents:', result.jsonResponseBody.numUndergraduateStudents);
		// console.log('get JSON typeof numUndergraduateStudents:', typeof result.jsonResponseBody.numUndergraduateStudents);
	},
	error => {
		console.error('get all error:', error);
	},
	() => {
		console.log('get all: Done.');
	}
);

engine.get(url_u1, verbose).subscribe(
	result => {
		console.log('get one result:', result);
		console.log('get one JSON:', result.jsonResponseBody);
		console.log('get one JSON name:', result.jsonResponseBody.name);
		console.log('get one JSON typeof name:', typeof result.jsonResponseBody.name);
		console.log('get one JSON numUndergraduateStudents:', result.jsonResponseBody.numUndergraduateStudents);
		console.log('get one JSON typeof numUndergraduateStudents:', typeof result.jsonResponseBody.numUndergraduateStudents);
	},
	error => {
		console.error('get one error:', error);
	},
	() => {
		console.log('get one: Done.');
	}
);

engine.post(url_u, data, verbose).subscribe(
	result => {
		console.log('post result:', result);
	},
	error => {
		console.error('post error:', error);
	},
	() => {
		console.log('post: Done.');
	}
);

engine.put(url_u1, data, verbose).subscribe(
	result => {
		console.log('put result:', result);
	},
	error => {
		console.error('put error:', error);
	},
	() => {
		console.log('put: Done.');
	}
);

engine.delete(url_u1, verbose).subscribe(
	result => {
		console.log('delete result:', result);
	},
	error => {
		console.error('delete error:', error);
	},
	() => {
		console.log('delete: Done.');
	}
);
*/
