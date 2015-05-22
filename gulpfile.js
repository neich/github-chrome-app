'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var reactify = require('reactify');
var $ = require('gulp-load-plugins')();

gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './app/js/main.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [reactify]
  });

  return b.bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    // Add transformation tasks to the pipeline here.
    // .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('copy', function() {
  gulp.src([
    './app/index.html',
    './app/styles/*.css',
    './app/ratchet/css/*.css',
    './app/ratchet/fonts/*.*'], {base: "./app"})
    .pipe(gulp.dest('./dist'));
});

gulp.task('manifest', function() {
  return gulp.src('app/manifest.json')
    .pipe($.chromeManifest({
      buildnumber: true,
    }))
    .pipe($.if('*.css', $.cssmin()))
    .pipe($.if('*.js', $.sourcemaps.init()))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.js', $.sourcemaps.write()))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['javascript', 'copy', 'manifest']);