//
// Main configuration file
//

// Put everything together
module.exports = {
  application: {
    name: 'application',
    administrator: {
      user: 'admin',
      password: 'admin'
    },
    port: 8080,
    version: '0.1'
  },
  types: require('./types.js'),
  db: {
    host: '127.0.0.1',
    port: 3306,
    name: 'Example',
    user: 'dbuser',
    password: 'dbpassword',
    rootPassword: 'rootPassword',
    entities: require('./entities.js')
  }
}
