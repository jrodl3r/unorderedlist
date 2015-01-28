// ==========================================================================
// Grunt Build
// ==========================================================================

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
          'public/css/core.css': 'public/css/core.scss'
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
          'ZeroClipboard': false
        }
      },
      files: ['Gruntfile.js', 'app.js', 'models/*.js', 'public/js/*.js']
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


    watch: {
      sass: {
        files: ['public/css/**/*.scss'],
        tasks: ['sass:dist']
      },
      js: {
        files: ['Gruntfile.js', 'app.js', 'models/*.js', 'public/js/*.js'],
        tasks: ['jshint']
      },
      test: {
        files: ['spec/**/*.js', 'inc/*.html'],
        tasks: ['test']
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
  grunt.loadNpmTasks('grunt-contrib-jasmine');


  // Register Tasks
  // ----------------------------------------------------------
  grunt.registerTask('default', ['sass:dist', 'jshint', 'jasmine']);
  grunt.registerTask('dev', ['sass:dist', 'jshint', 'watch']);
  grunt.registerTask('test', ['jshint', 'jasmine']);
  grunt.registerTask('heroku', ['sass:dist']);


  // Show Timer
  // ----------------------------------------------------------
  require('time-grunt')(grunt);
};
