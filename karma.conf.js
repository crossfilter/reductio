module.exports = function(config) {
  config.set({
    basePath: '.',

    frameworks: ['jasmine'],

    files: [
		'node_modules/crossfilter2/crossfilter.min.js',
		'node_modules/lodash/index.js',
		'reductio.min.js',
		'test/**/*.spec.js'
    ],

	browsers: [
		// 'Chrome'
		// 'ChromeCanary',
		// 'Firefox',
		'PhantomJS'
		// 'PhantomJS'
	],

	plugins: [
		'karma-jasmine',
		'karma-chrome-launcher',
		'karma-firefox-launcher',
		'karma-phantomjs-launcher'
	],

	reporters: ['dots'],

	singleRun: true,

	captureTimeout: 60000
  });
};
