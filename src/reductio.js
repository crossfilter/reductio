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

		group.reduce(funcs.reduceAdd, funcs.reduceRemove, funcs.reduceInitial);

		return group;
	}

	reductio_accessors.build(my, parameters);

	return my;
}

module.exports = reductio;