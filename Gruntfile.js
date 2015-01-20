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
          'require': false,
          'console': false,
          'window': true,
          'debug': true,
          'log': true,
          'io': true,
          '__dirname': false,
          'ZeroClipboard': false
        }
      },
      files: ['Gruntfile.js', 'app.js', 'js/*.js']
    },


    /*jasmine: {
      pivotal: {
        src: 'js/core.js',
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
      js: {
        files: ['Gruntfile.js', 'app.js', 'js/*.js'],
        tasks: ['jshint'/*, 'jasmine'*/]
      },
      html: {
        files: ['index.html']
      },
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


  // Register Tasks
  // ----------------------------------------------------------
  grunt.registerTask('default', ['sass:dist', 'jshint']);
  grunt.registerTask('dev', ['sass:dist', 'jshint', 'watch']);


  // Show Timer
  // ----------------------------------------------------------
  require('time-grunt')(grunt);

};
