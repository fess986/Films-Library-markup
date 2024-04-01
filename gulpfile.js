const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const map = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer'); 
const sass = require('gulp-sass')(require('sass'));
const cleancss = require('gulp-clean-css'); 

const pagePath = 'src/pages';
let preprocessor = 'sass'; 
const preprocessors = {
  sass: () => sass(),
};

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

function styles() {
  return src('src/sass/main.scss') // Выбираем источник: "app/sass/main.sass" или "app/less/main.less"
    .pipe(plumber())
    .pipe(map.init()) //запускаем карту кода
    .pipe(preprocessors[preprocessor]()) // Преобразуем значение переменной "preprocessor" в функцию
    .pipe(concat('styles.min.css')) // Конкатенируем в файл style.css
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true
    })) // Создадим префиксы с помощью Autoprefixer. Префиксы нужны для совместимости браузеров. грид - нужен для того чтобы эксплорер понимал гриды
    //.pipe(cleancss( { level: { 2: { specialComments: 0 } }/* , format: 'beautify' */ } )) // Минифицируем стили. в одну строку. если расскоментить бьютифай, то наоборот будет максимально красиво
    .pipe(cleancss({
      level: {
        1: {
          specialComments: 0
        }
      },
      format: 'beautify'
    })) //делаем всё красиво!! Если надо сжато, то расскоментим предыдущую строку
    // .pipe(cleancss({
    //   level: {
    //     2: {
    //       specialComments: 0
    //     }
    //   }
    // })) // Минифицируем стили. в одну строку. если расскоментить бьютифай, то наоборот будет максимально красиво

    .pipe(map.write('../css/')) //записываем карту кода в папку css
    .pipe(dest('src/css/')) // Выгрузим результат в папку "app/css/"
    .pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

function startwatch() {
  watch('src/**/' + preprocessor + '/**/*.scss', styles);  // src/**/sass/**.scss означает, что ищется папка sass, не обязательно в корне src, а может и в глубине
  watch('src/**/*.html').on('change', browserSync.reload);
}

exports.styles = styles;
exports.default = parallel(browsersync, styles, startwatch);