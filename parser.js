'use strict';

(function() {
    var root = this;
    var _ftlObjectParser = root.ftlObjectParser;

    var ftlObjectParser = function parser(s, option) {
        option = option || {};
        // parse all values include number and boolean to string type.
        option.stringOnly = option.stringOnly || false;

        var ENDREG = /([}\]]$|[}\]](?=[,}\]]))/;
        var NULLREG = /^null$/;
        var BOOLREG = /^true$|^false$/;
        var NUMREG = /^-?\d+\.?\d*$/;
        var MARKREG = /<\d+>/;

        var tree = s;
        var parts = [];
        var count = 0;

        while (ENDREG.test(tree)) {
            var endTag = ENDREG.exec(tree);
            var endPos = endTag.index + 1;

            var startSym = String.fromCharCode(endTag[0].charCodeAt() - 2);
            var endSym = endTag[0];

            var startPos = tree.lastIndexOf(startSym, endPos);
            var part = tree.substring(startPos, endPos);

            // remove clover
            part = part.substring(1, part.length - 1);

            if (startSym != '[') {
                // format keys and values
                part = part.replace(/([^=,\s]+)=([^,]+)/g, function(main, $1, $2) {
                    var pre = '"' + $1 + '"';
                    var suf = isString($2, option.stringOnly) ? '"' + $2 + '"' : $2;
                    return pre + ':' + suf;
                });
            } else {
                // format array values
                part = part.split(', ').map(function(value) {
                    return isString(value, option.stringOnly) ? '"' + value + '"' : value;
                }).join(', ');
            }

            // insert marker
            tree = tree.substring(0, startPos) + '<' + count + '>' + tree.substring(endPos, tree.length);

            // cache part of data
            parts[count] = startSym + part + endSym;
            count++;
        }

        // replace all markers with data backwards
        var l = parts.length;
        for (var i = l; i > -1; i--) {
            tree = tree.replace('<' + i + '>', parts[i]);
        }

        // is valid String
        function isString(y, stringOnly) {
            return stringOnly ? !MARKREG.test(y) : !(NULLREG.test(y) || BOOLREG.test(y) || NUMREG.test(y) || MARKREG.test(y));
        }

        return JSON.parse(tree);
    };

    ftlObjectParser.noConflict = function() {
        root.ftlObjectParser = _ftlObjectParser;
        return ftlObjectParser;
    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = ftlObjectParser;
        }
        exports.ftlObjectParser = ftlObjectParser;
    } else {
        root.ftlObjectParser = ftlObjectParser;
    }

}).call(this);