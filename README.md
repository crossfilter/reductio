Reductio: Crossfilter grouping
========

Reductio is a library for generating Crossfilter reduce functions and applying them to Crossfilter groups. Crossfilter supports basic count and sum aggregations, but even aggregations as conceptually simple as a group minimum or maximum can be difficult to build correctly and efficiently on a Crossfilter group. Reductio provides helper functions that generate these aggregations in an efficient and composable way, making it easy to use more complex aggregations with Crossfilter and to have more than one aggregation per group without having to worry about designing 2-way reduce functions.

[![NPM version](http://img.shields.io/npm/v/reductio.svg?style=flat)](https://www.npmjs.org/package/reductio)
[![Bower version](http://img.shields.io/bower/v/reductio.svg?style=flat)](http://bower.io/search/?q=reductio)
[![Travis build status](http://img.shields.io/travis/esjewett/reductio/master.svg?style=flat)](https://travis-ci.org/esjewett/reductio)
[![Code Climate](https://codeclimate.com/github/esjewett/reductio/badges/gpa.svg)](https://codeclimate.com/github/esjewett/reductio)
[![Dependency Status](https://david-dm.org/esjewett/reductio.svg?style=flat)](https://david-dm.org/esjewett/reductio)

* [Aggregations](#aggregations)
    * [Standard aggregations](#aggregations-standard-aggregations)
        * [Count](#aggregations-standard-aggregations-count)
        * [Sum](#aggregations-standard-aggregations-sum)
        * [Average](#aggregations-standard-aggregations-average)
        * [Median](#aggregations-standard-aggregations-median)
        * [Minimum, Maximum, Median](#aggregations-standard-aggregations-minimum-maximum-median)
        * [Sum of squares](#aggregations-standard-aggregations-sum-of-squares)
        * [Standard deviation](#aggregations-standard-aggregations-standard-deviation)
        * [Histogram](#aggregations-standard-aggregations-histogram)
        * [Values or sub-groupings](#aggregations-standard-aggregations-values-or-sub-groupings)
        * [Nest](#aggregations-standard-aggregations-nest)
        * [Alias](#aggregations-standard-aggregations-alias)
    * [groupAll aggregations](#aggregations-groupall-aggregations)
    * [Chaining aggregations](#aggregations-chaining-aggregations)
* [Example](#example)
    * [Exception aggregation](#example-exception-aggregation)


<h1 id="aggregations">Aggregations</h1>

Aggregations are composable (so you can track more than one aggregation on a given group) and may depend on each other (the 'avg' aggregation requires that 'count' and 'sum' be specified).

<h2 id="aggregations-standard-aggregations">Standard aggregations</h2>
Current aggregations supported are shown given the following setup.

```
var data = crossfilter([...]);
var dim = data.dimension(...);
var group = dim.group();
var reducer;
```

<h3 id="aggregations-standard-aggregations-count">Count</h3>
```
reducer = reductio().count(true);
// Same as group.reduceCount()
reducer(group);
```

Stored under the 'count' property of groups. The value will be a count of every record that matches the group accessor.

<h3 id="aggregations-standard-aggregations-sum">Sum</h3>
```
// accessorFunction must return a number
reducer = reductio().sum(accessorFunction);
// Same as group.reduceSum(accessor)
reducer(group);
```

Stored under the 'sum' property of groups. The value is a sum of ```accessor(d)``` for every record ```d``` that matches the group accessor.

<h3 id="aggregations-standard-aggregations-average">Average</h3>
```
// There is no need to use the intermediate 'reducer' variable if you are not going to re-use the reducer.
//
// .count(true) and .sum(...) must both be specified
reductio().avg(true)(group);
```
Stored under the 'avg' property of groups. Depends on *count* and *sum* aggregations being specified. Is equal to sum/count for the group.

<h3 id="aggregations-standard-aggregations-median">Median</h3>
```
// Median value returned by accessor function within each group 

```

<h3 id="aggregations-standard-aggregations-minimum-maximum-median">Minimum, Maximum, Median</h3>
```
// Minimum and maximum
reductio().min(accessorFunction)(group);
reductio().max(accessorFunction)(group);
reductio().median(accessorFunction)(group);
```
Stored under the 'median', 'min', and 'max' property of groups.

New in 0.0.6: Once you've defined one accessor function for min, max, or median (or if you have explicitly defined a ```valueList(accessorFunction)```) it will be used by the others. This avoids warning messages about overwriting the valueList.

```
// Min, max, median as boolean. (as of 0.0.6)
reductio().min(accessorFunction).max(true).median(true)(group);
```

<h3 id="aggregations-standard-aggregations-sum-of-squares">Sum of squares</h3>
```
// Sum of squares (used in standard deviation) (as of 0.0.3)
reductio().sumOfSq(accessorFunction)(group);
```
Stored under the 'sumOfSq' property of the group. Defined as the square of the value returned by the accessor function summed over all records in the group.

<h3 id="aggregations-standard-aggregations-standard-deviation">Standard deviation</h3>
```
// Standard deviation (as of 0.0.3)
reductio().sumOfSq(accessorFunction).sum(accessorFunction).count(true).std(true)(group);
reductio().std(accessorFunction)(group);
```
Stored under the 'std' property of the group. Defined as the sum-of-squares minus the average of the square of sums for all records in the group. In other words, for group 'g', ```g.sumOfSq - g.sum*g.sum/g.count```.

If ```sumOfSq```, ```sum```, and ```count``` are already defined, takes a boolean. Otherwise you can pass in an accessorFunction directly.

<h3 id="aggregations-standard-aggregations-histogram">Histogram</h3>
```
reductio().histogramBins([0,2,6,10])                            // Bin thresholds
        .histogramValue(function(d) { return d.bar; })(group)   // Value to bin
```

Histogram of values within grouping, stored on the 'histogram' property of the group. Acts like [d3.layout.histogram](https://github.com/mbostock/d3/wiki/Histogram-Layout) defined using bins(thresholds).

This grouping should be usable anywhere d3.layout.histogram can be used. May be useful for small-multiples charts, or for use with the dc.js stack mixin.

The property ```group.histogram``` is an array. Each element of the array is a sorted array of values returned by ```histogramValue``` that fall into that bin. Each element of the array also has properties, x, dx, and y, as defined in the d3.layout.histogram documentation.

<h3 id="aggregations-standard-aggregations-values-or-sub-groupings">Values or sub-groupings</h3>
```
var reducer = reductio();
reducer.value("x").sum(xSumAccessor);
reducer.value("y").count(true).sum(ySumAccessor).avg(true);
reducer(group);
```

Allows group structures such as
```
{
  x: { sum: 5 }
  y: { count: 3, sum: 12, avg: 4 }
}
```

Used for tracking multiple aggregations on a single group. For example, sum of x and sum of y. Useful for visualizations like scatter-plots where individual marks represent multiple dimensions in the data.

<h3 id="aggregations-standard-aggregations-nest">Nest</h3>
```
reductio().nest([keyAccessor1, keyAccessor2])(group)
```

Stored under the 'nest' property of the group.

Provides a result similar to ```d3.nest().key(keyAccessor1).key(keyAccessor2)``` when applied to the records in the group.

Usually you'll want to use the group key as the first level of nesting, then use this to accomplish sub-group nesting.

Note that leaves will not be created when there is no record with that value in the branch. However, once a leaf is created it is not currently removed, so there is the possibility of leaves with empty 'values' arrays. Check for this.

<h3 id="aggregations-standard-aggregations-alias">Alias</h3>
```
reductio().count(true).alias({ newCount: function(g) { return g.count; } });
```

Allows definition of an accessor function of any name on the group that returns a value from the group. At the moment only functions are allowed, which allows us to define the accessor at initialization-time. In the future it would be good to support aliased properties as well because this would allow recreating a data structure in the exact form required for another library.

On the group, we can then call the following to retrieve the count value.
```
group.top(1)[0].newCount();
```

<h2 id="aggregations-groupall-aggregations">groupAll aggregations</h2>

Sometimes it is necessary to include one record in multiple groups. This is common in OLAP scenarios, classification, and tracking moving averages, to give a few examples. Say we have a data set like

```
[
  { foo: 'one', num: 1 },
  { foo: 'two', num: 2 },
  { foo: 'three', num: 2 },
  { foo: 'one', num: 3 },
  { foo: 'one', num: 4 },
  { foo: 'two', num: 5 },
]
```

We want to track a moving count of the last 2 values on the ```num``` property. So our group with a key ```2``` should count up all records with a ```num``` of ```2``` *or* ```1```. Normally this must be done using the Crossfilter dimension.groupAll method. With reductio we can use all the standard reductio reducers in this type of scenario by specifying some additional groupAll information and called the reducer on the output of ```dimension.groupAll``` *instead* of the output of ```dimension.group```.

reductio().groupAll takes a single argument: a function that takes a record from the data set (e.g. ```{ foo: 'three', num: 2 }```) and returns an array of keys of the groups that the record should be included in (e.g. ```[2,3]```). This is a very simple example, but the same thing could be done for dates, with a function for a 5-day moving average returning an array of 5 dates.

```
data.dimension(function(d) { return d.num; });
filterDim = data.dimension(function(d) { return d.foo; });
groupAll = dim.groupAll();

var reducer = reductio()
  .groupAll(function(record) {
    if(record.num === 5) {
      return [5];
    } else {
      return [record.num, record.num+1];
    }
  })
  .count(true);

reducer(groupAll);
```

<h2 id="aggregations-chaining-aggregations">Chaining aggregations</h2>
Aggregations can be chained on a given instance of reductio. For example:

```
reductio().count(true)
    .sum(function(d) { return d.bar; })
    .avg(true)(group);
```

<h1 id="example">Example</h1>

Basic use:

```
var data = crossfilter([
  { foo: 'one', bar: 1 },
  { foo: 'two', bar: 2 },
  { foo: 'three', bar: 3 },
  { foo: 'one', bar: 4 },
  { foo: 'one', bar: 5 },
  { foo: 'two', bar: 6 },
]);

var dim = data.dimension(function(d) { return d.foo; });
var group = dim.group();

// Equivalent to reductio().avg(function(d) { return d.bar; }), which sets the .sum() and .count() values.
var reducer = reductio()
    .count(true)
    .sum(function(d) { return d.bar; })
    .avg(true);

// Now it should track count, sum, and avg.
reducer(group);

group.top(Infinity);
// [ { key: 'one', value: { count: 3, sum: 10, avg: 3.3333333 },
//   { key: 'two', value: { count: 2, sum: 8, avg: 4 },
//   { key: 'three', value: { count: 1, sum: 3, avg: 3 } ]
```

<h2 id="example-exception-aggregation">Exception aggregation</h2>
We also support exception aggregation. For our purposes, this means only aggregating once for each unique value that the exception accessor returns. So:

```
var data = crossfilter([
  { foo: 'one', bar: 'A', num: 1 },
  { foo: 'two', bar: 'B', num: 2 },
  { foo: 'three', bar: 'A', num: 3 },
  { foo: 'one', bar: 'B', num: 2 },
  { foo: 'one', bar: 'A', num: 1 },
  { foo: 'two', bar: 'B', num: 2 },
]);

var dim = data.dimension(function(d) { return d.foo; });
var group = dim.group();

var reducer = reductio()
    .exception(function(d) { return d.bar; })
    .exceptionCount(true)
    .exceptionSum(function(d) { return d.num; });

reducer(group);

group.top(Infinity);
// [ { key: 'one', value: { exceptionCount: 2, exceptionSum: 3 },    // 'bar' dimension has 2 values: 'A' and 'B'.
//   { key: 'two', value: { exceptionCount: 1, exceptionSum: 2 },    // 'bar' dimension has 1 value: 'B'.
//   { key: 'three', value: { exceptionCount: 1 , exceptionSum: 3} ] // 'bar' dimension has 1 value: 'A'.
```

Right now we support exceptionCount and exceptionSum, but it might also make sense to support other types of dependent aggregation. These types of aggregations are meant to help with a situation where you want to use Crossfilter on a flattened one-to-many or many-to-many relational model, which can result in redundant values. When using exceptionSum, make sure that for each value within a group that the exception accessor returns, the exceptionSum accessor returns an identical value, or results will be unpredictable.
