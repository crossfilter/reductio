Reductio: Crossfilter grouping
========

Reductio is a library for generating Crossfilter reduce functions and applying them to Crossfilter groups. Aggregations are additive (so you can track more than one aggregation on a given group) and can depend on each other (the 'avg' aggregation requires that 'count' and 'sum' be specified).

Current aggregations supported are:

```
reductio().count(true);
reductio().sum(accessorFunction); // accessorFunction must return a number
reductio().avg(true);             // .count(true) and .sum(...) must both be specified
```

Aggregations can be chained on a given instance of reductio. For example:

```
reductio().count(true)
    .sum(function(d) { return d.bar; })
    .avg(true);
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

var reducer = reductio()
    .count(true)
    .sum(function(d) { return d.bar; })
    .avg(true);

// Now it should track count, sum, and avg.
reducer(group);

group.top(Infinity);
// [ { key: 'one', value: { count: 3, sum: 10, avg: 3.3333333 },
//   { key: 'one', value: { count: 2, sum: 8, avg: 4 },
//   { key: 'one', value: { count: 1, sum: 3, avg: 3 } ]
```
