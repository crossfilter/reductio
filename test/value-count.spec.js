var vows = require('vows'),
    assert = require('assert'),
    crossfilter = require('crossfilter'),
    reductio = require('../reductio.js');

// Counting tests
vows.describe('Reductio value count').addBatch({
    'import': {
        topic: function () {
            var data = crossfilter([
                { foo: 'one', bar: 1 },
                { foo: 'two', bar: 2 },
                { foo: 'two', bar: 3 },
                { foo: 'one', bar: 1 },
                { foo: 'one', bar: 5 },
                { foo: 'two', bar: 2 },
            ]);

            var dim = data.dimension(function(d) { return d.foo; });
            var group = dim.group();

            var reducer = reductio()
                    .sum(function (d) { return d.bar; })
                    .count(true)
                    .uniques(function (d) { return d.bar; });

            reducer(group);

            return group;
        },

        'has two groups': function (topic) {
            assert.equal (topic.top(Infinity).length, 2);
        },
        'grouping have the right sums': function (topic) {
            var values = {};
            topic.top(Infinity).forEach(function (d) {
                values[d.key] = d.value;
            });

            assert.equal (values['one'].sum, 7);
            assert.equal (values['two'].sum, 7);
        },
        'properly tracks values': function (topic) {
            var values = {};
            topic.top(Infinity).forEach(function (d) {
                values[d.key] = d.value;
            });

            assert.deepEqual (values['one'].values, [[1,2],[5,1]]);
            assert.deepEqual (values['two'].values, [[2,2],[3,1]]);
        }
    }
}).export(module); // Run it