// Counting tests
describe('Reductio sum', function () {
    var group;

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
        groupString = dim.group();

        var reducer = reductio()
                .sum(function(d) { return d.bar; })
                .count(true);

        var reducerString = reductio()
                .sum('bar')
                .count(true);

        reducer(group);
        reducerString(groupString);
    });

    it('has three groups', function () {
        expect(group.top(Infinity).length).toEqual(3);
        expect(groupString.top(Infinity).length).toEqual(3);
    });

    it('grouping have the right sums', function () {
        var values = {};
        groupString.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(values['one'].sum).toEqual(10);
        expect(values['two'].sum).toEqual(8);
        expect(values['three'].sum).toEqual(3);
    });

    it('string grouping has the right sums', function () {
        var values = {};
        group.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(values['one'].sum).toEqual(10);
        expect(values['two'].sum).toEqual(8);
        expect(values['three'].sum).toEqual(3);
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