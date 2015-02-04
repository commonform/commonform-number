/* jshint mocha: true */
var expect = require('chai').expect;
var number = require('..');

describe('Default style', function() {
  it('is decimal', function() {
    expect(number.default)
      .to.equal(number.decimal);
  });
});
