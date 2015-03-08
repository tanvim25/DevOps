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
		},

		clean: {
			files: ["public/main.css", "public/main.min.js", "pmd.xml"],
		},

		uglify:{
			files: {
				src: "public/main.js",
				dest: "public/main.min.js"
			}

		}

	});

	// This will automatically load any grunt plugin you install, such as grunt-contrib-less.
	//require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('build_all', ['clean','less','uglify']);
	grunt.registerTask("default", ["build_all"]);
};