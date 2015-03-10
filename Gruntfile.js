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

		},

		jasmine : {
			// Your project's source files
			all : {
				src : ['public/MyTrie/trie.js', 'public/main.js'],
				options: {
					vendor: ['public/lib/angular.min.js', 'test/jasmine-2.1.3/angular-mocks.js', 'public/MyTrie/trie-browser.js'],
					// Your Jasmine spec files
					specs : 'test/autocomplete.js',
				},
			},
			
			fuzzing : {
				src : ['public/MyTrie/trie.js', 'public/main.js'],
				options: {
					vendor: ['public/lib/angular.min.js', 'test/jasmine-2.1.3/angular-mocks.js', 'public/MyTrie/trie-browser.js'],
					// Your Jasmine spec files
					specs : 'test/test-fuzzing.js',
				},
			},

			istanbul: {
				src: '<%= jasmine.all.src %>',
				options: {
					vendor: '<%= jasmine.all.options.vendor %>',
					specs: '<%= jasmine.all.options.specs %>',
					template: require('grunt-template-jasmine-istanbul'),
					templateOptions: {
						coverage: 'coverage/json/coverage.json',
						report: [
							{type: 'html', options: {dir: 'coverage/html'}},
							{type: 'text-summary'},
							{type: 'json-summary'}
						]
					}
				}
			},
			
			istanbul_fuzzing: {
				src: '<%= jasmine.fuzzing.src %>',
				options: {
					vendor: '<%= jasmine.fuzzing.options.vendor %>',
					specs: '<%= jasmine.fuzzing.options.specs %>',
					template: require('grunt-template-jasmine-istanbul'),
					templateOptions: {
						coverage: 'coverage/json/coverage.json',
						report: [
							{type: 'html', options: {dir: 'coverage/html'}},
							{type: 'text-summary'},
							{type: 'json-summary'}
						]
					}
				}
			}
		},


	});

	grunt.registerTask("initHooks", function() {
		grunt.file.copy("./gitHooks/pre-commit", "./.git/hooks/pre-commit");
		grunt.file.copy("./gitHooks/post-commit", "./.git/hooks/post-commit");
	});

	// This will automatically load any grunt plugin you install, such as grunt-contrib-less.
	//require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.registerTask('build_all', ['clean','less','uglify']);
	grunt.registerTask("default", ["build_all"]);
	grunt.registerTask("istanbul", "istanbul");
};
