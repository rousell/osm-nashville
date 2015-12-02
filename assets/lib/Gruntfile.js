module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['../../app/**/*.js', '../../app/*.js'],
    },
    sass: {
      dist: {
        files: {
          '../styles/main.css': '../styles/sass/main.scss'
        }
      }
    },
    watch: {
      javascripts: {
        files: ['../../app/**/*.js'],
        tasks: ['jshint']
      },
      sassy: {
        files: ['../styles/sass/**/*.scss'],
        tasks: ['sass']
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['jshint', 'sass', 'watch']);
};
