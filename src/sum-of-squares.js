var reductio_sum_of_sq = {
	add: function (a, prior) {
		return function (p, v) {
			if(prior) prior(p, v);
			p.sumOfSq = p.sumOfSq + a(v)*a(v);
			return p;
		};
	},
	remove: function (a, prior) {
		return function (p, v) {
			if(prior) prior(p, v);
			p.sumOfSq = p.sumOfSq - a(v)*a(v);
			return p;
		};
	},
	initial: function (prior) {
		return function (p) {
			p = prior(p);
			p.sumOfSq = 0;
			return p;
		};
	}
};

module.exports = reductio_sum_of_sq;