var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: {
            target: "http://mymatto.xwork.site/"
        }
    });

    gulp.watch("./**/*.*").on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync']);