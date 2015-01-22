module.exports = function(config) {
  config.set({
    basePath: '.',

    frameworks: ['jasmine'],
    
    files: [
		'node_modules/crossfilter/crossfilter.min.js',
		'reductio.min.js',
		'test/**/*.spec.js'
    ],

	browsers: [
		// 'Chrome'
		'ChromeCanary',
		'Firefox'
		// 'PhantomJS'
	],

	plugins: [
		'karma-jasmine',
		'karma-chrome-launcher',
		'karma-firefox-launcher'
	],

	reporters: ['dots'],

	singleRun: true,

	captureTimeout: 60000
  });
};