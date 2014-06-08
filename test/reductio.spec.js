var vows = require('vows'),
    assert = require('assert'),
    reductio = require('../reductio.js');

// Basic tests
vows.describe('Reductio').addBatch({
    'import': {
        topic: reductio,

        'is a function': function (topic) {
            assert.isFunction (topic);
        }
    }
}).export(module); // Run it