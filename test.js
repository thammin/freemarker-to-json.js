var fs = require('fs');
var test = require('tape');
var parser = require('./parser');

var ftlObject = fs.readFileSync('./fixture/object.txt', 'utf8');
var ftlEmptyArray = fs.readFileSync('./fixture/emptyArray.txt', 'utf8');
var ftlEmptyObject = fs.readFileSync('./fixture/emptyObject.txt', 'utf8');

test('parse ftl object string to json', function(t) {
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
        input = parser(ftlObject);
    } catch(e) {
        t.fail(e.message);
    }

    t.deepEqual(input, output);
    t.end();
});

test('parse all values include number and boolean to string type.', function(t) {
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
        input = parser(ftlObject, {
            stringOnly: true
        });
    } catch(e) {
        t.fail(e.message);
    }

    t.deepEqual(input, output);
    t.end();
});

test('parse empty array.', function(t) {
    var output = [];

    var input;
    try  {
        input = parser(ftlEmptyArray);
    } catch(e) {
        t.fail(e.message);
    }

    t.equal(Object.prototype.toString.call(input), Object.prototype.toString.call(output));
    t.end();
});

test('parse empty object.', function(t) {
    var output = {};

    var input;
    try  {
        input = parser(ftlEmptyObject);
    } catch(e) {
        t.fail(e.message);
    }

    t.equal(Object.prototype.toString.call(input), Object.prototype.toString.call(output));
    t.end();
});