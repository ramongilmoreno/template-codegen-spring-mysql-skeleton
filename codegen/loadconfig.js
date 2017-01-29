//
// Loads config and merges custom config files.
//

var fs = require('fs')
var vm = require('vm')
var _ = require('lodash')
var path = require('path')

// Load project configuration

var config = require('../config/config.js')

// Apply '_names' to objects based on its field name in the parent object. _xxxx properties
// are considered internal.
function names (o) {
  Object.keys(o).forEach(function (i) {
    var oi = o[i]
    if (_.isObject(oi)) {
      oi._name = i
      names(oi)
    }
  })
}
names(config)

// Merge config

// http://www.scriptol.com/javascript/include.php
// Leading ; prevents function definition from being interpreted is a function call providing a function
;(function () {
  // Do not pollute global scope.
  var context = vm.createContext({
    config: config,
    console: console
  });
  var mergeConfigDir = path.join(__dirname, '../config/custom')
  var mergeConfig = fs.readdirSync(mergeConfigDir)
  mergeConfig.sort()
  for (var i in mergeConfig) {
    var f = mergeConfigDir + '/' + mergeConfig[i]
    if (f.match(/.*\.js$/) && fs.statSync(f).isFile()) {
      var contents = fs.readFileSync(f).toString()
      vm.runInContext(contents, context)
    }
  }
})()

module.exports = config
