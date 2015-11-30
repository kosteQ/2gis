/**
 * Usage
 *
 * Build project:
 * $ gulp
 * or
 * $ gulp build
 *
 * Watch for sass changes
 * $ gulp watch
 */

'use strict';

var gulp         = require('gulp');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var plumber      = require('gulp-plumber');
var handlebars   = require('gulp-handlebars');
var defineModule = require('gulp-define-module');
var jshint       = require('gulp-jshint');
var stylish      = require('jshint-stylish');
var sass         = require('gulp-sass');
var scsslint     = require('gulp-scss-lint');
var jscs         = require('gulp-jscs');
var map          = require('map-stream');
var chmod        = require('gulp-chmod');
var notify       = require('gulp-notify');
var tap          = require('gulp-tap');
var notifier     = require('node-notifier');
var livereload   = require('gulp-livereload');
var changed      = require('gulp-changed');
var jade         = require('gulp-jade');
var jadeInh      = require('gulp-jade-inheritance');
var gulpif       = require('gulp-if');
var spritesmith  = require('gulp.spritesmith');
/**
 * Error function for plumber
 * @param  {Object} error
 */
var onError = notify.onError('Ошибка в <%= error.plugin %>');

/**
 * Configuring paths
 * @type {Object}
 */

var paths = {};

paths.srcBase         = 'src';
paths.src             = {};
paths.src.scriptsBase = paths.srcBase + '/scripts';
paths.src.scripts     = paths.src.scriptsBase + '/**/*.js';
paths.src.stylesBase  = paths.srcBase + '/styles';
paths.src.styles      = paths.src.stylesBase + '/**/*.scss';
paths.src.tpl         = paths.src.scriptsBase + '/**/*.hbs';
paths.src.jadeBase    = paths.srcBase + '/jade';
paths.src.jade        = paths.src.jadeBase + '/**/*.jade';
paths.src.sprites     = paths.srcBase + '/sprites/1x/*.png';
paths.src.sprites2x   = paths.srcBase + '/sprites/2x/*.png';

paths.buildBase       = 'www';
paths.build           = {};
paths.build.scripts   = paths.buildBase + '/scripts';
paths.build.styles    = paths.buildBase + '/styles';
paths.build.tpl       = paths.build.scripts;
paths.build.jade      = paths.buildBase + '/html';

paths.html            = paths.buildBase + '/**/*.html';

var buildCss = function() {
    return gulp.src(paths.src.styles)
        .pipe(sass({
            includePaths: [
                'node_modules/compass-mixins/lib/',
                'node_modules/susy/sass/'
            ]
        }))
        .on('error', notify.onError({
            message : 'Line: <%= error.lineNumber %>:' +
            ' <%= error.message %>' +
            '\n<%= error.fileName %>',
            title   : '<%= error.plugin %>'
        }))
        .on('error', function() {
            this.emit('end');
        })
        .pipe(gulp.dest(paths.build.styles))
        .pipe(livereload());
};

/**
 * Build tasks
 */

// Main build task
gulp.task('build', [
    'hooks',
    'styles',
    'vendor',
    'js-uglify',
    'templates',
    'jade'
]);

gulp.task('sprites', function() {
    return gulp.src(paths.src.sprites)
        .pipe(spritesmith({
            imgName     : 'sprites.png',
            cssName     : '_sprites.scss',
            imgPath     : '/img/sprites.png',
            padding     : 1,
            cssTemplate : 'sprites.handlebars'
        }))
        .pipe(gulpif(
            '*.png',
            gulp.dest(paths.buildBase + '/img'),
            gulp.dest(paths.src.stylesBase + '/base')
        ))
        .pipe(livereload());
});

gulp.task('sprites2x', function() {
    return gulp.src(paths.src.sprites2x)
        .pipe(spritesmith({
            imgName     : 'sprites@2x.png',
            imgPath     : '/img/sprites@2x.png',
            cssName     : '_sprites@2x.scss',
            padding     : 2,
            cssTemplate : 'sprites@2x.handlebars'
        }))
        .pipe(gulpif(
            '*.png',
            gulp.dest(paths.buildBase + '/img'),
            gulp.dest(paths.src.stylesBase + '/base')
        ))
        .pipe(livereload());
});

