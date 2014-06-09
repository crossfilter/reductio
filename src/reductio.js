reductio_count = require('./count.js');
reductio_sum = require('./sum.js');
reductio_avg = require('./avg.js');
reductio_value_count = require('./value-count.js');

function reductio() {
	var order, avg, count, sum, unique_accessor, reduceAdd, reduceRemove, reduceInitial;

	avg = count = sum = unique_accessor = false;

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

		if(unique_accessor) {
			reduceAdd = reductio_value_count.add(unique_accessor, reduceAdd);
			reduceRemove = reductio_value_count.remove(unique_accessor, reduceRemove);
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

	my.uniques = function(value) {
		if (!arguments.length) return unique_accessor;
		unique_accessor = value;
		return my;
	};

	return my;
}

module.exports = reductio;