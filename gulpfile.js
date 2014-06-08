var gulp = require('gulp');

var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('scripts', function () {
	return browserify('./src/reductio.js')
		.bundle({ standalone: 'reductio' })
		.pipe(source('reductio.js'))
        .pipe(gulp.dest('./'));
        // .pipe(rename('reductio.min.js'))
        // .pipe(uglify())
        // .pipe(gulp.dest('./'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('./src/**/*.js', ['scripts']);
});

gulp.task('default', ['scripts', 'watch']);
gulp.task('all', ['scripts', 'html']);