/**
 * Created by cesarmejia on 22/08/2017.
 */

const gulp = require('gulp')
    , ts = require('gulp-typescript');

gulp.task('ts', () => {
    let tsSettings = {
        outFile: 'scripts.js',
        target: 'ES5'
    };

    return gulp.src('ts/*.ts')
            .pipe(ts(tsSettings))
            .pipe(gulp.dest('scripts/'));
});