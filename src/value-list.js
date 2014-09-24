var crossfilter = require('crossfilter');

var reductio_value_list = {
	add: function (a, prior) {
		var i;
		var bisect = crossfilter.bisect.by(function(d) { return d; }).left;
		return function (p, v) {
			if(prior) prior(p, v);
			// Not sure if this is more efficient than sorting.
			i = bisect(p.valueList, a(v), 0, p.valueList.length);
			p.valueList.splice(i, 0, a(v));
			return p;
		};
	},
	remove: function (a, prior) {
		var i;
		var bisect = crossfilter.bisect.by(function(d) { return d; }).left;
		return function (p, v) {
			if(prior) prior(p, v);
			i = bisect(p.valueList, a(v), 0, p.valueList.length);
			// Value already exists or something has gone terribly wrong.
			p.valueList.splice(i, 1);
			return p;
		};
	},
	initial: function (prior) {
		return function (p) {
			p = prior(p);
			p.valueList = [];
			return p;
		};
	}
};

module.exports = reductio_value_list;