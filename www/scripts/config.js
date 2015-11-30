/* jshint ignore:start */
require.config({
    baseUrl: '/scripts/lib',

    paths : {
        app              : '../app',
        tpl              : '../tpl',
        async            : 'requirejs-plugins/src/async',
        jquery           : 'jquery/dist/jquery.min',
        cookie           : 'jquery.cookie/jquery.cookie',
        fastclick        : 'fastclick/lib/fastclick',
        modernizr        : 'modernizr/modernizr',
        placeholder      : 'jquery-placeholder/jquery.placeholder',
        infobox          : 'google-infobox/google-infobox',
        handlebars       : 'handlebars/handlebars.runtime.min',
        polyfiller       : 'webshim/js-webshim/dev/polyfiller'
    },
    shim : {
        cookie : {
            deps   : ['jquery']
        },
        fastclick : {
            exports: 'FastClick'
        },
        modernizr: {
            exports: 'Modernizr'
        },
        placeholder: {
            exports: 'Placeholders'
        },
        handlebars: {
            exports: 'Handlebars'
        }
    },
    /* Launch app.js after config */
    deps: ['app']
});
