'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.image_sprite = {
  setUp: function (done) {
    // setup here if necessary
    done();
  },
  sprite_retina: function (test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/sprite@2x.png');
    var expected = grunt.file.read('test/expected/sprite@2x.png');
    test.equal(actual, expected, 'should be the same.');

    test.done();
  },
  sprite: function (test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/sprite.png');
    var expected = grunt.file.read('test/expected/sprite.png');
    test.equal(actual, expected, 'should be the same.');

    test.done();
  },
  style: function (test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/sprite.css')
      .toString().replace(/^\/\*[^]*\*\//m, '');
    var expected = grunt.file.read('test/expected/sprite.css')
      .toString().replace(/^\/\*[^]*\*\//m, '');

    test.equal(actual, expected, 'should be the same.');

    test.done();
  }
};
