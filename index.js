/*
Copyright 2016 Kyle E. Mitchell

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

var groupSeries = require('commonform-group-series')

var number = function (form, numberings, headings, parentNumbering) {
  var seriesNumber = 0
  var elementIndex = 0

  var groups = groupSeries(form)

  // Count series, to provide X of Y numberings later.
  var seriesCount = groups
    .filter(function (group) { return group.type === 'series' })
    .length

  // Compute numberings.
  groups.forEach(function (group) {
    if (group.type !== 'series') {
      elementIndex += group.content.length
    } else {
      seriesNumber++
      if (!numberings.hasOwnProperty('content')) {
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
        if (child.hasOwnProperty('heading')) {
          var heading = child.heading
          if (!headings.hasOwnProperty(heading)) {
            headings[heading] = []
          }
          headings[heading].push(childNumbering)
        }

        // Recursion
        var nextNumberings = {}
        number(child.form, nextNumberings, headings, childNumbering)
        if (nextNumberings.hasOwnProperty('content')) {
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
