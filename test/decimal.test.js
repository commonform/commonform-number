/* jshint node: true, mocha: true */
var expect = require('chai').expect;
var number = require('..');

var xofy = function(x, y) {
  return {number: x, of: y};
};

describe('Decimal style', function() {
  describe('provision numbering', function() {
    it('uses alphabetic prefixes for multiple series', function() {
      expect(number.decimal.provision([
        {series: xofy(1, 2), element: xofy(1, 1)}
      ]))
          .to.equal('A-1.');
    });
  });

  describe('reference numbering', function() {
    it('uses alphabetic prefixes for multiple series', function() {
      expect(number.decimal.reference([
        {series: xofy(1, 2), element: xofy(1, 1)}
      ]))
          .to.equal('Clause A-1');
    });

    it('uses Arabic numerals for all levels', function() {
      expect(number.decimal.reference([
        {series: xofy(1, 1), element: xofy(1, 1)},
        {series: xofy(1, 1), element: xofy(1, 1)},
        {series: xofy(1, 1), element: xofy(1, 1)},
        {series: xofy(1, 1), element: xofy(1, 1)}
      ]))
          .to.equal('Clause 1.1.1.1');
    });
  });
});
