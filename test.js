var fs = require('fs');
var test = require('tape');
var parser = require('./parser');

var ftlObject = fs.readFileSync('./fixture/object.txt', 'utf8');
var ftlEmptyArray = fs.readFileSync('./fixture/emptyArray.txt', 'utf8');
var ftlEmptyObject = fs.readFileSync('./fixture/emptyObject.txt', 'utf8');
var ftlPlainArray = fs.readFileSync('./fixture/plainArray.txt', 'utf8');
var ftlTypedArray = fs.readFileSync('./fixture/typedArray.txt', 'utf8');
var ftlWeirdJapaneseWords = fs.readFileSync('./fixture/japanese.txt', 'utf8');

test('parse ftl object string to json', function(t) {
    var output = {
        a: 1,
        b: true,
        c: 'iamstring',
        d: {
            e: [2, false, 'iam string2', {
                f: 'end omg'
            }]
        },
        ep: []
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
        },
        ep: []
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

test('parse plain array.', function(t) {
    var output = [{
        a: 1,
        b: 2,
        c: 3
    }, {
        d: 4,
        e: 5,
        f: 6
    }];

    var input;
    try  {
        input = parser(ftlPlainArray);
    } catch(e) {
        t.fail(e.message);
    }

    t.deepEqual(input, output);
    t.end();
});

test('parse typed array.', function(t) {
    var output = [{
        a: 1,
        b: 2,
        c: 'か(き)'
    }, {
        a: 2,
        b: 2,
        c: [{
            y: 5
        }, {
            z: 3
        }]
    }];

    var input;
    try  {
        input = parser(ftlTypedArray);
    } catch(e) {
        t.fail(e.message);
    }

    t.deepEqual(input, output);
    t.end();
});

test('parse \[\]\(\) correctly if it could predict as string', function(t) {
    var output = [{
        name: 'マーケット[のの]'
    }, {
        name: 'マーケット(とと)'
    }];

    var input;
    try  {
        input = parser(ftlWeirdJapaneseWords);
    } catch(e) {
        t.fail(e.message);
    }

    t.deepEqual(input, output);
    t.end();
});