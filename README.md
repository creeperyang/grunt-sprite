# grunt-image-sprite

> convert images to a css sprite image

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-image-sprite --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-image-sprite');
```

## The "image_sprite" task

### Overview
In your project's Gruntfile, add a section named `image_sprite` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  image_sprite: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.vertical
Type: `Boolean`
Default value: `true`

A boolean value that is used to specify orientation of icons.

#### options.margin
Type: `Number`
Default value: `0`

A number value that is used to specify margin(icon's gap).

#### options.prefix
Type: `String`
Default value: `'icon'`

A string value that is used as class name's prefix when generate css file.

```css
.icon-angle-down-suffix {
// 'icon' is the prefix, '-' is the connector, 'andle-down' is automatically generated from file's name, 'suffix' is the suffix.
}
```

#### options.connector
Type: `String`
Default value: `'-'`

A string value that is used as connector when generate css file.

#### options.suffix
Type: `String`
Default value: `''`

A string value that is used as class name's suffix when generate css file.

#### options.cssPath
Type: `String`
Default value: `''`

A string value that is used to specify css file's path

#### options.cssFile
Type: `String|Function`
Default value: `''`

A string/function value that is used to specify css file's name. If it is set to function, the generated sprite image's path will be passed as argument.

### Usage Examples

#### Default Options
Run command `grunt image_sprite`, you will get the `tmp/sprite.png` and `tmp/sprite.css`.

```js
grunt.initConfig({
  image_sprite: {
    options: {
      'cssPath': 'tmp',
      'vertical': true,
      'margin': 2
    },
    sprite: {
      options: {
        'vertical': true,
        'cssFile': 'sprite.css'
      },
      files: {
        'tmp/sprite.png': ['test/fixtures/*.png']
      }
    }
  },
})
```

Use sprite inside your project, some more work:

1. add some more style code:

  ```css
  @import url('tmp/sprite.css');

  .icon {
    display: inline-block; // block;
    background-image: url('tmp/sprite.png');
    background-repeat: no-repeat;
  }
  ```

2. make sure css file path and sprite image path is right.
3. Finally you can write something like this:

  ```html
  <i class='icon icon-angle-down'></i>
  ```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
2015-04-17 `v0.0.1` 初始版本

## License
Copyright (c) 2015 creeperyang. Licensed under the MIT license.
