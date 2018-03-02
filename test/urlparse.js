const url = require('url');

let urlString = 'https://localhost:3000/u/1';
let result = url.parse(urlString);

console.log('URL:', urlString);
console.log('Parsed URL:', result);
console.log('Hostname:', result.hostname);
