//
// Types definitions
//

function defineStringType (length) {
  return {
    sqlType: 'VARCHAR(' + length + ')',
    javaType: 'java.lang.String',
    sampleValue: '(Long value) -> "" + value + " Text ' + length + ' chars"'
  }
}

var types = {
  id: defineStringType(100),
  label: defineStringType(100),
  text: defineStringType(500),
  int: {
    sqlType: 'BIGINT',
    javaType: 'java.lang.Long',
    sampleValue: '(Long value) -> value'
  },
  date: {
    sqlType: 'BIGINT',
    javaType: 'java.lang.Long',
    sampleValue: '(Long value) -> value'
  },
  boolean: {
    sqlType: 'BOOLEAN',
    javaType: 'java.lang.Boolean',
    sampleValue: '(Long value) -> (value % 2) == 0 ? java.lang.Boolean.FALSE : java.lang.Boolean.TRUE'
  }
}

module.exports = types
