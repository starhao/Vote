/**
 * Created by wuchenghao on 2017/5/5.
 */
var gulp = require('gulp');
var babel = require('gulp-babel'),
    minifycss = require('gulp-minify-css'),  //css压缩
    concat = require('gulp-concat'),         //文件合并
    uglify = require('gulp-uglify'),         //js压缩插件
    rename = require('gulp-rename');         //重命名
var clean = require('gulp-clean');
var eztask = require('gulp-eztasks');
var gutil = require('gulp-util');

var config = {};

config.dist = 'dist';

config.static = ['app.js', 'routes/*.js',];

config.cssFile = ['**/*.css', '!**/*.min.css', '!node_modules/**/*.css'];
config.jsFile = ['resources/javascript/*.js', '!resources/javascript/*.min.js'];
config.minFile = ['resources/javascript/*.min.js'];

//压缩css
gulp.task('minifycss', function () {
  return gulp.src(config.cssFile)
      .pipe(minifycss())
      .pipe(gulp.dest('dist'))
});

//es6Toes5
gulp.task('useEs5', function () {
  return gulp.src(config.jsFile)
      .pipe(babel({presets: ['es2015']}))
      .pipe(gulp.dest('dist'))
});

//压缩js
gulp.task('minify', function () {
  return gulp.src('./app.js')
      .pipe(uglify())
      .on('error', function (err) {
        gutil.log(gutil.colors.red(['Error']), err.toString());
        this.emit('end')
      })
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('dist'))
});

//删除文件
gulp.task('clean', function () {
  return gulp.src('dist/*', {read: false})
      .pipe(clean())
});

gulp.task('watch', function () {
  gulp.watch(['resources/css/*.css', 'resources/javascript/*.js'], ['minifycss', 'minify-js'])
});

gulp.task('ezminicss', eztask.minicss(config.cssFile));
gulp.task('ezminijs', eztask.minijs(config.jsFile));

gulp.task('default', ['ezminicss', 'ezminijs'], function () {
  console.log('success');
});