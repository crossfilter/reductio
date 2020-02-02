// Counting tests
describe('Reductio sumOfSq', function () {
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

        var reducer = reductio()
                .count(true)
                .sumOfSq(function(d) { return d.bar; });

        reducer(group);
    });

    it('has three groups', function () {
        expect(group.top(Infinity).length).toEqual(3);
    });

    it('grouping have the right sum of squares', function () {
        var values = {};
        group.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(values['one'].sumOfSq).toEqual(42);
        expect(values['two'].sumOfSq).toEqual(40);
        expect(values['three'].sumOfSq).toEqual(9);
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