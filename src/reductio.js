reductio_count = require('./count.js');
reductio_sum = require('./sum.js');
reductio_avg = require('./avg.js');
reductio_median = require('./median.js');
reductio_value_count = require('./value-count.js');
reductio_value_list = require('./value-list.js');
reductio_exception_count = require('./exception-count.js');
reductio_exception_sum = require('./exception-sum.js');

function reductio() {
	var order, avg, count, sum, exceptionAccessor, exceptionCount,
		exceptionSum, valueList, median,
		reduceAdd, reduceRemove, reduceInitial;

	avg = count = sum = unique_accessor = countUniques = false;

	reduceAdd = function(p, v) { return p; };
	reduceAdd = function(p, v) { return p; };
	reduceInitial = function () { return {}; };

	function my(group) {
		buildFunctions();

		group.reduce(reduceAdd, reduceRemove, reduceInitial);

		return group;
	}

	function buildFunctions() {

		// We have to build these functions in order. Eventually we can include dependency
		// information and create a dependency graph if the process becomes complex enough.

		if(count) {
			reduceAdd = reductio_count.add;
			reduceRemove = reductio_count.remove;
			reduceInitial = reductio_count.initial;
		}

		if(sum) {
			reduceAdd = reductio_sum.add(sum, reduceAdd);
			reduceRemove = reductio_sum.remove(sum, reduceRemove);
			reduceInitial = reductio_sum.initial(reduceInitial);
		}

		if(avg) {
			if(!count | !sum) {
				console.error("You must set .count(true) and define a .sum(accessor) to use .avg(true).");
			} else {
				reduceAdd = reductio_avg.add(sum, reduceAdd);
				reduceRemove = reductio_avg.remove(sum, reduceRemove);
				reduceInitial = reductio_avg.initial(reduceInitial);
			}
		}

		// The unique-only reducers come before the value_count reducers. They need to check if
		// the value is already in the values array on the group. They should only increment/decrement
		// counts if the value not in the array or the count on the value is 0.
		if(exceptionCount) {
			if(!exceptionAccessor) {
				console.error("You must define an .exception(accessor) to use .exceptionCount(true).");
			} else {
				reduceAdd = reductio_exception_count.add(exceptionAccessor, reduceAdd);
				reduceRemove = reductio_exception_count.remove(exceptionAccessor, reduceRemove);
				reduceInitial = reductio_exception_count.initial(reduceInitial);
			}
		}

		if(exceptionSum) {
			if(!exceptionAccessor) {
				console.error("You must define an .exception(accessor) to use .exceptionSum(accessor).");
			} else {
				reduceAdd = reductio_exception_sum.add(exceptionAccessor, exceptionSum, reduceAdd);
				reduceRemove = reductio_exception_sum.remove(exceptionAccessor, exceptionSum, reduceRemove);
				reduceInitial = reductio_exception_sum.initial(reduceInitial);
			}
		}

		// Maintian the values array.
		if(valueList || median) {
			reduceAdd = reductio_value_list.add(valueList, reduceAdd);
			reduceRemove = reductio_value_list.remove(valueList, reduceRemove);
			reduceInitial = reductio_value_list.initial(reduceInitial);
		}

		if(median) {
			reduceAdd = reductio_median.add(reduceAdd);
			reduceRemove = reductio_median.remove(reduceRemove);
			reduceInitial = reductio_median.initial(reduceInitial);
		}

		// Maintain the values count array.
		if(exceptionAccessor) {
			reduceAdd = reductio_value_count.add(exceptionAccessor, reduceAdd);
			reduceRemove = reductio_value_count.remove(exceptionAccessor, reduceRemove);
			reduceInitial = reductio_value_count.initial(reduceInitial);
		}
	}

	my.order = function(value) {
		if (!arguments.length) return order;
		order = value;
		return my;
	};

	my.count = function(value) {
		if (!arguments.length) return count;
		count = value;
		return my;
	};

	my.sum = function(value) {
		if (!arguments.length) return sum;
		sum = value;
		return my;
	};

	my.avg = function(value) {
		if (!arguments.length) return avg;
		// We can take either an accessor function or a boolean
		if( typeof value === 'function' ) {
			if(sum) console.warn('SUM aggregation is being overwritten by AVG aggregation');
			sum = value;
			avg = true;
			count = true;
		} else {
			avg = value;
		}
		return my;
	};

	my.exception = function(value) {
		if (!arguments.length) return exceptionAccessor;
		exceptionAccessor = value;
		return my;
	};

	my.valueList = function(value) {
		if (!arguments.length) return valueList;
		valueList = value;
		return my;
	}

	my.median = function(value) {
		if (!arguments.length) return median;
		if(valueList) console.warn('VALUELIST accessor is being overwritten by median aggregation');
		valueList = value;
		median = value;
		return my;
	}

	my.exceptionCount = function(value) {
		if (!arguments.length) return exceptionCount;
		if( typeof value === 'function' ) {
			if(sum) console.warn('EXCEPTION accessor is being overwritten by exception count aggregation');
			exceptionAccessor = value;
			exceptionCount = true;
		} else {
			exceptionCount = value;
		}
		return my;
	};

	my.exceptionSum = function(value) {
		if (!arguments.length) return exceptionSum;
		exceptionSum = value;
		return my;
	};

	return my;
}

module.exports = reductio;