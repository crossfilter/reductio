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