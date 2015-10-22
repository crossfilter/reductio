// Counting tests
describe('Reductio data list', function() {

    var max = {},
        filterDim;

    beforeEach(function() {
        var data = crossfilter([{
            foo: 'one',
            bar: 1
        }, {
            foo: 'two',
            bar: 2
        }, {
            foo: 'three',
            bar: 3
        }, {
            foo: 'one',
            bar: 4
        }, {
            foo: 'one',
            bar: 5
        }, {
            foo: 'two',
            bar: 6
        }, ]);

        var dim = data.dimension(function(d) {
            return d.foo;
        });
        var group = dim.group();

        filterDim = data.dimension(function(d) {
            return d.bar;
        });

        reductio()
            .dataList(true)(group);

        max = group;

    });

    it('has three groups', function(topic) {
        expect(max.top(Infinity).length).toEqual(3);
    });

    it('grouping have the right maximums', function(topic) {

        var rows = {};
        max.top(Infinity).forEach(function(d) {
            rows[d.key] = d.value;
        });

        expect(Math.round(rows['one'].dataList.length)).toEqual(Math.round(3));
        expect(Math.round(rows['two'].dataList.length)).toEqual(Math.round(2));
        expect(Math.round(rows['three'].dataList.length)).toEqual(Math.round(1));

        filterDim.filterExact(1);

        expect(Math.round(rows['one'].dataList.length)).toEqual(Math.round(1));
        expect(rows['two'].dataList.length).toEqual(Math.round(0));
        expect(rows['three'].dataList.length).toEqual(Math.round(0));

        filterDim.filterAll();

        expect(Math.round(rows['one'].dataList.length)).toEqual(Math.round(3));
        expect(Math.round(rows['two'].dataList.length)).toEqual(Math.round(2));
        expect(Math.round(rows['three'].dataList.length)).toEqual(Math.round(1));

    });
});
