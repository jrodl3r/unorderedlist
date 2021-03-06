// ==========================================================================
// Grunt Build
// ==========================================================================

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({

    sass: {
      dev: {
        options: {
          style: 'expanded',
          compass: true
        },
        files: {
          'public/css/core.css': 'public/css/core.scss'
        }
      },
      dist: {
        options: {
          style: 'compressed',
          compass: true,
          sourcemap: 'none'
        },
        files: {
          'public/css/core.css': 'public/css/core.scss'
        }
      },
      prototype: {
        options: {
          style: 'expanded',
          compass: true,
          require: ['breakpoint']
        },
        files: {
          'prototype/core.css': 'prototype/core.scss'
        }
      }
    },


    jshint: {
      options: {
        '-W058': true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: false,
        boss: true,
        eqnull: false,
        browser: true,
        esnext: true,
        debug: true,
        globalstrict: true,
        globals: {
          '$': false,
          'module': true,
          'require': false,
          'console': false,
          'window': true,
          'debug': true,
          'log': true,
          'io': true,
          'process': false,
          '__dirname': false,
          'ZeroClipboard': false,
          'chrome': true
        }
      },
      files: ['Gruntfile.js', 'app.js', 'models/*.js', 'public/js/*.js', 'chrome/ext/*.js', 'prototype/core.js']
    },


    jasmine: {
      pivotal: {
        src: 'public/js/core.js',
        options: {
          vendor: ['public/js/vendor/socket.io.js', 'public/js/vendor/clipboard.min.js', 'public/js/vendor/jquery.min.js'],
          helpers: ['spec/helpers/jasmine-jquery.js'],
          specs: 'spec/*Spec.js',
          keepRunner: true
        }
      }
    },


    preprocess: {
      html : {
        src : 'tmpl/index.html',
        dest : 'public/index.html'
      }
    },


    watch: {
      sass: {
        files: ['public/css/**/*.scss'],
        tasks: ['sass:dist']
      },
      js: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint']
      },
      test: {
        files: ['spec/**/*.js', 'tmpl/inc/*.html', 'public/js/*.js'],
        tasks: ['test']
      },
      html: {
        files: ['tmpl/**/*.html'],
        tasks: ['preprocess']
      },
      options: {
        livereload: true
      },
      prototype: {
        files: ['prototype/core.scss'],
        tasks: ['sass:prototype']
      }
    }

  });


  // Load Modules
  // ----------------------------------------------------------
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-preprocess');


  // Register Tasks
  // ----------------------------------------------------------
  // grunt.registerTask('default', ['sass:dev', 'jshint', 'preprocess', 'jasmine']);
  grunt.registerTask('dev', ['sass:dev', 'jshint', 'preprocess', 'jasmine', 'watch']);
  grunt.registerTask('dist', ['sass:dist', 'jshint', 'jasmine', 'preprocess']);
  grunt.registerTask('proto', ['sass:prototype', 'jshint', 'watch']);
  grunt.registerTask('test', ['jasmine']);
  // grunt.registerTask('heroku', ['sass:dist']);
  // grunt.registerTask('default', ['sass:dev']);
  grunt.registerTask('default', []);


  // Show Timer
  // ----------------------------------------------------------
  require('time-grunt')(grunt);

};
