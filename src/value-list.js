var crossfilter = require('crossfilter2');

var reductio_value_list = {
	add: function (a, prior, path) {
		var i;
		var bisect = crossfilter.bisect.by(function(d) { return d; }).left;
		return function (p, v, nf) {
			if(prior) prior(p, v, nf);
			// Not sure if this is more efficient than sorting.
			i = bisect(path(p).valueList, a(v), 0, path(p).valueList.length);
			path(p).valueList.splice(i, 0, a(v));
			return p;
		};
	},
	remove: function (a, prior, path) {
		var i;
		var bisect = crossfilter.bisect.by(function(d) { return d; }).left;
		return function (p, v, nf) {
			if(prior) prior(p, v, nf);
			i = bisect(path(p).valueList, a(v), 0, path(p).valueList.length);
			// Value already exists or something has gone terribly wrong.
			path(p).valueList.splice(i, 1);
			return p;
		};
	},
	initial: function (prior, path) {
		return function (p) {
			p = prior(p);
			path(p).valueList = [];
			return p;
		};
	}
};

module.exports = reductio_value_list;