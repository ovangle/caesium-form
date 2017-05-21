// #docregion
// /*global jasmine, __karma__, window*/
Error.stackTraceLimit = 0; // "No stacktrace"" is usually best for app testing.

// Uncomment to get full stacktrace output. Sometimes helpful, usually not.
// Error.stackTraceLimit = Infinity; //

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

var builtPath = '/base/';
var srcPath = '/base/src/'

__karma__.loaded = function () { };


function isJsFile(path) {
    return path.slice(-3) == '.js';
}

function isSpecFile(path) {
    return /\.spec\.(.*\.)?js$/.test(path);
}

function isBuiltFile(path) {
return isJsFile(path)
    && (path.substr(0, builtPath.length) === builtPath)
    && (path.substr(0, srcPath.length) === srcPath);
}


System.config({
    baseURL: 'base',
    // Extend usual application package list with test.ts folder
    packages: { 'testing': { main: 'index.js', defaultExtension: 'js' } },

    // Assume npm: is set in `paths` in systemjs.config
    // Map the angular testing umd bundles
    map: {
        '@angular/core/testing': 'npm:@angular/core/bundles/core-testing.umd.js',
        '@angular/common/testing': 'npm:@angular/common/bundles/common-testing.umd.js',
        '@angular/compiler/testing': 'npm:@angular/compiler/bundles/compiler-testing.umd.js',
        '@angular/platform-browser/testing': 'npm:@angular/platform-browser/bundles/platform-browser-testing.umd.js',
        '@angular/platform-browser-dynamic/testing': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
        '@angular/http/testing': 'npm:@angular/http/bundles/http-testing.umd.js',
        '@angular/router/testing': 'npm:@angular/router/bundles/router-testing.umd.js',
        '@angular/forms/testing': 'npm:@angular/forms/bundles/forms-testing.umd.js'
    }
});

System.import('systemjs.config.js')
  .then(initTestBed)
  .then(loadTests)
  .then(__karma__.start, (error) => {
      console.error(error);
      __karma__.error(error);
  });

/** Optional SystemJS configuration extras. Keep going w/o it */
function importSystemJsExtras(){
    return System.import('systemjs.config.extras.js')
        .catch(function(reason) {
            console.log(
                'Warning: System.import could not load the optional "systemjs.config.extras.js". Did you omit it by accident? Continuing without it.'
            );
            console.log(reason);
        });
}

function initTestBed(){
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;

    return Promise.all([
        System.import('@angular/core/testing'),
        System.import('@angular/platform-browser-dynamic/testing')
    ])
    .then(function (providers) {
        var coreTesting    = providers[0];
        var browserTesting = providers[1];

        coreTesting.TestBed.initTestEnvironment(
            browserTesting.BrowserDynamicTestingModule,
            browserTesting.platformBrowserDynamicTesting());
    });

}

function loadTests() {

    var allSpecFiles = Object.keys(window.__karma__.files)
      .filter(isSpecFile)
      .filter(isBuiltFile);


    function loadSpec(specFile) {
        console.log('loading spec', specFile);
        return System.import(specFile);
    }

    return Promise.all(allSpecFiles.map(loadSpec));
}

// TODO: Temporary hack to add a '_url' property to XHR.
var xhrProto = XMLHttpRequest.prototype,
    origOpen = xhrProto.open;

xhrProto.open = function (method, url) {
    this._url = url;
    return origOpen.apply(this, arguments);
};
