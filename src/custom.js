var reductio_custom = {
	add: function(prior, path, addFn) {
		return function (p, v, nf) {
			if(prior) prior(p, v, nf);
			return addFn(p, v);
		};
	},
	remove: function(prior, path, removeFn) {
		return function (p, v, nf) {
			if(prior) prior(p, v, nf);
			return removeFn(p, v);
		};
	},
	initial: function(prior, path, initialFn) {
		return function (p) {	
			if(prior) p = prior(p);
			return initialFn(p);
		};
	}
};

module.exports = reductio_custom;