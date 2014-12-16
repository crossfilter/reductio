// Counting tests
describe('Multiple values', function () {

    var values = {};

    beforeEach(function () {
        var data = crossfilter([
            { foo: 'one', x: 1, other: 2 },
            { foo: 'two', x: 2, other: 1 },
            { foo: 'three', x: 3, other: 4 },
            { foo: 'one', x: 4, other: 1 },
            { foo: 'one', x: 5, other: 2 },
            { foo: 'two', x: 6, other: 3 },
        ]);

        var dim = data.dimension(function(d) { return d.foo; });
        var group = dim.group();

        var reducer = reductio()
                .avg(function(d) { return d.x; })
                .count(true);

        reducer.value("x").count(true).sum(function (d) { return d.x; });
        reducer.value("y", function(d) { return d.other; }).count(true).sum(function(d) { return d.other; }).avg(true);

        reducer(group);

        values = group;
    });

    it('has three groups with proper counts', function (topic) {
        expect(values.top(Infinity).length).toEqual(3);

        var vals = {};
        values.top(Infinity).forEach(function (d) {
            vals[d.key] = d.value['x'];
        });

        expect(vals['one'].count).toEqual(3);
        expect(vals['two'].count).toEqual(2);
        expect(vals['three'].count).toEqual(1);

        values.top(Infinity).forEach(function (d) {
            vals[d.key] = d.value['y'];
        });

        expect(vals['one'].count).toEqual(3);
        expect(vals['two'].count).toEqual(2);
        expect(vals['three'].count).toEqual(1);
    });

    it('has sums as expected', function (topic) {
        expect(values.top(Infinity).length).toEqual(3);

        var vals = {};
        values.top(Infinity).forEach(function (d) {
            vals[d.key] = d.value['x'];
        });

        expect(vals['one'].sum).toEqual(10);
        expect(vals['two'].sum).toEqual(8);
        expect(vals['three'].sum).toEqual(3);

        values.top(Infinity).forEach(function (d) {
            vals[d.key] = d.value['y'];
        });

        expect(vals['one'].sum).toEqual(5);
        expect(vals['two'].sum).toEqual(4);
        expect(vals['three'].sum).toEqual(4);
    });

    it('has averages as expected', function (topic) {
        expect(values.top(Infinity).length).toEqual(3);

        var vals = {};
        values.top(Infinity).forEach(function (d) {
            vals[d.key] = d.value['x'];
        });

        expect(vals['one'].avg).toBeUndefined();
        expect(vals['two'].avg).toBeUndefined();
        expect(vals['three'].avg).toBeUndefined();

        values.top(Infinity).forEach(function (d) {
            vals[d.key] = d.value['y'];
        });

        expect(Math.round(vals['one'].avg)).toEqual(Math.round(5/3));
        expect(Math.round(vals['two'].avg)).toEqual(Math.round(4/2));
        expect(Math.round(vals['three'].avg)).toEqual(Math.round(4/1));
    });
});