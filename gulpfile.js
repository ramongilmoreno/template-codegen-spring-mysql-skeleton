var fs = require('fs')
var vm = require('vm')
var gulp = require('gulp')
var watch = require('gulp-watch')
var codegen = require('./codegen/codegen.js')
var _ = require('lodash')
var path = require('path')
var exec = require('./codegen/exec.js')
var Q = require('q')

var config = require('./codegen/loadconfig.js')

// Codegen tasks

gulp.task('codegen', function () {
  return codegen.codegen(config, gulp.src(codegen.sources))
})

gulp.task('codegen:watch', function () {
  return codegen.codegen(config, watch([ codegen.sources, '!node_modules' /* Watching node_modules/ directory caused an internal gulp-watch error on binary files */ ], { ignoreInitial: false }))
})

gulp.task('codegen:clean', function () {
  return codegen.clean(config, gulp.src(codegen.sources))
})

gulp.task('mysql:start', [ 'codegen' ], function () {
  return exec(__dirname, 'mysql', './start.sh')
})

gulp.task('mysql:alive', [ 'codegen' ], function () {
  return exec(__dirname, 'mysql', './alive.sh')
})

gulp.task('mysql:stop', [ 'codegen' ], function () {
  return exec(__dirname, 'mysql', './stop.sh')
})

gulp.task('mysql:clean', [ 'codegen' ], function () {
  return exec(__dirname, 'mysql', './clean.sh')
})

gulp.task('mvn:clean', [ 'codegen' ], function () {
  return exec(__dirname, './dev', 'mvn clean')
})

gulp.task('mvn:web', [ 'codegen' ], function () {
  return exec(__dirname, './dev', './mvn.sh spring-boot:run --web')
})

gulp.task('mvn:run', [ 'codegen' ], function () {
  return Q()
    .then(function () { return exec(__dirname, './dev', 'mvn package') })
    .then(function () { return exec(__dirname, './dev', './run.sh') })
})

gulp.task('mvn:dump', [ 'codegen' ], function () {
  return exec(__dirname, './dev', './mvn.sh spring-boot:run --dump')
})

gulp.task('mvn:test', [ 'codegen' ], function () {
  return exec(__dirname, './dev', './mvn.sh test')
})

gulp.task('qa:spaces', function () {
  return exec(__dirname, '.', './codegen/qa/spaces.sh')
})

gulp.task('qa', [ 'qa:spaces' ])

gulp.task('run', [ 'mvn:run' ])

gulp.task('test', [ 'mvn:test' ])

gulp.task('clean', function () {
  return exec(__dirname, '.', './clean.sh')
})

gulp.task('default', [ 'run' ])
