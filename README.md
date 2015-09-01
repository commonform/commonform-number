```javascript
var number = require('commonform-number')
var assert = require('assert')

var A = { form: { content: [ 'A' ] } }
var B = { form: { content: [ 'B' ] } }

assert.deepEqual(
  number({ content: [ 'blah', A, B ] }),
  { form: {
      content: {
        1: { numbering: [
              { series:  { number: 1, of: 1 },
                element: { number: 1, of: 2 } } ] },
        2: { numbering: [
              { series:  { number: 1, of: 1 },
                element: { number: 2, of: 2 } } ] } } },
    headings: { } },
  'numbers children')

assert.deepEqual(
  number({ content: [ A, 'blah', B ] }),
  { form: {
      content: {
        0: { numbering: [
              { series:  { number: 1, of: 2 },
                element: { number: 1, of: 1 } } ] },
        2: { numbering: [
              { series:  { number: 2, of: 2 },
                element: { number: 1, of: 1 } } ] } } },
    headings: { } },
  'numbers non-contiguous series')

var first = [
  { series:  { number: 1, of: 1 },
    element: { number: 1, of: 2 } } ]

var second = [
  { series:  { number: 1, of: 1 },
    element: { number: 2, of: 2 } } ]

assert.deepEqual(
  number({
    content: [
      { heading: 'A',
        form: { content: [ 'text' ] } },
      { heading: 'A',
        form: { content: [ 'another' ] } } ] }),
  { form: {
      content: {
        0: { numbering: first  },
        1: { numbering: second  }  }  },
    headings: { A: [ first, second  ]  }  },
  'maps headings to numberings')

var form = {
  content: [
    'before',
    { heading: 'A',
      form: {
        conspicuous: 'yes',
        content: [
          'before',
          { form: { content: [ 'B' ] } },
          { form: { content: [ 'C' ] } },
          'between',
          { form: { content: [ 'D' ] } },
          { form: { content: [ 'E' ] } },
          'after' ] } },
    'after' ] }

assert.deepEqual(
  number(form).form,
  { content: {
      1: {
        numbering: [
          { series:  { number: 1, of: 1 },
            element: { number: 1, of: 1 } } ],
        form: {
          content: {
            1: { numbering: [
                  { series:  { number: 1, of: 1 },
                    element: { number: 1, of: 1 } },
                  { series:  { number: 1, of: 2 },
                    element: { number: 1, of: 2 } } ] },
            2: { numbering: [
                  { series:  { number: 1, of: 1 },
                    element: { number: 1, of: 1 } },
                  { series:  { number: 1, of: 2 },
                    element: { number: 2, of: 2 } } ] },
            4: { numbering: [
                  { series:  { number: 1, of: 1 },
                    element: { number: 1, of: 1 } },
                  { series:  { number: 2, of: 2 },
                    element: { number: 1, of: 2 } } ] },
            5: { numbering: [
                  { series:  { number: 1, of: 1 },
                    element: { number: 1, of: 1 } },
                  { series:  { number: 2, of: 2 },
                    element: { number: 2, of: 2 } } ] } } } } } },
  'numbers nested children')
```
