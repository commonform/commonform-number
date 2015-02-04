// Section 1.
//   1.1.
//     1.1.1.
//       1.1.1.1.

var alpha = require('lower-alpha');

var n = function(numbering) {
  return numbering
    .map(function(component) {
      var series = component.series;
      return series.of > 1 ?
        alpha(series.number) + '-' + component.element.number :
        component.element.number;
    })
    .join('.')
    .toUpperCase();
};

exports.provision = function(numbering) {
  return n(numbering) + '.';
};

exports.reference = function(numbering) {
  return 'Clause ' + n(numbering);
};
