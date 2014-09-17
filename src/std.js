var reductio_std = {
	add: function (prior) {
		return function (p, v) {
			if(prior) prior(p, v);
			if(p.count > 0) {
				p.std = 0.0;
				var n = p.sumOfSq - p.sum*p.sum/p.count;
				if (n>0.0) p.std = Math.sqrt(n/(p.count-1));
			} else {
				p.std = 0.0;
			}
			return p;
		};
	},
	remove: function (prior) {
		return function (p, v) {
			if(prior) prior(p, v);
			if(p.count > 0) {
				p.std = 0.0;
				var n = p.sumOfSq - p.sum*p.sum/p.count;
				if (n>0.0) p.std = Math.sqrt(n/(p.count-1));
			} else {
				p.std = 0;
			}
			return p;
		};
	},
	initial: function (prior) {
		return function (p) {
			p = prior(p);
			p.std = 0;
			return p;
		};
	}
};

module.exports = reductio_std;