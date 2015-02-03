// groupAll tests
describe('groupAll', function () {
    var group, filterDim;

    beforeEach(function () {
        var data = crossfilter([
            { foo: 'one', num: 1, val: 2 },
            { foo: 'two', num: 2, val: 3 },
            { foo: 'three', num: 2, val: 3 },
            { foo: 'one', num: 3, val: 2 },
            { foo: 'one', num: 4, val: 1 },
            { foo: 'two', num: 5, val: 3 },
        ]);

        var dim = data.dimension(function(d) { return d.num; });
        filterDim = data.dimension(function(d) { return d.foo; });
        group = dim.groupAll();

        var reducer = reductio()
                .groupAll(function(record) {
                    if(record.num === 5) {
                        return [5];
                    } else {
                        return [record.num, record.num+1];
                    }
                })
                .count(true)
                .sum(function(d) { return d.val; })
                .avg(true);

        reducer(group);
    });

    it('has five groups', function () {
        expect(group.value().length).toEqual(5);
        expect(group.all().length).toEqual(5);
    });

    it('groupings have the right counts', function () {
        var values = {};
        group.value().forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(values[1].count).toEqual(1);
        expect(values[2].count).toEqual(3);
        expect(values[3].count).toEqual(3);
        expect(values[4].count).toEqual(2);
        expect(values[5].count).toEqual(2);

        filterDim.filter('one');

        expect(values[1].count).toEqual(1);
        expect(values[2].count).toEqual(1);
        expect(values[3].count).toEqual(1);
        expect(values[4].count).toEqual(2);
        expect(values[5].count).toEqual(1);

        filterDim.filterAll();

        expect(values[1].count).toEqual(1);
        expect(values[2].count).toEqual(3);
        expect(values[3].count).toEqual(3);
        expect(values[4].count).toEqual(2);
        expect(values[5].count).toEqual(2);
    });

    it('groupings have the right sums and averages', function () {
        var values = {};
        group.value().forEach(function (d) {
            values[d.key] = d.value;
        });

        expect(values[1].sum).toEqual(2);
        expect(values[2].sum).toEqual(8);
        expect(values[3].sum).toEqual(8);
        expect(values[4].sum).toEqual(3);
        expect(values[5].sum).toEqual(4);

        expect(values[1].avg).toEqual(2);
        expect(values[5].avg).toEqual(2);

        filterDim.filter('one');

        expect(values[1].sum).toEqual(2);
        expect(values[2].sum).toEqual(2);
        expect(values[3].sum).toEqual(2);
        expect(values[4].sum).toEqual(3);
        expect(values[5].sum).toEqual(1);

        expect(values[1].avg).toEqual(2);
        expect(values[2].avg).toEqual(2);
        expect(values[3].avg).toEqual(2);
        expect(values[5].avg).toEqual(1);

        filterDim.filterAll();

        expect(values[1].sum).toEqual(2);
        expect(values[2].sum).toEqual(8);
        expect(values[3].sum).toEqual(8);
        expect(values[4].sum).toEqual(3);
        expect(values[5].sum).toEqual(4);

        expect(values[1].avg).toEqual(2);
        expect(values[5].avg).toEqual(2);
    });
});