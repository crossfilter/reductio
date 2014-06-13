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
		var i;
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