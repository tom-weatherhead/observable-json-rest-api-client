// observable-json-rest-api-client/Gruntfile.js

'use strict';

module.exports = function (grunt) {
	const packageJsonFilename = 'package.json';
	const packageJsonContents = grunt.file.readJSON(packageJsonFilename);

	grunt.initConfig({
		pkg: packageJsonContents,
		eslint: {
			target: [
				// '*.js',
				'src/*.js' //,
				// 'test/*.js'
			]
		},
		mochaTest: {
			options: {
				reporter: 'spec'
			},
			test: {
				src: ['test/*_spec.js']
			}
		//},
		// watch : {
		//	js : {
		//		files : ['src/*.js'],
		//		tasks : 'build'
		//	},
		//	pkg: {
		//		files : packageJsonFilename,
		//		tasks : 'build'
		//	},
		//	readme : {
		//		files : 'README.md',
		//		tasks : 'build'
		//	}
		}
	});

	// Tasks:
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-mocha-test');
	// grunt.loadNpmTasks('grunt-contrib-watch');

	// Aliases:
	grunt.registerTask('test', ['eslint', 'mochaTest']);
	grunt.registerTask('default', ['test']);
};
