var vows = require('vows'),
    assert = require('assert'),
    crossfilter = require('crossfilter'),
    reductio = require('../reductio.js');

// Counting tests
vows.describe('Reductio avg').addBatch({
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
            var groupNoAvg = dim.group();

            var reducer = reductio()
                    .avg(true)
                    .count(true);

            // This doesn't work because no .sum(accessor) has been defined.
            // The resulting group only tracks counts.
            reducer(groupNoAvg);

            reducer.sum(function(d) { return d.bar; });

            // Now it should track count, sum, and avg.
            reducer(group);

            return {
                avg: group,
                noAvg: groupNoAvg
            };
        },

        'has three groups': function (topic) {
            assert.equal (topic.avg.top(Infinity).length, 3);
        },
        'grouping have the right averages': function (topic) {
            var values = {};
            topic.avg.top(Infinity).forEach(function (d) {
                values[d.key] = d.value;
            });

            assert.equal (Math.round(values['one'].avg), Math.round(10/3));
            assert.equal (Math.round(values['two'].avg), Math.round(8/2));
            assert.equal (Math.round(values['three'].avg), Math.round(3/1));
        },
        'grouping with .avg() but no .sum() doesn\'t work': function (topic) {
            var values = {};
            topic.noAvg.top(Infinity).forEach(function (d) {
                values[d.key] = d.value;
            });

            // It has a count, as defined.
            assert.equal (values['one'].count, 3);

            // But no sum.
            assert.isUndefined(values['one'].sum);

            // And no avg.
            assert.isUndefined(values['one'].avg);

            // Also throws an error on the console, but that's more difficult to test.
        }
    }
}).export(module); // Run it