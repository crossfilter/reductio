var gulp = require('gulp');

var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var shim = require('browserify-shim');
// var Gitdown = require('gitdown');
var bump = require('gulp-bump');
var karma = require('gulp-karma');

var testFiles = [
	'node_modules/crossfilter2/crossfilter.min.js',
	'node_modules/lodash/index.js',
	'reductio.min.js',
	'test/**/*.spec.js'
];

gulp.task('scripts', function () {
	return browserify('./src/reductio.js', { standalone: 'reductio' })
		.transform(shim)
		.bundle()
		.pipe(source('reductio.js'))
        .pipe(gulp.dest('./'))
        .pipe(rename('reductio.min.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('./'));
});

gulp.task('docs', function () {
	// Set up gitdown
	// Gitdown.notice = function () { return ''; };
	// var gitdown = Gitdown.read('docs/README.md');
	// var config = gitdown.config;
	// config.gitinfo.gitPath = './docs';
	// gitdown.config = config;
	
	// return gitdown
	// 	.write('README.md');
});

gulp.task('bump', function(){
  gulp.src(['./bower.json', './package.json'])
	  .pipe(bump({type:'minor'}))
	  .pipe(gulp.dest('./'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('./src/**/*.js', ['scripts']);
    gulp.watch('./docs/*', ['docs']);
});

gulp.task('test', function () {
	return gulp.src(testFiles)
		.pipe(karma({
		  configFile: 'karma.conf.js',
		  action: 'run'
		}))
		.on('error', function(err) {
		  // Make sure failed tests cause gulp to exit non-zero 
		  throw err;
		});
});

gulp.task('testWatch', function () {
	return gulp.src(testFiles)
		.pipe(karma({
		  configFile: 'karma.conf.js',
		  action: 'watch'
		}))
		.on('error', function(err) {
		  // Make sure failed tests cause gulp to exit non-zero 
		  throw err;
		});
});

gulp.task('default', ['scripts', 'docs', 'testWatch', 'watch']);
gulp.task('all', ['scripts', 'docs', 'test']);