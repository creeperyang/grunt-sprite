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
var toStr = Object.prototype.toString;

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
      retina: false, // whether to enable retina, value: false | true | 'default' | Function
      cssFile: function(imagePath) {
        return path.dirname(imagePath) + '/icon.css';
      }
    });

    var done = this.async();

    var infoGettedCount = 0;
    var margin = options.margin;
    var vertical = options.vertical;
    var retinaRe = /@2x$/; 
    var retinaFilter = function(filepath) {
      filepath = path.resolve(__dirname, filepath);
      var basename = path.basename(filepath, path.extname(filepath));
      var dir = path.dirname(filepath).split(path.sep);
      return retinaRe.test(basename) || retinaRe.test(dir[dir.length - 1]);
    };
    var genSprite = function(imagePaths, imageInfoList, dest, vertical, margin, cb) {
      mergeImage(imagePaths, dest, vertical, margin, function(err) {
        if(err) {
          grunt.log.error(err);
        } else {
          grunt.log.writeln('Sprite image "' + dest + '" created.');
        }
        if(toStr.call(cb) === '[object Function]') {
          cb(err, dest);
        }
      });
    };


    // Iterate over all specified file groups.
    this.files.forEach(function (file) {
      var original = {
        paths: [],
        info: [],
        infoGettedCount: 0
      };
      var retina = options.retina ? {
          paths: [],
          info: [],
          infoGettedCount: 0
        } : null;
      var validPaths = file.src.filter(function (filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else if(filepath === file.dest) { // exclude the dest file(if exists)
          return false;
        } else {
          return true;
        }
      });
      var finish = (function() {
        return retina ? function(err) {
          if(original.done && retina.done) {
            grunt.log.ok();
            done(err);
          }
        } : function(err) {
          if(original.done) {
            grunt.log.ok();
            done(err);
          }
        };
      })();
      var cssFile;

      if(toStr.call(options.retina) === '[object Function]') {
        retinaFilter = options.retina;
      }

      validPaths.sort().forEach(function(filepath) {
        if(retina && retinaFilter(filepath)) {
          retina.paths.push(filepath);
        } else {
          original.paths.push(filepath);
        }
      });

      // check paths
      if(!original.paths.length) {
        grunt.log.error('Images(1x) not found.');
        done('Images not found.');
      } else if(options.retina && !retina.paths.length) {
        grunt.log.error('Retina images(2x) not found.');
        done('Retina images not found.');
      }

      // css file path
      cssFile = Object.prototype.toString.call(options.cssFile) === '[object Function]' ? 
        options.cssFile(file.dest) : options.cssFile;
      cssFile = path.resolve(options.cssPath, cssFile);

      // ensure the dest dir exists
      if(!grunt.file.exists(file.dest)) {
        grunt.file.write(file.dest, 'placeholder'); 
        grunt.file.delete(file.dest);
      }

      // original
      original.paths.forEach(function (filepath, index) {
        getImageInfo(filepath, function(err, data, stdout) {
          if(err) {
            grunt.log.error(err);
          }
          original.info[index] = data;
          original.infoGettedCount++;
          if(original.infoGettedCount === original.paths.length) {
            genSprite(original.paths, original.info, file.dest, vertical, margin, function(err, dest) {
              // gen css/less file
              grunt.file.write(cssFile, genSpriteCSS(path.relative('../', path.relative(cssFile, path.resolve(dest))), original.info, vertical, grunt.util.normalizelf('\n'), options.connector, options.prefix, options.suffix, margin));
              grunt.log.writeln('Style file "' + cssFile + '" created.');
              original.done = true;
              finish(err);
            });
          }
        });
        return filepath;
      });

      // retina
      if(retina && retina.paths.length) {
        retina.paths.forEach(function (filepath, index) {
          getImageInfo(filepath, function(err, data, stdout) {
            if(err) {
              grunt.log.error(err);
            }
            retina.info[index] = data;
            retina.infoGettedCount++;
            if(retina.infoGettedCount === retina.paths.length) {
              genSprite(retina.paths, retina.info, file.dest.replace(/(\.\w+)/, '@2x$1'), vertical, margin*2, function(err) {
                retina.done = true;
                finish(err);
              });
            }
          });
          return filepath;
        });
      }
    });
  });

};
