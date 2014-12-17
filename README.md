Reductio: Crossfilter grouping
========

Reductio is a library for generating Crossfilter reduce functions and applying them to Crossfilter groups. Aggregations are additive (so you can track more than one aggregation on a given group) and can depend on each other (the 'avg' aggregation requires that 'count' and 'sum' be specified).

Current aggregations supported are:

```
var data = crossfilter([...]);
var dim = data.dimension(...);
var group = dim.group();
var reducer;

reducer = reductio().count(true);
// Same as group.reduceCount()
reducer(group);

// accessorFunction must return a number
reducer = reductio().sum(accessorFunction);
// Same as group.reduceSum(accessor)
reducer(group);

// There is no need to use the intermediate 'reducer' variable if you are not going to re-use the reducer.

// .count(true) and .sum(...) must both be specified
reductio().avg(true)(group);

// Median value returned by accessor function within each group 
reductio().median(accessorFunction)(group);

// Minimum and maximum
reductio().min(accessorFunction)(group);
reductio().max(accessorFunction)(group);

// Sum of squares (used in standard deviation) (as of 0.0.3)
reductio().sumOfSq(accessorFunction)(group);

// Standard deviation (as of 0.0.3)
reductio().sumOfSq(accessorFunction).std(true)(group);
reductio().std(accessorFunction)(group);

// Histogram of values within grouping. Acts like d3.layout.histogram defined using bins(thresholds).
// https://github.com/mbostock/d3/wiki/Histogram-Layout
//
// This grouping should be usable anywhere d3.layout.histogram can be used. May be useful for small-
// multiples charts, or for use with the dc.js stack mixin.
//
// group.histogram is an array. Each element of the array is a sorted array of values returned by
// histogramValue that fall into that bin. Each element of the array also has properties, x, dx,
// and y, as defined in the d3.layout.histogram documentation.
reductio().histogramBins([0,2,6,10])                            // Bin thresholds
        .histogramValue(function(d) { return d.bar; })(group)   // Value to bin

// Values/sub-groups (as of 0.0.4)
// 
// Allows group structures such as
// {
//   x: { sum: 5 }
//   y: { count: 3, sum: 12, avg: 4 }
// }
//
// Used for tracking multiple aggregations on a single group. For example, sum of x and y.

var reducer = reductio();
reducer.value("x").sum(xSumAccessor);
reducer.value("y").count(true).sum(ySumAccessor).avg(true);
reducer(group);
```

Aggregations can be chained on a given instance of reductio. For example:

```
reductio().count(true)
    .sum(function(d) { return d.bar; })
    .avg(true)(group);
```

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
