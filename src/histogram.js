var reductio_histogram = {
	add: function (a, prior) {
		var bisect = crossfilter.bisect.by(function(d) { return d; }).left;
		var bisectHisto = crossfilter.bisect.by(function(d) { return d.x; }).right;
		var curr, i;
		return function (p, v) {
			if(prior) prior(p, v);
			curr = p.histogram[bisectHisto(p.histogram, a(v), 0, p.histogram.length) - 1];
			curr.y++;
			curr.splice(bisect(curr, a(v), 0, curr.length), 0, a(v));
			return p;
		};
	},
	remove: function (a, prior) {
		var bisect = crossfilter.bisect.by(function(d) { return d; }).left;
		var bisectHisto = crossfilter.bisect.by(function(d) { return d.x; }).right;
		var curr;
		return function (p, v) {
			if(prior) prior(p, v);
			curr = p.histogram[bisectHisto(p.histogram, a(v), 0, p.histogram.length) - 1];
			curr.y--;
			curr.splice(bisect(curr, a(v), 0, curr.length), 1);
			return p;
		};
	},
	initial: function (thresholds, prior) {
		return function (p) {
			p = prior(p);
			p.histogram = [];
			var arr = [];
			for(var i = 1; i < thresholds.length; i++) {
				arr = [];
				arr.x = thresholds[i - 1];
				arr.dx = (thresholds[i] - thresholds[i - 1]);
				arr.y = 0;
				p.histogram.push(arr);
			}
			return p;
		};
	}
};

module.exports = reductio_histogram;