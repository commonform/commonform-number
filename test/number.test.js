/* jshint mocha: true */
var Immutable = require('immutable');
var expect = require('chai').expect;
var number = require('..');

var A = {form: {content:['A']}};
var B = {form: {content:['A']}};

var xOfy = function(x, y) {
  return {number: x, of: y};
};

var makeForm = function(content) {
  return Immutable.fromJS({
    content: content
  });
};

describe('number', function() {
  it('returns an immutable map', function() {
    expect(Immutable.Map.isMap(number(makeForm(['test']))))
      .to.be.true();
  });

  it('numbers sub-forms', function() {
    expect(number(makeForm(['blah', A, B])).toJS())
      .to.eql({
        form: {
          content: {
            1: {
              numbering: [{series: xOfy(1, 1), element: xOfy(1, 2)}]
            },
            2: {
              numbering: [{series: xOfy(1, 1), element: xOfy(2, 2)}]
            }
          }
        },
        summaries: {}
      });
  });

  it('numbers non-contiguous series', function() {
    expect(number(makeForm([A, 'blah', B])).toJS())
      .to.eql({
        form: {
          content: {
            0: {
              numbering: [{series: xOfy(1, 2), element: xOfy(1, 1)}]
            },
            2: {
              numbering: [{series: xOfy(2, 2), element: xOfy(1, 1)}]
            }
          }
        },
        summaries: {}
      });
  });

  it('maps summaries to numberings', function() {
    var first = [{series: xOfy(1, 1), element: xOfy(1, 2)}];
    var second = [{series: xOfy(1, 1), element: xOfy(2, 2)}];
    expect(number(makeForm([
      {
        summary: 'A',
        form: {
          content: ['text']
        },
      }, {
        summary: 'A',
        form: {
          content: ['another']
        }
      }
    ])).toJS())
      .to.eql({
        form: {
          content: {
            0: {numbering: first},
            1: {numbering: second}
          }
        },
        summaries: {
          A: [first, second]
        }
      });
  });

  it('numbers nested sub-forms', function() {
    var form = Immutable.fromJS({
      content: [
        'before',
        {
          summary: 'A',
          form: {
            conspicuous: 'true',
            content: [
              'before',
              {
                form: {
                  content: ['B']
                }
              },
              {
                form: {
                  content: ['C']
                }
              },
              'between',
              {
                form: {
                  content: ['D']
                }
              },
              {
                form: {
                  content: ['E']
                }
              },
              'after'
            ]
          }
        },
        'after'
      ]
    });

    expect(
      number(form)
        .get('form').toJS())
      .to.eql({
        content: {
          1: {
            numbering: [
              {series: xOfy(1, 1), element: xOfy(1, 1)}
            ],
            form: {
              content: {
                1: {
                  numbering: [
                    {series: xOfy(1, 1), element: xOfy(1, 1)},
                    {series: xOfy(1, 2), element: xOfy(1, 2)}
                  ]
                },
                2: {
                  numbering: [
                    {series: xOfy(1, 1), element: xOfy(1, 1)},
                    {series: xOfy(1, 2), element: xOfy(2, 2)}]},
                4: {
                  numbering: [
                    {series: xOfy(1, 1), element: xOfy(1, 1)},
                    {series: xOfy(2, 2), element: xOfy(1, 2)}]},
                5: {
                  numbering: [
                    {series: xOfy(1, 1), element: xOfy(1, 1)},
                    {series: xOfy(2, 2), element: xOfy(2, 2)}
                  ]
                }
              }
            }
          }
        }
      }
    );
  });
});
