var reductio_max = {
	add: function (prior) {
		return function (p, v) {
			if(prior) prior(p, v);
 
			p.max = p.valueList[p.valueList.length - 1];

			return p;
		};
	},
	remove: function (prior) {
		return function (p, v) {
			if(prior) prior(p, v);

			// Check for undefined.
			if(p.valueList.length === 0) {
				p.max = undefined;
				return p;
			}
 
			p.max = p.valueList[p.valueList.length - 1];

			return p;
		};
	},
	initial: function (prior) {
		return function (p) {
			p = prior(p);
			p.max = undefined;
			return p;
		};
	}
};

module.exports = reductio_max;