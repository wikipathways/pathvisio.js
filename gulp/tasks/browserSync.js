// see setup guide for using with gulp: http://www.browsersync.io/docs/gulp/
var browserSync = require('browser-sync');
var gulp        = require('gulp');
var reload      = browserSync.reload;
var evt = browserSync.emitter;

evt.on('rs', function() {
  console.log('You want to reload BrowserSync!');
});

gulp.task('browserSync', ['browserify'], function() {
  //browserSync.init(['./lib/**/*.js'], {
  browserSync(['./index.js'], {
		server: {
			baseDir: './'
		},
    port: 3000,
    // Don't show any notifications in the browser.
    notify: false,
    //startPath: './test/'
    startPath: './demo/'
    //startPath: './demo/jquery-demo.html'
    //startPath: './demo/editor.html#/editor/open'
	});

  gulp.watch(['./demo/lib/pvjs/pvjs-dev.bundle.js']).on('change', reload);
});
