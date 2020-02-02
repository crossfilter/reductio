// Counting tests
describe('Reductio exception sum', function () {
    var group;

    beforeEach(function () {
        var data = crossfilter([
            { foo: 'one', bar: 'A', num: 1 },
            { foo: 'two', bar: 'B', num: 2 },
            { foo: 'three', bar: 'A', num: 3 },
            { foo: 'one', bar: 'B', num: 2 },
            { foo: 'one', bar: 'A', num: 1 },
            { foo: 'two', bar: 'B', num: 2 },
        ]);

        var dim = data.dimension(function(d) { return d.foo; });
        group = dim.group();

        var reducer = reductio()
                .exception(function(d) { return d.bar; })
                .exceptionSum(function(d) { return d.num; });

        reducer(group);
    });

    it('has three groups', function () {
        expect(group.top(Infinity).length).toEqual(3);
    });

    it('grouping have the right counts', function () {
        var values = {};
        group.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(values['one'].exceptionSum).toEqual(3);
        expect(values['two'].exceptionSum).toEqual(2);
        expect(values['three'].exceptionSum).toEqual(3);
    });
});