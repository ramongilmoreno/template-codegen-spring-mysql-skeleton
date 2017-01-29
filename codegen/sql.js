var utils = require('./utils')

function name (str) {
  return utils.camel(str)
}

function entityName (entity) { return utils.camel(utils.name(entity)) }

module.exports = {
  name: name,
  entityName: entityName,
  fieldName: entityName,
  referenceName: entityName
}
