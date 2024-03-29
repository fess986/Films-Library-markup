const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');

let preprocessor = 'sass'; 

const {
  src, 
  dest, 
  parallel, 
  watch 
} = require('gulp');

// настраиваем синхронизацию с браузером
function browsersync() {
  browserSync.init({ 
    server: {
      baseDir: './',
      index: 'src/pages/main/main.html'
    }, 
    notify: false, 
    online: true,
  })
}

// function defaultTask(cb) {
//   // place code for your default task here
//   cb();
// }

// exports.default = defaultTask
exports.default = parallel(browsersync);