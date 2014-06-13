// Counting tests
describe('Reductio exception count', function () {
    var group;
    var accGroup;

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
        accGroup = dim.group();

        var reducer = reductio()
                .exception(function(d) { return d.bar; })
                .exceptionCount(true);

        reducer(group);

        reductio().exceptionCount(function(d) { return d.bar; })(accGroup);
    });

    it('has three groups', function () {
        expect(group.top(Infinity).length).toEqual(3);
    });

    it('grouping has the right counts', function () {
        var values = {};
        group.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(values['one'].exceptionCount).toEqual(2);
        expect(values['two'].exceptionCount).toEqual(1);
        expect(values['three'].exceptionCount).toEqual(1);
    });

    it('accessor-based grouping has the right counts', function () {
        var values = {};
        accGroup.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(values['one'].exceptionCount).toEqual(2);
        expect(values['two'].exceptionCount).toEqual(1);
        expect(values['three'].exceptionCount).toEqual(1);
    });
});