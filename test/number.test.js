/* jshint mocha: true */
var Immutable = require('immutable');
var expect = require('chai').expect;
var validate = require('commonform-validate');
var number = require('..');

var A = {
  inclusion: {
    content:['A']
  }
};
var B = {
  inclusion: {
    content:['A']
  }
};

var xOfy = function(x, y) {
  return {
    number: x,
    of: y
  };
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

  it('handles valid form objects', function() {
    expect(validate.nestedForm(makeForm([A, B])))
      .to.be.true();
  });

  it('numbers inclusions', function() {
    expect(number(makeForm(['blah', A, B])).toJS())
      .to.eql({
        form: {
          content: {
            1: {
              numbering: [
                {
                  series: xOfy(1, 1),
                  element: xOfy(1, 2)
                }
              ]
            },
            2: {
              numbering: [
                {
                  series: xOfy(1, 1),
                  element: xOfy(2, 2)
                }
              ]
            }
          }
        },
        headings: {}
      });
  });

  it('numbers non-contiguous series', function() {
    expect(number(makeForm([A, 'blah', B])).toJS())
      .to.eql({
        form: {
          content: {
            0: {
              numbering: [
                {
                  series: xOfy(1, 2),
                  element: xOfy(1, 1)
                }
              ]
            },
            2: {
              numbering: [
                {
                  series: xOfy(2, 2),
                  element: xOfy(1, 1)
                }
              ]
            }
          }
        },
        headings: {}
      });
  });

  it('maps headings to numberings', function() {
    var first = [
      {
        series: xOfy(1, 1),
        element: xOfy(1, 2)
      }
    ];
    var second = [
      {
        series: xOfy(1, 1),
        element: xOfy(2, 2)
      }
    ];
    expect(number(makeForm([
      {
        heading: 'A',
        inclusion: {
          content: ['text']
        },
      }, {
        heading: 'A',
        inclusion: {
          content: ['another']
        }
      }
    ])).toJS())
      .to.eql({
        form: {
          content: {
            0: {
              numbering: first
            },
            1: {
              numbering: second
            }
          }
        },
        headings: {
          A: [
            first,
            second
          ]
        }
      });
  });

  it('numbers nested inclusions', function() {
    var form = Immutable.fromJS({
      content: [
        'before',
        {
          heading: 'A',
          inclusion: {
            conspicuous: 'true',
            content: [
              'before',
              {
                inclusion: {
                  content: ['B']
                }
              },
              {
                inclusion: {
                  content: ['C']
                }
              },
              'between',
              {
                inclusion: {
                  content: ['D']
                }
              },
              {
                inclusion: {
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
              {
                series: xOfy(1, 1),
                element: xOfy(1, 1)
              }
            ],
            inclusion: {
              content: {
                1: {
                  numbering: [
                    {
                      series: xOfy(1, 1),
                      element: xOfy(1, 1)
                    },
                    {
                      series: xOfy(1, 2),
                      element: xOfy(1, 2)
                    }
                  ]
                },
                2: {
                  numbering: [
                    {
                      series: xOfy(1, 1),
                      element: xOfy(1, 1)
                    },
                    {
                      series: xOfy(1, 2),
                      element: xOfy(2, 2)
                    }
                  ]
                },
                4: {
                  numbering: [
                    {
                      series: xOfy(1, 1),
                      element: xOfy(1, 1)
                    },
                    {
                      series: xOfy(2, 2),
                      element: xOfy(1, 2)
                    }
                  ]
                },
                5: {
                  numbering: [
                    {
                      series: xOfy(1, 1),
                      element: xOfy(1, 1)
                    },
                    {
                      series: xOfy(2, 2),
                      element: xOfy(2, 2)
                    }
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
