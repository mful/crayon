module.exports = function(grunt){

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      scripts: {
        src: ['build/scripts/vendor/**/*.js', 'build/scripts/crayon.js', 'build/scripts/**/*.js', '!build/scripts/popup/**/*.js', '!build/scripts/background/**/*.js'],
        dest: 'build/scripts/scribble.js'
      },

      popupScripts: {
        src: ['build/scripts/popup/popup.js', 'build/scripts/popup/**/*.js', 'build/scripts/helpers/**/*.js', 'build/scripts/constants/**/*.js'],
        dest: 'build/scripts/popup.js'
      },

      backgroundScripts: {
        src: ['build/scripts/background/background.js', 'build/scripts/background/dispatchers/**/*.js', 'build/scripts/background/mediators/**/*.js', 'build/scripts/background/stores/**/*.js', 'build/scripts/helpers/**/*.js', 'build/scripts/constants/**/*.js', 'build/scripts/background/background_initializer.js'],
        dest: 'build/scripts/background.js'
      }
    },

    copy: {
      vendorScripts: {
        cwd: 'vendor',
        src: [ '**/*.js' ],
        dest: 'build/scripts/vendor',
        expand: true
      },

      prod_scripts: {
        cwd: 'production/scripts',
        src: [ 'prod_init.js' ],
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
      },

      manifestDev: {
        src: 'manifest_dev.json',
        dest: 'build/manifest.json'
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
        src: [ 'build/**/*.js', '!build/scripts/scribble.js', '!build/scripts/popup.js', '!build/scripts/background.js' ]
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
          'build/scripts/scribble.js': [ 'build/scripts/prod_init.js', 'build/scripts/crayon.js', 'build/scripts/**/*.js', '!build/scripts/popup/**/*.js', '!build/scripts/background/**/*.js'],
          'build/scripts/popup.js': [ 'build/scripts/prod_init.js', 'build/scripts/popup/popup.js', 'build/scripts/popup/**/*.js', 'build/scripts/helpers/**/*.js', 'build/scripts/constants/**/*.js' ],
          'build/scripts/background.js': [ 'build/scripts/prod_init.js', 'build/scripts/background/background.js', 'build/scripts/background/dispatchers/**/*.js', 'build/scripts/background/mediators/**/*.js', 'build/scripts/background/stores/**/*.js', 'build/scripts/helpers/**/*.js', 'build/scripts/constants/**/*.js', 'build/scripts/background/background_initializer.js']
        }
      }
    },

    jasmine : {
      src : ['build/scripts/scribble.js'],
      options: {
        specs : 'spec/**/*spec.js',
        helpers: ['spec/support/helpers/*.js'],
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
    ['copy:vendorScripts', 'copy:prod_scripts', 'copy:scripts', 'uglify', 'clean:scripts']
  );

  grunt.registerTask(
    'devScripts',
    'Concats JS files together',
    ['copy:vendorScripts', 'copy:scripts', 'concat:scripts', 'concat:popupScripts', 'concat:backgroundScripts', 'clean:scripts']
  );

  grunt.registerTask(
    'build',
    'Compiles all of the assets and copies the files to the build directory.',
    ['clean:build', 'stylesheets', 'scripts', 'copy:images', 'copy:html', 'copy:fonts', 'copy:manifest']
  );

  grunt.registerTask(
    'devBuild',
    'Compiles all of the assets and copies the files to the build directory, without minifying',
    ['clean:build', 'stylesheets', 'devScripts', 'copy:images', 'copy:html', 'copy:fonts', 'copy:manifestDev']
  );

  grunt.registerTask(
    'spec',
    'Run Jasmine tests.',
    ['clean:build', 'devScripts', 'jasmine']
  );

  grunt.registerTask('default', []);

};
