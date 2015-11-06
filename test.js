var fs = require('fs');
var test = require('tape');
var parser = require('./parser');

var ftlString = fs.readFileSync('./fixture/object.txt', 'utf8');

test('parse ftl object string to json', function (t) {
    var output = {
        a: 1,
        b: true,
        c: 'iamstring',
        d: {
            e: [2, false, 'iam string2', {
                f: 'end omg'
            }]
        }
    };

    var input;
    try {
        input = parser(ftlString);
    } catch(e) {
        t.fail(e.message);
    }

    t.deepEqual(input, output);
    t.end();
});

test('parse all values include number and boolean to string type.', function (t) {
    var output = {
        a: '1',
        b: 'true',
        c: 'iamstring',
        d: {
            e: ['2', 'false', 'iam string2', {
                f: 'end omg'
            }]
        }
    };

    var input;
    try {
        input = parser(ftlString, {
            stringOnly: true
        });
    } catch(e) {
        t.fail(e.message);
    }

    t.deepEqual(input, output);
    t.end();
});