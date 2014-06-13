var reductio_median = {
	add: function (prior) {
		var half;
		return function (p, v) {
			if(prior) prior(p, v);

			half = Math.floor(p.valueList.length/2);
 
			if(p.valueList.length % 2) {
				p.median = p.valueList[half];
			} else {
				p.median = (p.valueList[half-1] + p.valueList[half]) / 2.0;
			}

			return p;
		};
	},
	remove: function (prior) {
		var half;
		return function (p, v) {
			if(prior) prior(p, v);

			half = Math.floor(p.valueList.length/2);

			// Check for undefined.
			if(p.valueList.length === 0) {
				p.median = undefined;
				return p;
			}
 
			if(p.valueList.length === 1 || p.valueList.length % 2) {
				p.median = p.valueList[half];
			} else {
				p.median = (p.valueList[half-1] + p.valueList[half]) / 2.0;
			}

			return p;
		};
	},
	initial: function (prior) {
		return function (p) {
			p = prior(p);
			p.median = undefined;
			return p;
		};
	}
};

module.exports = reductio_median;