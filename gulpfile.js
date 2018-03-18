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
const critical = require('critical').stream;

gulp.task('clean', function() {
  return del('build');
});

gulp.task('clean:dev', function() {
  return del('img/symbols.svg', 'css/style.css');
});

gulp.task('style', function() {
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
          browsers: ['last 2 versions']
        }),
        flexbugsFixes()
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
  const processors = [
    precss(),
    autoprefixer({
      browsers: ['last 2 versions']
    }),
    flexbugsFixes(),
    reporter({
      clearReportedMessages: 'true'
    })
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
    .src('build/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build/'));
});

gulp.task('jsmin', function() {
  return gulp
    .src(['js/main.js'])
    .pipe(
      uglify({
        compress: {
          booleans: true,
          loops: true,
          unused: true,
          warnings: false,
          drop_console: true,
          unsafe: true,
          dead_code: true
        },
        output: {
          beautify: false,
          comments: false
        }
      })
    )
    .pipe(gulp.dest('build/js'));
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

gulp.task('critical', function() {
  return gulp
    .src('./*.html')
    .pipe(
      critical({
        base: './',
        inline: true,
        css: 'build/css/style.css',
        minify: true,
        ignore: ['@font-face', /url\(/],
        dimensions: [
          {
            height: 1024,
            width: 768
          },
          {
            height: 768,
            width: 1024
          },
          {
            height: 900,
            width: 1200
          }
        ]
      })
    )
    .on('error', function(err) {
      gutil.log(gutil.colors.red(err.message));
    })
    .pipe(gulp.dest('build/'));
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
  run(
    'clean',
    ['copy', 'style', 'jsmin', 'symbols'],
    'critical',
    'htmlminify',
    fn
  );
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
