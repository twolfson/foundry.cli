// Load in our dependencies
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var xtend = require('xtend');

// Define our function
function foundryCli() {
  // Generate path to our file in `node_modules/.bin/`
  var nodeModulesBinDir = path.join(process.cwd(), 'node_modules', '.bin');
  var filepath = path.join(nodeModulesBinDir, 'foundry');

  // Determine if our script exists
  try {
    fs.statSync(filepath);
  } catch (err) {
    // If the error is about the file not existing, complain in a more understandable voice
    //   and exit
    if (err.code === 'ENOENT') {
      console.error('Locally installed `foundry` wasn\'t found. ' +
        'Please make sure it has been installed to `node_modules` via `npm`.');
      // Forcefully end stderr
      // DEV: This is required for `node@0.10` on Windows (otherwise, it's too slow and we can exit before the flush)
      // DEV: We have a try/catch because this is illegal in `node>=0.12`
      //    Another option is the `exit` package but this is simpler since we are a CLI
      // https://github.com/twolfson/foundry-release-base/blob/1.0.2/lib/foundry-release-base.js#L27-L31
      try { process.stderr.end(); } catch (err) {}
      return process.exit(1);
    // Otherwise, throw the error again
    } else {
      throw err;
    }
  }

  // Attempt to start foundry with our remaining arguments and with a new PATH option
  // DEV: Start it in the same fashion as an `npm` call (`node <script>` and `$PATH:$PWD/node_modules/.bin)
  // https://github.com/mochajs/mocha/blob/v2.3.3/bin/mocha#L54-L69
  var argv = [filepath].concat(process.argv.slice(2));
  var PATH = process.env.PATH + path.delimiter + nodeModulesBinDir;
  var env = xtend({}, process.env, {PATH: PATH});
  var child = spawn('node', argv, {stdio: 'inherit', env: env});

  // When the child exits, pass the exit code to its parent
  child.on('exit', function handleExit (code) {
    process.on('exit', function handleProcessExit () {
      process.exit(code);
    });
  });

  // If the process receives an interrupt, pass it on to the children
  process.on('SIGINT', function handleSigint () {
    child.kill('SIGINT');
  });
  process.on('SIGTERM', function handleSigterm () {
    child.kill('SIGTERM');
  });
}

// Export our function
module.exports = foundryCli;
