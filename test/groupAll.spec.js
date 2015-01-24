// groupAll tests
describe('groupAll', function () {
    var group, filterDim;

    beforeEach(function () {
        var data = crossfilter([
            { foo: 'one', num: 1 },
            { foo: 'two', num: 2 },
            { foo: 'three', num: 2 },
            { foo: 'one', num: 3 },
            { foo: 'one', num: 4 },
            { foo: 'two', num: 5 },
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
                .count(true);

        reducer(group);
    });

    it('has three groups', function () {
        expect(group.value().length).toEqual(5);
    });

    it('grouping have the right counts', function () {
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
});