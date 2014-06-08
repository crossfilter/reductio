var reductio_count = {
	add: function (p, v) {
		p.count++;
		return p;
	},
	remove: function (p, v) {
		p.count--;
		return p;
	},
	initial: function (p) {
		if(p === undefined) p = {};
		p.count = 0;
		return p;
	}
};

module.exports = reductio_count;