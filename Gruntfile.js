'use strict'

var lessBinDebugOpts = {
        sourceMap: true,
        sourceMapRootpath: '../../'
    },
    debug = {env: 'debug'}

module.exports = function(grunt){
    grunt.initConfig({
        clean: {
            options:{
                force: true
            },
            bin: ['bin'],
            dist: ['dist']
        },
        copy: {
            bin: {
                files: [
                    {expand: true, cwd: 'src/', src: '*.html', dest: 'bin/'}
                ]
            },
            dist: {
                files:[
                    {expand: true, cwd: 'lib/', src: '**', dest: 'dist/lib/'},
                    {expand: true, cwd: 'src/', src: '*.html', dest: 'dist/app'}
                ]
            }    
        },
        less: {
            options:{
                paths: 'lib/less',
                relativeUrls: true
            },
            bin:{
                options: (delete lessBinDebugOpts.modifyVars, lessBinDebugOpts),
                files: {
                    'bin/style/main.css': 'src/less/main.less'
                }
            },
            debug:{
                options: (lessBinDebugOpts.modifyVars = debug, lessBinDebugOpts),
                files: {
                    'bin/style/main.css': 'src/less/main.less'
                }
            },
            dist:{
              
                files: {
                    'dist/app/style/main.css': 'src/less/main.less'
                }
            }
        },
        watch: {     
            less: {  
                files: ["src/less/*.less"],  
                tasks: ['less:dist'],  
                options: {  
                    debounceDelay: 250  
                }  
            },
            html:{
                files:"src/*.html",
                tasks:['htmlmin'],
                options: {  
                    debounceDelay: 250  
                } 
            }  
        }, 
        htmlmin:{
            options: {
                removeComments: true,
                 removeCommentsFromCDATA: true,
                collapseWhitespace: true,
                 collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
               removeRedundantAttributes: true,
                 useShortDoctype: true,
                removeEmptyAttributes: true,
               removeOptionalTags: true
          },
             html: {
                files: [
                  {expand: true, cwd: 'src', src: ['*.html'], dest: 'dist/app/html'}
               ]
            }
        },
         cssmin: {
          prod: {
             options: {
               report: 'gzip'
             },
          files: [
            {
             expand: true,
             cwd: 'dist/app',
             src: ['css/*.css'],
             dest: 'dist/app'
           }
        ]
       }
     },


    })

    grunt.loadNpmTasks('grunt-contrib-less')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-contrib-htmlmin')
    grunt.loadNpmTasks('grunt-contrib-cssmin')
    var task = function(){
        var name = this.name
            , tasks = ['clean', 'copy', 'less']
            , targets = tasks.map(function(v, i, m){
                var target = name === 'debug' && v !== 'less' ? 'bin' : name
                return v + ':' + target
            })
        grunt.task.run(targets)
    }
    grunt.registerTask('bin', task)
    grunt.registerTask('debug', task)
    grunt.registerTask('dist', task)
    grunt.registerTask('default',['less','htmlmin','watch']);
}