var reductio_min = {
	add: function (prior, path) {
		return function (p, v) {
			if(prior) prior(p, v);
 
			path(p).min = path(p).valueList[0];

			return p;
		};
	},
	remove: function (prior, path) {
		return function (p, v) {
			if(prior) prior(p, v);

			// Check for undefined.
			if(path(p).valueList.length === 0) {
				path(p).min = undefined;
				return p;
			}
 
			path(p).min = path(p).valueList[0];

			return p;
		};
	},
	initial: function (prior, path) {
		return function (p) {
			p = prior(p);
			path(p).min = undefined;
			return p;
		};
	}
};

module.exports = reductio_min;