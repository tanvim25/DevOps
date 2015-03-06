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
			files: ["public/main.css", "public/main.min.js"],
		},

		uglify:{
			files: {
				src: "public/main.js",
				dest: "public/main.min.js"
			}

		},

		jasmine : {
			// Your project's source files
			src : ['public/main.js', 'public/MyTrie/trie-browser.js'],
			options: {
				vendor: ['public/lib/angular.min.js', 'test/jasmine-2.1.3/angular-mocks.js'],
				// Your Jasmine spec files
				specs : 'test/autocomplete.js',
			}
		}

	});
	
	grunt.registerTask("initHooks", function() {
		grunt.file.copy("./gitHooks/pre-commit", "./.git/hooks/pre-commit");
	});

	// This will automatically load any grunt plugin you install, such as grunt-contrib-less.
	//require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.registerTask('build_all', ['clean','less','uglify']);
	grunt.registerTask("default", ["build_all"]);
};