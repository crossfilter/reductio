var pluck = function(n){
    return function(d){
        return d[n];
    };
};

// supported operators are sum, avg, and count
_grouper = function(path, prior){
    if(!path) path = function(d){return d;};
    return function(p, v){
        if(prior) prior(p, v);
        var x = path(p), y = path(v);
        if(typeof y.count !== 'undefined') x.count += y.count;
        if(typeof y.sum !== 'undefined') x.sum += y.sum;
        if(typeof y.avg !== 'undefined') x.avg = x.sum/x.count;
        return p;
    };
};

reductio_cap = {
    all: function (prior, f, p) {
        if(!p.cap) return prior;
        var obj = f.reduceInitial();
        // we want to support values so we'll need to know what those are
        var values = p.values ? Object.keys(p.values) : [];
        var _othersGrouper = _grouper();
        if(values.length){
            for(var i = 0; i < values.length; ++i){
                _othersGrouper = _grouper(pluck(values[i]), _othersGrouper);
            }
        }
        return function () {
            var slice_idx = p.cap-1;
            var all = prior();
            if(all.length <= p.cap) return all;
            var data = all.slice(0, slice_idx);
            var others = {key: p.othersName};
            others.value = f.reduceInitial();
            for(var i = slice_idx; i < all.length; ++i){
                _othersGrouper(others.value, all[i].value);
            }
            data.push(others);
            return data;
        };
    }
};

module.exports = reductio_cap;
