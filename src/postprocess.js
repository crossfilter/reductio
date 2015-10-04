reductio_cap = require('./cap');

function postProcess(group, p, f) {
    group.post = {};
    if (p.cap) {
        group.post.cap = reductio_cap(group.all, f, p);
    }
}

module.exports = postProcess;
