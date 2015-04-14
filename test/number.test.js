/* jshint mocha: true */
var expect = require('chai').expect;
var validate = require('commonform-validate');
var number = require('..');

var A = {
  form: {
    content:['A']
  }
};

var B = {
  form: {
    content:['A']
  }
};

describe('commonform-number', function() {
  it('returns a map', function() {
    expect(number({content: ['test']})).to.be.an('object');
  });

  it('handles valid form objects', function() {
    expect(validate.form({content: [A, B]})).to.equal(true);
  });

  it('numbers children', function() {
    expect(
      number({content: ['blah', A, B]})
    ).to.eql({
      form: {
        content: {
          1: {
            numbering: [
              {
                series: {number: 1, of: 1},
                element: {number: 1, of: 2}
              }
            ]
          },
          2: {
            numbering: [
              {
                series: {number: 1, of: 1},
                element: {number: 2, of: 2}
              }
            ]
          }
        }
      },
      headings: {}
    });
  });

  it('numbers non-contiguous series', function() {
    expect(
      number({content: [A, 'blah', B]})
    )
    .to.eql({
      form: {
        content: {
          0: {
            numbering: [
              {
                series: {number: 1, of: 2},
                element: {number: 1, of: 1}
              }
            ]
          },
          2: {
            numbering: [
              {
                series: {number: 2, of: 2},
                element: {number: 1, of: 1}
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
        series: {number: 1, of: 1},
        element: {number: 1, of: 2}
      }
    ];
    var second = [
      {
        series: {number: 1, of: 1},
        element: {number: 2, of: 2}
      }
    ];
    expect(
      number({
        content: [
          {
            heading: 'A',
            form: {
              content: ['text']
            },
          }, {
            heading: 'A',
            form: {
              content: ['another']
            }
          }
        ]
      })
    ).to.eql({
      form: {
        content: {
          0: {numbering: first},
          1: {numbering: second}
        }
      },
      headings: {
        A: [first, second]
      }
    });
  });

  it('numbers nested children', function() {
    var form = {
      content: [
        'before',
        {
          heading: 'A',
          form: {
            conspicuous: 'yes',
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
    };

    expect(
      number(form).form
    ).to.eql({
      content: {
        1: {
          numbering: [
            {
              series: {number: 1, of: 1},
              element: {number: 1, of: 1}
            }
          ],
          form: {
            content: {
              1: {
                numbering: [
                  {
                    series: {number: 1, of: 1},
                    element: {number: 1, of: 1}
                  },
                  {
                    series: {number: 1, of: 2},
                    element: {number: 1, of: 2}
                  }
                ]
              },
              2: {
                numbering: [
                  {
                    series: {number: 1, of: 1},
                    element: {number: 1, of: 1}
                  },
                  {
                    series: {number: 1, of: 2},
                    element: {number: 2, of: 2}
                  }
                ]
              },
              4: {
                numbering: [
                  {
                    series: {number: 1, of: 1},
                    element: {number: 1, of: 1}
                  },
                  {
                    series: {number: 2, of: 2},
                    element: {number: 1, of: 2}
                  }
                ]
              },
              5: {
                numbering: [
                  {
                    series: {number: 1, of: 1},
                    element: {number: 1, of: 1}
                  },
                  {
                    series: {number: 2, of: 2},
                    element: {number: 2, of: 2}
                  }
                ]
              }
            }
          }
        }
      }
    });
  });
});
