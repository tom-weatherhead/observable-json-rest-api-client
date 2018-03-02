let engine = require('..');

let hostname = 'localhost';
let port = 3000;
let path1 = '/u/';
let path2 = '/u/1';
let data = { "secret": "Wo ai ni!" };

//engine.post(hostname, port, path1, data);
//engine.put(hostname, port, path2, data);
//engine.delete(hostname, port, path2, data);

//engine.post(hostname, port, path1, data).subscribe(
engine.post('http://localhost:3000/u/', data).subscribe(
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

//engine.put(hostname, port, path2, data).subscribe(
engine.put('http://localhost:3000/u/1', data).subscribe(
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

//engine.delete(hostname, port, path2).subscribe(
engine.delete('http://localhost:3000/u/1', data).subscribe(
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

/*
engine.observableTest1().subscribe(
	result => {
		console.log('observableTest1 result:', result);
	},
	error => {
		console.error('observableTest1 error:', error);
	},
	() => {
		console.log('observableTest1: Done.');
	}
);

engine.observableTest2().subscribe(
	result => {
		console.log('observableTest2 result:', result);
	},
	error => {
		console.error('observableTest2 error:', error);
	},
	() => {
		console.log('observableTest2: Done.');
	}
);
*/

/*
let url = 'https://www.google.ca';
//let urlJson = 'http://nodejs.org/dist/index.json';
let urlJson = 'https://httpbin.org/uuid';
let urlRegex = 'https://nodejs.org/en/';
let regex = /Download v{0,1}(\S+)\s+Current/;

engine.getBodyObs(url).subscribe(
	result => {
		console.log('getBodyObs succeeded.');
		//console.log('getBodyObs result:', result);
	},
	error => {
		console.error('getBodyObs error:', error);
	},
	() => {
		console.log('getBodyObs: Done.');
	}
);

engine.getBodyAsJSONObs(urlJson).subscribe(
	result => {
		console.log('getBodyAsJSONObs result:', result);
	},
	error => {
		console.error('getBodyAsJSONObs error:', error);
	},
	() => {
		console.log('getBodyAsJSONObs: Done.');
	}
);

engine.matchRegexObs(urlRegex, regex).subscribe(
	result => {
		console.log('matchRegexObs result:', result);
	},
	error => {
		console.error('matchRegexObs error:', error);
	},
	() => {
		console.log('matchRegexObs: Done.');
	}
);
*/
