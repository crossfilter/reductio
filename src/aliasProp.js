var reductio_alias_prop = {
	add: function (obj, prior, path) {
		return function (p, v) {
			if(prior) prior(p, v);
			for(var prop in obj) {
				path(p)[prop] = obj[prop](path(p));
			}
			return p;
		};
	}
};

module.exports = reductio_alias_prop;