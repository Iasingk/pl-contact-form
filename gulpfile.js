/**
 * Created by cesarmejia on 22/08/2017.
 */
const gulp       = require('gulp');
const concat     = require('gulp-concat');
const typescript = require('gulp-typescript');
const uglify     = require('gulp-uglify');
const plumber    = require('gulp-plumber');
const livereload = require('gulp-livereload');


let srcPath = {
    css : 'styles/',
    ts  : 'scripts/ts/',
    root: ''
};

let destPath = {
    js: 'scripts/js/'
};

// ---------------------------------------------------------------------
// | Maintains updated src changes in the browser.                     |
// ---------------------------------------------------------------------

/**
 * Reload on change.
 */
gulp.task('reload', ['ts'], () => {
    gulp.src(srcPath.root)
        .pipe(livereload());
});

/**
 * Monitors changes in projects files and apply changes instantly.
 * Use with livereload chrome extension.
 * Reference: https://github.com/vohof/gulp-livereload
 */
gulp.task('watch', () => {
    // Files to be watched.
    let files = [
        srcPath.ts   + '**/*.ts',
        srcPath.css  + '**/*.css',
        srcPath.root + '*.html'
    ];

    livereload.listen();

    gulp.watch(files, ['ts', 'reload']);
});


// ---------------------------------------------------------------------
// | Build production project.                                         |
// ---------------------------------------------------------------------

/**
 * Concatenate and compile typescript files.
 * Reference: https://www.npmjs.com/package/gulp-typescript/
 */
gulp.task('ts', () => {
    let opts = {
        target        : 'ES5',
        removeComments: false,
        noImplicitAny : false
    };

    // Source files.
    let srcFiles = [
        srcPath.ts + '**/*.ts'
    ];

    // Output file.
    let outputFile = 'pl-contact-form.min.ts';

    return gulp.src(srcFiles)
        .pipe(plumber())
        .pipe(concat(outputFile))
        .pipe(typescript(opts))
        .pipe(uglify())
        .pipe(gulp.dest(destPath.js));
});