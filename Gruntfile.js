var configify = require('config-browserify');

module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-banner');
    
    var pathsConfig = {
        client: 'src/client',
        server: 'src/server'
    };

    // Project configuration.
    grunt.initConfig({
        paths: pathsConfig,

        pkg: grunt.file.readJSON('package.json'),

        sass: {
            options: {
                sourceMap: true,
                outputStyle: 'compressed'
            },
            build: {
                files: {
                    '<%= paths.client %>/build/main.css': '<%= paths.client %>/scss/main.scss'
                }
            }
        },

        browserify: {
            options: {
                browserifyOptions: {
                    debug: true
                },
                
                transform: [configify]
            },

            build: {
                files: {
                    '<%= paths.client %>/build/main.js': ['<%= paths.client %>/js/main.js']
                }
            }
        },

        uglify: {
            build: {
                options: {
                    // sourceMap: true,
                    // sourceMapName: '<%= paths.client %>/build/main.min.map'
                },

                files: {
                    '<%= paths.client %>/build/main.min.js': ['<%= paths.client %>/build/main.js']
                }
            }
        },

        jshint: {
            all: [
                'Gruntfile.js', 
                '<%= paths.client %>/js/**/*.js', 
                '<%= paths.server %>/js/**/*.js'
            ]
        },

        usebanner: {
            taskName: {
                options: {
                    position: 'top',
                    banner: [
                        '/**',
                        '* Studiengang: MultimediaTechnology / FHS',
                        '* Zweck: Web (Basisqualifikationen)',
                        '* Autor: Erfan Ebrahimnia',
                        '*/\n'
                    ].join('\n'),
                    linebreak: true
                },
                files: {
                    src: [ 
                        '<%= paths.client %>/js/**/*.js', 
                        '<%= paths.server %>/js/**/*.js' ,
                        '<%= paths.client %>/scss/**/*.scss', 
                    ]
                }
            }
        },

        watch: {
            sass: {
                files: ['<%= paths.client %>/scss/*.scss'],
                tasks: ['sass'],
            },

            browserify: {
                files: ['<%= paths.client %>/js/**/*.js'],
                tasks: ['browserify']
            }
        }
    });

    grunt.registerTask('build', ['sass', 'jshint', 'browserify', 'uglify']);
    grunt.registerTask('default', ['watch']);

};
