(function (global) {
    System.config({
        paths: {
            // paths serve as alias
            'npm:': 'node_modules/'
        },

        // map tells the System loader where to look for things
        map: {

            // babel plugin for transpiling ES6 module syntax
            'plugin-babel': 'npm:systemjs-plugin-babel/plugin-babel.js',
            'systemjs-babel-build': 'npm:systemjs-plugin-babel/systemjs-babel-browser.js',

            // angular bundles
            '@angular': 'npm:@angular',
            '@ng-bootstrap/ng-bootstrap': 'npm:@ng-bootstrap/ng-bootstrap',

            // other libraries
            'rxjs':                         'npm:rxjs',
            'immutable':                    'npm:immutable',
            'typescript-memoize':           'npm:typescript-memoize',
            'moment':                       'npm:moment',
            'caesium-core':                 'npm:caesium-core',
            'typescript':                   'npm:typescript/lib/typescript.js'

        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            "@angular/core": {
                main: "bundles/core.umd.js" //use the ESM entry point for bundling tools
            },
            "@angular/common": {
                main: "bundles/common.umd.js" //use the ESM entry point for bundling tools
            },
            "@angular/compiler": {
                main: "bundles/compiler.umd.js" //use the ESM entry point for bundling tools
            },
            "@angular/forms": {
                main: "bundles/forms.umd.js"
            },
            "@angular/http": {
                main: "bundles/http.umd.js"
            },
            "@angular/platform-browser": {
                main: "bundles/platform-browser.umd.js" //use the ESM entry point for bundling tools
            },
            "@angular/platform-browser-dynamic": {
                main: "bundles/platform-browser-dynamic.umd.js" //use the ESM entry point for bundling tools
            },
            "@angular/router": {
                main: "bundles/router.umd.js" //use the ESM entry point for bundling tools
            },
            'src': {
                defaultExtension: 'js'
            },
            'doc': {
                defaultExtension: 'js'
            },
            'test': {
                defaultExtension: 'js'
            },
            'rxjs': {
                defaultExtension: 'js'
            },
            'caesium-core': {
                defaultExtension: 'js'
            },
            'typescript-memoize': {
                main: "dist/memoize-decorator.js",
                defaultExtension: 'js'
            },
            '@ng-bootstrap/ng-bootstrap': {
                main: 'index.js',
                defaultExtension: 'js'
            },
            'immutable': {
                main: 'dist/immutable.js'
            },
            'moment': {
                main: 'moment.js'
            }
        },

        transpiler: 'plugin-babel',

        meta: {
            '*.js': {
                babelOptions: {
                    // Don't transpile es2015 features, except imports
                    'es2015': false
                }
            }
        }
    });
})(this);
