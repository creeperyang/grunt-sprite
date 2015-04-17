'use strict';

var fs = require("fs");
var path = require('path');
var execFile = require('child_process').execFile;

var toStr = Object.prototype.toString;
var propArray = ['path', 'format', 'dimension', 'sizeMore', 'colorDepth', 'imageClass', 'size', 'time', 'time2'];
var dimensionRegex = /(\d+)x(\d+)/;

function mergeImage(sourceImgPaths, mergedImgPath, vertical, margin, callback) {
    if(!sourceImgPaths) {
        throw new Error('invalid argument:sourceImgPaths');
    }
    if(toStr.call(sourceImgPaths) !== '[object Array]') {
        sourceImgPaths = [sourceImgPaths];
    }
    vertical = !!vertical;
    margin = +margin || 0;
    var execArgs = ['-background', 'none'].concat(sourceImgPaths);
    if(margin) {
        execArgs = execArgs.concat(['-splice', margin + 'x' + margin + '+0+0']);
    }
    execFile('convert', execArgs.concat([(vertical ? '-' : '+') + 'append', mergedImgPath]), function(err, stdout, stderr) {
        if(toStr.call(callback) === '[object Function]') {
            callback(err, stdout, stderr);
        }
    });
}

function resizeImage(imagePath, newImagePath, size, callback) {
    var sizeArg;
    if(toStr.call(size) === '[object Number]') {
        sizeArg = size;
    } else if(toStr.call(size) === '[object Object]') {
        sizeArg = size.width;
        if(size.height) {
            sizeArg += 'x' + size.height;
        }
        if(size.forceSize) {
            sizeArg += '!';
        }
    } else {
        throw new Error('invalid size argument');
    }
    execFile("convert", ["-resize", sizeArg, imagePath, newImagePath], function(err, stdout, stderr) {
        if(toStr.call(callback) === '[object Function]') {
            callback(err, stdout, stderr);
        }
    });
}

function getImageInfo(imagePath, callback) {
    execFile("identify", [imagePath], function(err, stdout, stderr) {
        var map = {};
        var widthAndHeight;
        if(toStr.call(callback) === '[object Function]') {
            if(err) {
                callback(err);
            } else {
                stdout.slice(0, stdout.length - 1).split(' ').forEach(function(val, i) {
                    map[propArray[i]] = val;
                });
                widthAndHeight = dimensionRegex.exec(map.dimension);
                if(widthAndHeight) {
                    map.width = widthAndHeight[1];
                    map.height = widthAndHeight[2];
                }
                callback(null, map, stdout);
            }
        }
    });
}

exports.mergeImage = mergeImage;
exports.resizeImage = resizeImage;
exports.getImageInfo = getImageInfo;