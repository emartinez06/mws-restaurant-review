'use strict';

let autoprefixer = require('gulp-autoprefixer');
let csso = require('gulp-csso');
let del = require('del');
let gulp = require('gulp');
let htmlmin = require('gulp-htmlmin');
let runSequence = require('run-sequence');
let uglify = require('gulp-uglify-es').default;
let responsive = require('gulp-responsive');

// Set the browser that you want to support
const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

//File paths
let cssFiles = './src/css/styles.css';
let jsFiles = './src/js/**/*.js';
let htmlFiles = './src/**/*.html';
let imgFiles = './src/img/**/*.*';
let otherFiles = [
    './src/favicon.ico',
    './src/manifest.json',
    './src/sw.js',
    './src/index.html',
    './src/error.html',
    './src/restaurant.html',
];
let images = './src/img/**/*.jpg';

//Gulp task to move other files
gulp.task('other-files', function() {
    return gulp.src(otherFiles)
        .pipe(gulp.dest('./app'));
});

//Gulp task to move other images
gulp.task('other-images', function() {
    return gulp.src(images)
        .pipe(gulp.dest('./app/img'));
});

// Gulp task to minify CSS files
gulp.task('styles', function () {
    return gulp.src(cssFiles)
    // Auto-prefix css styles for cross browser compatibility
        .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        // Minify the file
        .pipe(csso())
        // Output
        .pipe(gulp.dest('./app/css'))
});

// Gulp task to minify JavaScript files
gulp.task('scripts', function() {
    return gulp.src(jsFiles)
    // Minify the file
        .pipe(uglify())
        // Output
        .pipe(gulp.dest('./app/js'))
});

// Gulp task to minify HTML files
gulp.task('pages', function() {
    return gulp.src([htmlFiles])
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./app'));
});

// Gulp task to minify image files. Thanks to Alexandro Perez:
//https://alexandroperez.github.io/mws-walkthrough/?2.2.gulp-with-watchify-browserify-and-browsersync
gulp.task('responsive:images', function() {
    return gulp.src(imgFiles)
        .pipe(responsive({
            // Here is where you can change sizes and suffixes to fit your needs. Right now
            // we are resizing all jpg images to three different sizes: 300, 600 and 800 px wide.

            '**/*.jpg': [{
                width: 800,
                quality: 70,
                rename: { suffix: '-large'}
            }, {
                width: 600,
                quality: 50,
                rename: { suffix: '-medium'}
            }, {
                width: 300,
                quality: 40,
                rename: { suffix: '-small'}
            }],
            '**/*.png':{
                quality: 100
            }
        },))
        .pipe(gulp.dest('./app/img'));
});

// Clean output directory
gulp.task('clean', () => del(['app']));

// Gulp task to minify all files
gulp.task('default', ['clean'], function () {
    runSequence(
        'styles',
        'scripts',
        //'pages',
        'responsive:images',
        'other-files',
        'other-images'
    );
});