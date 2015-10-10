describe('Reductio cap', function () {
    var group, reducer;

    beforeEach(function () {
        var data = crossfilter([
            {foo: 1, bar: 2},
            {foo: 2, bar: 2},
            {foo: 3, bar: 1},
            {foo: 4, bar: 1},
            {foo: 5, bar: 1},
            {foo: 6, bar: 1}
        ]);

        var dim = data.dimension(function(d) { return d.foo; });
        group = dim.group();
        groupString = dim.group();

        reducer = reductio()
                .sum('bar')
                .count(true)
                .avg(true);

        reducer(group);
    });

    it('has three groups', function () {
        expect(group.post().cap(3)().length).toEqual(3);
    });

    it('groups have the right sums', function(){
        var values = {};
        group.post().cap(3)().forEach(function(d){
            values[d.key] = d.value;
        });

        expect(values[1].sum).toBe(2);
        expect(values[2].sum).toBe(2);
        expect(values.Others.sum).toBe(4);
    });

    it('plays nicely with count', function(){
        expect(group.post().cap(3)().pop().value.count).toBe(4);
    });

    it('plays nicely with avg', function(){
        expect(group.post().cap(3)().pop().value.avg).toBe(1);
    });

    it('seperate instances can be created', function(){
        var post1 = group.post().cap(3);
        var post2 = group.post().cap(4);
        expect(post1().length).toBe(3);
        expect(post2().length).toBe(4);
    });

    it('returns the whole array when it\'s length equals the cap', function(){
        var val = group.post().cap(6)().pop();
        expect(val.key).not.toEqual('Others');
    });

    it('can rename the others grouping key', function(){
        var val = group.post().cap(3, 'Hot damn that woman is a man')().pop();
        expect(val.key).toBe('Hot damn that woman is a man');
    });

});

describe('Reductio cap with values', function(){
    var group;
    beforeEach(function(){
        var data = crossfilter([
            { foo: 'one', x: 1, other: 2 },
            { foo: 'two', x: 2, other: 1 },
            { foo: 'three', x: 3, other: 4 },
            { foo: 'four', x: 4, other: 1 }, // second group
            { foo: 'five', x: 5, other: 2 }, // first group
            { foo: 'six', x: 6, other: 3 }
        ]);

        var dim = data.dimension(function(d) { return d.foo; });
        group = dim.group();

        var reducer = reductio()
                .avg(function(d) { return d.x; })
                .count(true);

        reducer.value("x").count(true).sum(function (d) { return d.x; });
        reducer.value("y").count(true).sum(function(d) { return d.other; }).avg(true);
        reducer(group);
    });

    it('has the correct number of groups', function(){
        expect(group.post().cap(3)().length).toBe(3);
    });

    it('has the correct sum', function(){
        var val = group.post().cap(3)().pop().value;
        var x = val.x;
        var y = val.y;
        expect(val.sum).toBe(12);
        expect(x.sum).toBe(12);
        expect(y.sum).toBe(10);
    });

    it('has the correct average', function(){
        var val = group.post().cap(3)().pop().value;
        var avg = val.avg;
        var avgY = val.y.avg;

        expect(avg).toBe(12/4);
        expect(avgY).toBe(10/4);
    });
});
