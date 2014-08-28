// Counting tests
describe('Reductio maximum', function () {

    var max = {}, filterDim;

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
                .max(function(d) { return d.bar; })(group);

        max = group;
    });

    it('has three groups', function (topic) {
        expect(max.top(Infinity).length).toEqual(3);
    });

    it('grouping have the right maximums', function (topic) {
        var values = {};
        max.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(Math.round(values['one'].max)).toEqual(Math.round(5));
        expect(Math.round(values['two'].max)).toEqual(Math.round(6));
        expect(Math.round(values['three'].max)).toEqual(Math.round(3));

        filterDim.filter(1);

        expect(Math.round(values['one'].max)).toEqual(Math.round(1));
        expect(values['two'].max).toBeUndefined();
        expect(values['three'].max).toBeUndefined();

        filterDim.filterAll();

        expect(Math.round(values['one'].max)).toEqual(Math.round(5));
        expect(Math.round(values['two'].max)).toEqual(Math.round(6));
        expect(Math.round(values['three'].max)).toEqual(Math.round(3));

    });
});