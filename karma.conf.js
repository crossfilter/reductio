module.exports = function(config) {
  config.set({
    basePath: '.',

    frameworks: ['jasmine'],

    files: [
		'node_modules/crossfilter2/crossfilter.min.js',
		'node_modules/lodash/lodash.js',
     // {pattern: 'main.js', type: 'module'},
		'reductio.min.js',
     { pattern: config.grep ? config.grep : 'test/**/*.test.js', type: 'module' },
		// 'test/**/*.test.js'
    ],

	browsers: [
		// 'Chrome'
		// 'ChromeCanary',
		// 'Firefox',
    'ChromeHeadless'
		// 'PhantomJS'
		// 'PhantomJS'
	],

	plugins: [
		'karma-jasmine',
		'karma-chrome-launcher',
		// 'karma-firefox-launcher',
		// 'karma-phantomjs-launcher'
	],

	// reporters: ['dots'],
  reporters: ['progress'],

	singleRun: true,

  concurrency: Infinity,
  autoWatch: false,
  colors: true,
  port: 9876,  // karma web server port
	captureTimeout: 60000
  });
};

    // logLevel: config.LOG_INFO,
    // browsers: ['ChromeHeadless'],
    // // singleRun: false, // Karma captures browsers, runs the tests and exits