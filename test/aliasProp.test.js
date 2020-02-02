// Alias tests
describe('Alias property', function () {
    var group;

    beforeEach(function () {
        var data = crossfilter([
            { foo: 'one', num: 1 },
            { foo: 'two', num: 2 },
            { foo: 'three', num: 3 },
            { foo: 'one', num: 3 },
            { foo: 'one', num: 2 },
            { foo: 'two', num: 2 },
        ]);

        var dim = data.dimension(function(d) { return d.foo; });
        group = dim.group();

        var reducer = reductio()
                .count(true)
                .sum(function(d) { return +d.num; })
                .aliasProp({
                    newCount: function(g) { return g.count; },
                    average: function(g) { return g.sum / g.count; },
                    description: function(g, v) { return v.foo; }
                });

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

        expect(values['one'].newCount).toEqual(3);
        expect(values['two'].newCount).toEqual(2);
        expect(values['three'].newCount).toEqual(1);
    });

    it('grouping have the right averages', function () {
        var values = {};
        group.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(values['one'].average).toEqual(2);
        expect(values['two'].average).toEqual(2);
        expect(values['three'].average).toEqual(3);
    });

    it('grouping have the right descriptions', function () {
        var values = {};
        group.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(values['one'].description).toEqual('one');
        expect(values['two'].description).toEqual('two');
        expect(values['three'].description).toEqual('three');
    });
});