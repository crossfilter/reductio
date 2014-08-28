var reductio_min = {
	add: function (prior) {
		return function (p, v) {
			if(prior) prior(p, v);
 
			p.min = p.valueList[0];

			return p;
		};
	},
	remove: function (prior) {
		return function (p, v) {
			if(prior) prior(p, v);

			// Check for undefined.
			if(p.valueList.length === 0) {
				p.min = undefined;
				return p;
			}
 
			p.min = p.valueList[0];

			return p;
		};
	},
	initial: function (prior) {
		return function (p) {
			p = prior(p);
			p.min = undefined;
			return p;
		};
	}
};

module.exports = reductio_min;