gulp.task('styles', ['sprites', 'sprites2x'], function() {
    return buildCss();
});

gulp.task('css', function() {
    return buildCss();
});

gulp.task('js-uglify', function jsTask() {
    return gulp.src(paths.src.scripts, {
        base: paths.src.scriptsBase
    })
        .pipe(changed(paths.build.scripts))
        .pipe(plumber({
            errorHandler: notify.onError({
                message : 'Line: <%= error.lineNumber %>:' +
                ' <%= error.message %>' +
                '\n<%= error.fileName %>',
                title   : '<%= error.plugin %>'
            })
        }))
        // .pipe(uglify({
        //     outSourceMap: false
        // }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(paths.build.scripts))
        .pipe(livereload());
});

gulp.task('vendor', function vendorTask() {
    return gulp.src(['www/scripts/lib/requirejs/require.js'], {
        base: process.cwd() // jshint ignore:line
    })
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(uglify({
            outSourceMap: false
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest('.'));
});

gulp.task('templates', function templatesTask() {
    var fileName;
    var errorTpl = '<%= error.message %>';

    return gulp.src(paths.src.tpl)
        .pipe(changed(paths.build.tpl, {extension: '.js'}))
        .pipe(tap(function(file) {
            fileName = file.relative;
        }))
        .pipe(plumber({
            errorHandler: notify.onError({
                message : function() {
                    return errorTpl + '\n\n' + fileName;
                },
                title   : 'Handlebars'
            })
        }))
        .pipe(handlebars())
        .pipe(plumber.stop())
        .pipe(defineModule('amd'))
        .pipe(uglify({
            outSourceMap : false
        }))
        .pipe(gulp.dest(paths.build.tpl))
        .pipe(livereload());
});

gulp.task('jade', function() {
    return gulp.src(paths.src.jade)
        .pipe(changed(paths.build.jade, {extension: '.html'}))
        .pipe(jadeInh({basedir: paths.src.jadeBase}))
        .pipe(jade({
            pretty: true
        }))
        .on('error', notify.onError({
            message : 'Failed to compile html',
            title   : 'Jade'
        }))
        .on('error', function() {
            this.emit('end');
        })
        .pipe(gulp.dest(paths.build.jade));
});



/**
 * Lint tasks
 */

// Main lint task
gulp.task('lint', []);

gulp.task('scss-lint', function sassLintTask() {
    return gulp.src(paths.src.styles)
        .pipe(scsslint({
            config : '.scss-lint.yml'
        }))
        .pipe(scsslint.failReporter());
});

gulp.task('jshint', function lintTask() {
    var errorReporter = function() {
        return map(function(file, cb) {
            if (!file.jshint.success) {
                process.exit(1); // jshint ignore:line
            }
            cb(null, file);
        });
    };

    return gulp.src(paths.src.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(errorReporter());
});

gulp.task('jscs', function jscsTask() {
    return gulp.src(paths.src.scripts)
        .pipe(jscs());
});

/**
 * Hook tasks
 */

gulp.task('hooks', function() {
    gulp.src('hooks/*')
        .pipe(chmod({
            execute: true
        }))
        .pipe(gulp.dest('.git/hooks/'));
});

/**
 * Notify task
 s */
gulp.task('pre-commit-notify', function() {
    notifier.notify({
        message : 'Fix errors first',
        title   : 'Commit failed'
    });
});

/**
 * Watch task
 */
gulp.task('watch', ['build'], function watch() {
    livereload.listen(function(err) {
        if (err) {
            return console.log('Livereload start failed');
        }

        gulp.watch(paths.src.sprites, ['sprites']);
        gulp.watch(paths.src.sprites2x, ['sprites2x']);
        gulp.watch(paths.src.styles,  ['css']);
        gulp.watch(paths.src.scripts, ['js-uglify']);
        gulp.watch(paths.src.tpl,     ['templates']);
        gulp.watch(paths.src.jade,    ['jade']);

        gulp.watch(paths.html).on('change', function(file) {
            livereload.changed(file.path);
        });
    });
});

// Run
gulp.task('default', ['build']);
