var gulp = require('gulp');
var gutil = require('gulp-util');

var fs = require('fs');
var stream = require('stream');
var path = require('path');
var del = require('del');
var series = require('series');

var inline_templates = require('gulp-inline-ng2-template');
var rollup = require('gulp-better-rollup');
var sass = require('gulp-sass');
var ts = require('gulp-typescript');

var tsProject = ts.createProject('./tsconfig.json');

var bundles = [
  'bootstrap',
  'date',
  'email',
  'enum',
  'icon',
  'phone',
  'spinner',
  'toggle'
];

gulp.task('clean:spec', ['build'], function () {
  return series([
    del('./lib/**/*.spec.js'),
    del('./lib/**/*.spec.d.ts')
  ]);
});

gulp.task('clean', function () {
  return series([
    del('./lib'),
    del('./bundles')
  ])
});

gulp.task('build', function () {
  return gulp.src('src/**/*.ts')
    .pipe(inline_templates({
      useRelativePaths: true,
      removeModuleId: true,

      processStyles: sass({
        includePaths: ['node_modules'],
        omitSourceMapUrl: true
      })
    }))
    .pipe(tsProject())
    .pipe(gulp.dest('./lib'));
});

gulp.task('build:rollup', ['build', 'clean:spec'], function () {
  var globals = {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/forms': 'ng.forms',

    'rxjs/Observable': 'Rx',
    'rxjs/add/observable/fromEventPattern': 'Rx.Observable',
    'rxjs/add/observable/defer': 'Rx.Observable.prototype',
    'rxjs/add/operator/debounceTime': 'Rx.Observable.prototype',
    'rxjs/add/operator/skipWhile': 'Rx.Observable.prototype',
    'rxjs/add/operator/first': 'Rx.Observable.prototype',
    'rxjs/add/operator/map': 'Rx.Observable.prototype',
    'rxjs/add/operator/filter': 'Rx.Observable.prototype',
    'rxjs/add/operator/toPromise': 'Rx.Observable.prototype',

    'immutable': 'Immutable',

    'moment': 'moment',

    'caesium-core/lang': 'cs.core.lang',
    'caesium-core/converter': 'cs.core.converter',
    'caesium-core/codec': 'cs.core.codec',
    'caesium-core/exception': 'cs.core.exception',
    'caesium-model': 'cs.model'
  };

  var rollupOptions = {
    context: 'this',
    external: Object.keys(globals),
  };

  const rollupGenerateOptions = {
    moduleId: '',
    moduleName: 'cs.forms',
    format: 'umd',
    globals,
    dest: 'caesium-form.umd.js'
  };

  return gulp.src(path.join('lib', 'module.js'))
    .pipe(rollup(rollupOptions, rollupGenerateOptions))
    .pipe(gulp.dest('bundles'));
});

