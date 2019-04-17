/*
 * Gonzalo Chacon
 */

const sass = require('node-sass');

module.exports = function(grunt) {
  'use strict';

  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          implementation: sass,
          style: 'compressed',
          sourceMap: true
        },
        files: {
          'dist/css/style.css': [
            'src/scss/style.scss'
          ]
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */ \n'
      },
      targets: {
        files: {
          'dist/js/index.min.js': 'dist/js/index.js',
        }
      }
    },
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */ \n'
      },
      targets: {
        files: {
          'dist/js/index.js': ['src/js/*/*/*.js', 'src/js/*/*.js', 'src/js/index.js'],
        }
      }
    },
    cssmin: {
      files: {
        expand: true,
        cwd: 'dist/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/',
        ext: '.min.css'
      }
    },
    copy: {
      main: {
        expand: true,
        src: 'index.html',
        dest: 'dist/',
        cwd: 'src/',
      }
    },
    htmlmin: {
      dev: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**/*.html', '*.html'],
          dest: 'dist'
        }]
      }
    },
    watch: {
      options: {
        livereload: true
      },
      scripts: {
        files: ['src/js/**/*.js'],
        tasks: ['concat']
      },
      sass: {
        files: ['src/scss/**/*.scss'],
        tasks: ['sass']
      },
      html: {
        files: ['src/**/*.html', '*.html'],
        tasks: ['htmlmin']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: ['dist/**/*'],
      }
    },
    'http-server': {
      'dev': {
          root: "./dist",
          port: 8081,
          host: "0.0.0.0",
          cache: 0,
          showDir : true,
          autoIndex: true,
          ext: "html",
          runInBackground: true,
          logFn: function(req, res, error) { },
          openBrowser : false,
          customPages: {
              "/readme": "README.md"
          }
      }

  },
  });

  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['concat', 'sass', 'copy', 'http-server:dev', 'watch']);
  grunt.registerTask('init', ['concat', 'uglify', 'sass', 'cssmin', 'htmlmin']);
  grunt.registerTask('build', ['concat', 'uglify', 'sass', 'cssmin', 'htmlmin']);
}
