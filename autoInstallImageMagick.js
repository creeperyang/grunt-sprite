'use strict';

var exec = require('child_process').exec;
var util = require('util');

console.log('\ngrunt-image-sprite depends on imagemagick [http://www.imagemagick.org/].\n');
console.log('This script will install imagemagick.');
console.log('It\'s ok to skip the installation and install imagemagick manually.');
console.log('Whether to install imagemagick automatically? (Y/n): ');

process.stdin.setEncoding('utf8');
process.stdin.on('data', function(text) {
    if(/^y|yes/i.test(text)) {
        console.log('\nAbout to install imagemagick.');
        setImmediate(install);
    } else {
        console.log('\nSkip imagemagick installing.')
    }
    process.stdin.pause();
});

function install() {
    var platform = process.platform;
    if(platform === 'linux') {
        console.log('Current os is linux. \nAttempt to install via "sudo apt-get install imagemagick".');
        exec('sudo apt-get install imagemagick', function(err, stdout, stderr) {
            if(err) {
                console.log(stderr);
            } else {
                console.log('Installed sucessfully!');
            }
        });
    } else if(platform === 'darwin') {
        console.log('Current os is max os. \nAttempt to install via "sudo port install ImageMagick".');
        exec('sudo port install ImageMagick', function(err, stdout, stderr) {
            if(err) {
                console.log(stderr);
            } else {
                console.log('Installed sucessfully!');
            }
        });
    } else if(/win/.test(platform)) {
        console.log('Current os is windows. Goto http://www.imagemagick.org/script/binary-releases.php#windows and install manually.');
    } else {
        console.log('Goto http://www.imagemagick.org/ for details.');
    }
}
