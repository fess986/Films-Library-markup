const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const map = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer'); 
const sass = require('gulp-sass')(require('sass'));
const cleancss = require('gulp-clean-css'); 
const htmlmin = require('gulp-htmlmin');
const del = require('del'); // Подключаем модуль del

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
      // index: `${pagePath}/main/main.html` // - для главной страницы
      index: `${pagePath}/sign-in/sign-in.html`,  // - для страницы с плейером - в состоянии паузы
      // index: `${pagePath}/player/player-pause.html`,  // - для страницы с плейером - в состоянии паузы
      // index: `${pagePath}/player/player.html`,  // - для страницы с плейером
      // index: `${pagePath}/my-list/my-list.html` // - для страниц со списком пользовательских фильмов
      // index: `${pagePath}/add-review/add-review.html` // - для страницы с добавлением фильма
      // index: `${pagePath}/movie-page/movie-page-details.html` // - для страницы фильма - детализация
      // index: `${pagePath}/movie-page/movie-page-reviews.html` // - для страницы фильма - детализация
      // index: `${pagePath}/movie-page/movie-page.html` // - для страницы фильма - детализация
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
  watch('src/**/*.js').on('change', browserSync.reload);
}

////////////////////////////////////// БИЛД ПРИЛОЖЕНИЯ //////////////////////
//минимизация html и копирование в папку build
function htmlBuild() {
  return src('src/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true
    }))
    .pipe(dest('build'))
}

// минимизация css и копирование в папку build
function stylesBuild() {
  return src('src/sass/main.scss') 
    .pipe(map.init()) 
    .pipe(eval(preprocessor)()) // Преобразуем значение переменной "preprocessor" в функцию
    .pipe(preprocessors[preprocessor]()) 
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      grid: true
    })) 
    .pipe(cleancss({
      level: {
        2: {
          specialComments: 0
        }
      }
    })) 
    .pipe(map.write('../../build/css/')) //записываем карту кода в папку build/css
    .pipe(dest('build/css/')) // Выгрузим результат в папку "app/css/"
}

//удаляем папку build, для того чтобы переписать на актуальные изменения
function cleanBuild() {
  return del(['build'])
}

// копирование шрифтов и картинок в папку build
function copyBuild() {
  return src([
      "src/fonts/*.*",
      'src/images/**/*'
    ], {
      base: "src"
    })
    .pipe(dest("build"))
}

exports.copyBuild = copyBuild;

//exports.styles = styles;
exports.default = parallel(browsersync, styles, startwatch);

//запуск билда проекта
const build = gulp.series( 
  cleanBuild,  // удаляем папку build
  htmlBuild, //минимизация html и копирование в папку build
  stylesBuild, // минимизация css и копирование в папку build
  copyBuild // копирование шрифтов и картинок
)

exports.build = build;
