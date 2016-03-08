'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    var optipng = require('imagemin-optipng');
    var jpegtran = require('imagemin-jpegtran');
    var gifsicle = require('imagemin-gifsicle');
    var svgo = require('imagemin-svgo');


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        app: 'app',
        dist: 'dist',

        sass: {
            options: {
                includePaths: ['<%= app %>/bower_components/foundation-sites/scss']
            },
            dist: {
                options: {
                    outputStyle: 'extended'
                },
                files: {
                    '<%= app %>/css/app.css': '<%= app %>/scss/app.scss'
                }
            }
        },

        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({browsers: 'last 2 versions'})
                ]
            },
            dist: {
                src: '<%= app %>/css/app.css'
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= app %>/js/**/*.js'
            ]
        },

        clean: {
            dist: {
                src: ['<%= dist %>/*']
            },
            grunticon: {
                src: ['<%= app %>/images/grunticon/*']
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= app %>/',
                    src: ['fonts/**', '**/*.html', '**/*.htaccess', '**/*.ico', '!**/*.scss', '!bower_components/**'],
                    dest: '<%= dist %>/'
                }]
            }
        },

        uglify: {
            options: {
                preserveComments: 'some',
                mangle: false
            }
        },

        useminPrepare: {
            html: ['<%= app %>/index.html'],
            options: {
                dest: '<%= dist %>'
            }
        },

        usemin: {
            html: ['<%= dist %>/**/*.html', '!<%= app %>/bower_components/**'],
            css: ['<%= dist %>/css/**/*.css'],
            options: {
                dirs: ['<%= dist %>'],
                blockReplacements: {
                    js: function (block) {
                        return '<script async src=\'' + block.dest + '\'><\/script>';
                    }
                }
            }
        },

        uncss: {
            dist: {
                files: {
                    '<%= dist %>/css/app.min.css': ['<%= dist %>/index.html']
                }
            }
        },

        cssmin: {
            dist: {
                files: {
                    '<%= dist %>/css/app.min.css': ['<%= dist %>/css/app.min.css']
                }
            }
        },

        watch: {
            grunt: {
                files: ['Gruntfile.js'],
                tasks: ['sass', 'postcss']
            },
            sass: {
                files: '<%= app %>/scss/**/*.scss',
                tasks: ['sass', 'postcss']
            },
            livereload: {
                files: ['<%= app %>/**/*.html', '!<%= app %>/bower_components/**', '<%= app %>/js/**/*.js', '<%= app %>/css/**/*.css', '<%= app %>/images/**/*.{jpg,gif,svg,jpeg,png}'],
                options: {
                    livereload: true
                }
            }
        },

        connect: {
            app: {
                options: {
                    port: 9000,
                    base: '<%= app %>/',
                    open: true,
                    livereload: true,
                    hostname: '127.0.0.1'
                }
            },
            dist: {
                options: {
                    port: 9001,
                    base: '<%= dist %>/',
                    open: true,
                    keepalive: true,
                    livereload: false,
                    hostname: '127.0.0.1'
                }
            }
        },

        wiredep: {
            target: {
                src: [
                    '<%= app %>/**/*.html'
                ],
                exclude: [
                    'modernizr',
                    'font-awesome',
                    'jquery-placeholder',
                    'foundation-sites'
                ]
            }
        },

        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 5,
                    progressive: true,
                    use: [optipng(), jpegtran(), gifsicle(), svgo()]
                },
                files: [{
                    expand: true,
                    cwd: '<%= app %>/images/',
                    src: ['**/*.{jpg,gif,svg,jpeg,png}'],
                    dest: '<%= app %>/images/grunticon/'
                }]
            }
        },

        grunticon: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= app %>/images/grunticon/',
                    src: ['**/*.{jpg,gif,svg,jpeg,png}'],
                    dest: '<%= dist %>'
                }],
                options: {
                    datasvgcss: '../<%= app %>/css/icons.data.svg.css',
                    pngfolder: '/images/',
                    pngpath: '../images/',
                    loadersnippet: '../<%= app %>/images/grunticon/grunticon.loader.js',
                    datapngcss: '../<%= app %>/images/grunticon/icons.data.png.css',
                    urlpngcss: '../<%= app %>/images/grunticon/icons.fallback.css',
                    previewhtml: '../<%= app %>/images/grunticon/preview.html'
                }
            }
        },

        minifyHtml: {
            options: {
                cdata: true
            },
            dist: {
                files: {
                    '<%= dist %>/index.html': '<%= dist %>/index.html'
                }
            }
        }

    });

    grunt.registerTask('compile-sass', ['sass', 'postcss']);
    grunt.registerTask('bower-install', ['wiredep']);
    grunt.registerTask('default', ['compile-sass', 'bower-install', 'connect:app', 'watch']);
    grunt.registerTask('validate-js', ['jshint']);
    grunt.registerTask('server-dist', ['connect:dist']);
    //grunt.registerTask('publish', ['compile-sass', 'clean', 'imagemin:dist', 'grunticon:dist', 'validate-js', 'useminPrepare', 'copy:dist', 'concat', 'cssmin', 'uglify', 'usemin', 'uncss', 'cssmin:dist', 'minifyHtml:dist']);
    grunt.registerTask('publish', ['compile-sass', 'clean', 'imagemin:dist', 'grunticon:dist', 'validate-js', 'useminPrepare', 'copy:dist', 'concat', 'usemin', 'uncss', 'minifyHtml:dist']);
    //grunt.registerTask('publish', ['compile-sass', 'clean:dist', 'validate-js', 'useminPrepare', 'copy:dist', 'newer:imagemin', 'concat', 'cssmin', 'uglify', 'usemin']);
    grunt.registerTask('grunt-grunticon', ['grunticon']);
    grunt.loadNpmTasks('grunt-contrib-imagemin');
};
