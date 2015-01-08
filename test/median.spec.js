// Counting tests
describe('Reductio median', function () {

    var median = {}, filterDim;

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
                .min(function(d) { return d.bar; })
                .median(true)(group);

        median = group;
    });

    it('has three groups', function (topic) {
        expect(median.top(Infinity).length).toEqual(3);
    });

    it('grouping have the right medians', function (topic) {
        var values = {};
        median.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(Math.round(values['one'].median)).toEqual(Math.round(4));
        expect(Math.round(values['two'].median)).toEqual(Math.round(4));
        expect(Math.round(values['three'].median)).toEqual(Math.round(3));

        filterDim.filter(1);

        expect(Math.round(values['one'].median)).toEqual(Math.round(1));
        expect(values['two'].median).toBeUndefined();
        expect(values['three'].median).toBeUndefined();

        filterDim.filterAll();

        expect(Math.round(values['one'].median)).toEqual(Math.round(4));
        expect(Math.round(values['two'].median)).toEqual(Math.round(4));
        expect(Math.round(values['three'].median)).toEqual(Math.round(3));

    });
});