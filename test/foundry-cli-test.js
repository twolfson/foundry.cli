// Load in dependencies
var assert = require('assert');
var foundryCli = require('../');

// Start our tests
describe('foundry-cli', function () {
  it('returns awesome', function () {
    assert.strictEqual(foundryCli(), 'awesome');
  });
});
