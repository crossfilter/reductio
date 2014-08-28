// Counting tests
describe('Reductio minimum', function () {

    var min = {}, filterDim;

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

        filterDim = data.dimension(function(d) { return d.bar; });

        reductio()
                .min(function(d) { return d.bar; })(group);

        min = group;
    });

    it('has three groups', function (topic) {
        expect(min.top(Infinity).length).toEqual(3);
    });

    it('grouping have the right minimums', function (topic) {
        var values = {};
        min.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(Math.round(values['one'].min)).toEqual(Math.round(1));
        expect(Math.round(values['two'].min)).toEqual(Math.round(2));
        expect(Math.round(values['three'].min)).toEqual(Math.round(3));

        filterDim.filter(4);

        expect(Math.round(values['one'].min)).toEqual(Math.round(4));
        expect(values['two'].min).toBeUndefined();
        expect(values['three'].min).toBeUndefined();

        filterDim.filterAll();

        expect(Math.round(values['one'].min)).toEqual(Math.round(1));
        expect(Math.round(values['two'].min)).toEqual(Math.round(2));
        expect(Math.round(values['three'].min)).toEqual(Math.round(3));

    });
});