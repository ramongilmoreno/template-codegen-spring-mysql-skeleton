//
// Utilities to parse templates and generate code from them. Will be used
// to define tasks within the gulpfile.js module.
//

var vm = require('vm')
var gulp = require('gulp')
var debug = require('gulp-debug')
var gutil = require('gulp-util')
var cache = require('gulp-cached')
var utils = require('./utils.js')
var java = require('./java.js')
var sql = require('./sql.js')
var references = require('./references.js')
var ejs = require('ejs')
var through = require('through2')
var path = require('path')
var del = require('del')
var Q = require('q')

// Codegen tasks

var helpers = {
  java: java,
  sql: sql,
  references: references,
  utils: utils
}

var extension = '.template.codegen'
var sources = '**/*' + extension

var cachename = 'codegen'

function processCodegenFiles (config, sourcestream, processor) {
  // https://github.com/gulpjs/gulp/tree/master/docs/writing-a-plugin
  // https://github.com/kebingzao/gulp-file-split/blob/master/index.js
  return sourcestream
    .pipe(cache(cachename))
    .pipe(debug({title: 'Processing template:'}))
    .pipe(through.obj(function (file, enc, callback) {
      var sthis = this
      Q()
        .then(function () {
          if (file.isNull()) {
            // Null/deleted files get in here
            return
          }
          var filename = file.path
          var dir = path.dirname(filename)
          var contents = file.contents.toString().split('__TEMPLATE__')
          var producer = contents[0].trim()
          var template = contents[1].trim() + '\n'
          return Q()
            .then(function () {
              return processor(filename, dir, producer, template)
            })
            .then(function (results) {
              results.forEach(function (f) {
                var nf = new gutil.File({
                  base: file.base,
                  cwd: file.cwd,
                  path: path.join(dir, f.filename),
                  contents: new Buffer(f.contents),
                  stat: {
                    mode: file.stat.mode // Produce executable files as its template
                  }
                })
                sthis.push(nf)
              })
            })
        })
        .catch(function (err) {
          console.error('Failed to process file', file.path, err)
        })
        .finally(function () {
          // Never stop build due to errors
          callback()
        })
        .done()
    }))
    .pipe(cache(cachename))
    .pipe(debug({title: 'Generated file:'}))
    .pipe(gulp.dest('.'))
}

function codegen (config, sourcestream) {
  return processCodegenFiles(config, sourcestream, function (file, dir, producer, template) {
    return Q()
      .then(function () {
        var result = []
        vm.runInNewContext(producer, {
          config: config,
          helpers: helpers,
          single: function (filename) {
            if (!filename) {
              filename = path.basename(file, extension)
            }
            var product = ejs.render(template, {
              config: config,
              helpers: helpers
            })
            result.push({
              filename: filename,
              contents: product
            })
          },
          perEntity: function (filenameFunction, cleanPattern) {
            utils.foreach(config.db.entities, function (entity) {
              var filename = filenameFunction(entity)
              var product = ejs.render(template, {
                entity: entity,
                config: config,
                helpers: helpers
              })
              result.push({
                filename: filename,
                contents: product
              })
            })
          },
          cleanDirectory: function () { /* Do nothing during code generation */ }
        })
        return result
     })
  })
}

function clean (config, sourcestream) {
  return processCodegenFiles(config, sourcestream, function (file, dir, producer, template) {
    return Q()
      .then(function () {
        vm.runInNewContext(producer, {
          config: config,
          helpers: helpers,
          single: function (filename) {
            if (!filename) {
              filename = path.basename(file, extension)
            }
            del.sync((dir ? (dir + '/') : dir) + filename).forEach(function (f) {
              console.log('Deleting ' + f)
            })
          },
          perEntity: function (filenameFunction, cleanPattern) {
            del.sync((dir ? (dir + '/') : dir) + cleanPattern).forEach(function (f) {
              console.log('Deleting ' + f)
            })
          }
        })
        return []
      })
  })
}

module.exports = {
  codegen: codegen,
  clean: clean,
  processCodegenFiles: processCodegenFiles,
  sources: sources,
  extension: extension,
  helpers: helpers
}
