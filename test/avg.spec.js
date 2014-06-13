// Counting tests
describe('Reductio avg', function () {

    var avg = {}, noAvg = {}, accAvg = {};

    beforeEach(function () {
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
        var groupAccAvg = dim.group();

        var reducer = reductio()
                .avg(true)
                .count(true);

        // This doesn't work because no .sum(accessor) has been defined.
        // The resulting group only tracks counts.
        reducer(groupNoAvg);

        reducer.count(false).sum(false);
        reducer.avg(function(d) { return d.bar; });

        reducer(groupAccAvg);

        reducer.sum(false);
        reducer.avg(false);

        reducer.sum(function(d) { return d.bar; })
                .avg(true);

        // Now it should track count, sum, and avg.
        reducer(group);

        avg = group;
        noAvg = groupNoAvg;
        accAvg = groupAccAvg;
    });

    it('has three groups', function (topic) {
        expect(avg.top(Infinity).length).toEqual(3);
    });

    it('grouping have the right averages', function (topic) {
        var values = {};
        avg.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(Math.round(values['one'].avg)).toEqual(Math.round(10/3));
        expect(Math.round(values['two'].avg)).toEqual(Math.round(8/2));
        expect(Math.round(values['three'].avg)).toEqual(Math.round(3/1));
    });

    it('grouping with .avg() but no .sum() doesn\'t work', function (topic) {
        var values = {};
        noAvg.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        // It has a count, as defined.
        expect(values['one'].count).toEqual(3);

        // But no sum.
        expect(values['one'].sum).toBeUndefined();

        // And no avg.
        expect(values['one'].avg).toBeUndefined();

        // Also throws an error on the console, but that's more difficult to test.
    });

    it('grouping with .avg(accessor) works', function (topic) {
        var values = {};
        accAvg.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(Math.round(values['one'].avg)).toEqual(Math.round(10/3));
        expect(Math.round(values['two'].avg)).toEqual(Math.round(8/2));
        expect(Math.round(values['three'].avg)).toEqual(Math.round(3/1));
    });
});