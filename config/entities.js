//
// Entities definitions
//

function defineField (type) {
  return {
    type: type
  }
}

var entities = {
  department: {
    fields: {
      name: defineField('label'),
      description: defineField('text')
    }
  },
  employee: {
    fields: {
      name: defineField('label'),
      surname: defineField('label'),
      startDate: defineField('date')
    },
    references: {
      department: {
        // No need to declare anything else, as the name of the reference its itself
      }
    }
  },
  user: {
    fields: {
      name: defineField('label'),
      password: defineField('label'),
      enabled: defineField('boolean')
    }
  }
}

module.exports = entities
