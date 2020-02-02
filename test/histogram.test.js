// Counting tests
describe('Reductio histogram', function () {
    var group;
    var filterDim;

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
        group = dim.group();

        filterDim = data.dimension(function (d) { return d.bar; });

        var reducer = reductio()
                .histogramBins([0,2,6,10])
                .histogramValue(function(d) { return d.bar; })
                .count(true);

        reducer(group);
    });

    it('has three groups', function () {
        expect(group.top(Infinity).length).toEqual(3);
    });

    it('grouping have the right histograms', function () {
        var values = {};
        group.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(values['one'].histogram.map(function(d) { return d.y; })).toEqual([1,2,0]);
        expect(values['two'].histogram.map(function(d) { return d.y; })).toEqual([0,1,1]);
        expect(values['three'].histogram.map(function(d) { return d.y; })).toEqual([0,1,0]);

        filterDim.filter([2,6]);

        expect(values['one'].histogram.map(function(d) { return d.y; })).toEqual([0,2,0]);
        expect(values['two'].histogram.map(function(d) { return d.y; })).toEqual([0,1,0]);
        expect(values['three'].histogram.map(function(d) { return d.y; })).toEqual([0,1,0]);

        filterDim.filterAll();

        expect(values['one'].histogram.map(function(d) { return d.y; })).toEqual([1,2,0]);
        expect(values['two'].histogram.map(function(d) { return d.y; })).toEqual([0,1,1]);
        expect(values['three'].histogram.map(function(d) { return d.y; })).toEqual([0,1,0]);
    });

    it('grouping plays nicely with count', function () {
        var values = {};
        group.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(values['one'].count).toEqual(3);
        expect(values['two'].count).toEqual(2);
        expect(values['three'].count).toEqual(1);
    });
});