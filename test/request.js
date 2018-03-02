let engine = require('..');

let url = 'http://localhost:3000/u/';
let method = 'POST';
let data = { "secret": "Wo ai ni!" };

engine.request(method, url, data).subscribe(
	result => {
		console.log('request result:', result);
	},
	error => {
		console.error('request error:', error);
	},
	() => {
		console.log('request: Done.');
	}
);
