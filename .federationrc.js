/* istanbul ignore file */
const path = require('path');
const dependencies = require("./package.json").dependencies;

module.exports = {
    // meta (filename is static and should not be changed)
    name: 'delivery_planning',
    filename: 'remote-entry.js',
    library: null,

    // dynamic remotes (injected dynamically into your application)
    proxy: {
        local: [
            {
                port: 8090,
                alias: 'destination',
                url: 'http://localhost',
                file: 'remote-entry.js',
            },
        ],
        development: [
            /* [ADD REMOTES HERE] */
            {
                port: 80,
                alias: 'destination',
                url: '#{DESTINATION_SHELL_UI_URL}#',
                file: 'remote-entry.js',
            },
        ],
        production: [
            /* [ADD REMOTES HERE] */
            {
                port: 80,
                alias: 'destination',
                url: '#{DESTINATION_SHELL_UI_URL}#',
                file: 'remote-entry.js',
            },
        ],
    },
    // static remotes (loaded at runtime but are statically injected)
    remotes: [],

    // localized exports
    exposes: {
        // [NOTE]: mandatory exports to run in the shell...
        './app': path.resolve(__dirname, './src/app'),
        './initialize': path.resolve(__dirname, './src/initialize'),

        // [NOTE]: displays the syntax to export your component and/or logic)
        // './my-component': path.resolve(__dirname, './src/components/my-component/my-component'),
    },

    // application shared dependencies (defaults to ...package.dependencies)
    shared: {
        ...dependencies,
        'core-js': {
            singleton: true,
        },
        'vue': {
            singleton: true,
        },
        'vuex': {
            singleton: true,
        },
        'vue-router': {
            singleton: true,
        },
        'lodash': {
            singleton: true,
        },
        'vue-i18n': {
            singleton: true,
        },
    },
};
