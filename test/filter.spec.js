// Filtering tests
describe('Reductio filter', function () {
    var dim, dim2;

    beforeEach(function () {
        var data = crossfilter([
            { foo: 'one', bar: 1 },
            { foo: 'two', bar: 2 },
            { foo: 'three', bar: 3 },
            { foo: 'one', bar: 4, sparseVal: 5 },
            { foo: 'one', bar: 5, sparseVal: 15 },
            { foo: 'two', bar: 6 },
        ]);

        dim = data.dimension(function(d) { return d.foo; });
        dim2 = data.dimension(function(d) { return d.foo; });
    });

    it('groups a counting reducer', function() {
      var reducer = reductio().count(true)
        .filter(function(d) { return d.bar > 3; });

      var map = _.indexBy(reducer(dim.group()).top(Infinity), 'key');
      expect(map.one.value.count).toEqual(2);
      expect(map.two.value.count).toEqual(1);
      expect(map.three.value.count).toEqual(0);
    });

    it('groups an averaging reducer', function() {
      var reducer = reductio()
        .filter(function(d) { return d.bar > 3; })
        .avg(function (d) { return d.bar; });

      var map = _.indexBy(reducer(dim.group()).top(Infinity), 'key');
      expect(map.one.value.avg).toBeCloseTo(4.5);
      expect(map.two.value.avg).toEqual(6);
      expect(map.three.value.avg).toEqual(0);
    });

    it('handles value lists', function() {
      var reducer = reductio();
      reducer.value("gt3").filter(function(d) { return d.bar > 3; }).count(true);
      reducer.value("even").filter(function(d) { return d.bar % 2 === 0; }).count(true);

      var map = _.indexBy(reducer(dim.group()).top(Infinity), 'key');
      expect(map.one.value.gt3.count).toEqual(2);
      expect(map.one.value.even.count).toEqual(1);
      expect(map.two.value.gt3.count).toEqual(1);
      expect(map.two.value.even.count).toEqual(2);
      expect(map.three.value.gt3.count).toEqual(0);
      expect(map.three.value.even.count).toEqual(0);
    });

    it('handles sparsely-populated data', function() {
      var reducer = reductio()
        .filter(function(d) { return typeof d.sparseVal !== "undefined"; })
        .avg(function(d) { return d.sparseVal; });

      var map = _.indexBy(reducer(dim.group()).top(Infinity), 'key');
      expect(map.one.value.count).toEqual(2);
      expect(map.one.value.avg).toBeCloseTo(10);
      expect(map.two.value.count).toEqual(0);
      expect(map.three.value.count).toEqual(0);
    });
    it('exposes data lifecycle information from Crossfilter2', function() {
      var reducer = reductio();
      reducer.value('addOnly')
        .count(true)
        .filter(function(d, nf) { return d.bar > 3 && nf; });
      reducer.value('normal')
        .count(true)
        .filter(function(d, nf) { return d.bar > 3; });

      var group = reducer(dim.group());

      var map = _.indexBy(group.top(Infinity), 'key');
      expect(map.one.value.addOnly.count).toEqual(2);
      expect(map.two.value.addOnly.count).toEqual(1);
      expect(map.three.value.addOnly.count).toEqual(0);
      expect(map.one.value.normal.count).toEqual(2);
      expect(map.two.value.normal.count).toEqual(1);
      expect(map.three.value.normal.count).toEqual(0);

      dim2.filter('one');

      map = _.indexBy(group.top(Infinity), 'key');
      expect(map.one.value.addOnly.count).toEqual(2);
      expect(map.two.value.addOnly.count).toEqual(1);
      expect(map.three.value.addOnly.count).toEqual(0);
      expect(map.one.value.normal.count).toEqual(2);
      expect(map.two.value.normal.count).toEqual(0);
      expect(map.three.value.normal.count).toEqual(0);
    });
});
