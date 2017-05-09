/**
 * Created by wuchenghao on 2017/5/5.
 */
var gulp = require('gulp');
var babel = require('gulp-babel'),
    minifycss = require('gulp-minify-css'),  //css压缩
    concat = require('gulp-concat'),         //文件合并
    uglify = require('gulp-uglify'),         //js压缩插件
    rename = require('gulp-rename');         //重命名

var config = {};

config.dist = 'dist';

config.static = ['dist/js/app.js', 'resources/javascript/*.js'];

//压缩css
gulp.task('minifycss', function () {
  return gulp.src('resources/css/*.css')
      .pipe(minifycss())
      .pipe(gulp.dest('dist/css'))
});

//es6Toes5
gulp.task('useEs5', function () {
  return gulp.src('app.js')
      .pipe(babel({presets: ['es2015']}))
      .pipe(gulp.dest('dist/js'))
})

//压缩js
gulp.task('minify-js', ['useEs5'], function () {
  return gulp.src('dist/js/*.js')
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('dist/js'))
});

gulp.task('watch', function () {
  gulp.watch(['resources/css/*.css', 'resources/javascript/*.js'], ['minifycss', 'minify-js'])
});


// gulp.task('default', ['minifycss', 'minify-js', 'watch'], function () {
//   console.log('gulp complete~')
// });

gulp.task('default',['minify-js'], function () {
  console.log('success');
})