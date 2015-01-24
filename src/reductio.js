var reductio_build = require('./build.js');
var reductio_accessors = require('./accessors.js');
var reductio_parameters = require('./parameters.js');

function reductio() {
	var parameters = reductio_parameters();

	var funcs = {};

	function my(group) {
		// Start fresh each time.
		funcs = {
			reduceAdd: function(p) { return p; },
			reduceRemove: function(p) { return p; },
			reduceInitial: function () { return {}; },
		};

		reductio_build.build(parameters, funcs);

		// If we're doing groupAll
		if(parameters.groupAll) {
			if(group.top) {
				console.warn("'groupAll' is defined but attempting to run on a standard dimension.group(). Must run on dimension.groupAll().");
			} else {
				var bisect = crossfilter.bisect.by(function(d) { return d.key; }).left;
				var i;
				var keys;
				group.reduce(
					function(p, v) {
						keys = parameters.groupAll(v);
						keys.forEach(function(k) {
							i = bisect(p, k, 0, p.length);
							if(!p[i] || p[i].key !== k) {
								// If the group doesn't yet exist, create it first.
								p.splice(i, 0, { key: k, value: funcs.reduceInitial() });
							}

							// Then pass the record and the group value to the reducers
							funcs.reduceAdd(p[i].value, v);
						});
						return p;
					},
					function(p, v) {
						keys = parameters.groupAll(v);
						keys.forEach(function(k) {
							i = bisect(p, k, 0, p.length);
							// The group should exist or we're in trouble!
							// Then pass the record and the group value to the reducers
							funcs.reduceRemove(p[i].value, v);
						});
						return p;
					},
					function() {
						return [];
					}
				);
			}
		} else {
			group.reduce(funcs.reduceAdd, funcs.reduceRemove, funcs.reduceInitial);
		}

		return group;
	}

	reductio_accessors.build(my, parameters);

	return my;
}

module.exports = reductio;