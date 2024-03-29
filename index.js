var groupSeries = require('commonform-group-series')
var has = require('has')
var predicate = require('commonform-predicate')

var number = function (form, numberings, headings, parentNumbering) {
  var seriesNumber = 0
  var elementIndex = 0

  var groups = groupSeries(form)

  // Count series, to provide X of Y numberings later.
  var seriesCount = groups
    .filter(function (group) {
      return group.type === 'series'
    })
    .length

  // Compute numberings.
  groups.forEach(function (group) {
    if (group.type !== 'series') {
      elementIndex += group.content.length
    } else {
      seriesNumber++
      if (!has(numberings, 'content')) {
        numberings.content = {}
      }
      var contentNumberings = numberings.content
      group.content.forEach(function (child, childIndex, content) {
        var index = elementIndex++

        // Numbering
        var childNumbering = parentNumbering.concat([{
          series: {
            number: seriesNumber,
            of: seriesCount
          },
          element: {
            number: childIndex + 1,
            of: content.length
          }
        }])
        var childNumberings = contentNumberings[index] = {}
        childNumberings.numbering = childNumbering

        // Heading
        if (has(child, 'heading')) {
          var heading = child.heading
          if (!has(headings, heading)) {
            headings[heading] = []
          }
          headings[heading].push(childNumbering)
        }

        // Recursion
        if (predicate.component(child)) return
        var nextNumberings = {}
        number(child.form, nextNumberings, headings, childNumbering)
        if (has(nextNumberings, 'content')) {
          childNumberings.form = nextNumberings
        }
      })
    }
  })
}

module.exports = function (form) {
  var numberings = {}
  var headings = {}
  number(form, numberings, headings, [])
  return {
    form: numberings,
    headings: headings
  }
}
