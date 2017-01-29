//
// Execute commands in subdirectory
//

var exec = require('child_process').exec
var path = require('path')
var Q = require('q')

function run (dirname, dir, command) {
  return Q()
    .then(function () {
      var r = Q.defer()
      var cmd = exec(command, {
        cwd: path.join(dirname, dir),
        shell: '/bin/bash'
      })

      cmd.stdout.on('data', (data) => {
        process.stdout.write(`[${command}] ${data}`)
      });

      cmd.stderr.on('data', (data) => {
        process.stderr.write(`[${command}] [ERR] ${data}`)
      });

      cmd.on('close', (code) => {
        if (code == 0) {
          r.resolve(code)
        } else {
          console.error(`[${command}] Failed with code ${code}`);
          r.reject(code)
        }
      });

      return r.promise
   })
}

module.exports = run
