'use strict';

var path = require('path');
var toStr = Object.prototype.toString;

function genSpriteCSS(spriteImagePath, infoList, vertical, newline, connector, prefix, suffix, margin) {
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

    var ext = path.extname(spriteImagePath);
    var css = '/*' + newline + ' * ' + (new Date()).toLocaleString() + 
        newline + ' * Here is the sprite plugin automatically generated style file.' +
        newline + ' */' + 
        newline  + '.' + prefix + ' {' + 
        newline + '    display: inline-block;' + 
        newline + '    background-image: url(' + spriteImagePath + ');' + 
        newline  + '    background-repeat: no-repeat;'  + 
        newline  + '    background-image: -webkit-image-set(url(' + spriteImagePath + ') 1x, url(' + spriteImagePath.replace(new RegExp('(' + ext + ')' + '$', 'i'), '@2x$1') + ') 2x);'  +
        newline + '}' + newline;
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
