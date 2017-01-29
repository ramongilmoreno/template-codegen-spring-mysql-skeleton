var utils = require('./utils.js')

// Returns the target of the reference
function targetEntity (reference, entities) {
  return entities[reference.target || reference._name]
}

module.exports = {
  // Locates all references to me (my entity) in the entities structure.
  pointToMe: function (entity, entities) {
    var r = []
    utils.foreach(entities, function (e2) {
      utils.foreach(e2.references, function (reference) {
        if (targetEntity(reference, entities) === entity) {
          r.push({
            source: e2,
            reference: reference
          })
        }
      })
    })
    return r
  },
  targetEntity: targetEntity
}
