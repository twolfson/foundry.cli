// Load in dependencies
var expect = require('chai').expect;
var quote = require('shell-quote').quote;
var childUtils = require('./utils/child-process');

var foundryCliCmd =  __dirname + '/../bin/foundry';

// Start our tests
describe('foundry-cli running in a directory with `foundry`', function () {
  // Emulate how `npm` generates the path to `foundry-cli`
  childUtils.exec(quote(['node', foundryCliCmd, 'hello', 'world']), {
    cwd: __dirname + '/test-files/repo-with-foundry'
  });

  it('has no errors', function () {
    expect(this.err).to.equal(null);
    expect(this.stderr).to.equal('');
  });

  it('invokes `foundry`', function () {
    expect(this.stdout).to.not.equal('');
  });

  it('added `node_modules/.bin/` to the `PATH`', function () {
    expect(JSON.parse(this.stdout).PATH).to.contain(__dirname + '/test-files/repo-with-foundry/node_modules/.bin');
  });

  it('passes along arguments to `foundry`', function () {
    expect(JSON.parse(this.stdout).argv).to.have.length(4);
    expect(JSON.parse(this.stdout).argv[0]).to.equal('node');
    expect(JSON.parse(this.stdout).argv[1]).to.match(/\/foundry$/);
    expect(JSON.parse(this.stdout).argv[2]).to.equal('hello');
    expect(JSON.parse(this.stdout).argv[3]).to.equal('world');
  });

  it('runs the executable in the repo\'s directory', function () {
    expect(JSON.parse(this.stdout).cwd).to.equal(__dirname + '/test-files/repo-with-foundry');
  });
});

describe('foundry-cli running in a directory without `foundry`', function () {
  // Emulate how `npm` generates the path to `foundry-cli`
  childUtils.exec(quote(['node', foundryCliCmd, 'hello', 'world']), {
    cwd: __dirname + '/test-files/repo-without-foundry'
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

describe('foundry-cli running `foundry` that has an error', function () {
  // Emulate how `npm` generates the path to `foundry-cli`
  childUtils.exec(quote(['node', foundryCliCmd, 'hello', 'world']), {
    cwd: __dirname + '/test-files/repo-with-bad-foundry'
  });

  it('has an error', function () {
    expect(this.err).to.not.equal(null);
  });

  it('propagates the exit code', function () {
    expect(this.err.code).to.equal(20);
  });

  it('propagates the stderr', function () {
    expect(this.stderr).to.contain('Oh noes. Something went wrong');
  });
});
