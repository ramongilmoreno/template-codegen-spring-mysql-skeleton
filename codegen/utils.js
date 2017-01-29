var _ = require('lodash')

function camel (str) {
  return _.upperFirst(_.camelCase(str))
}

function name (o) {
  return o.name || o._name
}

// Obtains the list of defined properties in a config object discarding _xxxx fields (internals)
function values (a) {
  if (!a) {
    a = {}
  }
  return Object
      .keys(a)
      .sort()
      .filter(function (i) { return !i.startsWith('_') })
      .map(function (i) { return a[i] })
}

function foreach (a, f) {
  values(a).map(f)
}

module.exports = {
  camel: camel,
  name: name,
  values: values,
  foreach: foreach
}
