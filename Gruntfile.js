module.exports = function(grunt){

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      vendorScripts: {
        cwd: 'vendor',
        src: [ '**/*.js' ],
        dest: 'build/scripts',
        expand: true
      },

      scripts: {
        cwd: 'scripts',
        src: ['**/*.js'],
        dest: 'build/scripts',
        expand: true
      },

      images: {
        cwd: 'images',
        src: [ '*' ],
        dest: 'build/images',
        expand: true
      },

      html: {
        cwd: 'html',
        src: ['*'],
        dest: 'build/html',
        expand: true
      },

      fonts: {
        cwd: 'fonts',
        src: ['*'],
        dest: 'build/fonts',
        expand: true
      },

      manifest: {
        cwd: '.',
        src: [ 'manifest.json' ],
        dest: 'build',
        expand: true
      }
    },

    clean: {
      build: {
        src: [ 'build' ]
      },
      stylesheets: {
        src: [ 'build/**/*.css', '!build/styles/scribble.css' ]
      },
      scripts: {
        src: [ 'build/**/*.js', '!build/scripts/scribble.js' ]
      },
    },

    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'styles',
          src: ['scribble.scss'],
          dest: 'build/styles',
          ext: '.css'
        }]
      }
    },

    cssmin: {
      build: {
        files: {
          'build/styles/scribble.css': [ 'build/styles/**/*.css' ]
        }
      }
    },

    uglify: {
      build: {
        files: {
          'build/scripts/scribble.js': [ 'build/scripts/crayon.js', 'build/scripts/**/*.js', '!build/scripts/background/**/*.js' ],
          'build/scripts/background.js': [ 'build/scripts/background/**/*.js' ]
        }
      }
    },

    jasmine : {
      src : ['build/scripts/scribble.js'],
      options: {
        specs : 'spec/**/*spec.js',
        helpers: 'spec/support/helpers/*.js',
        keepRunner: true
      }
    },

  });

  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  grunt.registerTask(
    'stylesheets',
    'Compiles the stylesheets.',
    ['sass', 'cssmin', 'clean:stylesheets']
  );

  grunt.registerTask(
    'scripts',
    'Compiles the JavaScript files.',
    ['copy:vendorScripts', 'copy:scripts', 'uglify', 'clean:scripts']
  );

  grunt.registerTask(
    'build',
    'Compiles all of the assets and copies the files to the build directory.',
    ['clean:build', 'stylesheets', 'scripts', 'copy:images', 'copy:html', 'copy:fonts', 'copy:manifest']
  );

  grunt.registerTask(
    'spec',
    'Run Jasmine tests.',
    ['scripts', 'jasmine']
  );

  grunt.registerTask('default', []);

};
