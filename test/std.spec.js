// Counting tests
describe('Reductio std', function () {

    var std, noSumOfSq, accStd;

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
        var groupNoSumOfSq = dim.group();
        var groupAccStd = dim.group();

        var reducer = reductio()
                .std(true)
                .count(true);

        // This doesn't work because no .sumOfSq(accessor) has been defined.
        // The resulting group only tracks counts.
        reducer(groupNoSumOfSq);

        reducer.count(false).sumOfSq(false);
        reducer.std(function(d) { return d.bar; });

        reducer(groupAccStd);

        reducer.sumOfSq(false);
        reducer.std(false);

        reducer.sumOfSq(function(d) { return d.bar; })
                .std(true);

        // Now it should track count, sumOfSq, and std.
        reducer(group);

        std = group;
        noSumOfSq = groupNoSumOfSq;
        accStd = groupAccStd;
    });

    it('has three groups', function (topic) {
        expect(std.top(Infinity).length).toEqual(3);
    });

    it('grouping have the right averages', function (topic) {
        var values = {};
        std.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(Math.round(values['one'].std)).toEqual(Math.round(2.08167));
        expect(Math.round(values['two'].std)).toEqual(Math.round(2.82843));
        expect(Math.round(values['three'].std)).toEqual(Math.round(0));
    });

    it('grouping with .std() but no .sumOfSq() doesn\'t work', function (topic) {
        var values = {};
        noSumOfSq.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        // It has a count, as defined.
        expect(values['one'].count).toEqual(3);

        // But no sumOfSq.
        expect(values['one'].sumOfSq).toBeUndefined();

        // And no std.
        expect(values['one'].std).toBeUndefined();

        // Also throws an error on the console, but that's more difficult to test.
    });

    it('grouping with .std(accessor) works', function (topic) {
        var values = {};
        accStd.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(Math.round(values['one'].std)).toEqual(Math.round(2.08167));
        expect(Math.round(values['two'].std)).toEqual(Math.round(2.82843));
        expect(Math.round(values['three'].std)).toEqual(Math.round(0));
    });
});