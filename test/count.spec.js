var vows = require('vows'),
    assert = require('assert'),
    crossfilter = require('crossfilter'),
    reductio = require('../reductio.js');

// Counting tests
vows.describe('Reductio count').addBatch({
    'import': {
        topic: function () {
            var data = crossfilter([
                { foo: 'one' },
                { foo: 'two' },
                { foo: 'three' },
                { foo: 'one' },
                { foo: 'one' },
                { foo: 'two' },
            ]);

            var dim = data.dimension(function(d) { return d.foo; });
            var group = dim.group();

            var reducer = reductio()
                    .count(true);

            reducer(group);

            return group;
        },

        'has three groups': function (topic) {
            assert.equal (topic.top(Infinity).length, 3);
        },
        'grouping have the right counts': function (topic) {
            var values = {};
            topic.top(Infinity).forEach(function (d) {
                values[d.key] = d.value;
            });

            assert.equal (values['one'].count, 3);
            assert.equal (values['two'].count, 2);
            assert.equal (values['three'].count, 1);
        }
    }
}).export(module); // Run it