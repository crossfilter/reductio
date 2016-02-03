Notes on development, possible changes, possible features

API definition:
```
	reductio <-- crossfilter (optional?)
		dimension(accessor | property, type)
			group(accessor | property, type)
				accessor (returns the accessor)
				count
				sum
				avg <-- change to 'average'?
				min <-- change to 'minimum'?
				max <-- change to 'maximum'?
				median
				sumOfSq <-- name change?
				std <-- name change?
				histogram(bins, value) ??
					x histogramBins
					x histogramValue
				value
					...
				filter
				nest
				alias
				aliasProp <-- name change? Or just get rid of it - efficiency issues
				uniqueBy (formerly exception) / distinct?
					count
					sum
			groupAll
				...
			accessor (returns the accessor)
			groups - array of current groups on the dimension
		dimensions - array of current dimensions
```

Checks on dimension accessors for basic natural-ordered-ness. More less just checking if it always returns values of the same type for different types of edge-case inputs (text, number, 0, Infinity, "", [], {}, undefined, null, NaN)

Dimension accessor helpers? We have some pretty complex time-dimension accessors in Palladio.



Pre-aggregation is intended to serve as a framework for thinking through a 2-stage aggregation process.

Stage 1 - Usually server-side, aggregating over all dimensions that are not relevant in the Reductio/Crossfilter and then sending to the client-side

Stage 2 - Crossfilter/Reductio client-side aggregation with pure client-side filtering and re-aggregation

The intent is to allow interactive filtering and aggregation on data sets that are too large to fit client-side. The problem is that 2-stage aggregations can be challenging.

Pre-aggregation strategies:
```
	count - sum a fake '1' dimension - can use the same dimension pre/post aggregation
	sum - commutative across aggregation
	avg - pure post-aggregation calculation
	min - commutative
	max - commutative
	median - ???
	sumOfSq - ???
	std - ???
	histogram - ???
	value - ???
	filter - pure push-down (need a non-closure definition syntax)
	nest - ???
	alias - pure post-aggregation calculation
	aliasProp - pure post-aggregation calculation
	exception - valueList provided, concat in aggregation ???
		count - see above?
		sum - see above?
```
