const engine = require('..');

engine.get('https://httpbin.org/get').subscribe(
	result => {
		console.log('GET: result:', result);
	},
	error => {
		console.error('GET: Error:', error);
	},
	() => {
		console.log('GET: Done.');
	}
);

engine.get('https://httpbin.org/uuid').subscribe(
	result => {
		console.log('GET: result:', result);
		console.log('GET: UUID:', result.uuid);
		console.log('GET: typeof UUID:', typeof result.uuid);
	},
	error => {
		console.error('GET: Error:', error);
	},
	() => {
		console.log('GET: Done.');
	}
);
