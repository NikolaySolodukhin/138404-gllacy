'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const precss = require('precss');
const csscomb = require('gulp-csscomb');
const rename = require('gulp-rename');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const csso = require('gulp-csso');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-html-minifier2');
const concat = require('gulp-concat');
const del = require('del');
const run = require('run-sequence');
const uglify = require('gulp-uglify');
const ghPages = require('gulp-gh-pages');
const server = require('browser-sync').create();
const flexbugsFixes = require('postcss-flexbugs-fixes');
const htmlhint = require('gulp-htmlhint');
const reporter = require('postcss-reporter');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const sprites = require('postcss-sprites');

gulp.task('clean', function() {
  return del('build');
});

gulp.task('clean:dev', function() {
  return del('js/main.js', 'img/symbols.svg', 'css/style.css');
});

gulp.task('style', function() {
  const opts = {
    stylesheetPath: './build/css',
    spritePath: './build/img/'
  };
  return gulp
    .src('postcss/style.css')
    .pipe(plumber())
    .pipe(
      postcss([
        precss(),
        mqpacker({
          sort: true
        }),
        autoprefixer({
          browsers: ['last 4 versions']
        }),
        flexbugsFixes(),
        sprites(opts)
      ])
    )
    .pipe(csscomb('./.csscomb.json'))
    .pipe(
      csso({
        restructure: true,
        sourceMap: true,
        debug: true
      })
    )
    .pipe(gulp.dest('build/css'));
});

gulp.task('style:dev', function() {
  const opts = {
    stylesheetPath: './css',
    spritePath: './img/sprite/',
    filterBy: function(image) {
      if (!/\/img\/sprite\//.test(image.url)) {
        return Promise.reject();
      }
      return Promise.resolve();
    }
  };
  const processors = [
    precss(),
    autoprefixer({
      browsers: ['last 4 versions']
    }),
    flexbugsFixes(),
    reporter({
      clearReportedMessages: 'true'
    }),
    sprites(opts)
  ];
  return gulp
    .src('postcss/style.css')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.identityMap())
    .pipe(postcss(processors))
    .pipe(csscomb('./.csscomb.json'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css'))
    .pipe(plumber.stop())
    .pipe(server.stream());
});

gulp.task('linthtml', function() {
  return gulp
    .src('*.html')
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter('htmlhint-stylish'));
});

gulp.task('lintjs', function() {
  return gulp
    .src(['js/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('htmlminify', function() {
  return gulp
    .src('*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build/'));
});

gulp.task('jsmin', function() {
  return gulp
    .src(['js/utils.js'])
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('concat:dev', function() {
  return gulp
    .src(['js/utils.js', 'js/map.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('js'))
    .pipe(server.stream());
});

gulp.task('images', function() {
  return gulp
    .src('img/*.{png,jpg,gif}')
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 7 }),
        imagemin.jpegtran({ progressive: true })
      ])
    )
    .pipe(gulp.dest('img'));
});

gulp.task('symbols:dev', function() {
  return gulp
    .src('img/icons/*.svg')
    .pipe(svgmin())
    .pipe(
      svgstore({
        inlineSvg: true
      })
    )
    .pipe(rename('symbols.svg'))
    .pipe(gulp.dest('img/'));
});

gulp.task('symbols', function() {
  return gulp
    .src('img/icons/*.svg')
    .pipe(svgmin())
    .pipe(
      svgstore({
        inlineSvg: true
      })
    )
    .pipe(rename('symbols.svg'))
    .pipe(gulp.dest('build/img'));
});

gulp.task('svg', function() {
  return gulp
    .src('img/**/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('img/'));
});

gulp.task('copy', function() {
  return gulp
    .src(['fonts/*.{woff,woff2}', 'img/*.{svg,png,jpg,gif}'], {
      base: '.'
    })
    .pipe(gulp.dest('build'));
});

gulp.task('html:copy', function() {
  return gulp.src('*.html').pipe(gulp.dest('build'));
});

gulp.task('html:update', ['html:copy'], function(done) {
  server.reload();
  done();
});

gulp.task('serve', ['clean:dev', 'style:dev'], function() {
  server.init({
    server: '.',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('postcss/**/*.css', function() {
    run('clean:dev', ['style:dev']);
  });
  gulp.watch('*.html', ['html:update']);
});

gulp.task('build', function(fn) {
  run('clean', ['copy', 'style', 'htmlminify', 'jsmin'], fn);
});

gulp.task('demo', function() {
  server.init({
    server: 'build',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
});

gulp.task('deploy', function() {
  return gulp.src('./build/**/*').pipe(ghPages());
});
