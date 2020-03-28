module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        copy: {
            files: {
                cwd: 'app',      // set working folder / root to copy
                src: '**/*',     // copy all files and subfolders
                dest: 'dist',    // destination folder
                expand: true     // required when using cwd
            }
        },

        // Commit code from Github to screeps.
        // @see https://docs.screeps.com/commit.html
        screeps: {
            options: {
                email: '<your e-mail>',
                password: '<your password>',
                branch: 'default',   // The branch needs to be created in screeps first
                ptr: false
            },
            dist: {
                src: ['dist/*.js']
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['copy']);
    grunt.registerTask('deploy', ['copy', 'screeps']);
};
