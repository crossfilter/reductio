var gulp = require('gulp');

var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var shim = require('browserify-shim');
var Gitdown = require('gitdown');

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
	Gitdown.notice = function () { return ''; };
	var gitdown = Gitdown.read('docs/README.md');
	var config = gitdown.config;
	config.gitinfo.gitPath = './docs';
	gitdown.config = config;
	
	return gitdown
		.write('README.md');
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('./src/**/*.js', ['scripts']);
    gulp.watch('./docs/*', ['docs']);
});

gulp.task('default', ['scripts', 'docs', 'watch']);
gulp.task('all', ['scripts', 'docs']);