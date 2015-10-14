module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    jasmine : {
      src : '*-r*.js',
      options : {
        specs : 'tests/*.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('test', ['jasmine']);

  grunt.registerTask('default', ['test']);

};
