!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.reductio=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var reductio_avg = {
	add: function (a, prior) {
		return function (p, v) {
			if(prior) prior(p, v);
			if(p.count > 0) {
				p.avg = p.sum / p.count;
			} else {
				p.avg = 0;
			}
			return p;
		};
	},
	remove: function (a, prior) {
		return function (p, v) {
			if(prior) prior(p, v);
			if(p.count > 0) {
				p.avg = p.sum / p.count;
			} else {
				p.avg = 0;
			}
			return p;
		};
	},
	initial: function (prior) {
		return function (p) {
			p = prior(p);
			p.avg = 0;
			return p;
		};
	}
};

module.exports = reductio_avg;
},{}],2:[function(_dereq_,module,exports){
var reductio_count = {
	add: function (p, v) {
		p.count++;
		return p;
	},
	remove: function (p, v) {
		p.count--;
		return p;
	},
	initial: function (p) {
		if(p === undefined) p = {};
		p.count = 0;
		return p;
	}
};

module.exports = reductio_count;
},{}],3:[function(_dereq_,module,exports){
reductio_count = _dereq_('./count.js');
reductio_sum = _dereq_('./sum.js');
reductio_avg = _dereq_('./avg.js');
reductio_value_count = _dereq_('./value-count.js');

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
},{"./avg.js":1,"./count.js":2,"./sum.js":4,"./value-count.js":5}],4:[function(_dereq_,module,exports){
var reductio_sum = {
	add: function (a, prior) {
		return function (p, v) {
			if(prior) prior(p, v);
			p.sum = p.sum + a(v);
			return p;
		};
	},
	remove: function (a, prior) {
		return function (p, v) {
			if(prior) prior(p, v);
			p.sum = p.sum - a(v);
			return p;
		};
	},
	initial: function (prior) {
		return function (p) {
			p = prior(p);
			p.sum = 0;
			return p;
		};
	}
};

module.exports = reductio_sum;
},{}],5:[function(_dereq_,module,exports){
// TODO: Figure out how to use a global crossfilter object. We need to
// import here because the testing framework doesn't provide global
// objects. We shouldn't need to require this for use in browser.

var reductio_value_count = {
	add: function (a, prior) {
		var i, curr;
		return function (p, v) {
			if(prior) prior(p, v);
			// Not sure if this is more efficient than sorting.
			i = p.bisect(p.values, a(v), 0, p.values.length);
			curr = p.values[i];
			if(curr && curr[0] === a(v)) {
				// Value already exists in the array - increment it
				curr[1]++;
			} else {
				// Value doesn't exist - add it in form [value, 1]
				p.values.splice(i, 0, [a(v), 1]);
			}
			return p;
		};
	},
	remove: function (a, prior) {
		return function (p, v) {
			if(prior) prior(p, v);
			i = p.bisect(p.values, a(v), 0, p.values.length);
			// Value already exists or something has gone terribly wrong.
			p.values[i][1]--;
			return p;
		};
	},
	initial: function (prior) {
		return function (p) {
			p = prior(p);
			// Array[Array[value, count]]
			p.values = [];
			p.bisect = crossfilter.bisect.by(function(d) { return d[0]; }).left;
			return p;
		};
	}
};

module.exports = reductio_value_count;
},{}]},{},[3])
(3)
});