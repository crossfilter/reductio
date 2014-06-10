module.exports = function(config) {
  config.set({
    basePath: '.',

    frameworks: ['jasmine'],
    
    files: [
		'node_modules/crossfilter/crossfilter.min.js',
		'reductio.js',
		'test/**/*.spec.js'
    ],

	browsers: [
		// 'Chrome'
		'ChromeCanary'
		// 'PhantomJS'
	],

	plugins: [
		'karma-jasmine',
		'karma-chrome-launcher'
	],

	singleRun: true,

	captureTimeout: 60000
  });
};