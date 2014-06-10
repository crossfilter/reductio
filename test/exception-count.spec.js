// Counting tests
describe('Reductio exception count', function () {
    var group;

    beforeEach(function () {
        var data = crossfilter([
            { foo: 'one', bar: 'A' },
            { foo: 'two', bar: 'B' },
            { foo: 'three', bar: 'A' },
            { foo: 'one', bar: 'B' },
            { foo: 'one', bar: 'A' },
            { foo: 'two', bar: 'B' },
        ]);

        var dim = data.dimension(function(d) { return d.foo; });
        group = dim.group();

        var reducer = reductio()
                .exception(function(d) { return d.bar; })
                .exceptionCount(true);

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

        expect(values['one'].exceptionCount).toEqual(2);
        expect(values['two'].exceptionCount).toEqual(1);
        expect(values['three'].exceptionCount).toEqual(1);
    });
});