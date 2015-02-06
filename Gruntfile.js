module.exports = function(grunt) {

  grunt.initConfig({

	  less: 
	  {
	      development: 
	      {
	        options: 
	        {
	          compress: true,
	          yuicompress: true,
	          optimization: 2
	        },
	        files: 
	        [{
	  				expand: true,
	  				cwd: "public",
	  				src: "**/main.less",
	  				dest: "public",
	  				ext: ".css"
	        }]
	      }
	  }

  });

  // This will automatically load any grunt plugin you install, such as grunt-contrib-less.
  //require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.registerTask("default", ["less"]);
};