// Load in dependencies
var path = require('path');
var expect = require('chai').expect;
var childUtils = require('./utils/child-process');

var foundryCliCmd =  path.join(__dirname, '..', 'bin', 'foundry');

// Start our tests
describe('foundry.cli running in a directory with `foundry`', function () {
  // Emulate how `npm` generates the path to `foundry.cli`
  childUtils.spawn('node', [foundryCliCmd, 'hello', 'world'], {
    cwd: path.join(__dirname, 'test-files', 'repo-with-foundry')
  });

  it('has no errors', function () {
    expect(this.err).to.equal(null);
    expect(this.stderr).to.equal('');
  });

  it('invokes `foundry`', function () {
    expect(this.stdout).to.not.equal('');
  });

  it('added `node_modules/.bin/` to the `PATH`', function () {
    var actualPaths = JSON.parse(this.stdout).PATH.split(path.delimiter);
    var expectedPath = path.join(__dirname, 'test-files', 'repo-with-foundry', 'node_modules', '.bin');
    expect(actualPaths).to.contain(expectedPath);
  });

  it('passes along arguments to `foundry`', function () {
    expect(JSON.parse(this.stdout).argv).to.have.length(4);
    // DEV: In `node@4.1` on Travis CI, `node` becomes a full path. Likely due to symlinks
    // DEV: Use `\\` for Windows testing
    expect(JSON.parse(this.stdout).argv[0]).to.match(/(^node|\/node|\\node.exe)$/);
    expect(JSON.parse(this.stdout).argv[1]).to.match(/(\/|\\)foundry$/);
    expect(JSON.parse(this.stdout).argv[2]).to.equal('hello');
    expect(JSON.parse(this.stdout).argv[3]).to.equal('world');
  });

  it('runs the executable in the repo\'s directory', function () {
    expect(JSON.parse(this.stdout).cwd).to.equal(path.join(__dirname, 'test-files', 'repo-with-foundry'));
  });
});

describe('foundry.cli running in a directory without `foundry`', function () {
  // Emulate how `npm` generates the path to `foundry.cli`
  childUtils.spawn('node', [foundryCliCmd, 'hello', 'world'], {
    cwd: path.join(__dirname, 'test-files', 'repo-without-foundry')
  });

  it('has an error', function () {
    expect(this.err).to.not.equal(null);
    expect(this.stderr).to.contain('Locally installed `foundry` wasn\'t found. ' +
      'Please make sure it has been installed to `node_modules` via `npm`.');
  });

  it('has no output', function () {
    expect(this.stdout).to.equal('');
  });
});

describe('foundry.cli running `foundry` that has an error', function () {
  // Emulate how `npm` generates the path to `foundry.cli`
  childUtils.spawn('node', [foundryCliCmd, 'hello', 'world'], {
    cwd: path.join(__dirname, 'test-files', 'repo-with-bad-foundry')
  });

  it('has an error', function () {
    expect(this.err).to.not.equal(null);
  });

  it('propagates the exit code', function () {
    // DEV: Since we are using `buffered-spawn`, this is `err.status` over `err.code`
    expect(this.err.status).to.equal(20);
  });

  it('propagates the stderr', function () {
    expect(this.stderr).to.contain('Oh noes. Something went wrong');
  });
});

// DEV: This is a test case to verify we don't break bash completion
//   Case to reproduce:
//      Type `foundry rel<tab>` in non-git directory
//      Navigate to git directory
//      Type `git checkout or<tab>`
//      Expected: Autocompletes to `git checkout origin/`
//      Actual: No autocompletion takes place yet it works in a fresh tab
describe('foundry.cli running completion in a directory without `foundry`', function () {
  // Emulate how `npm` generates the path to `foundry.cli`
  childUtils.spawn('node', [foundryCliCmd, 'completion', '--', 'foundry rel'], {
    cwd: path.join(__dirname, 'test-files', 'repo-without-foundry')
  });

  it('silently exits', function () {
    expect(this.err).to.equal(null);
    expect(this.stdout).to.equal('');
    expect(this.stderr).to.equal('');
  });
});
