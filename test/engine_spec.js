// observable-json-rest-api-client/test/engine_spec.js

'use strict';

const engine = require('..');

const chai = require('chai');
const expect = chai.expect;

describe('App', function () {
	this.timeout(10000);

	const data = {
		field1: 'abc',
		field2: 123
	};

	it('Rocks!', function (done) {
		engine.post('https://httpbin.org/post', data)
			.subscribe(
				result => {
					console.log('POST: Result is', result);
					expect(result).to.be.not.null;						// eslint-disable-line no-unused-expressions
					expect(result.url).to.equal('https://httpbin.org/post');
					expect(result.json.field1).to.equal('abc');
					expect(result.json.field2).to.equal(123);
					done();
				}, error => {
					// expect(null).to.be.not.null;						// eslint-disable-line no-unused-expressions
					done();
				}
			);
	});

	it('Rocks!', function (done) {
		engine.get('https://httpbin.org/get')
			.subscribe(
				result => {
					console.log('GET: Result is', result);
					expect(result).to.be.not.null;						// eslint-disable-line no-unused-expressions
					expect(result.url).to.equal('https://httpbin.org/get');
					done();
				}, error => {
					console.error('GET test: Error is', error);
					// expect(null).to.be.not.null;						// eslint-disable-line no-unused-expressions
					done();
				}
			);
	});

	it('Rocks!', function (done) {
		engine.get('https://httpbin.org/status/404')
			.subscribe(
				_ => {
					expect(null).to.be.not.null;						// eslint-disable-line no-unused-expressions
					done();
				}, error => {
					console.error('GET 404 test: Error is', error);
					// expect(error).to.be.not.null;						// eslint-disable-line no-unused-expressions
					done();
				} /* ,
				() => {
					done();
				} */
			);
	});

	it('Rocks!', function (done) {
		engine.put('https://httpbin.org/put', data)
			.subscribe(
				result => {
					console.log('PUT: Result is', result);
					expect(result).to.be.not.null;						// eslint-disable-line no-unused-expressions
					expect(result.url).to.equal('https://httpbin.org/put');
					expect(result.json.field1).to.equal('abc');
					expect(result.json.field2).to.equal(123);
					done();
				}, error => {
					console.error('PUT test: Error is', error);
					// expect(null).to.be.not.null;						// eslint-disable-line no-unused-expressions
					done();
				}
			);
	});

	it('Rocks!', function (done) {
		engine.delete('https://httpbin.org/delete')
			.subscribe(
				result => {
					console.log('DELETE: Result is', result);
					expect(result).to.be.not.null;						// eslint-disable-line no-unused-expressions
					expect(result.url).to.equal('https://httpbin.org/delete');
					expect(result.json).to.be.null;						// eslint-disable-line no-unused-expressions
					done();
				}, error => {
					console.error('DELETE test: Error is', error);
					// expect(null).to.be.not.null;						// eslint-disable-line no-unused-expressions
					done();
				}
			);
	});

	// const urlStatus200 = 'https://httpbin.org/status/200';
	// const urlStatus404 = 'https://httpbin.org/status/404';
	// const urlStatus500 = 'https://httpbin.org/status/500';
});
