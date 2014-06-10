var reductio_exception_count = {
	add: function (a, prior) {
		var i, curr;
		return function (p, v) {
			if(prior) prior(p, v);
			// Only count++ if the p.values array doesn't contain a(v) or if it's 0.
			i = p.bisect(p.values, a(v), 0, p.values.length);
			curr = p.values[i];
			if((!curr || curr[0] !== a(v)) || curr[1] === 0) {
				p.exceptionCount++;
			}
			return p;
		};
	},
	remove: function (a, prior) {
		var i, curr;
		return function (p, v) {
			if(prior) prior(p, v);
			// Only count-- if the p.values array contains a(v) value of 1.
			i = p.bisect(p.values, a(v), 0, p.values.length);
			curr = p.values[i];
			if(curr && curr[0] === a(v) && curr[1] === 1) {
				p.exceptionCount--;
			}
			return p;
		};
	},
	initial: function (prior) {
		return function (p) {
			p = prior(p);
			p.exceptionCount = 0;
			return p;
		};
	}
};

module.exports = reductio_exception_count;