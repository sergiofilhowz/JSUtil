/*jslint browser: true*/
/*global module, alert*/

module.exports = function (grunt) {

    'use strict';
    
    var banner = '/* \n * JSUtil <%= pkg.version %> is under MIT License (c) 2014 Sérgio Marcelino \n * \n * Author: http://sergio.filho.org \n * More details on http://github.com/sergiofilhow/JSUtil \n * \n */ \n\n';
    
    // Project configuration.
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        uglify : {
            options : {
                banner : banner
            },
            build : {
                src : 'src/*.js',
                dest : 'release/<%= pkg.name %>-<%= pkg.version %>.min.js'
            }
        },
        
        cssmin : {
            options : {
                banner : banner
            },
            css : {
                src : 'release/<%= pkg.name %>-<%= pkg.version %>.css',
                dest : 'release/<%= pkg.name %>-<%= pkg.version %>.min.css'
            }
        },
        
        concat : {
            options : {
                banner : banner
            },
            css : {
                src : [
                    'styles/*'
                ],
                dest : 'release/<%= pkg.name %>-<%= pkg.version %>.css'
            },
            js : {
                src : [
                    'src/*'
                ],
                dest : 'release/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    
    grunt.registerTask('default', [ 'concat:css', 'cssmin:css', 'concat:js', 'uglify' ]);

};