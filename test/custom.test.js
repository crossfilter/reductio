// Counting tests
describe('Reductio custom', function () {
    var group, dimFilter, customReducer;

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
        dimFilter = data.dimension(function(d) { return d.foo; });
        group = dim.group();

        // Create a dummy custom reducer that sums items length
        customReducer = {
            add: function(p, v) {
                p.myProp += v.foo.length;
                return p;
            },
            remove: function(p, v) {
                p.myProp -= v.foo.length;
                return p;
            },
            initial: function(p) {
                p.myProp = 0;
                return p;
            }
        };

        spyOn(customReducer, 'add').and.callThrough();
        spyOn(customReducer, 'remove').and.callThrough();
        spyOn(customReducer, 'initial').and.callThrough();

        var reducer = reductio()
            .count(true)
            .custom(customReducer);

        reducer(group);
        group.all();
    });

    it('applies previous reducer', function() {
        expect(group.all()[0].value.count).toBeDefined();
    });

    it('calls intial function once for each group', function(done) {
        expect(customReducer.initial.calls.count()).toEqual(3);
        done();
    });

    it('calls add function once for each element', function(done) {
        expect(customReducer.add.calls.count()).toEqual(6);
        done();
    });

    it('computes custom prop correctly', function(done) {
        var data = group.top(Infinity);
        expect(data[0].value.myProp).toEqual(5); // three
        expect(data[1].value.myProp).toEqual(6); // two
        expect(data[2].value.myProp).toEqual(9); // one
        done();
    });

    it('calls remove function once for each filtered element', function(done) {
        dimFilter.filter('three');
        expect(customReducer.remove.calls.count()).toEqual(5);
        done();
    });

    it('computes custom prop correctly when remove', function() {
        dimFilter.filter('three');
        var data = group.top(Infinity);
        expect(data[0].value.myProp).toEqual(5); // three
        expect(data[1].value.myProp).toEqual(0); // two
        expect(data[2].value.myProp).toEqual(0); // one
    });


});