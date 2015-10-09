// Load in dependencies
var bufferedSpawn = require('buffered-spawn');

// Define our utilities
exports.spawn = function (command, args, options) {
  before(function spawnFn (done) {
    // Run our command
    var that = this;
    bufferedSpawn(command, args, options, function handleBufferedSpawn (err, stdout, stderr) {
      // Save our results
      that.err = err;
      that.stdout = stdout;
      that.stderr = stderr;

      // Callback with no errors
      done();
    });
  });

  after(function cleanup () {
    // Clean up our results
    delete this.err;
    delete this.stdout;
    delete this.stderr;
  });
};
