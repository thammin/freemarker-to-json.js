'use strict';

(function() {
    var root = this;
    var _ftlObjectParser = root.ftlObjectParser;

    var ftlObjectParser = function parser(s, option) {
        option = option || {};
        // parse all values include number and boolean to string type.
        option.stringOnly = option.stringOnly || false;

        var ENDREG = /([\)]|[}\]\)]$|[}\]\)](?=[,}\]]))/;
        var NULLREG = /^null$/;
        var BOOLREG = /^true$|^false$/;
        var NUMREG = /^-?\d+\.?\d*$/;
        var MARKREG = /<\d+>/;
        var TYPEREG = /\w+\(/g;
        var TEMPSTRREG= /""/;

        var alias = {
            '(': '<ob>',
            ')': '<cb>',
            '[': '<osb>',
            ']': '<csb>'
        };

        // add empty string marker
        var tree = s.replace(/\=([,\}+])/g, '=""$1');
        var parts = [];
        var count = 0;

        while (ENDREG.test(tree)) {
            var endTag = ENDREG.exec(tree);
            var endPos = endTag.index;

            var startSym;
            var endSym;

            if (endTag[0] != ')') {
                startSym = String.fromCharCode(endTag[0].charCodeAt() - 2);
                endSym = endTag[0];
            } else {
                var _startSym = '(';
                var _part = tree.substring(0, endPos + 1);
                var _startPos = _part.lastIndexOf(_startSym);
                var prevChar = _part[_startPos - 1];

                if (!/\w/.test(prevChar)) {
                    tree = replaceAt(tree, alias[endTag[0]], endPos);
                    tree = replaceAt(tree, alias[_startSym], _startPos);
                    continue;
                } else {
                    var match = _part.match(TYPEREG);
                    startSym = match[match.length - 1];
                    endSym = endTag[0];
                }
            }

            var startPos = tree.lastIndexOf(startSym, endPos + 1);
            var part = tree.substring(startPos, endPos + 1);

            var prevChar = tree[startPos - 1];
            if (startSym == '[' && prevChar && !/[\[=,]/.test(prevChar)) {
                tree = replaceAt(tree, alias[endSym], endPos);
                tree = replaceAt(tree, alias[startSym], startPos);
                continue;
            }

            // remove clover
            part = part.substring(startSym.length, part.length - 1);

            if (part) {
                if (startSym != '[') {
                    if (endSym == ')') {
                        // replace type as object
                        startSym = '{';
                        endSym = '}';
                    }

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
            }

            // insert marker
            tree = tree.substring(0, startPos) + '<' + count + '>' + tree.substring(endPos + 1, tree.length);

            // cache part of data
            parts[count] = startSym + part + endSym;
            count++;
        }

        // replace all markers with data backwards
        var l = parts.length;
        for (var i = l; i > -1; i--) {
            tree = tree.replace('<' + i + '>', parts[i]);
        }

        // replace back special characters
        Object.keys(alias).forEach(function(key) {
            var reg = new RegExp(alias[key], 'g');
            tree = tree.replace(reg, key);
        });

        // replace a character inside of string
        function replaceAt(input, value, index) {
            return input.substring(0, index) + value + input.substring(index + 1, input.length);
        };

        // is valid String
        function isString(y, stringOnly) {
            return !TEMPSTRREG.test(y) && (stringOnly ? !MARKREG.test(y) : !(NULLREG.test(y) || BOOLREG.test(y) || NUMREG.test(y) || MARKREG.test(y)));
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