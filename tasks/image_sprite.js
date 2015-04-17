/*
 * grunt-image-sprite
 * 
 *
 * Copyright (c) 2015 creeperyang
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var imageUtil = require('./util.js');
var genSpriteCSS = require('./genCss.js').genSpriteCSS;
var mergeImage = imageUtil.mergeImage;
var resizeImage = imageUtil.resizeImage;
var getImageInfo = imageUtil.getImageInfo;

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('image_sprite', 'convert images to a css sprite image', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      resize: false,
      vertical: true,
      connector: '-',
      margin: 0,
      prefix: 'icon',
      suffix: '',
      cssPath: '',
      cssFile: function(imagePath) {
        return path.dirname(imagePath) + '/icon.css';
      }
    });

    var done = this.async();

    var infoGettedCount = 0;
    var margin = options.margin;
    var vertical = options.vertical;
    var sourceImagePaths;
    var imageInfoList;
    var cssFile;
    var genSprite = function(sourceImagePaths, imageInfoList, dest) {
      if(infoGettedCount < sourceImagePaths.length) {
        return;
      }
      mergeImage(sourceImagePaths, dest, vertical, margin, function(err) {
        if(err) {
          grunt.log.error(err);
        } else {
          grunt.log.writeln('Sprite Image "' + dest + '" created.');
          grunt.file.write(cssFile, genSpriteCSS(imageInfoList, vertical, grunt.util.normalizelf('\n'), options.connector, options.prefix, options.suffix, margin));
          grunt.log.writeln('Css File "' + cssFile + '" created.');
        }
        done(err);
      });
    };

    // Iterate over all specified file groups.
    this.files.forEach(function (file) {
      sourceImagePaths = file.src.filter(function (filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else if(filepath === file.dest) { // dont include the file who has the same path with dest
          return false;
        } else {
          return true;
        }
      });
      imageInfoList = new Array(sourceImagePaths.length);
      cssFile = Object.prototype.toString.call(options.cssFile) === '[object Function]' ? 
        options.cssFile(file.dest) : options.cssFile;
      cssFile = path.resolve(options.cssPath, cssFile);
      sourceImagePaths.forEach(function (filepath, index) {
        getImageInfo(filepath, function(err, data, stdout) {
          if(err) {
            grunt.log.error(err);
          }
          imageInfoList[index] = data;
          infoGettedCount++;
          // ensure the dest dir exists
          if(!grunt.file.exists(file.dest)) {
            grunt.file.write(file.dest, 'placeholder'); 
            grunt.file.delete(file.dest);
          }
          genSprite(sourceImagePaths, imageInfoList, file.dest);
        });
        return filepath;
      });
    });
  });

};
