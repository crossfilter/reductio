var reductio_median = {
	add: function (prior, path) {
		var half;
		return function (p, v, nf) {
			if(prior) prior(p, v, nf);

			half = Math.floor(path(p).valueList.length/2);
 
			if(path(p).valueList.length % 2) {
				path(p).median = path(p).valueList[half];
			} else {
				path(p).median = (path(p).valueList[half-1] + path(p).valueList[half]) / 2.0;
			}

			return p;
		};
	},
	remove: function (prior, path) {
		var half;
		return function (p, v, nf) {
			if(prior) prior(p, v, nf);

			half = Math.floor(path(p).valueList.length/2);

			// Check for undefined.
			if(path(p).valueList.length === 0) {
				path(p).median = undefined;
				return p;
			}
 
			if(path(p).valueList.length === 1 || path(p).valueList.length % 2) {
				path(p).median = path(p).valueList[half];
			} else {
				path(p).median = (path(p).valueList[half-1] + path(p).valueList[half]) / 2.0;
			}

			return p;
		};
	},
	initial: function (prior, path) {
		return function (p) {
			p = prior(p);
			path(p).median = undefined;
			return p;
		};
	}
};

module.exports = reductio_median;