// Counting tests
describe('Reductio value count', function () {
    var group;

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

        var reducer = reductio()
                .sum(function (d) { return d.bar; })
                .count(true)
                .exception(function (d) { return d.bar; });

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

        expect(values['one'].values).toEqual([[1,2],[5,1]]);
        expect(values['two'].values).toEqual([[2,2],[3,1]]);
    });
});