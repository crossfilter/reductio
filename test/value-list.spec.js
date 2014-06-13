// Counting tests
describe('Reductio value list', function () {
    var group;
    var filterDim;

    beforeEach(function () {
        var data = crossfilter([
            { foo: 'one', bar: 1 },
            { foo: 'two', bar: 2 },
            { foo: 'two', bar: 3 },
            { foo: 'one', bar: 1 },
            { foo: 'one', bar: 5 },
            { foo: 'two', bar: 2 },
        ]);

        var dim = data.dimension(function(d) { return d.foo; });
        group = dim.group();

        filterDim = data.dimension(function(d) { return d.bar; });

        var reducer = reductio()
                .sum(function (d) { return d.bar; })
                .valueList(function (d) { return d.bar; });

        reducer(group);
    });

    it('has two groups', function () {
        expect(group.top(Infinity).length).toEqual(2);
    });

    it('grouping have the right sums', function () {
        var values = {};
        group.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(values['one'].sum).toEqual(7);
        expect(values['two'].sum).toEqual(7);
    });

    it('properly tracks values', function () {
        var values = {};
        group.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(values['one'].valueList).toEqual([1, 1, 5]);
        expect(values['two'].valueList).toEqual([2, 2, 3]);

        filterDim.filter(1);

        expect(values['one'].valueList).toEqual([1, 1]);
        expect(values['two'].valueList).toEqual([]);

        filterDim.filter(3);

        expect(values['one'].valueList).toEqual([]);
        expect(values['two'].valueList).toEqual([3]);

        filterDim.filterAll();

        expect(values['one'].valueList).toEqual([1, 1, 5]);
        expect(values['two'].valueList).toEqual([2, 2, 3]);
    });
});