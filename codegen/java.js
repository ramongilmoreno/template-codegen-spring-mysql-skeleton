var utils = require('./utils')
var _ = require('lodash')

function name (str) {
  return utils.camel(str)
}

function entityName (entity) {
  return utils.camel(utils.name(entity))
}

function entityAttributeName (entity) {
  return _.camelCase(utils.name(entity))
}

function attributeName (str) {
  return _.camelCase(str)
}

function packageDir (pkg) {
  return pkg.replace(/\./g, '/')
}

module.exports = {
  name: name,
  attributeName: attributeName,
  entityName: entityName,
  entityAttributeName: entityAttributeName,
  fieldName: entityName,
  fieldAttributeName: entityAttributeName,
  referenceName: entityName,
  referenceAttributeName: entityAttributeName,
  packageDir: packageDir
}
