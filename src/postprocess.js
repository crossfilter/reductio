reductio_cap = require('./cap');

function postProcess(group, p, f) {
    if (p.cap) {
        group.all = reductio_cap.all(group.all, f, p);
    }
}

module.exports = postProcess;
