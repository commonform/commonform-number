commonform-number
=================

Number the provisions of a contract

Styles
------

Each numbering style is an object with two string returning functions:

1. `.provision` is for numbers that appear before contract provisions.
2. `.reference` is for references to numbered provisions.

Each function takes an array argument with an arbitrary number of objects of the form:

```javascript
{
  series: {
    number: 1,
    of: 1
  },
  element: {
    number: 1,
    of: 1
  }
}
```

`.number` and `.of` values start at 1, not at 0.

The first element is the numbering of the provision's highest-level parent provision. The last element is the numbering for the provision of interest.
