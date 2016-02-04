// Alias tests
describe('Alias function', function () {
    var group;
    var values = {};

    beforeEach(function () {
        var data = crossfilter([
            { foo: 'one' },
            { foo: 'two' },
            { foo: 'three' },
            { foo: 'one' },
            { foo: 'one' },
            { foo: 'two' },
        ]);

        var dim = data.dimension(function(d) { return d.foo; });
        group = dim.group();

        var reducer = reductio()
                .count(true)
                .alias({ newCount: function(g) { return g.count; },
                         twoCount: function(g) { return 2*g.count; }
                       });

        reducer(group);
        group.top(Infinity).forEach(function (d) {
            values[d.key] = d.value;
        });
    });

    it('has three groups', function () {
        expect(group.top(Infinity).length).toEqual(3);
    });

    it('grouping for first alias have the right counts', function () {
        expect(values['one'].newCount()).toEqual(3);
        expect(values['two'].newCount()).toEqual(2);
        expect(values['three'].newCount()).toEqual(1);
    });

    it('groupings for second alias have the right values', function(){
        expect(values['one'].twoCount()).toMatch(6);
        expect(values['two'].twoCount()).toMatch(4);
        expect(values['three'].twoCount()).toMatch(2);
    });

});