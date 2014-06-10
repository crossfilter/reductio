reductio_count = require('./count.js');
reductio_sum = require('./sum.js');
reductio_avg = require('./avg.js');
reductio_value_count = require('./value-count.js');
reductio_exception_count = require('./exception-count.js');
reductio_exception_sum = require('./exception-sum.js');

function reductio() {
	var order, avg, count, sum, exceptionAccessor, exceptionCount,
		exceptionSum,
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

		// Maintain the values array.
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
		avg = value;
		return my;
	};

	my.exception = function(value) {
		if (!arguments.length) return exceptionAccessor;
		exceptionAccessor = value;
		return my;
	};

	my.exceptionCount = function(value) {
		if (!arguments.length) return exceptionCount;
		exceptionCount = value;
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