var reductio_avg = {
	add: function (a, prior) {
		return function (p, v) {
			if(prior) prior(p, v);
			if(p.count > 0) {
				p.avg = p.sum / p.count;
			} else {
				p.avg = 0;
			}
			return p;
		};
	},
	remove: function (a, prior) {
		return function (p, v) {
			if(prior) prior(p, v);
			if(p.count > 0) {
				p.avg = p.sum / p.count;
			} else {
				p.avg = 0;
			}
			return p;
		};
	},
	initial: function (prior) {
		return function (p) {
			p = prior(p);
			p.avg = 0;
			return p;
		};
	}
};

module.exports = reductio_avg;