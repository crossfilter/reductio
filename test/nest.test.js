// Counting tests
describe('Reductio nest', function () {
    var group;
    var filterDim;

    beforeEach(function () {
        var data = crossfilter([
            { foo: 'one', bar: 1, city: 'NYC', type: 'car' },
            { foo: 'two', bar: 2, city: 'NYC', type: 'bike' },
            { foo: 'two', bar: 3, city: 'NYC', type: 'bike' },
            { foo: 'one', bar: 1, city: 'LA', type: 'bike' },
            { foo: 'one', bar: 5, city: 'LA', type: 'car' },
            { foo: 'two', bar: 2, city: 'LA', type: 'car' },
        ]);

        var dim = data.dimension(function(d) { return d.foo; });
        group = dim.group();

        filterDim = data.dimension(function(d) { return d.bar; });

        var reducer = reductio()
                .nest([function(d) { return d.city; }, function(d) { return d.type; }]);

        reducer(group);
    });

    it('has two groups', function () {
        expect(group.top(Infinity).length).toEqual(2);
    });

    it('grouping have the right nests', function () {
        var values = {};
        group.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });

        // 'one.nest.values' should look like:
        // [ { key: 'NYC', values: [
        //          { key: 'car', values: [
        //              { foo: 'one', bar: 1, city: 'NYC', type: 'car' }
        //          ]},
        //          { key: 'bike', values: [
        //              { foo: 'two', bar: 2, city: 'NYC', type: 'bike' },
        //              { foo: 'two', bar: 3, city: 'NYC', type: 'bike' }
        //          ]}
        //     ]},
        //     { key: 'LA', values: [
        //          { key: 'car', values: [
        //              { foo: 'one', bar: 5, city: 'LA', type: 'car' },
        //              { foo: 'two', bar: 2, city: 'LA', type: 'car' }
        //          ]},
        //          { key: 'bike', values: [
        //              { foo: 'one', bar: 1, city: 'LA', type: 'bike' }
        //          ]}
        //     ]}
        // ]

        var OneNYCcars = values['one'].nest
                .filter(function(d) { return d.key === 'NYC'; })[0]
                .values.filter(function(d) { return d.key === 'car'; })[0]
                .values;

        var TwoNYCbike = values['two'].nest
                .filter(function(d) { return d.key === 'NYC'; })[0]
                .values.filter(function(d) { return d.key === 'bike'; })[0]
                .values;

        var TwoLAbike = values['two'].nest
                .filter(function(d) { return d.key === 'LA'; })[0]
                .values.filter(function(d) { return d.key === 'bike'; })[0];

        var TwoLAcars = values['two'].nest
                .filter(function(d) { return d.key === 'LA'; })[0]
                .values.filter(function(d) { return d.key === 'car'; })[0]
                .values;

        expect(values['one'].nest.length).toEqual(2);
        expect(values['two'].nest.length).toEqual(2);
        expect(OneNYCcars.length).toEqual(1);
        expect(TwoNYCbike.length).toEqual(2);
        expect(TwoLAcars.length).toEqual(1);
        expect(TwoLAbike).toBeUndefined();

        filterDim.filter(2);

        expect(values['one'].nest.length).toEqual(2); // Should be 0.
        expect(values['two'].nest.length).toEqual(2);
        expect(OneNYCcars.length).toEqual(0);
        expect(TwoNYCbike.length).toEqual(1);
        expect(TwoLAcars.length).toEqual(1);
        expect(TwoLAbike).toBeUndefined();

        filterDim.filterAll();

        expect(values['one'].nest.length).toEqual(2);
        expect(values['two'].nest.length).toEqual(2);
        expect(OneNYCcars.length).toEqual(1);
        expect(TwoNYCbike.length).toEqual(2);
        expect(TwoLAcars.length).toEqual(1);
        expect(TwoLAbike).toBeUndefined();
    });
});