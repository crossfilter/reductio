var vows = require('vows'),
    assert = require('assert'),
    crossfilter = require('crossfilter'),
    reductio = require('../reductio.js');

// Counting tests
vows.describe('Reductio sum').addBatch({
    'import': {
        topic: function () {
            var data = crossfilter([
                { foo: 'one', bar: 1 },
                { foo: 'two', bar: 2 },
                { foo: 'three', bar: 3 },
                { foo: 'one', bar: 4 },
                { foo: 'one', bar: 5 },
                { foo: 'two', bar: 6 },
            ]);

            var dim = data.dimension(function(d) { return d.foo; });
            var group = dim.group();

            var reducer = reductio()
                    .sum(function(d) { return d.bar; })
                    .count(true);

            reducer(group);

            return group;
        },

        'has three groups': function (topic) {
            assert.equal (topic.top(Infinity).length, 3);
        },
        'grouping have the right sums': function (topic) {
            var values = {};
            topic.top(Infinity).forEach(function (d) {
                values[d.key] = d.value;
            });

            assert.equal (values['one'].sum, 10);
            assert.equal (values['two'].sum, 8);
            assert.equal (values['three'].sum, 3);
        },
        'grouping plays nicely with count': function (topic) {
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