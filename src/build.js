import filter from './filter.js';
import count from './count.js';
import sum from './sum.js';
import avg from './avg.js';
import median from './median.js';
import min from './min.js';
import max from './max.js';
import value_count from './value-count.js';
import value_list from './value-list.js';
import exception_count from './exception-count.js';
import exception_sum from './exception-sum.js';
import histogram from './histogram.js';
import sum_of_sq from './sum-of-squares.js';
import std from './std.js';
import nest from './nest.js';
import alias from './alias.js';
import alias_prop from './aliasProp.js';
import data_list from './data-list.js';
import custom from './custom.js';

function build_function(p, f, path) {
	// We have to build these functions in order. Eventually we can include dependency
	// information and create a dependency graph if the process becomes complex enough.

	if(!path) path = function (d) { return d; };

	// Keep track of the original reducers so that filtering can skip back to
	// them if this particular value is filtered out.
	var origF = {
		reduceAdd: f.reduceAdd,
		reduceRemove: f.reduceRemove,
		reduceInitial: f.reduceInitial
	};

	if(p.count || p.std) {
    f.reduceAdd = count.add(f.reduceAdd, path, p.count);
    f.reduceRemove = count.remove(f.reduceRemove, path, p.count);
    f.reduceInitial = count.initial(f.reduceInitial, path, p.count);
	}

	if(p.sum) {
		f.reduceAdd = sum.add(p.sum, f.reduceAdd, path);
		f.reduceRemove = sum.remove(p.sum, f.reduceRemove, path);
		f.reduceInitial = sum.initial(f.reduceInitial, path);
	}

	if(p.avg) {
		if(!p.count || !p.sum) {
			console.error("You must set .count(true) and define a .sum(accessor) to use .avg(true).");
		} else {
			f.reduceAdd = avg.add(p.sum, f.reduceAdd, path);
			f.reduceRemove = avg.remove(p.sum, f.reduceRemove, path);
			f.reduceInitial = avg.initial(f.reduceInitial, path);
		}
	}

	// The unique-only reducers come before the value_count reducers. They need to check if
	// the value is already in the values array on the group. They should only increment/decrement
	// counts if the value not in the array or the count on the value is 0.
	if(p.exceptionCount) {
		if(!p.exceptionAccessor) {
			console.error("You must define an .exception(accessor) to use .exceptionCount(true).");
		} else {
			f.reduceAdd = exception_count.add(p.exceptionAccessor, f.reduceAdd, path);
			f.reduceRemove = exception_count.remove(p.exceptionAccessor, f.reduceRemove, path);
			f.reduceInitial = exception_count.initial(f.reduceInitial, path);
		}
	}

	if(p.exceptionSum) {
		if(!p.exceptionAccessor) {
			console.error("You must define an .exception(accessor) to use .exceptionSum(accessor).");
		} else {
			f.reduceAdd = exception_sum.add(p.exceptionAccessor, p.exceptionSum, f.reduceAdd, path);
			f.reduceRemove = exception_sum.remove(p.exceptionAccessor, p.exceptionSum, f.reduceRemove, path);
			f.reduceInitial = exception_sum.initial(f.reduceInitial, path);
		}
	}

	// Maintain the values array.
	if(p.valueList || p.median || p.min || p.max) {
		f.reduceAdd = value_list.add(p.valueList, f.reduceAdd, path);
		f.reduceRemove = value_list.remove(p.valueList, f.reduceRemove, path);
		f.reduceInitial = value_list.initial(f.reduceInitial, path);
	}

	// Maintain the data array.
	if(p.dataList) {
		f.reduceAdd = data_list.add(p.dataList, f.reduceAdd, path);
		f.reduceRemove = data_list.remove(p.dataList, f.reduceRemove, path);
		f.reduceInitial = data_list.initial(f.reduceInitial, path);
	}

	if(p.median) {
		f.reduceAdd = median.add(f.reduceAdd, path);
		f.reduceRemove = median.remove(f.reduceRemove, path);
		f.reduceInitial = median.initial(f.reduceInitial, path);
	}

	if(p.min) {
		f.reduceAdd = min.add(f.reduceAdd, path);
		f.reduceRemove = min.remove(f.reduceRemove, path);
		f.reduceInitial = min.initial(f.reduceInitial, path);
	}

	if(p.max) {
		f.reduceAdd = max.add(f.reduceAdd, path);
		f.reduceRemove = max.remove(f.reduceRemove, path);
		f.reduceInitial = max.initial(f.reduceInitial, path);
	}

	// Maintain the values count array.
	if(p.exceptionAccessor) {
		f.reduceAdd = value_count.add(p.exceptionAccessor, f.reduceAdd, path);
		f.reduceRemove = value_count.remove(p.exceptionAccessor, f.reduceRemove, path);
		f.reduceInitial = value_count.initial(f.reduceInitial, path);
	}

	// Histogram
	if(p.histogramValue && p.histogramThresholds) {
		f.reduceAdd = histogram.add(p.histogramValue, f.reduceAdd, path);
		f.reduceRemove = histogram.remove(p.histogramValue, f.reduceRemove, path);
		f.reduceInitial = histogram.initial(p.histogramThresholds ,f.reduceInitial, path);
	}

	// Sum of Squares
	if(p.sumOfSquares) {
		f.reduceAdd = sum_of_sq.add(p.sumOfSquares, f.reduceAdd, path);
		f.reduceRemove = sum_of_sq.remove(p.sumOfSquares, f.reduceRemove, path);
		f.reduceInitial = sum_of_sq.initial(f.reduceInitial, path);
	}

	// Standard deviation
	if(p.std) {
		if(!p.sumOfSquares || !p.sum) {
			console.error("You must set .sumOfSq(accessor) and define a .sum(accessor) to use .std(true). Or use .std(accessor).");
		} else {
			f.reduceAdd = std.add(f.reduceAdd, path);
			f.reduceRemove = std.remove(f.reduceRemove, path);
			f.reduceInitial = std.initial(f.reduceInitial, path);
		}
	}

	// Custom reducer defined by 3 functions : add, remove, initial
	if (p.custom) {
		f.reduceAdd = custom.add(f.reduceAdd, path, p.custom.add);
		f.reduceRemove = custom.remove(f.reduceRemove, path, p.custom.remove);
		f.reduceInitial = custom.initial(f.reduceInitial, path, p.custom.initial);
	}

	// Nesting
	if(p.nestKeys) {
		f.reduceAdd = nest.add(p.nestKeys, f.reduceAdd, path);
		f.reduceRemove = nest.remove(p.nestKeys, f.reduceRemove, path);
		f.reduceInitial = nest.initial(f.reduceInitial, path);
	}

	// Alias functions
	if(p.aliasKeys) {
		f.reduceInitial = alias.initial(f.reduceInitial, path, p.aliasKeys);
	}

	// Alias properties - this is less efficient than alias functions
	if(p.aliasPropKeys) {
		f.reduceAdd = alias_prop.add(p.aliasPropKeys, f.reduceAdd, path);
		// This isn't a typo. The function is the same for add/remove.
		f.reduceRemove = alias_prop.add(p.aliasPropKeys, f.reduceRemove, path);
	}

	// Filters determine if our built-up priors should run, or if it should skip
	// back to the filters given at the beginning of this build function.
	if (p.filter) {
		f.reduceAdd = filter.add(p.filter, f.reduceAdd, origF.reduceAdd, path);
		f.reduceRemove = filter.remove(p.filter, f.reduceRemove, origF.reduceRemove, path);
	}

	// Values go last.
	if(p.values) {
		Object.getOwnPropertyNames(p.values).forEach(function(n) {
			// Set up the path on each group.
			var setupPath = function(prior) {
				return function (p) {
					p = prior(p);
					path(p)[n] = {};
					return p;
				};
			};
			f.reduceInitial = setupPath(f.reduceInitial);
			build_function(p.values[n].parameters, f, function (p) { return p[n]; });
		});
	}
}

var build = {
	build: build_function
};

export default build;
