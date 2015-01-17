/*global module, require*/

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({

    sass: {
      dist: {
        options: {
          style: 'expanded',
          compass: true
        },
        files: {
          'css/core.css': 'css/core.scss'
        }
      }
    },


    jshint: {
      options: {
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
          'app': true,
          'console': false,
          'window': true,
          'debug': true,
          'log': true,
          'jasmine': false,
          'describe': true,
          'it': true,
          'expect': true,
          'sinon': true,
          'stub': true,
          'assert': true,
          'before': true,
          'beforeEach': true,
          'afterEach': true,
          'spyOn': true,
          'spyOnEvent': true,
          'Simon': false,
        }
      },
      files: ['Gruntfile.js', 'js/core.js']
    },


    /*traceur: {
      options: {
        script: true,
        'experimental': true,
        'blockBinding': true
      },
      custom: {
        files: [{
          expand: true,
          cwd: 'js/es6',
          src: ['core.js', 'test.js'],
          dest: 'js/es5'
        }]
      }
    },


    jasmine: {
      pivotal: {
        src: 'js/es5/*.js',
        options: {
          helpers: ['js/traceur-runtime.js', 'js/jquery.js', 'js/jasmine-jquery.js'],
          keepRunner: true
        }
      }
    },*/


    watch: {
      sass: {
        files: ['css/**/*.scss'],
        tasks: ['sass:dist']
      },
      /*js: {
        files: ['Gruntfile.js', 'js/es6/*.js'],
        tasks: ['jshint', 'traceur', 'jasmine']
      },*/
      options: {
        livereload: true
      }
    }

  });


  // Load Modules
  // ----------------------------------------------------------
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-jasmine');
  //grunt.loadNpmTasks('grunt-traceur');


  // Register Tasks
  // ----------------------------------------------------------
  grunt.registerTask('default', ['sass:dist', 'jshint', 'watch']);


  // Show Timer
  // ----------------------------------------------------------
  require('time-grunt')(grunt);

};
