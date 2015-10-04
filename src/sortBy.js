var pluck_n = function (n) {
    if (typeof n === 'function') {
        return n;
    }
    if (~n.indexOf('.')) {
        var split = n.split('.');
        return function (d) {
            return split.reduce(function (p, v) {
                return p[v];
            }, d);
        };
    }
    return function (d) {
        return d[n];
    };
};

var comparer = function (accessor, ordering) {
    return function (a, b) {
        var aVal = accessor(a);
        var bVal = accessor(b);
        if(aVal > bVal) return ordering == 'asc' ? 1 : -1;
        if(aVal < bVal) return ordering == 'asc' ? -1 : 1;
        return 0;
    };
};

var type = {}.toString;

module.exports = function (prior) {
    return function (value) {
        var ordering = 'asc';
        if(type.call(value) === '[object String]' && value.indexOf('-') === 0){
            value = value.substr(1);
            ordering = 'desc';
        }
        return prior().sort(comparer(pluck_n(value), ordering));
    };
};
