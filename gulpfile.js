const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');

const pagePath = 'src/pages';

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
      index: `${pagePath}/main/main.html`
    }, 
    notify: false, 
    online: true,
  })
}


// exports.default = defaultTask
exports.default = parallel(browsersync);