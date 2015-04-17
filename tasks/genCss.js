'use strict';

var path = require('path');
var toStr = Object.prototype.toString;

function genSpriteCSS(infoList, vertical, newline, connector, prefix, suffix, margin) {
    if (toStr.call(infoList) !== '[object Array]') {
        throw new Error('invalid argument:infoList');
    }
    if (toStr.call(newline) !== '[object String]') {
        throw new Error('invalid argument:newline');
    }

    vertical = !!vertical;
    connector = connector || '';
    prefix = prefix || '';
    suffix = suffix || '';
    margin = +margin || 0;

    var css = '';
    var last = margin;
    var left, top, width, height;
    var filename;

    infoList.forEach(function(info, i) {
        filename = path.basename(info.path);
        css += '.' + prefix + connector + filename.slice(0, filename.lastIndexOf('.'));
        if (suffix) {
            css += connector + suffix;
        }
        width = +info.width;
        height = +info.height;
        if (vertical) {
            left = margin;
            top = last;
            last += height;
        } else {
            top = margin;
            left = last;
            last += width;
        }
        last += margin;
        css += ' {' + newline + '    background-position: -' + left + 'px -' + top + 'px;' +
            newline + '    width: ' + width + 'px;' +
            newline + '    height: ' + height + 'px;' +
            newline + '}' + newline;
    });

    return css;
}

exports.genSpriteCSS = genSpriteCSS;
